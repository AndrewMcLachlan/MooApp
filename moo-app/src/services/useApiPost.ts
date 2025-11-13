import { DefaultError, MutationFunctionContext, useMutation, UseMutationOptions, UseMutationResult } from "@tanstack/react-query";
import { useHttpClient } from "../providers/HttpClientProvider";
import { processAxiosError } from "./processAxiosError";
import { useErrorHandler } from "./errorHandler";

export const useApiPost = <Response, Variables, Data = null>(path: (variables: Variables) => string, options?: UseMutationOptions<Response, DefaultError, [Variables, Data]>): UseMutationResult<Response, DefaultError, [Variables, Data]> => {

    const httpClient = useHttpClient();
    const errorHandler = useErrorHandler();

    const { onError, ...otherOptions } = options ?? {};

    const onErrorWrapper = (error: Error, variables: [Variables, Data], onMutateResult: unknown, context: MutationFunctionContext) => {
        errorHandler(error);
        onError?.(error, variables, onMutateResult, context);
    }

    return useMutation<Response, DefaultError, [Variables, Data]>({
        mutationFn: async ([variables, data]): Promise<Response> => {
            try {
                return (await httpClient.post(path(variables), data)).data;
            }
            catch (error: any) {
                throw processAxiosError(error);
            }
        },
        onError: onErrorWrapper,
        ...otherOptions
    });
}

export const useApiPostEmpty = <Response, Variables>(path: (variables: Variables) => string, options?: UseMutationOptions<Response, DefaultError, Variables>) => {

    const httpClient = useHttpClient();
    const errorHandler = useErrorHandler();

    const { onError, ...otherOptions } = options ?? {};

    const onErrorWrapper = (error: Error, variables: Variables, onMutateResult: unknown, context: MutationFunctionContext) => {
        errorHandler(error);
        onError?.(error, variables, onMutateResult, context);
    }

    return useMutation<Response, DefaultError, Variables>({
        mutationFn: async (variables): Promise<Response> => {
            try {
                return (await httpClient.post(path(variables))).data;
            }
            catch (error: any) {
                throw processAxiosError(error);
            }
        },
        onError: onErrorWrapper,
        ...otherOptions
    });
}

export const useApiPostFile = <Variables extends { file: File }>(path: (variables: Variables) => string, options?: UseMutationOptions<null, DefaultError, Variables>) => {

    const httpClient = useHttpClient();
    const errorHandler = useErrorHandler();

    const { onError, ...otherOptions } = options ?? {};

    const onErrorWrapper = (error: Error, variables: Variables, onMutateResult: unknown, context: MutationFunctionContext) => {
        errorHandler(error);
        onError?.(error, variables, onMutateResult, context);
    }

    return useMutation<null, DefaultError, Variables>({
        mutationFn: async (variables): Promise<null> => {

            const formData = new FormData();

            formData.append("file", variables.file, variables.file.name);

            try {
                return (await httpClient.post(path(variables), formData)).data;
            }
            catch (error: any) {
                throw processAxiosError(error);
            }
        },
        onError: onErrorWrapper,
        ...otherOptions
    });
}
