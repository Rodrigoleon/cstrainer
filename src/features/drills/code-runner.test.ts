import { describe, expect, it } from "vitest";

import { evaluateUserCode } from "./code-runner";

describe("code runner core", () => {
	it("passes every fixture when the submitted solution is correct", () => {
		expect(
			evaluateUserCode({
				userCode:
					"function solution(nums) { return nums.filter((num) => num % 2 === 0); }",
				tests: [
					{ input: [[1, 2, 3, 4]], expected: [2, 4] },
					{ input: [[]], expected: [] },
				],
			}),
		).toMatchObject({ ok: true });
	});

	it("returns the first failing fixture with expected and actual values", () => {
		const result = evaluateUserCode({
			userCode: "function solution(nums) { return nums; }",
			tests: [{ input: [[1, 2, 3, 4]], expected: [2, 4] }],
		});

		expect(result.ok).toBe(false);
		expect(result.results?.[0]).toMatchObject({
			expected: [2, 4],
			actual: [1, 2, 3, 4],
			passed: false,
		});
	});

	it("reports missing solution functions and thrown errors", () => {
		expect(
			evaluateUserCode({ userCode: "const nope = 1;", tests: [] }),
		).toMatchObject({
			ok: false,
			error: "Could not find a function named solution.",
		});

		expect(
			evaluateUserCode({
				userCode: "function solution() { throw new Error('boom'); }",
				tests: [{ input: [], expected: true }],
			}),
		).toMatchObject({ ok: false, error: "boom" });
	});
});
