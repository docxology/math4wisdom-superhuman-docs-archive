import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";

const root = new URL("../", import.meta.url);

async function retainedRecord(path, digest) {
  const bytes = await readFile(new URL(path, root));
  if (createHash("sha256").update(bytes).digest("hex") !== digest) {
    throw new Error(`Retained record differs from the manuscript edition: ${path}`);
  }
  return JSON.parse(bytes.toString("utf8"));
}

const snapshot = await retainedRecord(
  "archive/snapshots/2026-07-28T19-26-53-926Z/manifest.json",
  "0f1c4e23bf3b6474a896faa3bf412257cf220914b87ad1377d0e8b93131c195c",
);
const images = await retainedRecord(
  "archive/rendered-images/consolidated-inventory.json",
  "77d031e2623f3bf978b0ad75dc9f3dbc9af55e89d54498cb68bcfcfe1bf9e08e",
);
const { completedPageIds, failedPageIds } = images.sourceCoverage;
const { originalInstances, retainedInstances, prunedInstances, uniqueRetainedAssets } = images.counts;
if (originalInstances !== retainedInstances + prunedInstances ||
    images.assets.length !== uniqueRetainedAssets ||
    images.assets.reduce((sum, asset) => sum + asset.occurrenceCount, 0) !== retainedInstances ||
    new Set(images.assets.map((asset) => asset.sourceUrl)).size !== uniqueRetainedAssets ||
    completedPageIds.length + failedPageIds.length !== images.counts.pages ||
    snapshot.inventory.pages.length !== snapshot.counts.pages ||
    snapshot.inventory.tables.length !== snapshot.counts.tables ||
    snapshot.inventory.assets.length !== snapshot.counts.assets) {
  throw new Error("Retained inventory totals disagree with their records");
}

const metrics = {
  ...snapshot.counts,
  manifestFiles: snapshot.files.length,
  completedPageRoutes: completedPageIds.length,
  failedPageRoutes: failedPageIds.length,
  originalInstances,
  retainedInstances,
  prunedInstances,
  uniqueRetainedAssets,
};
const csv = Object.entries(metrics).map(([name, value]) => `${name},${value}\n`).join("");
const output = new URL("output/data/", root);
await mkdir(output, { recursive: true });
await writeFile(new URL("retained-archive-counts.csv", output), "metric,value\n" + csv, { flag: "wx" });
console.log(csv);
