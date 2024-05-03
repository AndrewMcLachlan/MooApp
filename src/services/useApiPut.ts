import { DefaultError, useMutation, UseMutationOptions, UseMutationResult } from "@tanstack/react-query";
import { useHttpClient } from "../providers/HttpClientProvider";
import { processAxiosError } from "./processAxiosError";
import { useErrorHandler } from "./errorHandler";

export const useApiPut = <Response, Variables, Data = null>(path: (variables: Variables) => string, options?: UseMutationOptions<Response, DefaultError, [Variables, Data]>): UseMutationResult<Response, DefaultError, [Variables, Data]> => {

    const httpClient = useHttpClient();
    const errorHandler = useErrorHandler();

    const { onError, ...otherOptions } = options ?? {};

    const onErrorWrapper = (error: Error, variables: [Variables, Data], context: unknown) => {
        errorHandler(error);
        onError?.(error, variables, context);
    }

    return useMutation<Response, null,[Variables, Data]>({
        mutationFn: async ([variables, data]): Promise<Response> => {
            try {
                return (await httpClient.put(path(variables), data)).data;
            }
            catch (error: any) {
                throw processAxiosError(error);
            }
        },
        onError: onErrorWrapper,
        ...otherOptions
    });
}

export const useApiPutEmpty = <Response, Variables>(path: (variables: Variables) => string, options?: UseMutationOptions<Response, DefaultError, Variables>) => {

    const httpClient = useHttpClient();
    const errorHandler = useErrorHandler();

    const { onError, ...otherOptions } = options ?? {};

    const onErrorWrapper = (error: Error, variables: Variables, context: unknown) => {
        errorHandler(error);
        onError?.(error, variables, context);
    }

    return useMutation<Response, null,Variables>({
        mutationFn: async (variables): Promise<Response> => {
            try {
                return (await httpClient.put(path(variables))).data;
            }
            catch (error: any) {
                throw processAxiosError(error);
            }
        },
        onError: onErrorWrapper,
        ...otherOptions
    });
}
