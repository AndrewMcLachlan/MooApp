import { DefaultError, useMutation, UseMutationOptions, UseMutationResult } from "@tanstack/react-query";
import { useHttpClient } from "../providers/HttpClientProvider";

export const useApiPatch = <Response, Variables, Data = null>(path: (variables: Variables) => string, options?: UseMutationOptions<Response, DefaultError, [Variables, Data]>): UseMutationResult<Response, DefaultError, [Variables, Data]> => {

    const httpClient = useHttpClient();

    return useMutation<Response, DefaultError, [Variables, Data]>({
        mutationFn: async ([variables, data]): Promise<Response> => (await httpClient.patch(path(variables), data)).data,
        ...options
    });
}