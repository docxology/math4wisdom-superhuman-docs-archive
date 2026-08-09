#!/usr/bin/env node

import { access, readFile, writeFile } from "node:fs/promises";

const output = process.argv[3] ?? "archive/rendered-images/consolidated-inventory.json";
const rawInput = process.argv[2] ?? "archive/rendered-images/2026-08-09-content-inventory/inventory.json";
let input = rawInput;
try {
  await access(input);
} catch {
  input = output;
}

const inventory = JSON.parse(await readFile(input, "utf8"));
if (!Array.isArray(inventory.instances)) {
  if (inventory.schemaVersion !== 2) throw new Error(`Unsupported inventory schema in ${input}`);
  await writeFile(output, `${JSON.stringify(inventory, null, 2)}\n`);
  console.log(JSON.stringify(inventory.counts));
  process.exit(0);
}
const prunablePatterns = [
  /\/icons\//i,
  /favicon/i,
  /sprite/i,
  /\/packs\//i,
];

function isPrunable(instance) {
  const url = instance.sourceUrlRaw ?? "";
  if (prunablePatterns.some((pattern) => pattern.test(url))) return true;
  const { naturalWidth: width, naturalHeight: height } = instance;
  return width > 0 && height > 0 && (width <= 64 || height <= 64);
}

const keptInstances = inventory.instances.filter((instance) => !isPrunable(instance));
const grouped = new Map();
for (const instance of keptInstances) {
  const key = instance.sourceUrlRaw;
  const current = grouped.get(key) ?? {
    sourceUrl: key,
    occurrenceCount: 0,
    pages: new Map(),
    dimensions: new Set(),
    altTexts: new Set(),
  };
  current.occurrenceCount += 1;
  current.pages.set(instance.pageId, instance.pageTitle);
  current.dimensions.add(`${instance.naturalWidth}x${instance.naturalHeight}`);
  if (instance.alt) current.altTexts.add(instance.alt);
  grouped.set(key, current);
}

const assets = [...grouped.values()]
  .sort((a, b) => a.sourceUrl.localeCompare(b.sourceUrl))
  .map(({ pages, dimensions, altTexts, ...asset }) => ({
    ...asset,
    pages: [...pages.entries()].sort(([a], [b]) => a.localeCompare(b)).map(([pageId, pageTitle]) => ({ pageId, pageTitle })),
    dimensions: [...dimensions].sort(),
    altTexts: [...altTexts].sort(),
  }));

const pageCounts = new Map();
for (const instance of keptInstances) pageCounts.set(instance.pageId, (pageCounts.get(instance.pageId) ?? 0) + 1);
const pages = inventory.pages.map((page) => ({
  ...page,
  imageInstances: pageCounts.get(page.pageId) ?? 0,
}));

const outputInventory = {
  schemaVersion: 2,
  baseSnapshot: inventory.baseSnapshot,
  sourceCoverage: inventory.coverage,
  pruning: {
    description: "Removed icon/UI sprite URLs and measured images with either dimension <= 64 px; zero-dimension occurrences are retained because the browser did not expose their intrinsic size.",
    patterns: prunablePatterns.map((pattern) => pattern.source),
    maxDimensionPx: 64,
  },
  counts: {
    pages: pages.length,
    originalInstances: inventory.instances.length,
    retainedInstances: keptInstances.length,
    prunedInstances: inventory.instances.length - keptInstances.length,
    uniqueRetainedAssets: assets.length,
  },
  pages,
  assets,
};

await writeFile(output, `${JSON.stringify(outputInventory, null, 2)}\n`);
console.log(JSON.stringify(outputInventory.counts));
