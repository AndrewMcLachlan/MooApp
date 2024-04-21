import { DefaultError, useMutation, UseMutationOptions, UseMutationResult } from "@tanstack/react-query";
import { useHttpClient } from "../providers/HttpClientProvider";
import { useMessages } from "../providers/MessageProvider";
import { processAxiosError } from "./processAxiosError";

export const useApiPatch = <Response, Variables, Data = null>(path: (variables: Variables) => string, options?: UseMutationOptions<Response, DefaultError, [Variables, Data]>): UseMutationResult<Response, DefaultError, [Variables, Data]> => {

    const httpClient = useHttpClient();
    const messages = useMessages();

    const { onError, ...otherOptions } = options ?? {};

    const onErrorWrapper = (error: Error, variables: [Variables, Data], context: unknown) => {
        messages.sendMessage({ message: error.message, variant: "danger" });
        onError?.(error, variables, context);
    }

    return useMutation<Response, DefaultError, [Variables, Data]>({
        mutationFn: async ([variables, data]): Promise<Response> => {
            try {
                return (await httpClient.patch(path(variables), data)).data;
            }
            catch (error: any) {
                throw processAxiosError(error);
            }
        },
        onError: onErrorWrapper,
        ...otherOptions
    });
}
