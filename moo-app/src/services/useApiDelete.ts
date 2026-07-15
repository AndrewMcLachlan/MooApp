import { type DefaultError, type UseMutationOptions, type UseMutationResult } from "@tanstack/react-query";
import { useHttpClient } from "../providers/HttpClientProvider";
import { useApiMutation } from "./useApiMutation";

export const useApiDelete = <Variables>(path: (variables: Variables) => string, options?: UseMutationOptions<void, DefaultError, Variables>): UseMutationResult<void, DefaultError, Variables> => {
    const httpClient = useHttpClient();
    return useApiMutation<void, Variables>(
        async (variables) => {
            await httpClient.delete(path(variables));
        },
        options
    );
}
