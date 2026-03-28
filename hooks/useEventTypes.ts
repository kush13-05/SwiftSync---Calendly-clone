import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  fetchEventTypes, 
  createEventType, 
  updateEventType, 
  deleteEventType 
} from "../lib/api";
import { EventTypeInput } from "../lib/validations";

export function useEventTypes() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["eventTypes"],
    queryFn: fetchEventTypes,
  });

  const createMutation = useMutation({
    mutationFn: (data: EventTypeInput) => createEventType(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["eventTypes"] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: (params: { id: string; data: Partial<EventTypeInput> }) => updateEventType(params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["eventTypes"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteEventType(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["eventTypes"] });
    },
  });

  return {
    eventTypes: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    createEventType: createMutation.mutate,
    isCreating: createMutation.isPending,
    updateEventType: updateMutation.mutate,
    isUpdating: updateMutation.isPending,
    deleteEventType: deleteMutation.mutate,
    isDeleting: deleteMutation.isPending,
  };
}
