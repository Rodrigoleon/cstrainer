import { createFileRoute } from "@tanstack/react-router";

import DrillTrainer from "../features/drills/DrillTrainer";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
	return <DrillTrainer />;
}
