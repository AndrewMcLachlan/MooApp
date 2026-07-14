import { type DefaultError, type UseMutationOptions, type UseMutationResult } from "@tanstack/react-query";
import { useHttpClient } from "../providers/HttpClientProvider";
import { useApiMutation } from "./useApiMutation";

export const useApiPut = <Response, Variables, Data = null>(path: (variables: Variables) => string, options?: UseMutationOptions<Response, DefaultError, [Variables, Data]>): UseMutationResult<Response, DefaultError, [Variables, Data]> => {
    const httpClient = useHttpClient();
    return useApiMutation<Response, [Variables, Data]>(
        async ([variables, data]) => (await httpClient.put(path(variables), data)).data,
        options
    );
}

export const useApiPutEmpty = <Response, Variables>(path: (variables: Variables) => string, options?: UseMutationOptions<Response, DefaultError, Variables>) => {
    const httpClient = useHttpClient();
    return useApiMutation<Response, Variables>(
        async (variables) => (await httpClient.put(path(variables))).data,
        options
    );
}
