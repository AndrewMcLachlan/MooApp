import { type DefaultError, type MutationFunctionContext, useMutation, type UseMutationOptions, type UseMutationResult } from "@tanstack/react-query";
import { processAxiosError } from "./processAxiosError";
import { useErrorHandler } from "./errorHandler";

export const useApiMutation = <Response, Variables>(
    mutationFn: (variables: Variables) => Promise<Response>,
    options?: UseMutationOptions<Response, DefaultError, Variables>
): UseMutationResult<Response, DefaultError, Variables> => {
    const errorHandler = useErrorHandler();
    const { onError, ...otherOptions } = options ?? {};

    const onErrorWrapper = (error: Error, variables: Variables, onMutateResult: unknown, context: MutationFunctionContext) => {
        errorHandler(error);
        onError?.(error, variables, onMutateResult, context);
    };

    return useMutation<Response, DefaultError, Variables>({
        mutationFn: async (variables) => {
            try {
                return await mutationFn(variables);
            } catch (error: any) {
                throw processAxiosError(error);
            }
        },
        onError: onErrorWrapper,
        ...otherOptions
    });
};
