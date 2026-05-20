import { describe, expect, it } from "vitest";
import {
	filterDrills,
	gradeEnglishAnswer,
	gradeMultipleChoiceAnswer,
	gradeTraceAnswer,
	pickRandomDrill,
} from "./drill-utils";
import type { Drill } from "./types";

const drills: Drill[] = [
	{
		id: "arrays-code",
		title: "Filter evens",
		topic: "Arrays",
		level: "Level 1",
		type: "code",
		concept: "filter",
		prompt: "Return evens.",
		hints: ["Use modulo."],
		explanation: "Filters even numbers.",
		signature: "function solution(nums) { ... }",
		starter: "function solution(nums) {}",
		tests: [{ input: [[1, 2]], expected: [2] }],
	},
	{
		id: "objects-mcq",
		title: "Object lookup",
		topic: "Objects",
		level: "Level 2",
		type: "mcq",
		concept: "keys",
		prompt: "What is an object key?",
		hints: ["It names a value."],
		explanation: "Keys are property names.",
		choices: [
			{ id: "a", label: "A property name" },
			{ id: "b", label: "Only a number" },
		],
		correctChoiceId: "a",
	},
	{
		id: "arrays-trace",
		title: "Trace sums",
		topic: "Arrays",
		level: "Level 2",
		type: "trace",
		concept: "manual tracing",
		prompt: "Trace the totals.",
		hints: ["Add each distance."],
		explanation: "The middle value minimizes distance.",
		values: [2, 4, 7],
		expectedSums: [7, 5, 8],
		expectedAnswer: 4,
	},
];

describe("drill utilities", () => {
	it("filters drills by topic and answer type", () => {
		expect(filterDrills(drills, { topic: "Arrays", type: "code" })).toEqual([
			drills[0],
		]);
		expect(filterDrills(drills, { topic: "All", type: "All" })).toEqual(drills);
	});

	it("picks a random drill from the filtered list using an injectable random source", () => {
		expect(pickRandomDrill(drills, () => 0.7)).toBe(drills[2]);
	});

	it("grades multiple choice answers with explanation feedback", () => {
		const drill = drills[1];
		if (drill.type !== "mcq") throw new Error("Unexpected fixture");

		expect(gradeMultipleChoiceAnswer(drill, "a")).toMatchObject({
			ok: true,
			message: "Correct.",
		});
		expect(gradeMultipleChoiceAnswer(drill, "b")).toMatchObject({
			ok: false,
		});
	});

	it("grades English answers by required keyword coverage", () => {
		const result = gradeEnglishAnswer(
			["duplicate", "seen", "true", "false"],
			"It returns true when a duplicate has been seen before.",
		);

		expect(result).toMatchObject({ ok: true });
		expect(result.message).toContain("3/4");
	});

	it("grades trace answers from comma-separated sums and a final answer", () => {
		const drill = drills[2];
		if (drill.type !== "trace") throw new Error("Unexpected fixture");

		expect(gradeTraceAnswer(drill, "7, 5, 8", "4")).toMatchObject({
			ok: true,
		});
		expect(gradeTraceAnswer(drill, "7, 5, 9", "4")).toMatchObject({
			ok: false,
		});
	});
});
