import m from "mithril";
import { UrlModel } from "../model/UrlModel";

/**
 * Controller for URL validation, handling local and remote validation
 */
export class UrlValidationController {
	private model = new UrlModel();

	private abortCtl: AbortController | null = null;
	private debounceTimer: number | undefined = 0;
	private lastRunTime = 0;
	private readonly THROTTLE_MS = 2000;
	private readonly DEBOUNCE_MS = 400;

	public isRemoteValidating = false;

	public get url() {
		return this.model.url;
	}
	public get error() {
		return this.model.error;
	}
	public get isValid() {
		return this.model.isValid;
	}
	public get fileType() {
		return this.model.type;
	}

	/**
	 * Handles input events, validating local URL and running remote check if valid
	 */
	public async handleinput(e: InputEvent) {
		const target = e.target as HTMLInputElement;
		const value = target.value;

		// Exit early if local URL check fails
		this.model.syncLocalValidation(value);
		if (!this.model.isLocalValid) {
			target.setCustomValidity(this.model.error || "");
			return;
		}

		this.scheduleRemoteCheck(target);
		m.redraw();
	}

	/**
	 * Schedules a remote check for the given target, applying throttle and debounce logic
	 */
	private scheduleRemoteCheck(target: HTMLInputElement) {
		const now = Date.now();
		const timeSinceLastRun = now - this.lastRunTime;

		// Leading Edge (Throttle)
		if (!this.debounceTimer && timeSinceLastRun >= this.THROTTLE_MS) {
			this.executeRemoteCheck(target);
			return;
		}

		// Trailing Edge (Debounce)
		clearTimeout(this.debounceTimer);
		this.debounceTimer = window.setTimeout(() => {
			this.executeRemoteCheck(target);
			this.debounceTimer = undefined;
		}, this.DEBOUNCE_MS);
	}

	/**
	 * Runs the remote check for the given target
	 */
	private async executeRemoteCheck(target: HTMLInputElement) {
		// Cancel pending requests to prevent race conditions
		this.abortCtl?.abort();
		this.abortCtl = new AbortController();

		this.lastRunTime = Date.now();
		this.isRemoteValidating = true;
		m.redraw();

		try {
			await this.model.syncRemoteValidation(this.abortCtl.signal);
		} catch (err: any) {
			if (err.name === "AbortError") return;

			console.error("Remote check failed:", err);
		} finally {
			// Update input validity and clear loading state
			target.setCustomValidity(this.model.error || "");
			this.isRemoteValidating = false;

			m.redraw();
		}
	}
}
