import { DefaultError, useMutation, UseMutationOptions, UseMutationResult } from "@tanstack/react-query";
import { useHttpClient } from "../providers/HttpClientProvider";

export const useApiPost = <Response, Variables, Data = null>(path: (variables: Variables) => string, options?: UseMutationOptions<Response, DefaultError, [Variables, Data]>): UseMutationResult<Response, DefaultError, [Variables, Data]> => {

    const httpClient = useHttpClient();

    return useMutation<Response, DefaultError, [Variables, Data]>({
        mutationFn: async ([variables, data]): Promise<Response> => (await httpClient.post(path(variables), data)).data,
        ...options
    });
}

export const useApiDatalessPost = <Response, Variables>(path: (variables: Variables) => string, options?: UseMutationOptions<Response, DefaultError, Variables>) => {

    const httpClient = useHttpClient();

    return useMutation<Response, DefaultError, Variables>({
        mutationFn: async (variables): Promise<Response> => (await httpClient.post(path(variables))).data,
        ...options
    });
}

export const useApiPostFile = <Variables extends { file: File }>(path: (variables: Variables) => string, options?: UseMutationOptions<null, DefaultError, Variables>) => {

    const httpClient = useHttpClient();

    return useMutation<null, DefaultError, Variables>({
        mutationFn: async (variables): Promise<null> => {

            const formData = new FormData();

            formData.append("file", variables.file, variables.file.name);

            return (await httpClient.post(path(variables), formData)).data;
        },
        ...options
    });
}