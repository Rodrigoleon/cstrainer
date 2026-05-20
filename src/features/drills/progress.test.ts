import { describe, expect, it } from "vitest";

import {
	createEmptyProgress,
	loadProgress,
	recordAttempt,
	saveProgress,
} from "./progress";
import type { Drill } from "./types";

const drill: Drill = {
	id: "two-sum",
	title: "Two sum",
	topic: "Sets & Maps",
	level: "Level 3",
	type: "code",
	concept: "complements",
	prompt: "Return true if two numbers add to target.",
	hints: ["Track seen values."],
	explanation: "A set lets each complement lookup be constant time.",
	signature: "function solution(nums, target) { ... }",
	starter: "function solution(nums, target) {}",
	tests: [{ input: [[2, 7], 9], expected: true }],
};

describe("progress storage", () => {
	it("records passes, failures, give-ups, streak, and per-topic stats", () => {
		let progress = createEmptyProgress();

		progress = recordAttempt(progress, drill, "pass");
		progress = recordAttempt(progress, drill, "fail");
		progress = recordAttempt(progress, drill, "give-up");

		expect(progress.completedDrillIds).toEqual(["two-sum"]);
		expect(progress.attempts).toBe(3);
		expect(progress.passes).toBe(1);
		expect(progress.failures).toBe(2);
		expect(progress.streak).toBe(0);
		expect(progress.lastStudiedTopic).toBe("Sets & Maps");
		expect(progress.topicStats["Sets & Maps"]).toEqual({
			attempts: 3,
			passes: 1,
			failures: 2,
		});
	});

	it("saves and loads versioned progress with fallback for invalid data", () => {
		const storage = new Map<string, string>();
		const localStorageLike = {
			getItem: (key: string) => storage.get(key) ?? null,
			setItem: (key: string, value: string) => storage.set(key, value),
		};
		const progress = recordAttempt(createEmptyProgress(), drill, "pass");

		saveProgress(progress, localStorageLike);

		expect(loadProgress(localStorageLike)).toEqual(progress);
		storage.set("cstrainer.progress.v1", "{not json");
		expect(loadProgress(localStorageLike)).toEqual(createEmptyProgress());
	});
});
