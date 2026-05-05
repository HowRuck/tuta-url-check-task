import validator from "validator";

/**
 * Represents the type of a URL (directory or file)
 */
export enum UrlFileType {
	Directory = "DIR",
	File = "FILE",
}

/**
 * Represents a remote check response
 */
export type RemoteCheckResponse = {
	url: string;
	status: number;
	type: UrlFileType;
};

/**
 * Represents a URL and its validation state
 */
export class UrlModel {
	public url: string = "";
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
		this.isLocalValid = false;
		this.isRemoteValid = false;

		// Validate the local URL
		if (!validator.isURL(this.url, { require_protocol: true })) {
			this.error = "Invalid URL format";
			return;
		}

		this.error = "";
		this.isLocalValid = true;
	}

	/**
	 * Validates the remote URL
	 */
	public async syncRemoteValidation(abortSignal: AbortSignal) {
		if (!this.isLocalValid) return;

		// Reset remote validation state
		this.remote = null;
		this.isRemoteValid = false;

		try {
			const resp = await fetch("http://localhost:3001/check", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ url: this.url }),
				signal: abortSignal,
			});

			if (!resp.ok) {
				this.error = `Remote Check Failed (${resp.status})`;
				return;
			}

			// Update remote validation state and error
			const data = await resp.json();
			this.remote = data as RemoteCheckResponse;
			this.error = "";
			this.isRemoteValid = true;
		} catch (err: any) {
			if (err.name === "AbortError") throw err;

			console.error("Remote validation error:", err);
			this.error = "Network Error or Server Unreachable";
		}
	}
}
