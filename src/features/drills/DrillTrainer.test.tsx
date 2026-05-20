import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import DrillTrainer from "./DrillTrainer";

afterEach(() => {
	cleanup();
	window.localStorage.clear();
});

describe("DrillTrainer", () => {
	it("renders the practice workspace with filters and progress", () => {
		render(<DrillTrainer />);

		expect(
			screen.getByRole("heading", { name: /CS Interview Drill Trainer/i }),
		).toBeTruthy();
		expect(
			screen.getByRole("button", { name: /Pick random drill/i }),
		).toBeTruthy();
		expect(screen.getByText(/completed/i)).toBeTruthy();
		expect(
			screen.getAllByText(/Return only even numbers/i).length,
		).toBeGreaterThan(0);
	});

	it("reveals progressive hints and the give-up answer", () => {
		render(<DrillTrainer />);

		fireEvent.click(screen.getByRole("button", { name: /Show hint/i }));
		expect(screen.getByText(/number % 2 === 0/i)).toBeTruthy();

		fireEvent.click(screen.getByRole("button", { name: /Give up/i }));
		expect(screen.getByText(/Reference answer/i)).toBeTruthy();
		expect(screen.getByText(/filtering problem/i)).toBeTruthy();
	});
});
