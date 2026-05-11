import m from "mithril";
import { UrlModel } from "../model/UrlModel";

/**
 * Enum representing the possible states of the input field
 */
export enum InputState {
	IDLE, // Initial state
	TYPING, // User is typing / waiting for debounce
	ERROR, // Input is invalid
	VALIDATING, // Remote validation is in progress
	SUCCESS, // Input is valid and remote validation succeeded
}

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

	public state: InputState = InputState.IDLE;

	// Proxy Methods for model

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
	 * Updates the validation state for the given target
	 *
	 * **WARNING:** This method cancels any pending remote validation and resets the debounce timer
	 */
	private updateValidationState(
		target: HTMLInputElement,
		validity: string | null,
		state: InputState,
	) {
		clearTimeout(this.debounceTimer);
		this.debounceTimer = undefined;

		this.abortCtl?.abort();
		this.state = state;
		target.setCustomValidity(validity || "");

		m.redraw();
	}

	/**
	 * Handles input events, validating local URL and running remote check if valid
	 */
	public async handleInput(e: InputEvent): Promise<void> {
		const target = e.target as HTMLInputElement;
		const value = target.value.trim();

		this.model.syncLocalValidation(value);

		if (!value) {
			this.updateValidationState(target, null, InputState.IDLE);
			return;
		}

		if (this.model.isLocalValid) {
			this.state = InputState.TYPING;
			this.scheduleRemoteCheck(target);
		} else {
			this.updateValidationState(target, this.model.error, InputState.ERROR);
		}

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
		this.abortCtl?.abort();
		this.abortCtl = new AbortController();
		const signal = this.abortCtl.signal;

		this.lastRunTime = Date.now();
		this.state = InputState.VALIDATING;
		m.redraw();

		try {
			await this.model.syncRemoteValidation(signal);

			if (signal.aborted) return;

			this.state = this.model.error ? InputState.ERROR : InputState.SUCCESS;
		} catch (err: any) {
			if (err.name === "AbortError") return;

			console.error("Remote check failed:", err);
			this.state = InputState.ERROR;
		} finally {
			target.setCustomValidity(this.model.error || "");

			m.redraw();
		}
	}
}
