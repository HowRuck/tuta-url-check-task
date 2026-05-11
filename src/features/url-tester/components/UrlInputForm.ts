import m from "mithril";
import "./UrlInputForm.css";
import { UrlValidationController, InputState } from "../controller/UrlValidationController";

/**
 * Link icon SVG component
 */
const LinkIcon = m(
	"svg",
	{
		class: "h-[1em] opacity-50",
		xmlns: "http://www.w3.org/2000/svg",
		viewBox: "0 0 24 24",
	},
	[
		m(
			"g",
			{
				"stroke-linejoin": "round",
				"stroke-linecap": "round",
				"stroke-width": "2.5",
				fill: "none",
				stroke: "currentColor",
			},
			[
				m("path", { d: "M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" }),
				m("path", { d: "M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" }),
			],
		),
	],
);

/**
 * Loading spinner icon SVG component
 */
const LoadingSpinnerIcon = m("span.url-loading-spinner");

/**
 * URL input form component that handles user input and validation
 */
export default function UrlInputForm() {
	const urlCtl = new UrlValidationController();

	function getUrlInputClass(state: InputState): string {
		switch (state) {
			case InputState.VALIDATING:
				return "input-info";
			case InputState.ERROR:
				return "input-error";
			case InputState.SUCCESS:
				return "input-success";
			default:
				return "";
		}
	}

	function getValidationInfo(state: InputState): m.Vnode | null {
		switch (state) {
			case InputState.ERROR:
				return m("p.text-error", urlCtl.error);
			case InputState.SUCCESS:
				return m("p.text-success", `URL looks good! Type: ${urlCtl.fileType}`);
			default:
				return null;
		}
	}

	return {
		view: () => {
			const urlInputClass = getUrlInputClass(urlCtl.state);
			const validationMessage = getValidationInfo(urlCtl.state);

			return m(
				"form.url-form",
				{
					novalidate: true,
					onsubmit: (e: Event) => {
						e.preventDefault();
					},
				},
				[
					m("label.input", { class: urlInputClass }, [
						urlCtl.state === InputState.VALIDATING ? LoadingSpinnerIcon : LinkIcon,
						m("input", {
							type: "url",
							placeholder: "https://example.com",
							value: urlCtl.url,
                            oninput: (e: InputEvent) => urlCtl.handleInput(e),
							onupdate: (vnode) => {
    							const dom = vnode.dom as HTMLInputElement;
                                const currentError = urlCtl.error || "";

                                if (dom.validationMessage !== currentError) {
                                    dom.setCustomValidity(currentError);
                                }
                            }
						}),
					]),
					m("div.message-container", [validationMessage]),
				],
			);
		},
	};
}
