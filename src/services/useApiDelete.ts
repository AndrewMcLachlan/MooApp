import { DefaultError, useMutation, UseMutationOptions, UseMutationResult } from "@tanstack/react-query";
import { useHttpClient } from "../providers/HttpClientProvider";

export const useApiDelete = <Variables>(path: (variables: Variables) => string, options?: UseMutationOptions<null, null, Variables>): UseMutationResult<Response, DefaultError, Variables> => {

    const httpClient = useHttpClient();

    return useMutation<null, null, Variables>({
        mutationFn: async (variables): Promise<null> => await httpClient.delete(path(variables)),
        ...options
    });
}