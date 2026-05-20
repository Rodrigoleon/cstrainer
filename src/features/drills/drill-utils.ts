import type {
	Drill,
	DrillFilters,
	EnglishDrill,
	MultipleChoiceDrill,
	SubmissionResult,
	TraceDrill,
} from "./types";

export function filterDrills(drills: Drill[], filters: DrillFilters) {
	return drills.filter((drill) => {
		const topicOk = filters.topic === "All" || drill.topic === filters.topic;
		const typeOk = filters.type === "All" || drill.type === filters.type;
		const levelOk =
			!filters.level ||
			filters.level === "All" ||
			drill.level === filters.level;

		return topicOk && typeOk && levelOk;
	});
}

export function pickRandomDrill(
	drills: Drill[],
	random: () => number = Math.random,
) {
	return drills[Math.floor(random() * drills.length)];
}

export function normalize(value: unknown): unknown {
	if (Array.isArray(value)) return value.map(normalize);
	if (value && typeof value === "object") {
		return Object.keys(value)
			.sort()
			.reduce<Record<string, unknown>>((acc, key) => {
				acc[key] = normalize((value as Record<string, unknown>)[key]);
				return acc;
			}, {});
	}
	return value;
}

export function deepEqual(a: unknown, b: unknown) {
	return JSON.stringify(normalize(a)) === JSON.stringify(normalize(b));
}

export function safeStringify(value: unknown) {
	try {
		return JSON.stringify(value);
	} catch {
		return String(value);
	}
}

export function gradeMultipleChoiceAnswer(
	drill: MultipleChoiceDrill,
	choiceId: string,
): SubmissionResult {
	const ok = choiceId === drill.correctChoiceId;

	return {
		ok,
		message: ok
			? "Correct."
			: `Not quite. The correct answer is ${drill.correctChoiceId}.`,
	};
}

export function gradeEnglishAnswer(
	keywordsOrDrill: string[] | EnglishDrill,
	answer: string,
): SubmissionResult {
	const keywords = Array.isArray(keywordsOrDrill)
		? keywordsOrDrill
		: keywordsOrDrill.keywords;
	const lower = answer.toLowerCase();
	const matched = keywords.filter((keyword) =>
		lower.includes(String(keyword).toLowerCase()),
	);
	const needed = Math.ceil(keywords.length * 0.65);
	const ok = matched.length >= needed;

	return {
		ok,
		message: ok
			? `Good. You included ${matched.length}/${keywords.length} key ideas: ${matched.join(", ")}.`
			: `Close, but missing important ideas. Matched ${matched.length}/${keywords.length}: ${matched.join(", ") || "none"}.`,
	};
}

export function gradeTraceAnswer(
	drill: TraceDrill,
	sums: string,
	answer: string,
): SubmissionResult {
	const parsedSums = sums
		.split(",")
		.map((item) => Number(item.trim()))
		.filter((item) => !Number.isNaN(item));
	const parsedAnswer = Number(answer.trim());
	const sumsOk = deepEqual(parsedSums, drill.expectedSums);
	const answerOk = parsedAnswer === drill.expectedAnswer;

	return {
		ok: sumsOk && answerOk,
		message:
			sumsOk && answerOk
				? "Nice. Your trace matches the expected sums and final answer."
				: `Expected sums ${safeStringify(drill.expectedSums)} and answer ${drill.expectedAnswer}.`,
	};
}
