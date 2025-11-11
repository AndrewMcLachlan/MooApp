import { DefaultError, MutationFunctionContext, useMutation, UseMutationOptions, UseMutationResult } from "@tanstack/react-query";
import { useHttpClient } from "../providers/HttpClientProvider";
import { processAxiosError } from "./processAxiosError";
import { useErrorHandler } from "./errorHandler";

export const useApiDelete = <Variables>(path: (variables: Variables) => string, options?: UseMutationOptions<null, Error, Variables>): UseMutationResult<Response, DefaultError, Variables> => {

    const httpClient = useHttpClient();
    const errorHandler = useErrorHandler();

    const { onError, ...otherOptions } = options ?? {};

    const onErrorWrapper = (error: Error, variables: Variables, onMutateResult: unknown, context: MutationFunctionContext) => {
        errorHandler(error);
        onError?.(error, variables, onMutateResult, context);
    }
    
    return useMutation<null, null, Variables>({
        mutationFn: async (variables): Promise<null> => {
            try {
                return await httpClient.delete(path(variables));
            }
            catch (error: any) {
                throw processAxiosError(error);
            }
        },
        onError: onErrorWrapper,
        ...otherOptions
    });
}
