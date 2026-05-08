import { RemoteCheckResponse, UrlFileType } from "../model/UrlModel";

/**
 * Mocked service for checking URLs and determining their existence and type
 */
export class UrlCheckService {

    /**
     * Checks the existence of a URL and determines its type
     */
    public static async checkUrl(url: URL, signal?: AbortSignal): Promise<RemoteCheckResponse> {
        if (signal?.aborted) {
            throw signal.reason;
        }

        const urlExists = await UrlCheckService.doesExist(url, signal);

        if (!urlExists) {
            return UrlCheckService.buildResponse(url.toString(), 404, UrlFileType.Unknown);
        }

        try {
            const type = UrlCheckService.determineType(url);
            return UrlCheckService.buildResponse(url.toString(), 200, type);
        } catch {
            return UrlCheckService.buildResponse(url.toString(), 500, UrlFileType.Unknown);
        }
    }

    /**
     * Checks if the URL exists by throwing a dice
     */
    private static async doesExist(urlObj: URL, signal?: AbortSignal): Promise<boolean> {
        signal?.throwIfAborted();

        return new Promise((resolve, reject) => {
            // Reject the promise if the signal is aborted
            const onAbort = () => {
                clearTimeout(timer);
                reject(signal?.reason);
            };

            // Resolve the promise with a random boolean value after a random delay
            const timer = setTimeout(() => {
                signal?.removeEventListener('abort', onAbort);
                resolve(Math.random() < 0.5);
            }, Math.random() * 400 + 100);

            signal?.addEventListener('abort', onAbort);
        });
    }

    /**
     * Determines the type of the URL based on its path
     */
    private static determineType(urlObj: URL): UrlFileType {
        const cleanPath = urlObj.pathname

        if (!cleanPath || cleanPath === '/') {
            return UrlFileType.Directory;
        }

        if (cleanPath.endsWith('/')) {
            return UrlFileType.Directory;
        }

        const segments = cleanPath.split('/');
        const lastSegment = segments.pop() || '';

        return lastSegment.includes('.') && lastSegment.lastIndexOf('.') !== 0
                    ? UrlFileType.File
                    : UrlFileType.Directory;
    }

    /**
     * Builds the response object for a URL check
     */
    private static buildResponse(url: string, status: number, type: UrlFileType): RemoteCheckResponse {
        return { url, status, type };
    }
}
