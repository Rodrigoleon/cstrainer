export type DrillLevel = "Level 1" | "Level 2" | "Level 3" | "Level 4";

export type DrillType = "code" | "mcq" | "english" | "trace" | "blank-file";

export type DrillTopic =
	| "Arrays"
	| "Objects"
	| "Strings"
	| "Sets & Maps"
	| "Recursion Basics"
	| "Big-O"
	| "Async JS"
	| "Mixed Interview";

export type DrillTypeFilter = DrillType | "All";
export type DrillTopicFilter = DrillTopic | "All";
export type DrillLevelFilter = DrillLevel | "All";

export interface TestCase {
	input: unknown[];
	expected: unknown;
}

interface BaseDrill {
	id: string;
	title: string;
	topic: DrillTopic;
	level: DrillLevel;
	type: DrillType;
	concept: string;
	prompt: string;
	hints: string[];
	explanation: string;
}

export interface CodeDrill extends BaseDrill {
	type: "code";
	signature: string;
	starter: string;
	tests: TestCase[];
	referenceSolution?: string;
}

export interface BlankFileDrill extends BaseDrill {
	type: "blank-file";
	signature: string;
	starter: string;
	tests: TestCase[];
	referenceSolution?: string;
}

export interface MultipleChoiceDrill extends BaseDrill {
	type: "mcq";
	choices: Array<{
		id: string;
		label: string;
	}>;
	correctChoiceId: string;
}

export interface EnglishDrill extends BaseDrill {
	type: "english";
	code: string;
	keywords: string[];
	expected: string;
}

export interface TraceDrill extends BaseDrill {
	type: "trace";
	values: number[];
	expectedSums: number[];
	expectedAnswer: number;
}

export type RunnableDrill = CodeDrill | BlankFileDrill;

export type Drill =
	| CodeDrill
	| BlankFileDrill
	| MultipleChoiceDrill
	| EnglishDrill
	| TraceDrill;

export interface DrillFilters {
	topic: DrillTopicFilter;
	type: DrillTypeFilter;
	level?: DrillLevelFilter;
}

export interface SubmissionResult {
	ok: boolean;
	message?: string;
	error?: string;
	results?: Array<{
		input: unknown[];
		expected: unknown;
		actual: unknown;
		passed: boolean;
	}>;
}
