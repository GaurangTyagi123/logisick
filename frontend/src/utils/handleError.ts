import { isAxiosError } from "axios";

/**
 * @objective function to handle error for async API class to server or system error
 * @param error instance of error
 * @param message custom message for toast to user
 */
export function handleError(error: unknown, message: string) {
    if (isAxiosError(error)) {
        const msg = error.response?.data?.message || message;
        console.log(msg);
        throw new Error(msg);
    } else {
        console.log(error);
    }
}
