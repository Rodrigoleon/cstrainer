import { deepEqual } from "./drill-utils";
import type { SubmissionResult, TestCase } from "./types";

interface EvaluateUserCodeOptions {
	userCode: string;
	tests: TestCase[];
	functionName?: string;
}

export function evaluateUserCode({
	userCode,
	tests,
	functionName = "solution",
}: EvaluateUserCodeOptions): SubmissionResult {
	try {
		const getFn = new Function(
			`${userCode}\n; return typeof ${functionName} !== "undefined" ? ${functionName} : null;`,
		);
		const fn = getFn();

		if (typeof fn !== "function") {
			return {
				ok: false,
				error: `Could not find a function named ${functionName}.`,
			};
		}

		const results = [];
		for (const test of tests) {
			const actual = fn.apply(null, test.input);
			const passed = deepEqual(actual, test.expected);
			results.push({
				input: test.input,
				expected: test.expected,
				actual,
				passed,
			});
			if (!passed) break;
		}

		return {
			ok: results.every((result) => result.passed),
			results,
		};
	} catch (err) {
		return {
			ok: false,
			error: err instanceof Error ? err.message : String(err),
		};
	}
}

export function createWorkerSource() {
	return `
		function normalize(value) {
			if (Array.isArray(value)) return value.map(normalize);
			if (value && typeof value === "object") {
				return Object.keys(value).sort().reduce((acc, key) => {
					acc[key] = normalize(value[key]);
					return acc;
				}, {});
			}
			return value;
		}
		function deepEqual(a, b) {
			return JSON.stringify(normalize(a)) === JSON.stringify(normalize(b));
		}
		self.onmessage = function(event) {
			const { userCode, tests, functionName } = event.data;
			try {
				const getFn = new Function(userCode + "\\n; return typeof " + functionName + " !== 'undefined' ? " + functionName + " : null;");
				const fn = getFn();
				if (typeof fn !== "function") {
					self.postMessage({ ok: false, error: "Could not find a function named " + functionName + "." });
					return;
				}
				const results = [];
				for (const test of tests) {
					const actual = fn.apply(null, test.input);
					const passed = deepEqual(actual, test.expected);
					results.push({ input: test.input, expected: test.expected, actual, passed });
					if (!passed) break;
				}
				self.postMessage({ ok: results.every((result) => result.passed), results });
			} catch (err) {
				self.postMessage({ ok: false, error: err && err.message ? err.message : String(err) });
			}
		};
	`;
}

export function runCodeInWorker({
	userCode,
	tests,
	functionName = "solution",
	timeoutMs = 1500,
}: EvaluateUserCodeOptions & { timeoutMs?: number }) {
	return new Promise<SubmissionResult>((resolve) => {
		if (typeof Worker === "undefined" || typeof Blob === "undefined") {
			resolve(evaluateUserCode({ userCode, tests, functionName }));
			return;
		}

		const blob = new Blob([createWorkerSource()], {
			type: "application/javascript",
		});
		const workerUrl = URL.createObjectURL(blob);
		const worker = new Worker(workerUrl);
		const timer = window.setTimeout(() => {
			worker.terminate();
			URL.revokeObjectURL(workerUrl);
			resolve({
				ok: false,
				error: "Your code took too long. Check for an infinite loop.",
			});
		}, timeoutMs);

		worker.onmessage = (event: MessageEvent<SubmissionResult>) => {
			window.clearTimeout(timer);
			worker.terminate();
			URL.revokeObjectURL(workerUrl);
			resolve(event.data);
		};

		worker.onerror = (event) => {
			window.clearTimeout(timer);
			worker.terminate();
			URL.revokeObjectURL(workerUrl);
			resolve({
				ok: false,
				error: event.message || "Unknown worker error.",
			});
		};

		worker.postMessage({ userCode, tests, functionName });
	});
}
