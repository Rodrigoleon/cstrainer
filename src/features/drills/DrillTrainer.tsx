import {
	BookOpenCheck,
	CheckCircle2,
	Clock3,
	Code2,
	Eye,
	Lightbulb,
	ListChecks,
	Play,
	RotateCcw,
	Shuffle,
	Target,
	XCircle,
} from "lucide-react";
import type { ReactNode } from "react";
import { useEffect, useMemo, useState } from "react";
import CodeEditor from "./CodeEditor";
import { runCodeInWorker } from "./code-runner";
import { DRILL_TOPICS, DRILL_TYPES, drillBank } from "./drill-bank";
import {
	filterDrills,
	gradeEnglishAnswer,
	gradeMultipleChoiceAnswer,
	gradeTraceAnswer,
	safeStringify,
} from "./drill-utils";
import {
	createEmptyProgress,
	loadProgress,
	recordAttempt,
	saveProgress,
	type TrainerProgress,
} from "./progress";
import type {
	Drill,
	DrillTopicFilter,
	DrillTypeFilter,
	RunnableDrill,
	SubmissionResult,
} from "./types";

const TIMER_OPTIONS = [0, 5, 10, 15, 25];

function cx(...classes: Array<string | false | null | undefined>) {
	return classes.filter(Boolean).join(" ");
}

function typeLabel(type: Drill["type"]) {
	return DRILL_TYPES.find((item) => item.value === type)?.label ?? type;
}

function isRunnable(drill: Drill): drill is RunnableDrill {
	return drill.type === "code" || drill.type === "blank-file";
}

function Pill({
	children,
	active,
	onClick,
}: {
	children: ReactNode;
	active: boolean;
	onClick: () => void;
}) {
	return (
		<button
			type="button"
			onClick={onClick}
			className={cx(
				"rounded-md border px-3 py-2 text-sm font-semibold transition",
				active
					? "border-emerald-300 bg-emerald-200 text-stone-950"
					: "border-stone-700 bg-stone-900 text-stone-300 hover:border-stone-500 hover:bg-stone-800",
			)}
		>
			{children}
		</button>
	);
}

function Metric({ label, value }: { label: string; value: string | number }) {
	return (
		<div className="border border-stone-800 bg-stone-950 p-3">
			<div className="font-mono text-2xl font-black text-stone-50">{value}</div>
			<div className="mt-1 text-xs font-semibold uppercase tracking-wide text-stone-500">
				{label}
			</div>
		</div>
	);
}

function ResultPanel({ result }: { result: SubmissionResult | null }) {
	if (!result) return null;

	return (
		<div
			className={cx(
				"mt-4 border p-4",
				result.ok
					? "border-emerald-500/40 bg-emerald-950/30"
					: "border-rose-500/40 bg-rose-950/30",
			)}
		>
			<div
				className={cx(
					"flex items-center gap-2 font-bold",
					result.ok ? "text-emerald-200" : "text-rose-200",
				)}
			>
				{result.ok ? <CheckCircle2 size={18} /> : <XCircle size={18} />}
				{result.ok ? "Pass" : "Try again"}
			</div>
			{result.message && (
				<p className="mt-2 text-sm leading-6 text-stone-300">
					{result.message}
				</p>
			)}
			{result.error && (
				<pre className="mt-3 overflow-auto whitespace-pre-wrap bg-stone-950 p-3 text-sm text-rose-100">
					{result.error}
				</pre>
			)}
			{result.results?.length ? (
				<div className="mt-3 grid gap-2">
					{result.results.map((item, index) => (
						<div
							key={`${safeStringify(item.input)}-${safeStringify(item.expected)}`}
							className="border border-stone-800 bg-stone-950 p-3 text-sm"
						>
							<div className="font-semibold text-stone-100">
								Test {index + 1}: {item.passed ? "passed" : "failed"}
							</div>
							<div className="mt-2 grid gap-2 text-stone-400 xl:grid-cols-3">
								<div>
									<span className="text-stone-200">Input:</span>{" "}
									{safeStringify(item.input)}
								</div>
								<div>
									<span className="text-stone-200">Expected:</span>{" "}
									{safeStringify(item.expected)}
								</div>
								<div>
									<span className="text-stone-200">Actual:</span>{" "}
									{safeStringify(item.actual)}
								</div>
							</div>
						</div>
					))}
				</div>
			) : null}
		</div>
	);
}

