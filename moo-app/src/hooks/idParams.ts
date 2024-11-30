import { useParams } from "react-router";

export const useIdParams = () => {
    const { id } = useParams<{ id: string }>();
    if (!id) throw Error("bad params");

    return id;
}
