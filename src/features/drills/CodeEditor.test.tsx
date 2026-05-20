import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import CodeEditor from "./CodeEditor";

afterEach(() => {
	cleanup();
});

describe("CodeEditor", () => {
	it("exposes a stable editor wrapper API for trainer code input", () => {
		let value = "function solution() {\n  return true;\n}";

		const { rerender } = render(
			<CodeEditor value={value} onChange={(next) => (value = next)} />,
		);

		const editor = screen.getByLabelText("Code editor");
		expect(editor).toBeTruthy();

		fireEvent.input(editor, {
			target: { textContent: "function solution() {\n  return false;\n}" },
		});
		expect(value).toContain("false");

		rerender(<CodeEditor value={value} onChange={(next) => (value = next)} />);
		expect(screen.getByLabelText("Code editor").textContent).toContain(
			"return false",
		);
	});
});
