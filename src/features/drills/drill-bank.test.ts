import { describe, expect, it } from "vitest";

import { DRILL_TOPICS, drillBank } from "./drill-bank";

describe("drill bank", () => {
	it("ships a curated v1 bank with demo coverage plus expanded interview topics", () => {
		expect(drillBank.length).toBeGreaterThanOrEqual(43);
		expect(new Set(drillBank.map((drill) => drill.id)).size).toBe(
			drillBank.length,
		);
		expect(new Set(drillBank.map((drill) => drill.type))).toEqual(
			new Set(["code", "mcq", "english", "trace", "blank-file"]),
		);

		for (const topic of DRILL_TOPICS) {
			expect(drillBank.some((drill) => drill.topic === topic)).toBe(true);
		}
	});

	it("includes the binary one-bits drill with an explanation of number-to-binary conversion", () => {
		const drill = drillBank.find((item) => item.id === "one-bits-positions");

		expect(drill).toBeDefined();
		expect(drill?.type).toBe("code");
		expect(drill?.explanation).toContain("toString(2)");
		expect(drill?.explanation).toContain("base 2");
	});
});
