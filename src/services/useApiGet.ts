import { useQuery, QueryKey, UseQueryOptions } from "react-query";
import { useHttpClient } from "../providers/HttpClientProvider";
import { PagedResult } from "models";

export const useApiPagedGet = <T extends PagedResult<any>>(key: QueryKey, path: string, options?: UseQueryOptions<T>) => {

    const httpClient = useHttpClient();

    const get = async (path: string) => {
        const response = await httpClient.get<any>(path);

        return {
            results: response.data,
            total: response.headers["X-Total-Count"],
        } as T;
    }

    return useQuery<T>(key, (): Promise<T> => get(path), options);
}

export const useApiGet = <T>(key: QueryKey, path: string, options?: UseQueryOptions<T>) => {

    const { get } = useGet();

    return useQuery<T>(key, (): Promise<T> => get<T>(path), options);
}

const useGet = () => {
    const httpClient = useHttpClient();

    const get = async <T>(path: string) => (await httpClient.get<T>(path)).data;

    return { get };
}