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

// No-op function with proper generic typing
const createNoopFunction = <T>(): ((params: T) => Promise<void>) => {
  return () => Promise.resolve();
};

export const useCRUD = <T, U, V>(
  key: string,
  fetchFn: () => Promise<T>,
  createFn?: (params: U) => Promise<void>,
  deleteFn?: (params: V) => Promise<void>
) => {
  const { data = [], isLoading } = useFetchData<T>(key, fetchFn);

  // Always call hooks, but provide properly typed no-op functions if the actual functions aren't provided
  const createMutation = useMutationWithInvalidation<U, void>(
    createFn || createNoopFunction<U>(),
    [key]
  );

  const deleteMutation = useMutationWithInvalidation<V, void>(
    deleteFn || createNoopFunction<V>(),
    [key]
  );

  return {
    data,
    isLoading,
    createMutation: createFn ? createMutation : null,
    deleteMutation: deleteFn ? deleteMutation : null,
  };
};
