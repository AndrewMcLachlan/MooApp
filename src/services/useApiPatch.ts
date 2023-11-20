import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { useHttpClient } from "../providers/HttpClientProvider";

export const useApiPatch = <Response, Variables, Data = null>(path: (variables: Variables) => string, options?: UseMutationOptions<Response, null, [Variables, Data]>) => {

    const httpClient = useHttpClient();

    return useMutation<Response, null, [Variables, Data]>({
        mutationFn: async ([variables, data]): Promise<Response> => (await httpClient.patch(path(variables), data)).data,
        ...options
    });
}