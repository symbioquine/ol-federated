const fs = require("fs");


process.env.JEST_PUPPETEER_CONFIG = `${process.cwd()}/../test/jest-puppeteer.config.js`;

if (!process.env.TEST_PORT_NUM) {
  process.env.TEST_PORT_NUM = '1234';
}

module.exports = {
  preset: "jest-puppeteer",
  roots: [
    "./",
    "../test/",
  ],
  testPathIgnorePatterns: [
    "/node_modules/",
    "index.spec.js",
  ],
};