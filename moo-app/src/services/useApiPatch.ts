import { type DefaultError, type UseMutationOptions, type UseMutationResult } from "@tanstack/react-query";
import { useHttpClient } from "../providers/HttpClientProvider";
import { useApiMutation } from "./useApiMutation";

export const useApiPatch = <Response, Variables, Data = null>(path: (variables: Variables) => string, options?: UseMutationOptions<Response, DefaultError, [Variables, Data]>): UseMutationResult<Response, DefaultError, [Variables, Data]> => {
    const httpClient = useHttpClient();
    return useApiMutation<Response, [Variables, Data]>(
        async ([variables, data]) => (await httpClient.patch(path(variables), data)).data,
        options
    );
}
