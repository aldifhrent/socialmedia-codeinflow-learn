import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { FollowingInfo } from "@/lib/types";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params: { userId } }: { params: { userId: string } },
) {
  try {
    const { user: LoggedInUser } = await validateRequest();

    if (!LoggedInUser) {
      return NextResponse.json({ error: "Unauthorizerd" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          following: {
            where: {
              followingId: LoggedInUser.id,
            },
            select: {
              followingId: true,
            },
          },
          _count: {
            select: {
              following: true,
            },
          },
        },
      });
      if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }

      const data: FollowingInfo = {
        following: user._count.following
      };
  
      return NextResponse.json(data);
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
