import LeaderboardsPage from "@/src/components/leaderboards/LeaderboardsPage";
import { getLeaderboards } from "@/src/lib/api";
import type { LeaderboardItem } from "@/src/types/forum";

export default async function LeaderboardsRoute() {
  let leaderboards: LeaderboardItem[] = [];

  try {
    leaderboards = await getLeaderboards();
  } catch {
    leaderboards = [];
  }

  return <LeaderboardsPage initialLeaderboards={leaderboards} />;
}
