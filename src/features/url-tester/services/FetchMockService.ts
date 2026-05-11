import type { RemoteCheckResponse } from "../model/UrlTypes";
import { AbortableDelayService } from "./AbortableDelayService";
import { ServerMock } from "./ServerMock";

/**
 * Mocked fetch-like service used by the URL tester
 *
 * It simulates network latency with an abortable delay and then delegates to the
 * server mock for the actual response
 */
export class FetchMockService {
	public static async checkUrl(url: URL, signal?: AbortSignal): Promise<RemoteCheckResponse> {
		signal?.throwIfAborted();

		// Simulate network latency
		const simulatedLatencyMs = Math.random() * 1000 + 100;
		await AbortableDelayService.delay(simulatedLatencyMs, signal);

		// Simulate server response
		return ServerMock.checkUrl(url);
	}
}
