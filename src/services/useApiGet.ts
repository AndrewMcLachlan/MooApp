import { useQuery, QueryKey, UseQueryOptions } from "react-query";
import { useHttpClient } from "../providers";

export const useApiGet = <T>(key: QueryKey, path: string, options?: UseQueryOptions<T>) => {

    const { get } = useGet();

    return useQuery<T>(key, (): Promise<T> => get<T>(path), options);
}

const useGet = () => {
    const httpClient = useHttpClient();

    const get = async <T>(path: string) =>  (await httpClient.get<T>(path)).data;

    return { get };
}