import { useQuery, QueryKey, UseQueryResult } from "@tanstack/react-query";
import { UseQueryOptions } from "./types";
import { useHttpClient } from "../providers/HttpClientProvider";
import { PagedResult } from "models";

export const useApiPagedGet = <T extends PagedResult<any>>(key: QueryKey, path: string, options?: UseQueryOptions<T>): UseQueryResult<T, Error> => {

    const httpClient = useHttpClient();

    const get = async (path: string) => {
        const response = await httpClient.get<any>(path);

        return {
            results: response.data,
            total: response.headers["x-total-count"],
        } as T;
    }

    return useQuery<T>({
        queryKey: key,
        queryFn: (): Promise<T> => get(path),
        ...options
    });
}

export const useApiGet = <T>(key: QueryKey, path: string, options?: UseQueryOptions<T>): UseQueryResult<T, Error> => {

    const { get } = useGet();

    return useQuery<T>({
        queryKey: key,
        queryFn: (): Promise<T> => get<T>(path), 
        ...options
    });
}

const useGet = () => {
    const httpClient = useHttpClient();

    const get = async <T>(path: string) => (await httpClient.get<T>(path)).data;

    return { get };
}