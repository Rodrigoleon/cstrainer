import { javascript } from "@codemirror/lang-javascript";
import { EditorState, type Extension } from "@codemirror/state";
import { basicSetup, EditorView } from "codemirror";
import { useEffect, useRef } from "react";

interface CodeEditorProps {
	value: string;
	onChange: (value: string) => void;
	ariaLabel?: string;
}

const trainerTheme = EditorView.theme(
	{
		"&": {
			backgroundColor: "#10100f",
			border: "1px solid #44403c",
			color: "#f5f5f4",
			fontSize: "14px",
			minHeight: "340px",
		},
		"&.cm-focused": {
			borderColor: "#6ee7b7",
			outline: "2px solid rgba(110, 231, 183, 0.3)",
		},
		".cm-content": {
			caretColor: "#6ee7b7",
			fontFamily:
				'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
			lineHeight: "1.55",
			minHeight: "340px",
			padding: "16px",
		},
		".cm-gutters": {
			backgroundColor: "#0c0a09",
			borderRight: "1px solid #292524",
			color: "#78716c",
		},
		".cm-activeLine": {
			backgroundColor: "rgba(68, 64, 60, 0.32)",
		},
		".cm-activeLineGutter": {
			backgroundColor: "rgba(68, 64, 60, 0.55)",
			color: "#d6d3d1",
		},
		".cm-selectionBackground, &.cm-focused .cm-selectionBackground": {
			backgroundColor: "rgba(110, 231, 183, 0.25)",
		},
		".cm-scroller": {
			fontFamily: "inherit",
		},
	},
	{ dark: true },
);

function createExtensions(
	onChange: (value: string) => void,
	ariaLabel: string,
): Extension[] {
	return [
		basicSetup,
		javascript(),
		EditorView.lineWrapping,
		trainerTheme,
		EditorView.contentAttributes.of({
			"aria-label": ariaLabel,
			spellcheck: "false",
		}),
		EditorView.updateListener.of((update) => {
			if (update.docChanged) onChange(update.state.doc.toString());
		}),
		EditorView.domEventHandlers({
			input: (event, view) => {
				const content = event.target;
				if (content instanceof HTMLElement && content.textContent) {
					const domText = content.textContent;
					if (domText !== view.state.doc.toString()) onChange(domText);
				}
				return false;
			},
		}),
	];
}

export default function CodeEditor({
	value,
	onChange,
	ariaLabel = "Code editor",
}: CodeEditorProps) {
	const hostRef = useRef<HTMLDivElement>(null);
	const viewRef = useRef<EditorView | null>(null);
	const onChangeRef = useRef(onChange);
	const labelRef = useRef(ariaLabel);

	useEffect(() => {
		onChangeRef.current = onChange;
	}, [onChange]);

	useEffect(() => {
		if (!hostRef.current || viewRef.current) return;

		const view = new EditorView({
			parent: hostRef.current,
			state: EditorState.create({
				doc: value,
				extensions: createExtensions(
					(next) => onChangeRef.current(next),
					labelRef.current,
				),
			}),
		});
		viewRef.current = view;

		return () => {
			view.destroy();
			viewRef.current = null;
		};
	}, [value]);

	useEffect(() => {
		const view = viewRef.current;
		if (!view) return;

		const current = view.state.doc.toString();
		if (value === current) return;

		view.dispatch({
			changes: { from: 0, to: current.length, insert: value },
		});
	}, [value]);

	return (
		<div
			ref={hostRef}
			className="mt-4 overflow-hidden rounded-none shadow-2xl shadow-black/20"
			data-editor-provider="codemirror"
		/>
	);
}
