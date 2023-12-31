import { DefaultError, useMutation, UseMutationOptions, UseMutationResult } from "@tanstack/react-query";
import { useHttpClient } from "../providers/HttpClientProvider";
import { useMessages } from "providers";

export const useApiDelete = <Variables>(path: (variables: Variables) => string, options?: UseMutationOptions<null, Error, Variables>): UseMutationResult<Response, DefaultError, Variables> => {

    const httpClient = useHttpClient();
    const messages = useMessages();

    const { onError, ...otherOptions } = options;

    const onErrorWrapper = (error: Error, variables: Variables, context: unknown) => {
        messages.sendMessage({ message: error.message, variant: "danger" });
        onError?.(error, variables, context);
    }

    return useMutation<null, null, Variables>({
        mutationFn: async (variables): Promise<null> => await httpClient.delete(path(variables)),
        onError: onErrorWrapper,
        ...otherOptions
    });
}