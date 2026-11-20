// `prepare` runs on this package's own `npm install` and also on a consumer's,
// because vtp-backend and vtp-front link it with `file:../vtp-common`. In that
// second case this package may not have its own node_modules yet, so a bare
// `tsc` fails the consumer's install with nothing but "tsc is not recognized".
// Build when the compiler is present; otherwise say what to do and let the
// install finish.
//
// tsc is spawned as `node <path-to-tsc>` rather than as a bin shim, and the
// clean step is a node script, so the whole thing behaves the same whether npm
// hands it to cmd.exe or to sh.
import { spawnSync } from "node:child_process";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);

let tsc;
try {
    tsc = require.resolve("typescript/bin/tsc");
} catch {
    console.warn("[vtp-common] typescript is not installed here, so dist/ was not built.");
    console.warn("[vtp-common] Run `npm install` inside vtp-common, then re-run `npm install` here.");
    process.exit(0);
}

// Only clear dist/ once we know we can rebuild it: importing clean.mjs runs it.
await import("./clean.mjs");

const { status } = spawnSync(process.execPath, [tsc], {
    cwd: fileURLToPath(new URL("..", import.meta.url)),
    stdio: "inherit"
});

process.exit(status ?? 1);
