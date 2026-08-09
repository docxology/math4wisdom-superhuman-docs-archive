import { mkdir, readFile, rename, rm, writeFile } from "node:fs/promises";
import { spawn } from "node:child_process";
import { dirname, extname, join, relative } from "node:path";

import { ARCHIVE_ROOT, DOCUMENT_URL } from "./constants.js";
import { sha256, stableJson } from "./json.js";

type CapturedImage = {
  pageId: string;
  pageTitle: string;
  sourceUrl?: string;
  sourceUrlRaw?: string;
  contentType?: string | null;
  name?: string;
  localPath?: string;
  alt?: string;
  width?: number | null;
  height?: number | null;
  naturalWidth?: number | null;
  naturalHeight?: number | null;
};

type CaptureInput = {
  baseSnapshot: string;
  coverage: { attemptedPageIds: string[]; completedPageIds: string[]; failedPageIds: string[] };
  assets: CapturedImage[];
};

type OutputAsset = {
  pageId: string;
  pageTitle: string;
  sourceUrl: string;
  name: string;
  contentType: string | null;
  occurrences: Array<{ pageId: string; pageTitle: string; alt: string; width: number | null; height: number | null; naturalWidth: number | null; naturalHeight: number | null }>;
  original: { sha256: string; bytes: number };
  png: { path: string; sha256: string; bytes: number };
};

function captureName(now = new Date()): string {
  return now.toISOString().replace(/[:.]/g, "-").replace(/Z$/, "Z");
}

function extension(asset: CapturedImage): string {
  if (asset.contentType === "image/svg+xml") return ".svg";
  if (asset.contentType === "image/png") return ".png";
  if (asset.contentType === "image/jpeg") return ".jpg";
  if (asset.contentType === "image/gif") return ".gif";
  if (asset.contentType === "image/webp") return ".webp";
  if (asset.contentType === "image/avif") return ".avif";
  const suffix = extname(asset.name ?? asset.sourceUrlRaw ?? asset.sourceUrl ?? "").toLowerCase();
  return suffix || ".bin";
}

function remoteSource(asset: CapturedImage): string {
  const source = asset.sourceUrlRaw ?? asset.sourceUrl;
  if (!source || !source.startsWith("https://")) throw new Error("Rendered image source must be HTTPS.");
  return source;
}

async function fetchImage(source: string): Promise<{ bytes: Buffer; contentType: string | null }> {
  const response = await fetch(source, { redirect: "error" });
  if (!response.ok) throw new Error(`Rendered image request failed with HTTP ${response.status}.`);
  const contentType = response.headers.get("content-type")?.split(";", 1)[0].trim().toLowerCase() || null;
  if (contentType && !contentType.startsWith("image/")) throw new Error(`Rendered image returned non-image content (${contentType}).`);
  const bytes = Buffer.from(await response.arrayBuffer());
  if (bytes.byteLength === 0) throw new Error("Rendered image response was empty.");
  if (bytes.byteLength > 100 * 1024 * 1024) throw new Error("Rendered image exceeds the 100 MiB safety limit.");
  return { bytes, contentType };
}

async function command(binary: string, args: string[]): Promise<void> {
  await new Promise<void>((resolve, reject) => {
    const child = spawn(binary, args, { stdio: "ignore" });
    child.once("error", reject);
    child.once("exit", (code) => code === 0 ? resolve() : reject(new Error(`${binary} exited with status ${code ?? "unknown"}.`)));
  });
}

async function toPng(source: string, destination: string, sourceExtension: string): Promise<void> {
  if (sourceExtension === ".png") {
    await writeFile(destination, await readFile(source), { flag: "wx" });
    return;
  }
  if (sourceExtension === ".svg") {
    await command("/opt/homebrew/bin/rsvg-convert", ["--format=png", "--output", destination, source]);
    return;
  }
  await command("/usr/bin/sips", ["--setProperty", "format", "png", source, "--out", destination]);
}

async function indexedFiles(root: string, directory = root): Promise<{ path: string; sha256: string; bytes: number }[]> {
  const entries = await (await import("node:fs/promises")).readdir(directory, { withFileTypes: true });
  const files: { path: string; sha256: string; bytes: number }[] = [];
  for (const entry of entries) {
    const full = join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await indexedFiles(root, full));
    else {
      const bytes = await readFile(full);
      files.push({ path: relative(root, full), sha256: sha256(bytes), bytes: bytes.byteLength });
    }
  }
  return files.sort((left, right) => left.path.localeCompare(right.path));
}

