import "@webcomponents/custom-elements";
import "lit/polyfill-support.js";
import { LitElement, html, css } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { defaultConfig } from "../content/scripts";

@customElement("squiddly-configurator")
export class SquiddlyConfigurator extends LitElement {
	static styles = css`
		:host {
			display: block;
			width: 20rem;
			padding: 1rem;
			font-family: -apple-system, BlinkMacSystemFont, "Segoe UI",
				"Noto Sans", Helvetica, Arial, sans-serif, "Apple Color Emoji",
				"Segoe UI Emoji";
			font-size: 12;
		}
		ul {
			list-style-type: none;
			padding: 0;
			margin: 0;
		}
		li {
			margin-bottom: 0.5rem;
		}
		li:last-child {
			margin-bottom: 0;
		}
		b {
			font-weight: 600;
			color: #333;
		}
	`;

	private port?: chrome.runtime.Port;
	private _blockIfFailingChecks = false;
	private _blockIfHasLabel = "";

	get blockIfFailingChecks() {
		return this._blockIfFailingChecks;
	}
	set blockIfFailingChecks(value: boolean) {
		this._blockIfFailingChecks = value;
		chrome.storage.sync.set({ blockIfFailingChecks: value });
	}

	get blockIfHasLabel() {
		return this._blockIfHasLabel;
	}
	set blockIfHasLabel(value: string) {
		this._blockIfHasLabel = value;
		chrome.storage.sync.set({ blockIfHasLabel: value });
	}

	async connectedCallback() {
		super.connectedCallback();

		const res = await chrome.storage.sync.get(defaultConfig);
		this._blockIfFailingChecks = res.blockIfFailingChecks ?? false;
		this._blockIfHasLabel = res.blockIfHasLabel ?? "";
		this.requestUpdate();
	}

	render() {
		return html`
			<ul>
				<li><b>Block merging if:</b></li>
				<li>
					<label>
						failing check[s]
						<input
							@change=${({
								target,
							}: {
								target: HTMLInputElement;
							}) => (this.blockIfFailingChecks = target?.checked)}
							type="checkbox"
							?checked=${this.blockIfFailingChecks}
						/>
					</label>
				</li>
				<li>or</li>
				<li>
					<label>
						PR has label
						<input
							value=${this.blockIfHasLabel}
							type="text"
							@input=${({
								target,
							}: {
								target: HTMLInputElement;
							}) => {
								this.blockIfHasLabel = target?.value;
							}}
						/>
					</label>
				</li>
			</ul>
		`;
	}
}
