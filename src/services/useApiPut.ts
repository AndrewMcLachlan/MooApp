import { DefaultError, useMutation, UseMutationOptions, UseMutationResult } from "@tanstack/react-query";
import { useHttpClient } from "../providers/HttpClientProvider";

export const useApiPut = <Response, Variables, Data = null>(path: (variables: Variables) => string, options?: UseMutationOptions<Response, DefaultError, [Variables, Data]>): UseMutationResult<Response, DefaultError, [Variables, Data]> => {

    const httpClient = useHttpClient();

    return useMutation<Response, null,[Variables, Data]>({
        mutationFn: async ([variables, data]): Promise<Response> => (await httpClient.put(path(variables), data)).data,
        ...options
    });
}

export const useApiDatalessPut = <Response, Variables>(path: (variables: Variables) => string, options?: UseMutationOptions<Response, DefaultError, Variables>) => {

    const httpClient = useHttpClient();

    return useMutation<Response, null,Variables>({
        mutationFn: async (variables): Promise<Response> => (await httpClient.put(path(variables))).data,
        ...options
    });
}