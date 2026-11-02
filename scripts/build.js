// Builds a small static status page into dist/, stamped with the commit it came from.
import { mkdirSync, writeFileSync } from "node:fs";

const sha = (process.env.GITHUB_SHA || "local").slice(0, 7);
const run = process.env.GITHUB_RUN_NUMBER || "-";
const builtAt = new Date().toISOString();

mkdirSync("dist", { recursive: true });
writeFileSync(
  "dist/index.html",
  `<!doctype html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>itadimaigal CI/CD demo</title>
<style>body{font-family:system-ui,sans-serif;background:#0b1220;color:#e8eefc;display:grid;place-items:center;min-height:100vh;margin:0}
main{max-width:560px;padding:24px}h1 span{color:#ff7a1a}code{color:#00e5ff}</style></head>
<body><main>
<h1><span>it</span>adimaigal CI/CD demo</h1>
<p>This page was built and deployed by GitHub Actions.</p>
<p>Commit <code>${sha}</code> · run #${run} · built ${builtAt}</p>
</main></body>
</html>
`
);
console.log(`Built dist/index.html for commit ${sha}`);
