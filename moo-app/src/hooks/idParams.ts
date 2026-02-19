import { useParams } from "@tanstack/react-router";

export const useIdParams = () => {
    const { id } = useParams({ strict: false });
    if (!id) throw Error("bad params");

    return id;
}
