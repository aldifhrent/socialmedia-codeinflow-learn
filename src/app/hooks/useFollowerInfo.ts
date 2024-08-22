import kyInstance from "@/lib/ky";
import { FollowerInfo } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";

export default function useFollowerInfo(
  userId: string,
  initialState: FollowerInfo,
) {
  const query = useQuery<FollowerInfo, Error>({
    queryKey: ["follower-info", userId],
    queryFn: async () => {
      return await kyInstance
        .get(`/api/users/${userId}/followers`)
        .json<FollowerInfo>();
    },
    initialData: initialState,
    staleTime: Infinity,
  });

  return query;
}
