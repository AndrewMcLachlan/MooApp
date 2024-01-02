import { DefaultError, useMutation, UseMutationOptions, UseMutationResult } from "@tanstack/react-query";
import { useHttpClient } from "../providers/HttpClientProvider";
import { useMessages } from "providers";

export const useApiPut = <Response, Variables, Data = null>(path: (variables: Variables) => string, options?: UseMutationOptions<Response, DefaultError, [Variables, Data]>): UseMutationResult<Response, DefaultError, [Variables, Data]> => {

    const httpClient = useHttpClient();
    const messages = useMessages();

    const { onError, ...otherOptions } = options ?? {};

    const onErrorWrapper = (error: Error, variables: [Variables, Data], context: unknown) => {
        messages.sendMessage({ message: error.message, variant: "danger" });
        onError?.(error, variables, context);
    }

    return useMutation<Response, null,[Variables, Data]>({
        mutationFn: async ([variables, data]): Promise<Response> => (await httpClient.put(path(variables), data)).data,
        onError: onErrorWrapper,
        ...otherOptions
    });
}

export const useApiPutEmpty = <Response, Variables>(path: (variables: Variables) => string, options?: UseMutationOptions<Response, DefaultError, Variables>) => {

    const httpClient = useHttpClient();
    const messages = useMessages();

    const { onError, ...otherOptions } = options ?? {};

    const onErrorWrapper = (error: Error, variables: Variables, context: unknown) => {
        messages.sendMessage({ message: error.message, variant: "danger" });
        onError?.(error, variables, context);
    }

    return useMutation<Response, null,Variables>({
        mutationFn: async (variables): Promise<Response> => (await httpClient.put(path(variables))).data,
        onError: onErrorWrapper,
        ...otherOptions
    });
}