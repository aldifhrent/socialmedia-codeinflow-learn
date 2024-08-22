import PostEditor from "@/components/post/editor/PostEditor";
import Post from "@/components/post/Post";
import TrendsSidebar from "@/components/TrendSidebar";
import prisma from "@/lib/prisma";
import { postDataInClude } from "@/lib/types";
import ForYourFeed from "./ForYourFeed";

export default async function Home() {
  const posts = await prisma.post.findMany({
    include: postDataInClude,
    orderBy: { createdAt: "desc" },
  });
  return (
    <main className="flex w-full min-w-0 gap-5">
      <div className="w-full min-w-0 space-y-5">
        <PostEditor />
        <ForYourFeed />
      </div>
      <TrendsSidebar />
    </main>
  );
}
