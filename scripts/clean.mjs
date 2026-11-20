// Cross-platform `rm -rf dist`. npm runs scripts through cmd.exe on Windows and
// sh everywhere else, so neither `rmdir /s /q` nor `rm -rf` works on both; node
// does.
import { rmSync } from "node:fs";
import { fileURLToPath } from "node:url";

rmSync(fileURLToPath(new URL("../dist", import.meta.url)), {
    recursive: true,
    force: true
});
