// typescript-eslint and its runtime deps require the classic TypeScript compiler
// API and do not yet support the TypeScript 7 native compiler: under TS7,
// `ts.Extension` / `ts.InternalSymbolName` etc. are undefined, which crashes
// typescript-estree ("...reading 'Cjs'") and ts-api-utils ("...reading
// 'Intrinsic'").
//
// The project keeps `typescript` pinned to TS7 for building/type-checking and
// ships `@typescript/typescript6` (the classic API) purely for the linter. This
// postinstall drops a tiny `typescript` re-export package inside each hoisted
// linter package that loads the TS runtime, so `require("typescript")` there
// returns the TS6 API while the compiler stays on TS7. A plain directory (not a
// symlink/junction) is used so it deletes cleanly on `npm ci`. It's a no-op once
// these packages support TS7.

import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const modules = join(root, "node_modules");
const ts6PkgPath = join(modules, "@typescript", "typescript6", "package.json");

// Packages that `require("typescript")` at runtime and must see the classic API.
const hosts = ["typescript-eslint", "ts-api-utils"];

if (!existsSync(ts6PkgPath)) process.exit(0); // e.g. production install without dev deps

const ts6Version = JSON.parse(readFileSync(ts6PkgPath, "utf8")).version;
const indexJs = 'module.exports = require("@typescript/typescript6");\n';
const pkgJson = JSON.stringify({ name: "typescript", version: ts6Version, main: "index.js" }, null, 2) + "\n";

const shim = (hostDir) => {
    if (!existsSync(hostDir)) return false;
    const shimDir = join(hostDir, "node_modules", "typescript");
    const indexPath = join(shimDir, "index.js");
    if (existsSync(indexPath) && readFileSync(indexPath, "utf8") === indexJs) return false; // already shimmed
    if (existsSync(shimDir)) rmSync(shimDir, { recursive: true, force: true });
    mkdirSync(shimDir, { recursive: true });
    writeFileSync(join(shimDir, "package.json"), pkgJson);
    writeFileSync(indexPath, indexJs);
    return true;
};

const shimmed = hosts.filter((name) => shim(join(modules, name)));
if (shimmed.length) {
    console.log(`[link-eslint-typescript] shimmed typescript -> @typescript/typescript6 in ${shimmed.join(", ")} for linting`);
}
