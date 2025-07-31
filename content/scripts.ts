let unmount: () => void;

// if (import.meta.webpackHot) {
// 	import.meta.webpackHot?.accept();
// 	import.meta.webpackHot?.dispose(() => unmount?.());
// }

const PR_PAGE_REGEX = /\/pull\/\d+$/;
const initialConfig = await chrome.storage.sync.get(["blockIfFailingChecks"]);

export class SquiddlyCS {
	observer: MutationObserver;
	onPrPage: boolean = false;
	config = initialConfig;

	constructor() {
		console.log("hello from content_scripts");
		chrome.storage.sync.onChanged.addListener(
			this.storageChanged.bind(this)
		);
		const body = document.querySelector("body");
		this.observer = new MutationObserver((mutations) => {
			if (
				this.onPrPage !== PR_PAGE_REGEX.test(document.location.pathname)
			) {
				this.onPrPage = !this.onPrPage;
				console.log("On PR page", this.onPrPage);
			}
			this.blockIfAppropriate();
		});
		if (body) {
			this.observer.observe(body, { childList: true, subtree: true });
		}
	}

	shouldBlockMerge() {
		return this.config.blockIfFailingChecks && this.hasFailingChecks();
	}

	blockIfAppropriate() {
		console.log(
			"Checking if we should block the merge button",
			this.onPrPage
		);
		if (this.onPrPage) {
			const mergeButton = this.getMergeButton();
			console.log("Found merge button:", mergeButton);
			if (!mergeButton) {
				return;
			}
			if (this.shouldBlockMerge()) {
				console.log("Blocking merge button due to failing checks");
				mergeButton.disabled = true;
			} else {
				console.log("No failing checks, enabling merge button");
				mergeButton.disabled = false;
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

	storageChanged(changes: { [key: string]: chrome.storage.StorageChange }) {
		const changedItems = Object.keys(changes);

		for (const item of changedItems) {
			if (this.config.hasOwnProperty(item)) {
				this.config[item as keyof typeof this.config] =
					changes[item].newValue;
			}
		}
		console.log("Storage changed:", this.config);
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

const MERGE_SECTION_SELECTOR = ".merge-pr";

function hasTargetLabel() {
	return !!document.querySelector(
		'.discussion-sidebar-item [data-name="failed-ci-checks"]'
	);
}
