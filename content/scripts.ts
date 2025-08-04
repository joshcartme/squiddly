let unmount: () => void;

// if (import.meta.webpackHot) {
// 	import.meta.webpackHot?.accept();
// 	import.meta.webpackHot?.dispose(() => unmount?.());
// }

export const defaultConfig = {
	blockIfFailingChecks: false,
	blockIfHasLabel: "",
};
const PR_PAGE_REGEX = /\/pull\/\d+$/;
// const MERGE_SECTION_SELECTOR = ".merge-pr";
const initialConfig = await chrome.storage.sync.get(defaultConfig);

const styles = `button.squiddly[disabled][aria-label]:hover::after {
    content: attr(aria-label);
    position: absolute;
    left: 100%;
    background: black;
    border-radius: 0.5rem;
    padding: 0.5rem;
    z-index: 100;
    width: 200%;
}`;

class SquiddlyCS {
	observer: MutationObserver;
	onPrPage: boolean = false;
	config = initialConfig;

	constructor() {
		chrome.storage.sync.onChanged.addListener(
			this.storageChanged.bind(this)
		);
		const body = document.querySelector("body");
		this.observer = new MutationObserver((mutations) => {
			if (
				this.onPrPage !== PR_PAGE_REGEX.test(document.location.pathname)
			) {
				this.onPrPage = !this.onPrPage;
			}
			this.blockIfAppropriate();
		});
		if (body) {
			this.observer.observe(body, { childList: true, subtree: true });
		}
		const styleElement = document.createElement("style");
		styleElement.textContent = styles;
		document.head.appendChild(styleElement);
	}

	reasonsToBlockMerge() {
		const reasons: string[] = [];
		if (this.config.blockIfFailingChecks && this.hasFailingChecks()) {
			reasons.push("failing checks");
		}
		if (this.config.blockIfHasLabel && this.hasTargetLabel()) {
			reasons.push(`PR has label "${this.config.blockIfHasLabel}"`);
		}
		return reasons;
	}

	blockIfAppropriate() {
		if (this.onPrPage) {
			const mergeButton = this.getMergeButton();
			if (!mergeButton) {
				return;
			}
			mergeButton.classList.add("squiddly");
			const reasons = this.reasonsToBlockMerge();
			if (reasons.length > 0) {
				mergeButton.disabled = true;
				mergeButton.ariaDisabled = "true";
				mergeButton.ariaLabel = `Merge button disabled by Squiddly: ${reasons.join(
					", "
				)}`;
			} else {
				mergeButton.removeAttribute("disabled");
				mergeButton.ariaDisabled = "false";
				mergeButton.removeAttribute("ariaLabel");
			}
		}
	}

	getMergeButton() {
		return Array.from(
			document.querySelectorAll("button")
		).reduce<HTMLButtonElement | null>((acc, b) => {
			if (b?.textContent?.includes("merge")) {
				acc = b;
			}
			return acc;
		}, null);
	}

	hasFailingChecks() {
		return (
			document.querySelectorAll('[aria-label="failing checks"]').length >
			0
		);
	}

	hasTargetLabel() {
		return !!document.querySelector(
			`.discussion-sidebar-item [data-name="${this.config.blockIfHasLabel}"]`
		);
	}

	storageChanged(changes: { [key: string]: chrome.storage.StorageChange }) {
		const changedItems = Object.keys(changes);
		for (const item of changedItems) {
			if (this.config.hasOwnProperty(item)) {
				this.config[item as keyof typeof this.config] =
					changes[item].newValue;
			}
		}
		this.blockIfAppropriate();
	}
}

if (document.readyState === "complete") {
	new SquiddlyCS();
} else {
	document.addEventListener("readystatechange", () => {
		if (document.readyState === "complete") new SquiddlyCS();
	});
}
