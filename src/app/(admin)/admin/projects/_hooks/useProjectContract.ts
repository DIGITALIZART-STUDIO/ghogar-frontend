import { useMutation, useQueryClient, type QueryClient } from "@tanstack/react-query";

import { useAuthContext } from "@/context/auth-provider";
import { backend as api, BACKEND_URL, backendUrl, enhancedFetch, type ApiError } from "@/types/backend";
import type { ProjectContractTemplate } from "../_types/project-contract";

const projectContractQueryKey = (id: string) =>
  ["get", "/api/Projects/{id}/contract", { params: { path: { id } } }] as const;

function isProjectContractQuery(queryKey: ReadonlyArray<unknown>, projectId: string) {
  if (queryKey[0] !== "get" || queryKey[1] !== "/api/Projects/{id}/contract") {
    return false;
  }

  const init = queryKey[2] as { params?: { path?: { id?: string } } } | undefined;
  return init?.params?.path?.id === projectId;
}

function syncProjectContractQuery(queryClient: QueryClient, projectId: string, data: ProjectContractTemplate) {
  queryClient.setQueriesData({ predicate: (query) => isProjectContractQuery(query.queryKey, projectId) }, data);
  queryClient.setQueryData(projectContractQueryKey(projectId), data);
}

export function useProjectContract(id: string) {
  const { handleAuthError } = useAuthContext();

  return api.useQuery(
    "get",
    "/api/Projects/{id}/contract",
    {
      params: {
        path: { id },
      },
    },
    {
      enabled: !!id,
      onError: async (error: unknown) => {
        await handleAuthError(error);
      },
    }
  );
}

export function useContractVariables() {
  const { handleAuthError } = useAuthContext();

  return api.useQuery("get", "/api/Projects/contract-variables", {
    onError: async (error: unknown) => {
      await handleAuthError(error);
    },
  });
}

export function useSaveProjectContract() {
  const queryClient = useQueryClient();
  const { handleAuthError } = useAuthContext();

  return api.useMutation("put", "/api/Projects/{id}/contract", {
    onSuccess: (data, variables) => {
      syncProjectContractQuery(queryClient, variables.params.path.id, data);
    },
    onError: async (error: unknown) => {
      await handleAuthError(error);
    },
  });
}

export function useImportProjectContract() {
  const queryClient = useQueryClient();
  const { handleAuthError } = useAuthContext();

  return useMutation({
    mutationFn: async (variables: { params: { path: { id: string } }; body: { file: File } }) => {
      const formData = new FormData();
      formData.append("file", variables.body.file);
      const url = `${backendUrl(BACKEND_URL ?? "")}/api/Projects/${variables.params.path.id}/contract/from-docx`;
      const response = await enhancedFetch(url, {
        method: "POST",
        body: formData,
      });
      return (await response.json()) as ProjectContractTemplate;
    },
    onSuccess: (data, variables) => {
      syncProjectContractQuery(queryClient, variables.params.path.id, data);
    },
    onError: async (error: ApiError) => {
      await handleAuthError(error);
    },
  });
}

export function useDeleteProjectContract() {
  const queryClient = useQueryClient();
  const { handleAuthError } = useAuthContext();

  return api.useMutation("delete", "/api/Projects/{id}/contract", {
    onSuccess: (_data, variables) => {
      const projectId = variables.params.path.id;
      syncProjectContractQuery(queryClient, projectId, {
        exists: false,
        projectId,
        htmlContent: null,
      });
    },
    onError: async (error: unknown) => {
      await handleAuthError(error);
    },
  });
}
