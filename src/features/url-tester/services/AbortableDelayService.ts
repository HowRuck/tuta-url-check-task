/**
 * Abortable delay helper used to simulate network latency
 */
export class AbortableDelayService {
	public static delay(ms: number, signal?: AbortSignal): Promise<void> {
		signal?.throwIfAborted();

		return new Promise((resolve, reject) => {
			const timer = setTimeout(() => {
				signal?.removeEventListener("abort", onAbort);
				resolve();
			}, ms);

			const onAbort = () => {
				clearTimeout(timer);
				reject(signal?.reason);
			};

			signal?.addEventListener("abort", onAbort, { once: true });
		});
	}
}
