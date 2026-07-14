import { type DefaultError, type UseMutationOptions, type UseMutationResult } from "@tanstack/react-query";
import { useHttpClient } from "../providers/HttpClientProvider";
import { useApiMutation } from "./useApiMutation";

export const useApiPost = <Response, Variables, Data = null>(path: (variables: Variables) => string, options?: UseMutationOptions<Response, DefaultError, [Variables, Data]>): UseMutationResult<Response, DefaultError, [Variables, Data]> => {
    const httpClient = useHttpClient();
    return useApiMutation<Response, [Variables, Data]>(
        async ([variables, data]) => (await httpClient.post(path(variables), data)).data,
        options
    );
}

export const useApiPostEmpty = <Response, Variables>(path: (variables: Variables) => string, options?: UseMutationOptions<Response, DefaultError, Variables>) => {
    const httpClient = useHttpClient();
    return useApiMutation<Response, Variables>(
        async (variables) => (await httpClient.post(path(variables))).data,
        options
    );
}

export const useApiPostFile = <Variables extends { file: File }>(path: (variables: Variables) => string, options?: UseMutationOptions<null, DefaultError, Variables>) => {
    const httpClient = useHttpClient();
    return useApiMutation<null, Variables>(
        async (variables) => {
            const formData = new FormData();
            formData.append("file", variables.file, variables.file.name);
            return (await httpClient.post(path(variables), formData)).data;
        },
        options
    );
}