function AnswerReveal({ drill }: { drill: Drill }) {
	return (
		<div className="mt-4 border border-amber-400/40 bg-amber-950/20 p-4">
			<div className="flex items-center gap-2 font-bold text-amber-200">
				<Eye size={18} />
				Reference answer
			</div>
			<p className="mt-2 text-sm leading-6 text-stone-200">
				{drill.explanation}
			</p>
			{drill.type === "english" && (
				<p className="mt-3 text-sm leading-6 text-amber-100">
					{drill.expected}
				</p>
			)}
			{drill.type === "trace" && (
				<p className="mt-3 font-mono text-sm text-amber-100">
					Sums: {safeStringify(drill.expectedSums)}. Final answer:{" "}
					{drill.expectedAnswer}.
				</p>
			)}
			{drill.type === "mcq" && (
				<p className="mt-3 text-sm text-amber-100">
					Correct choice:{" "}
					{
						drill.choices.find((choice) => choice.id === drill.correctChoiceId)
							?.label
					}
				</p>
			)}
			{isRunnable(drill) && drill.referenceSolution && (
				<pre className="mt-3 overflow-auto bg-stone-950 p-4 text-sm leading-6 text-amber-50">
					{drill.referenceSolution}
				</pre>
			)}
		</div>
	);
}

