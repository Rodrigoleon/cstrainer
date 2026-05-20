import type { Drill } from "./types";

export const PROGRESS_STORAGE_KEY = "cstrainer.progress.v1";

export type AttemptOutcome = "pass" | "fail" | "give-up";

export interface TopicProgress {
	attempts: number;
	passes: number;
	failures: number;
}

export interface TrainerProgress {
	version: 1;
	completedDrillIds: string[];
	attempts: number;
	passes: number;
	failures: number;
	streak: number;
	lastStudiedTopic: string | null;
	topicStats: Record<string, TopicProgress>;
}

interface LocalStorageLike {
	getItem(key: string): string | null;
	setItem(key: string, value: string): unknown;
}

export function createEmptyProgress(): TrainerProgress {
	return {
		version: 1,
		completedDrillIds: [],
		attempts: 0,
		passes: 0,
		failures: 0,
		streak: 0,
		lastStudiedTopic: null,
		topicStats: {},
	};
}

export function recordAttempt(
	progress: TrainerProgress,
	drill: Drill,
	outcome: AttemptOutcome,
): TrainerProgress {
	const pass = outcome === "pass";
	const topicStats = {
		...progress.topicStats,
		[drill.topic]: {
			attempts: (progress.topicStats[drill.topic]?.attempts ?? 0) + 1,
			passes: (progress.topicStats[drill.topic]?.passes ?? 0) + (pass ? 1 : 0),
			failures:
				(progress.topicStats[drill.topic]?.failures ?? 0) + (pass ? 0 : 1),
		},
	};
	const completedDrillIds = pass
		? Array.from(new Set([...progress.completedDrillIds, drill.id]))
		: progress.completedDrillIds;

	return {
		...progress,
		completedDrillIds,
		attempts: progress.attempts + 1,
		passes: progress.passes + (pass ? 1 : 0),
		failures: progress.failures + (pass ? 0 : 1),
		streak: pass ? progress.streak + 1 : 0,
		lastStudiedTopic: drill.topic,
		topicStats,
	};
}

export function loadProgress(
	storage: LocalStorageLike | undefined = globalThis.localStorage,
): TrainerProgress {
	if (!storage) return createEmptyProgress();

	try {
		const raw = storage.getItem(PROGRESS_STORAGE_KEY);
		if (!raw) return createEmptyProgress();

		const parsed = JSON.parse(raw) as Partial<TrainerProgress>;
		if (parsed.version !== 1) return createEmptyProgress();

		return {
			...createEmptyProgress(),
			...parsed,
			completedDrillIds: Array.isArray(parsed.completedDrillIds)
				? parsed.completedDrillIds
				: [],
			topicStats:
				parsed.topicStats && typeof parsed.topicStats === "object"
					? parsed.topicStats
					: {},
		};
	} catch {
		return createEmptyProgress();
	}
}

export function saveProgress(
	progress: TrainerProgress,
	storage: LocalStorageLike | undefined = globalThis.localStorage,
) {
	if (!storage) return;
	storage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(progress));
}
