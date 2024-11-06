import { promises as fs } from "fs";
import path from "node:path";
import { dirname } from "./__dirname.mjs";
import { logger } from "./logger.mjs";

const productPath = path.join(dirname, "../public/input/");

export const useProduct = async ({ fileName }) => {
  try {
    const filePath = productPath + fileName + ".json";

    const data = await fs.readFile(filePath, {
      encoding: "utf-8",
    });

    if (!data) {
      throw new Error(`${filePath} is empty or invalid.`);
    }

    try {
      return JSON.parse(data);
    } catch (parseError) {
      throw new Error(`Failed to parse ${filePath} as JSON.`);
    }
  } catch (error) {
    logger.error(error);
  }
};
