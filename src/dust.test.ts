import { expect, test } from "vitest";
import { askDust } from "./dust.js";

test("answer contains 42", async () => {
  const answer = await askDust(
    "What is the answer to the ultimate question of life, the universe, and everything?",
  );
  expect(answer).toContain("42");
});
