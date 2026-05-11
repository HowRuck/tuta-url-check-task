import validator from "validator";
import { FetchMockService } from "../services/FetchMockService";
import { UrlFileType, type RemoteCheckResponse } from "./UrlTypes";

export type { RemoteCheckResponse };
export { UrlFileType };

/**
 * Represents a URL and its validation state
 */
export class UrlModel {
	public url: string = "";
	public parsedUrl: URL | null = null;

	public remote: RemoteCheckResponse | null = null;
	public error: string = "";

	public isLocalValid: boolean = false;
	public isRemoteValid: boolean = false;

	/**
	 * Returns the status of the remote check, if available
	 */
	public get status(): number | undefined {
		return this.remote?.status;
	}

	/**
	 * Returns the type of the remote check, if available
	 */
	public get type(): UrlFileType | undefined {
		return this.remote?.type;
	}

	/**
	 * Returns whether the URL is valid (both local and remote are valid)
	 */
	public get isValid(): boolean {
		return this.isLocalValid && this.isRemoteValid;
	}

	/**
	 * Validates the local URL
	 */
	public syncLocalValidation(inputUrl: string) {
		this.url = inputUrl;

		// Reset state
        this.remote = null;
        this.error = "";
		this.isLocalValid = false;
        this.isRemoteValid = false;

        if (!inputUrl) return;

		// Validate the URL locally (URL.canParse also possible here)
		if (!validator.isURL(this.url, { require_protocol: true })) {
			this.error = "Invalid URL format";
			return;
		}

		this.parsedUrl = new URL(this.url);
		this.isLocalValid = true;
	}

	/**
	 * Validates the remote URL
	 */
	public async syncRemoteValidation(abortSignal: AbortSignal) {
		if (!this.isLocalValid || !this.parsedUrl) return;

		// Reset remote validation state
		this.remote = null;
		this.isRemoteValid = false;

		try {
			const resp = await FetchMockService.checkUrl(this.parsedUrl, abortSignal);

			if (resp.status != 200) {
				this.error = `Remote Check Failed (${resp.status})`;
				return;
			}

			this.remote = resp;
			this.error = "";
			this.isRemoteValid = true;
		} catch (err: any) {
			if (err.name === "AbortError") throw err;

			console.error("Remote validation error:", err);
			this.error = "Network Error or Server Unreachable";
		}
	}
}
