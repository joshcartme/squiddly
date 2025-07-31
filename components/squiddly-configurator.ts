import "@webcomponents/custom-elements";
import "lit/polyfill-support.js";
import { LitElement, html, css } from "lit";
import { customElement, property, state } from "lit/decorators.js";

@customElement("squiddly-configurator")
export class SquiddlyConfigurator extends LitElement {
	static styles = css`
		:host {
			display: block;
			width: 10rem;
		}
		footer {
			user-select: none;
			font-size: 0.6em;
		}
	`;

	private port?: chrome.runtime.Port;
	private _blockIfFailingChecks = false;

	get blockIfFailingChecks() {
		return this._blockIfFailingChecks;
	}
	set blockIfFailingChecks(value: boolean) {
		this._blockIfFailingChecks = value;
		chrome.storage.sync.set({ blockIfFailingChecks: value });
	}

	async connectedCallback() {
		super.connectedCallback();

		const res = await chrome.storage.sync.get(["blockIfFailingChecks"]);
		this._blockIfFailingChecks = res.blockIfFailingChecks ?? false;
		this.requestUpdate();
	}

	render() {
		return html`<p>
			<label
				>Block if failing checks
				<input
					@change=${(e) =>
						(this.blockIfFailingChecks = e.target.checked)}
					type="checkbox"
					?checked=${this.blockIfFailingChecks}
			/></label>
		</p>`;
	}
}
