import { useParams } from "@tanstack/react-router";

export const useIdParams = () => {
    const { id } = useParams({ strict: false });
    if (!id) throw new Error("useIdParams: expected an 'id' route parameter but none was present.");

    return id;
}
