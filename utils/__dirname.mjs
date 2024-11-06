import { dirname as __dirname } from "node:path";
import { fileURLToPath } from "node:url";

export const dirname = __dirname(fileURLToPath(import.meta.url));
