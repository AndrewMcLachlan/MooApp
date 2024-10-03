import { AxiosError } from "axios";
import { ProblemDetails } from "models/ProblemDetails";

export const processAxiosError = (error: any): Error => {

    const axiosError = error as AxiosError<ProblemDetails, any>;

    if (axiosError.response) {
        console.error(`API Error`, axiosError.response?.data);
        return new Error(axiosError.response.data.detail ?? axiosError.response.data.title ?? axiosError.response.statusText);
    }
    else if (axiosError.request) {
        return new Error("No response received from server.");
    }
    else if (axiosError.message) {
        return new Error(axiosError.message);
    }
    else {
        return new Error("An unknown error occurred.");
    }
}