import { UrlFileType, type RemoteCheckResponse } from "../model/UrlTypes";

/**
 * Mocked server-side URL checker.
 *
 * This service intentionally has no abort handling because the server mock
 * represents work that has already reached the server and must run to completion.
 */
export class ServerMock {
	public static checkUrl(url: URL): RemoteCheckResponse {
		const urlExists = ServerMock.doesExist();

		if (!urlExists) {
			return ServerMock.buildResponse(url.toString(), 404, UrlFileType.Unknown);
		}

		try {
			const type = ServerMock.determineType(url);
			return ServerMock.buildResponse(url.toString(), 200, type);
		} catch {
			return ServerMock.buildResponse(url.toString(), 500, UrlFileType.Unknown);
		}
	}

	/**
	 * Randomly decides whether the URL exists.
	 */
	private static doesExist(): boolean {
		return Math.random() < 0.5;
	}

	/**
	 * Determines the type of the URL based on its path.
	 */
	private static determineType(urlObj: URL): UrlFileType {
		const cleanPath = urlObj.pathname;

		if (!cleanPath || cleanPath === "/") {
			return UrlFileType.Directory;
		}

		if (cleanPath.endsWith("/")) {
			return UrlFileType.Directory;
		}

		const segments = cleanPath.split("/");
		const lastSegment = segments.pop() || "";

		return lastSegment.includes(".") && lastSegment.lastIndexOf(".") !== 0
			? UrlFileType.File
			: UrlFileType.Directory;
	}

	/**
	 * Builds the response object for a URL check.
	 */
	private static buildResponse(
		url: string,
		status: number,
		type: UrlFileType,
	): RemoteCheckResponse {
		return { url, status, type };
	}
}
