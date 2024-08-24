import kyInstance from "@/lib/ky";
import { FollowingInfo } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";

export default function useFollowingInfo(
  userId: string,
  initialState: FollowingInfo,
) {
  const query = useQuery<FollowingInfo, Error>({
    queryKey: ["following-info", userId],
    queryFn: async () => {
      return await kyInstance
        .get(`/api/users/${userId}/following`)
        .json<FollowingInfo>();
    },
    initialData: initialState,
    staleTime: Infinity,
  });

  return query;
}
