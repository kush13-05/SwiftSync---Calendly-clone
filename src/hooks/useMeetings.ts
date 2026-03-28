import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchMeetings, cancelMeeting } from "../lib/api";

export function useMeetings() {
  const queryClient = useQueryClient();

  // Load backend meetings for the host user
  const query = useQuery({
    queryKey: ["meetings"],
    queryFn: fetchMeetings,
  });

  const cancelMutation = useMutation({
    mutationFn: (id: string) => cancelMeeting(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["meetings"] });
    },
  });

  return {
    meetings: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    cancelMeeting: cancelMutation.mutate,
    isCancelling: cancelMutation.isPending,
  };
}
