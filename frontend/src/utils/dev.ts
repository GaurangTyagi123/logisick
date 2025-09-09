/**
 * @objective function to check if app is in development or production
 * @returns boolean value
 */
export function isDev() {
	return process.env.NODE_ENV === "development";
}
