import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getDrivers,
  getCompanies,
  assignDriverToCompany,
  removeDriverFromCompany,
} from "@/actions/actions";

// Fetch Data Hook
const useFetchData = <T>(key: string, fetchFn: () => Promise<T>) => {
  return useQuery({ queryKey: [key], queryFn: fetchFn });
};

// Mutations Hook
const useMutationWithInvalidation = <T>(
  mutationFn: (params: T) => Promise<any>
) => {
  const queryClient = useQueryClient();

  const invalidateQueries = () => {
    queryClient.invalidateQueries({ queryKey: ["drivers"] });
    queryClient.invalidateQueries({ queryKey: ["companies"] });
  };

  return useMutation({
    mutationFn,
    onSuccess: invalidateQueries,
  });
};

// Custom Hook to Fetch and Mutate Drivers & Companies
export const useDriversCompanies = () => {
  // Fetch Drivers & Companies
  const { data: drivers = [], isLoading: driversLoading } = useFetchData(
    "drivers",
    getDrivers
  );
  const { data: companies = [], isLoading: companiesLoading } = useFetchData(
    "companies",
    getCompanies
  );

  // Mutations
  const assignDriverMutation = useMutationWithInvalidation(
    ({
      driverId,
      companyId,
      spot,
    }: {
      driverId: string;
      companyId: string;
      spot: number;
    }) => assignDriverToCompany(driverId, companyId, spot)
  );

  const removeDriverMutation = useMutationWithInvalidation(
    ({ companyId, spot }: { companyId: string; spot: number }) =>
      removeDriverFromCompany(companyId, spot)
  );

  return {
    drivers,
    driversLoading,
    companies,
    companiesLoading,
    assignDriverMutation,
    removeDriverMutation,
  };
};
