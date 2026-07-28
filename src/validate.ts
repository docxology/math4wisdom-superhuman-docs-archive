import { access, readFile } from "node:fs/promises";
import { join } from "node:path";

import { isObject, sha256 } from "./json.js";

export async function validateSnapshot(root: string): Promise<void> {
  const raw = await readFile(join(root, "manifest.json"), "utf8");
  const manifest: unknown = JSON.parse(raw);
  if (!isObject(manifest) || manifest.schemaVersion !== 1 || !isObject(manifest.inventory) || !Array.isArray(manifest.files)) throw new Error("Invalid archive manifest.");
  const inventory = manifest.inventory;
  if (!Array.isArray(inventory.pages) || !Array.isArray(inventory.tables) || !Array.isArray(inventory.assets)) throw new Error("Archive manifest is missing inventory arrays.");
  const pageIds = new Set<string>();
  for (const page of inventory.pages) {
    if (!isObject(page) || typeof page.id !== "string" || typeof page.markdown !== "string" || typeof page.raw !== "string") throw new Error("Invalid page inventory entry.");
    if (pageIds.has(page.id)) throw new Error(`Duplicate manifest page ID ${page.id}.`);
    pageIds.add(page.id);
    if (typeof page.parentId === "string" && !pageIds.has(page.parentId)) {
      // Parent order is not part of the archive contract; check after all IDs are known.
    }
    await access(join(root, page.markdown));
    await access(join(root, page.raw));
  }
  for (const page of inventory.pages) if (isObject(page) && typeof page.parentId === "string" && !pageIds.has(page.parentId)) throw new Error(`Manifest refers to absent parent ${page.parentId}.`);
  const tableIds = new Set<string>();
  for (const table of inventory.tables) {
    if (!isObject(table) || typeof table.id !== "string" || typeof table.directory !== "string") throw new Error("Invalid table inventory entry.");
    if (tableIds.has(table.id)) throw new Error(`Duplicate manifest table ID ${table.id}.`);
    tableIds.add(table.id);
    await access(join(root, table.directory, "schema.json"));
    await access(join(root, table.directory, "rows.json"));
    await access(join(root, table.directory, "rows.csv"));
  }
  for (const asset of inventory.assets) {
    if (!isObject(asset) || typeof asset.path !== "string" || typeof asset.sha256 !== "string") throw new Error("Invalid media inventory entry.");
    const bytes = await readFile(join(root, asset.path));
    if (sha256(bytes) !== asset.sha256) throw new Error(`Checksum mismatch for ${asset.path}.`);
  }
  for (const file of manifest.files) {
    if (!isObject(file) || typeof file.path !== "string" || typeof file.sha256 !== "string") throw new Error("Invalid file checksum entry.");
    const bytes = await readFile(join(root, file.path));
    if (sha256(bytes) !== file.sha256) throw new Error(`Checksum mismatch for ${file.path}.`);
  }
}
