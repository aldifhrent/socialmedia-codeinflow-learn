"use client";

import useFollowerInfo from "@/app/hooks/useFollowerInfo";
import useFollowingInfo from "@/app/hooks/useFollowingInfo";
import { FollowingInfo } from "@/lib/types";
import { formatNumber } from "@/lib/utils";

interface FollowingCountProps {
  userId: string;
  initialState: FollowingInfo;
}

export default function FollowingCount({
  userId,
  initialState,
}: FollowingCountProps) {
  const { data } = useFollowingInfo(userId, initialState);

  return (
    <span>
      Following:{" "}
      <span className="font-semibold">{formatNumber(data.following)}</span>
    </span>
  );
}
