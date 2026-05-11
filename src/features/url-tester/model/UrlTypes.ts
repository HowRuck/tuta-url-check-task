/**
 * Represents the type of a URL (directory or file)
 */
export enum UrlFileType {
	Directory = "DIR",
	File = "FILE",
	Unknown = "UNKNOWN",
}

/**
 * Represents a remote check response
 */
export type RemoteCheckResponse = {
	url: string;
	status: number;
	type: UrlFileType;
};
