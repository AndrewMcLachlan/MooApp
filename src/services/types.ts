import { UseQueryOptions as RQUseQueryOptions } from "@tanstack/react-query";

export type UseQueryOptions<T> = Omit<RQUseQueryOptions<T>, "queryKey" | "queryFn">;