import { isAxiosError } from "axios";

/**
 * @brief function to handle error for async API class to server or system error
 * @param error instance of error
 * @param {string} message custom message for toast to user
 * @author `Gaurang Tyagi`
 */
export function handleError(error: unknown, message?: string) {
    if (isAxiosError(error)) {
        const msg = error.response?.data?.message || message;
        throw new Error(msg);
    } else {
        throw new Error((error as Error).message)
    }
}