export async function archiveRenderedImages(cwd: string, inputPath: string, now = new Date()): Promise<{ output: string; images: number; complete: boolean }> {
  const inputValue = JSON.parse(await readFile(inputPath, "utf8")) as CaptureInput & { instances?: CapturedImage[] };
  const input = { ...inputValue, assets: inputValue.assets ?? inputValue.instances ?? [] };
  if (!Array.isArray(input.assets) || !input.coverage || !Array.isArray(input.coverage.attemptedPageIds) || !Array.isArray(input.coverage.completedPageIds) || !Array.isArray(input.coverage.failedPageIds)) {
    throw new Error("Invalid rendered-image capture input.");
  }
  const name = captureName(now);
  const root = join(cwd, ARCHIVE_ROOT, "rendered-images");
  const stage = join(root, ".staging", `${name}-${process.pid}`);
  const output = join(root, name);
  await mkdir(stage, { recursive: true });

  try {
    const uniqueAssets = new Map<string, CapturedImage & { occurrences: OutputAsset["occurrences"] }>();
    for (const asset of input.assets) {
      if (!asset || typeof asset.pageId !== "string" || typeof asset.pageTitle !== "string") throw new Error("Invalid rendered image occurrence input.");
      const sourceUrl = remoteSource(asset);
      const occurrence = { pageId: asset.pageId, pageTitle: asset.pageTitle, alt: asset.alt ?? "", width: asset.width ?? null, height: asset.height ?? null, naturalWidth: asset.naturalWidth ?? null, naturalHeight: asset.naturalHeight ?? null };
      const existing = uniqueAssets.get(sourceUrl);
      if (existing) { existing.occurrences.push(occurrence); continue; }
      uniqueAssets.set(sourceUrl, { ...asset, sourceUrl, occurrences: [occurrence] });
    }

    const results: Array<OutputAsset | undefined> = [];
    const conversionByOriginal = new Map<string, Promise<{ path: string; sha256: string; bytes: number }>>();
    const assets = [...uniqueAssets.values()];
    let cursor = 0;
    async function processAsset(asset: CapturedImage & { occurrences: OutputAsset["occurrences"] }): Promise<OutputAsset> {
      const sourceUrl = remoteSource(asset);
      const fetched = typeof asset.localPath === "string" ? { bytes: await readFile(asset.localPath), contentType: asset.contentType ?? null } : await fetchImage(sourceUrl);
      const bytes = fetched.bytes;
      if (bytes.byteLength === 0) throw new Error(`Rendered image is empty: ${sourceUrl}`);
      const normalizedAsset = { ...asset, sourceUrl, contentType: fetched.contentType ?? asset.contentType ?? null, name: asset.name ?? new URL(sourceUrl).pathname.split("/").pop() ?? "asset" };
      const extensionName = extension(normalizedAsset);
      const originalDigest = sha256(bytes);
      let pngPromise = conversionByOriginal.get(originalDigest);
      if (!pngPromise) {
        pngPromise = (async () => {
          const pngTemporary = join(stage, "png", `${originalDigest}.pending.png`);
          await mkdir(dirname(pngTemporary), { recursive: true });
          const sourceTemporary = join(stage, "working", `${originalDigest}${extensionName}`);
          await mkdir(dirname(sourceTemporary), { recursive: true });
          await writeFile(sourceTemporary, bytes, { flag: "wx" });
          await toPng(sourceTemporary, pngTemporary, extensionName);
          await rm(sourceTemporary, { force: true });
          const pngBytes = await readFile(pngTemporary);
          if (pngBytes.byteLength < 8 || !pngBytes.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))) throw new Error(`PNG conversion failed for ${sourceUrl}.`);
          const pngDigest = sha256(pngBytes);
          const pngPath = `png/${pngDigest}.png`;
          await rename(pngTemporary, join(stage, pngPath));
          return { path: pngPath, sha256: pngDigest, bytes: pngBytes.byteLength };
        })();
        conversionByOriginal.set(originalDigest, pngPromise);
      }
      const outputAsset: OutputAsset = {
        pageId: asset.pageId,
        pageTitle: asset.pageTitle,
        sourceUrl,
        name: normalizedAsset.name!,
        contentType: normalizedAsset.contentType ?? null,
        occurrences: asset.occurrences,
        original: { sha256: originalDigest, bytes: bytes.byteLength },
        png: await pngPromise,
      };
      return outputAsset;
    }
    async function worker(): Promise<void> {
      while (true) {
        const index = cursor;
        cursor += 1;
        if (index >= assets.length) return;
        results[index] = await processAsset(assets[index]);
      }
    }
    await Promise.all(Array.from({ length: 8 }, () => worker()));
    const outputs = results.filter((asset): asset is OutputAsset => asset !== undefined);
    const files = await indexedFiles(stage);
    const complete = input.coverage.failedPageIds.length === 0;
    await writeFile(join(stage, "manifest.json"), stableJson({
      schemaVersion: 1,
      source: { documentUrl: DOCUMENT_URL, baseSnapshot: input.baseSnapshot, method: "public rendered-page asset capture" },
      capturedAt: now.toISOString(),
      complete,
      coverage: input.coverage,
      counts: { images: outputs.length, occurrences: outputs.reduce((total, asset) => total + asset.occurrences.length, 0), pngs: outputs.length },
      assets: outputs.sort((left, right) => left.sourceUrl.localeCompare(right.sourceUrl)),
      files,
    }), "utf8");
    await mkdir(root, { recursive: true });
    await rename(stage, output);
    return { output, images: outputs.length, complete };
  } catch (error) {
    await rm(stage, { recursive: true, force: true });
    throw error;
  }
}

async function main(): Promise<void> {
  const inputPath = process.argv[2];
  if (!inputPath) throw new Error("Usage: node rendered-images.js <capture-input.json>");
  const result = await archiveRenderedImages(process.cwd(), inputPath);
  process.stdout.write(stableJson(result));
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((error: unknown) => {
    process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`);
    process.exitCode = 1;
  });
}
