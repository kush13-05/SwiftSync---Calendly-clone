import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchAvailability, updateAvailability } from "../lib/api";
import { AvailabilityInput } from "../lib/validations";

export function useAvailability() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["availability"],
    queryFn: fetchAvailability,
  });

  const updateMutation = useMutation({
    mutationFn: (data: AvailabilityInput["availability"]) => updateAvailability(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["availability"] });
    },
  });

  return {
    availability: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    updateAvailability: updateMutation.mutate,
    isUpdating: updateMutation.isPending,
  };
}
