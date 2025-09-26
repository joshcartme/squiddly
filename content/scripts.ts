export const defaultConfig = {
	blockIfFailingChecks: false,
	blockIfHasLabel: "",
};
// warning to show when finding and checking checks isn't working
const FAILING_CHECKS_WARNING = "cannot determine if checks are failing";
const ALL_CHECKS_PASSED_TEXT = "All checks have passed";

const PR_PAGE_REGEX = /\/pull\/\d+$/;
// const MERGE_SECTION_SELECTOR = ".merge-pr";
const initialConfig = await chrome.storage.sync.get(defaultConfig);

const styles = `button.squiddly[disabled][aria-label]:hover::after {
	content: attr(aria-label);
	position: absolute;
	left: 100%;
	background: black;
	color: white;
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

	getChecksDescriptionElement() {
		const checksSection = document.querySelector('[aria-label="Checks"]');
		if (!checksSection) {
			console.warn(`Checks section not found, ${FAILING_CHECKS_WARNING}`);
			return;
		}
		const ariaDescribedBy = checksSection.getAttribute("aria-describedby");
		if (!ariaDescribedBy) {
			console.warn(
				`aria-describedby not found on checks section, ${FAILING_CHECKS_WARNING}`
			);
			return;
		}
		const checksDescription = document.getElementById(ariaDescribedBy);
		if (!checksDescription) {
			console.warn(
				`Element with id ${ariaDescribedBy} not found, ${FAILING_CHECKS_WARNING}`
			);
			return;
		}
		return checksDescription;
	}

	reasonsToBlockMerge() {
		const reasons: string[] = [];
		if (this.config.blockIfFailingChecks) {
			const descriptionElement = this.getChecksDescriptionElement();
			if (descriptionElement) {
				if (
					!descriptionElement.textContent?.includes(
						ALL_CHECKS_PASSED_TEXT
					)
				) {
					reasons.push(
						descriptionElement.nextElementSibling?.textContent ||
							"checks are running or failing"
					);
				}
			} else {
				reasons.push("unable to determine checks status");
			}
		}
		if (this.config.blockIfHasLabel && this.hasTargetLabel()) {
			reasons.push(`PR has label "${this.config.blockIfHasLabel}"`);
		}
		return reasons;
	}

	blockIfAppropriate() {
		if (this.onPrPage) {
			const mergeButton = this.getMergeButton();
			// don't interfere with the confirm merge button
			if (
				!mergeButton ||
				mergeButton.textContent?.toLowerCase().includes("confirm")
			) {
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
		).reduce<HTMLButtonElement | null>((mergeButton, button) => {
			if (button?.textContent?.includes("merge")) {
				mergeButton = button;
			}
			return mergeButton;
		}, null);
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
