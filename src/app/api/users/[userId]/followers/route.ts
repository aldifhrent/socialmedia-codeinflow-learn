import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { FollowerInfo } from "@/lib/types";
import { error } from "console";
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
        followers: {
          where: {
            followerId: LoggedInUser.id,
          },
          select: {
            followerId: true,
          },
        },
        _count: {
          select: {
            followers: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const data: FollowerInfo = {
      followers: user._count.followers,
      isFollowedByUser: !!user.followers.length,
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

export async function POST(
  req: Request,
  { params: { userId } }: { params: { userId: string } },
) {
  try {
    const { user: LoggedInUser } = await validateRequest();

    if (!LoggedInUser) {
      return NextResponse.json({ error: "Unauthorizerd" }, { status: 401 });
    }

    await prisma.follow.upsert({
      where: {
        followerId_followingId: {
          followerId: LoggedInUser.id,
          followingId: userId,
        },
      },
      create: {
        followerId: LoggedInUser.id,
        followingId: userId,
      },
      update: {},
    });

    return new NextResponse();
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  req: Request,
  { params: { userId } }: { params: { userId: string } },
) {
  try {
    const { user: LoggedInUser } = await validateRequest();

    if (!LoggedInUser) {
      return NextResponse.json({ error: "Unauthorizerd" }, { status: 401 });
    }

    await prisma.follow.deleteMany({
      where: {
        followerId: LoggedInUser.id,
        followingId: userId,
      },
    });

    return new NextResponse();
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