function DrillWorkArea({
	drill,
	code,
	setCode,
	result,
	onResult,
	onPass,
	onFail,
	onGiveUp,
}: {
	drill: Drill;
	code: string;
	setCode: (code: string) => void;
	result: SubmissionResult | null;
	onResult: (result: SubmissionResult | null) => void;
	onPass: () => void;
	onFail: () => void;
	onGiveUp: () => void;
}) {
	const [choiceId, setChoiceId] = useState("");
	const [englishAnswer, setEnglishAnswer] = useState("");
	const [traceSums, setTraceSums] = useState("");
	const [traceAnswer, setTraceAnswer] = useState("");
	const [visibleHints, setVisibleHints] = useState(0);
	const [showAnswer, setShowAnswer] = useState(false);
	const [isRunning, setIsRunning] = useState(false);

	const revealHint = () => {
		setVisibleHints((count) => Math.min(count + 1, drill.hints.length));
	};

	const giveUp = () => {
		setShowAnswer(true);
		onResult({
			ok: false,
			message:
				"Marked as a give-up. Study the answer, then reset and try again from memory.",
		});
		onGiveUp();
	};

	const submitCode = async () => {
		if (!isRunnable(drill)) return;

		setIsRunning(true);
		const output = await runCodeInWorker({
			userCode: code,
			tests: drill.tests,
		});
		setIsRunning(false);
		onResult(output);
		if (output.ok) onPass();
		else onFail();
	};

	const submitMultipleChoice = () => {
		if (drill.type !== "mcq") return;
		const output = gradeMultipleChoiceAnswer(drill, choiceId);
		onResult(output);
		if (output.ok) onPass();
		else onFail();
	};

	const submitEnglish = () => {
		if (drill.type !== "english") return;
		const output = gradeEnglishAnswer(drill, englishAnswer);
		onResult(output);
		if (output.ok) onPass();
		else onFail();
	};

	const submitTrace = () => {
		if (drill.type !== "trace") return;
		const output = gradeTraceAnswer(drill, traceSums, traceAnswer);
		onResult(output);
		if (output.ok) onPass();
		else onFail();
	};

	return (
		<section className="border border-stone-800 bg-stone-900/80 p-5 shadow-2xl shadow-black/20">
			<div className="flex flex-wrap items-start justify-between gap-3">
				<div>
					<div className="flex flex-wrap gap-2 text-xs font-black uppercase tracking-wide text-stone-500">
						<span>{drill.topic}</span>
						<span>/</span>
						<span>{drill.level}</span>
						<span>/</span>
						<span>{typeLabel(drill.type)}</span>
						<span>/</span>
						<span>{drill.concept}</span>
					</div>
					<h2 className="mt-2 text-3xl font-black tracking-tight text-stone-50">
						{drill.title}
					</h2>
				</div>
			</div>

			<p className="mt-4 max-w-4xl text-base leading-7 text-stone-300">
				{drill.prompt}
			</p>

			{"signature" in drill && (
				<div className="mt-4 border border-stone-800 bg-stone-950 p-3 font-mono text-sm text-emerald-200">
					{drill.signature}
				</div>
			)}

			{"code" in drill && (
				<pre className="mt-4 overflow-auto border border-stone-800 bg-stone-950 p-4 text-sm leading-6 text-stone-100">
					{drill.code}
				</pre>
			)}

			{isRunnable(drill) && (
				<>
					<CodeEditor
						value={code}
						onChange={setCode}
						ariaLabel={`${drill.title} code editor`}
					/>
					<div className="mt-4 flex flex-wrap gap-2">
						<button
							type="button"
							onClick={submitCode}
							disabled={isRunning}
							className="inline-flex items-center gap-2 rounded-md bg-emerald-300 px-4 py-2 font-black text-stone-950 transition hover:bg-emerald-200 disabled:cursor-not-allowed disabled:opacity-60"
						>
							<Play size={17} />
							{isRunning ? "Running tests..." : "Run tests"}
						</button>
						<button
							type="button"
							onClick={() => {
								setCode(drill.starter);
								onResult(null);
							}}
							className="inline-flex items-center gap-2 rounded-md border border-stone-700 bg-stone-950 px-4 py-2 font-bold text-stone-200 hover:border-stone-500"
						>
							<RotateCcw size={17} />
							Reset starter
						</button>
					</div>
				</>
			)}

			{drill.type === "mcq" && (
				<div className="mt-4 grid gap-2">
					{drill.choices.map((choice) => (
						<label
							key={choice.id}
							className={cx(
								"flex cursor-pointer items-center gap-3 border p-3 transition",
								choiceId === choice.id
									? "border-emerald-300 bg-emerald-950/30"
									: "border-stone-800 bg-stone-950 hover:border-stone-600",
							)}
						>
							<input
								type="radio"
								name={`choice-${drill.id}`}
								value={choice.id}
								checked={choiceId === choice.id}
								onChange={() => setChoiceId(choice.id)}
								className="h-4 w-4 accent-emerald-300"
							/>
							<span className="text-sm text-stone-100">{choice.label}</span>
						</label>
					))}
					<button
						type="button"
						onClick={submitMultipleChoice}
						disabled={!choiceId}
						className="mt-2 inline-flex w-fit items-center gap-2 rounded-md bg-emerald-300 px-4 py-2 font-black text-stone-950 hover:bg-emerald-200 disabled:cursor-not-allowed disabled:opacity-60"
					>
						<CheckCircle2 size={17} />
						Check answer
					</button>
				</div>
			)}

			{drill.type === "english" && (
				<>
					<textarea
						value={englishAnswer}
						onChange={(event) => setEnglishAnswer(event.target.value)}
						placeholder="Write the code's intention in plain English..."
						className="mt-4 min-h-[190px] w-full border border-stone-700 bg-stone-950 p-4 text-base leading-7 text-stone-100 outline-none transition placeholder:text-stone-600 focus:border-emerald-300 focus:ring-2 focus:ring-emerald-300/30"
					/>
					<button
						type="button"
						onClick={submitEnglish}
						className="mt-4 inline-flex items-center gap-2 rounded-md bg-emerald-300 px-4 py-2 font-black text-stone-950 hover:bg-emerald-200"
					>
						<ListChecks size={17} />
						Check explanation
					</button>
				</>
			)}

			{drill.type === "trace" && (
				<>
					<div className="mt-4 overflow-hidden border border-stone-800">
						<table className="w-full text-left text-sm">
							<thead className="bg-stone-950 text-stone-400">
								<tr>
									<th className="px-4 py-3">Candidate</th>
									<th className="px-4 py-3">Your total</th>
								</tr>
							</thead>
							<tbody className="divide-y divide-stone-800">
								{drill.values.map((value) => (
									<tr key={value}>
										<td className="px-4 py-3 font-mono text-stone-100">
											{value}
										</td>
										<td className="px-4 py-3 text-stone-500">
											Enter totals below in this order
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
					<div className="mt-4 grid gap-3 md:grid-cols-2">
						<label className="block">
							<span className="text-sm font-bold text-stone-300">
								Sums, comma-separated
							</span>
							<input
								value={traceSums}
								onChange={(event) => setTraceSums(event.target.value)}
								placeholder="Example: 7, 5, 8"
								className="mt-1 w-full border border-stone-700 bg-stone-950 px-4 py-3 text-stone-100 outline-none focus:border-emerald-300"
							/>
						</label>
						<label className="block">
							<span className="text-sm font-bold text-stone-300">
								Final answer
							</span>
							<input
								value={traceAnswer}
								onChange={(event) => setTraceAnswer(event.target.value)}
								placeholder="Example: 4"
								className="mt-1 w-full border border-stone-700 bg-stone-950 px-4 py-3 text-stone-100 outline-none focus:border-emerald-300"
							/>
						</label>
					</div>
					<button
						type="button"
						onClick={submitTrace}
						className="mt-4 inline-flex items-center gap-2 rounded-md bg-emerald-300 px-4 py-2 font-black text-stone-950 hover:bg-emerald-200"
					>
						<ListChecks size={17} />
						Check trace
					</button>
				</>
			)}

			<div className="mt-4 flex flex-wrap gap-2">
				<button
					type="button"
					onClick={revealHint}
					disabled={visibleHints >= drill.hints.length}
					className="inline-flex items-center gap-2 rounded-md border border-sky-700 bg-sky-950/40 px-4 py-2 font-bold text-sky-100 hover:border-sky-500 disabled:cursor-not-allowed disabled:opacity-60"
				>
					<Lightbulb size={17} />
					Show hint
				</button>
				<button
					type="button"
					onClick={giveUp}
					className="inline-flex items-center gap-2 rounded-md border border-amber-700 bg-amber-950/30 px-4 py-2 font-bold text-amber-100 hover:border-amber-500"
				>
					<Eye size={17} />
					Give up
				</button>
			</div>

			{visibleHints > 0 && (
				<div className="mt-4 grid gap-2">
					{drill.hints.slice(0, visibleHints).map((hint, index) => (
						<div
							key={hint}
							className="border border-sky-500/40 bg-sky-950/30 p-3 text-sm leading-6 text-sky-100"
						>
							<span className="font-bold">Hint {index + 1}:</span> {hint}
						</div>
					))}
				</div>
			)}

			<ResultPanel result={result} />
			{showAnswer && <AnswerReveal drill={drill} />}
		</section>
	);
}

export default function DrillTrainer() {
	const [topic, setTopic] = useState<DrillTopicFilter>("All");
	const [type, setType] = useState<DrillTypeFilter>("All");
	const [currentId, setCurrentId] = useState(drillBank[0].id);
	const [code, setCode] = useState(
		isRunnable(drillBank[0]) ? drillBank[0].starter : "",
	);
	const [result, setResult] = useState<SubmissionResult | null>(null);
	const [progress, setProgress] =
		useState<TrainerProgress>(createEmptyProgress);
	const [progressReady, setProgressReady] = useState(false);
	const [timerMinutes, setTimerMinutes] = useState(0);
	const [timeLeft, setTimeLeft] = useState(0);
	const [timerRunning, setTimerRunning] = useState(false);

	const filteredDrills = useMemo(
		() => filterDrills(drillBank, { topic, type }),
		[topic, type],
	);
	const currentDrill = useMemo(
		() =>
			drillBank.find((drill) => drill.id === currentId) ??
			filteredDrills[0] ??
			drillBank[0],
		[currentId, filteredDrills],
	);
	const accuracy = progress.attempts
		? Math.round((progress.passes / progress.attempts) * 100)
		: 0;

	useEffect(() => {
		if (!filteredDrills.some((drill) => drill.id === currentId)) {
			const next = filteredDrills[0] ?? drillBank[0];
			setCurrentId(next.id);
		}
	}, [filteredDrills, currentId]);

	useEffect(() => {
		setCode(isRunnable(currentDrill) ? currentDrill.starter : "");
		setResult(null);
		setTimerRunning(false);
		setTimeLeft(timerMinutes * 60);
	}, [currentDrill, timerMinutes]);

	useEffect(() => {
		setProgress(loadProgress(window.localStorage));
		setProgressReady(true);
	}, []);

	useEffect(() => {
		if (progressReady) saveProgress(progress, window.localStorage);
	}, [progress, progressReady]);

	useEffect(() => {
		setTimeLeft(timerMinutes * 60);
		setTimerRunning(false);
	}, [timerMinutes]);

	useEffect(() => {
		if (!timerRunning || timeLeft <= 0) return;

		const interval = window.setInterval(() => {
			setTimeLeft((seconds) => {
				if (seconds <= 1) {
					window.clearInterval(interval);
					setTimerRunning(false);
					return 0;
				}
				return seconds - 1;
			});
		}, 1000);

		return () => window.clearInterval(interval);
	}, [timerRunning, timeLeft]);

	const chooseDrill = (drill: Drill) => {
		setCurrentId(drill.id);
		setResult(null);
	};

	const randomDrill = () => {
		const source = filteredDrills.length ? filteredDrills : drillBank;
		chooseDrill(source[Math.floor(Math.random() * source.length)]);
	};

	const record = (outcome: "pass" | "fail" | "give-up") => {
		setProgress((current) => recordAttempt(current, currentDrill, outcome));
		if (outcome === "pass") setTimerRunning(false);
	};

	const formattedTime = `${Math.floor(timeLeft / 60)}:${String(timeLeft % 60).padStart(2, "0")}`;

	return (
		<div className="min-h-screen bg-[#171613] text-stone-100">
			<div className="border-b border-stone-800 bg-stone-950">
				<header className="mx-auto flex max-w-7xl flex-col gap-5 px-4 py-6 md:px-6">
					<div className="flex flex-wrap items-end justify-between gap-4">
						<div>
							<div className="flex items-center gap-2 text-sm font-black uppercase tracking-[0.24em] text-emerald-300">
								<BookOpenCheck size={18} />
								Practice Companion
							</div>
							<h1 className="mt-2 text-4xl font-black tracking-tight text-stone-50 md:text-6xl">
								CS Interview Drill Trainer
							</h1>
							<p className="mt-3 max-w-3xl text-base leading-7 text-stone-400">
								Drill JavaScript fluency, code reading, tracing, Big-O, async,
								and comments-first problem solving with deterministic feedback.
							</p>
						</div>
						<div className="grid grid-cols-3 border border-stone-800 bg-[#171613]">
							<Metric
								label="completed"
								value={progress.completedDrillIds.length}
							/>
							<Metric label="streak" value={progress.streak} />
							<Metric label="accuracy" value={`${accuracy}%`} />
						</div>
					</div>
				</header>
			</div>

			<div className="mx-auto grid max-w-7xl gap-5 px-4 py-5 md:px-6 lg:grid-cols-[340px_1fr]">
				<aside className="space-y-4">
					<section className="border border-stone-800 bg-stone-900/70 p-4">
						<div className="flex items-center gap-2 font-black text-stone-50">
							<Target size={18} />
							Study track
						</div>
						<div className="mt-3 flex flex-wrap gap-2">
							<Pill active={topic === "All"} onClick={() => setTopic("All")}>
								All
							</Pill>
							{DRILL_TOPICS.map((item) => (
								<Pill
									key={item}
									active={topic === item}
									onClick={() => setTopic(item)}
								>
									{item}
								</Pill>
							))}
						</div>
					</section>

					<section className="border border-stone-800 bg-stone-900/70 p-4">
						<div className="flex items-center gap-2 font-black text-stone-50">
							<Code2 size={18} />
							Drill type
						</div>
						<div className="mt-3 flex flex-wrap gap-2">
							{DRILL_TYPES.map((item) => (
								<Pill
									key={item.value}
									active={type === item.value}
									onClick={() => setType(item.value)}
								>
									{item.label}
								</Pill>
							))}
						</div>
						<button
							type="button"
							onClick={randomDrill}
							className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-md bg-emerald-300 px-4 py-3 font-black text-stone-950 transition hover:bg-emerald-200"
						>
							<Shuffle size={17} />
							Pick random drill
						</button>
					</section>

					<section className="border border-stone-800 bg-stone-900/70 p-4">
						<div className="flex items-center gap-2 font-black text-stone-50">
							<Clock3 size={18} />
							Timer
						</div>
						<div className="mt-3 flex flex-wrap gap-2">
							{TIMER_OPTIONS.map((minutes) => (
								<Pill
									key={minutes}
									active={timerMinutes === minutes}
									onClick={() => setTimerMinutes(minutes)}
								>
									{minutes === 0 ? "Off" : `${minutes}m`}
								</Pill>
							))}
						</div>
						<div className="mt-4 border border-stone-800 bg-stone-950 p-4 text-center">
							<div className="font-mono text-4xl font-black tabular-nums">
								{timerMinutes === 0 ? "--:--" : formattedTime}
							</div>
							{timeLeft === 0 && timerMinutes > 0 && (
								<div className="mt-1 text-sm font-bold text-rose-300">
									Time is up.
								</div>
							)}
						</div>
						<div className="mt-3 grid grid-cols-2 gap-2">
							<button
								type="button"
								onClick={() => {
									if (timerMinutes === 0) return;
									setTimeLeft(timerMinutes * 60);
									setTimerRunning(true);
								}}
								disabled={timerMinutes === 0}
								className="rounded-md border border-stone-700 bg-stone-950 px-4 py-2 font-bold text-stone-200 hover:border-stone-500 disabled:cursor-not-allowed disabled:opacity-50"
							>
								Start
							</button>
							<button
								type="button"
								onClick={() => setTimerRunning(false)}
								className="rounded-md border border-stone-700 bg-stone-950 px-4 py-2 font-bold text-stone-200 hover:border-stone-500"
							>
								Pause
							</button>
						</div>
					</section>

					<section className="border border-stone-800 bg-stone-900/70 p-4">
						<div className="flex items-center justify-between gap-3">
							<div className="font-black text-stone-50">Drills</div>
							<div className="text-xs font-bold uppercase tracking-wide text-stone-500">
								{filteredDrills.length} shown
							</div>
						</div>
						<div className="mt-3 max-h-[470px] space-y-2 overflow-auto pr-1">
							{filteredDrills.map((drill) => (
								<button
									type="button"
									key={drill.id}
									onClick={() => chooseDrill(drill)}
									className={cx(
										"w-full border p-3 text-left transition",
										drill.id === currentDrill.id
											? "border-emerald-300 bg-emerald-950/40"
											: "border-stone-800 bg-stone-950 hover:border-stone-600",
									)}
								>
									<div className="font-bold text-stone-100">{drill.title}</div>
									<div className="mt-1 text-xs text-stone-500">
										{drill.level} / {typeLabel(drill.type)} / {drill.topic}
									</div>
								</button>
							))}
						</div>
					</section>
				</aside>

				<main>
					<DrillWorkArea
						key={currentDrill.id}
						drill={currentDrill}
						code={code}
						setCode={setCode}
						result={result}
						onResult={setResult}
						onPass={() => record("pass")}
						onFail={() => record("fail")}
						onGiveUp={() => record("give-up")}
					/>
				</main>
			</div>
		</div>
	);
}
