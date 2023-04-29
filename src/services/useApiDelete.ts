import { useMutation, UseMutationOptions } from "react-query";
import { useHttpClient } from "../providers/HttpClientProvider";

export const useApiDelete = <Variables>(path: (variables: Variables) => string, options?: UseMutationOptions<null, null, Variables>) => {

    const httpClient = useHttpClient();

    return useMutation<null, null, Variables>(async (variables): Promise<null> => await httpClient.delete(path(variables)), options);
}