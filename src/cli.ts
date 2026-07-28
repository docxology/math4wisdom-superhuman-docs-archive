import { archive, loadLatestSnapshot, validateExistingSnapshot } from "./archive.js";
import { TOKEN_ENV } from "./constants.js";
import { stableJson } from "./json.js";
import { connectSuperhumanDocs } from "./mcp.js";
import { resolveToolPlan } from "./tools.js";

const cwd = process.cwd();

function usage(): string {
  return `Usage: npm run <command>

Commands:
  discover   Connect to the official read-only MCP and print its live tool catalog.
  dry-run    Check that the MCP catalog has an unambiguous, read-only archive path.
  archive    Create and validate a complete timestamped local snapshot.
  validate   Validate the newest completed snapshot, or pass a snapshot path.

Set ${TOKEN_ENV} only in the active shell. Never put it in .env, Git, or a command line.`;
}

function token(): string {
  const value = process.env[TOKEN_ENV];
  if (!value?.trim()) throw new Error(`${TOKEN_ENV} is not set. Configure a read-only MCP token locally and export it only for this command.`);
  return value;
}

async function main(): Promise<void> {
  const [command = "", suppliedPath] = process.argv.slice(2);
  if (["help", "--help", "-h"].includes(command)) {
    console.log(usage());
    return;
  }
  if (command === "validate") {
    const snapshot = suppliedPath ?? await loadLatestSnapshot(cwd);
    await validateExistingSnapshot(snapshot);
    console.log(`Validated ${snapshot}`);
    return;
  }
  if (!(["discover", "dry-run", "archive"] as string[]).includes(command)) throw new Error(usage());

  const client = await connectSuperhumanDocs(token());
  try {
    if (command === "discover") {
      const tools = await client.listTools();
      const plan = resolveToolPlan(tools);
      console.log(stableJson({ endpoint: "https://docs.superhuman.com/apis/mcp", toolPlan: Object.fromEntries(Object.entries(plan).map(([role, tool]) => [role, tool?.name])), tools }));
      return;
    }
    const result = await archive({ cwd, client, dryRun: command === "dry-run" });
    console.log(stableJson(result));
  } finally {
    await client.close();
  }
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`Archive failed: ${message}`);
  process.exitCode = 1;
});
