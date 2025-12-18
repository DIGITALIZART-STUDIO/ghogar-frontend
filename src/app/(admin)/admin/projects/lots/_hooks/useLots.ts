import { useQuery } from "@tanstack/react-query";
import { GetLotsByBlock } from "../_actions/LotActions";

export function useLots(blockId: string) {
    return useQuery({
        queryKey: ["lots", blockId],
        queryFn: async () => {
            const [lots, error] = await GetLotsByBlock(blockId);
            if (error) {
                throw new Error(error.message);
            }
            return lots ?? [];
        },
        enabled: !!blockId,
    });
}
