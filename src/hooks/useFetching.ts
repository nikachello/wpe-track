import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const useFetchData = <T>(key: string, fetchFn: () => Promise<T>) => {
  return useQuery({ queryKey: [key], queryFn: fetchFn });
};

const useMutationWithInvalidation = <T, U>(
  mutationFn: (params: T) => Promise<U>,
  keysToInvalidate: string[]
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn,
    onSuccess: () => {
      keysToInvalidate.forEach((key) => {
        queryClient.invalidateQueries({ queryKey: [key] });
      });
    },
  });
};

export const useCRUD = <T, U, V>(
  key: string,
  fetchFn: () => Promise<T>,
  createFn?: (params: U) => Promise<void>,
  deleteFn?: (params: V) => Promise<void>
) => {
  const { data = [], isLoading } = useFetchData<T>(key, fetchFn);

  const createMutation = createFn
    ? useMutationWithInvalidation<U, void>(createFn, [key])
    : null;
  const deleteMutation = deleteFn
    ? useMutationWithInvalidation<V, void>(deleteFn, [key])
    : null;

  return { data, isLoading, createMutation, deleteMutation };
};
