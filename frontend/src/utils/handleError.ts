import { isAxiosError } from "axios";

export function handleError(error: unknown, message: string) {
    if (isAxiosError(error)) {
        const msg = error.response?.data?.message || message;
        console.log(msg);
        throw new Error(msg);
    } else {
        console.log(error);
    }
}
