import ThreadDetailPage from "@/src/components/thread-detail/ThreadDetailPage";
import { getThreadDetail } from "@/src/lib/api";
import type { DetailThread } from "@/src/types/forum";

export default async function ThreadDetailRoute({
  params,
}: {
  params: Promise<{ threadId: string }>;
}) {
  const { threadId } = await params;

  let detail: DetailThread | null = null;
  let errorMessage = "";

  try {
    detail = await getThreadDetail(threadId);
  } catch (error) {
    detail = null;
    errorMessage = (error as Error).message;
  }

  return (
    <ThreadDetailPage initialDetail={detail} errorMessage={errorMessage} />
  );
}
