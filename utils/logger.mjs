import { createConsola } from "consola";

const consola = createConsola({
  formatOptions: {
    date: false,
    colors: true,
    compact: true,
  },
  defaults: {
    tag: "Website Scraper to Excel",
  },
});

export const createLogger = (options) => {
  return {
    log: (...args) => {
      !options?.disabled && consola.log("", ...args);
    },
    error: (...args) => {
      !options?.disabled && consola.error("", ...args);
    },
    warn: (...args) => {
      !options?.disabled && consola.warn("", ...args);
    },
    info: (...args) => {
      !options?.disabled && consola.info("", ...args);
    },
    debug: (...args) => {
      !options?.disabled && consola.debug("", ...args);
    },
    box: (...args) => {
      !options?.disabled && consola.box("", ...args);
    },
    success: (...args) => {
      !options?.disabled && consola.success("", ...args);
    },
    start: (...args) => {
      !options?.disabled && consola.start("", ...args);
    },
    break: (...args) => {
      !options?.disabled && console.log("\n");
    },
  };
};

export const logger = createLogger();
