"use server";

import { DownloadFile, FetchError, } from "@/types/backend";
import { Result } from "@/utils/result";

export async function DownloadContractPDF(contractId: string): Promise<Result<Blob, FetchError>> {
    return DownloadFile(`/api/Documents/${contractId}/pdf`, "get", null);
}

