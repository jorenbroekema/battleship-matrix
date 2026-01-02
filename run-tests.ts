import fs from "node:fs/promises";
import { solution } from "./main.ts";

/**
 * Tests can be put in the tests.txt file
 * Separate by double newline character as a test separator
 * Single newline character as a row separator
 * Assumes lf rather than crlf, so windows users may have some parsing issues with this
 * if they don't respect lf line endings, by auto-converting to crlf...
 */
async function runTests() {
  const testData = await fs.readFile(
    new URL("./tests.txt", import.meta.url),
    "utf-8"
  );
  const tests = testData.split("\n\n").map((test) => test.split("\n"));
  tests.forEach((test, i) => {
    console.log(`Test ${i + 1}:`);
    const res = solution(test);
    console.log(`\n${JSON.stringify(res)}\n`);
  });
}
runTests();
