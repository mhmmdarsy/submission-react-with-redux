"use client";

import Image from "next/image";
import DataHydrator from "@/src/components/providers/DataHydrator";
import { useAppSelector } from "@/src/states/hooks";
import type { LeaderboardItem } from "@/src/types/forum";

export default function LeaderboardsPage({
  initialLeaderboards,
}: {
  initialLeaderboards: LeaderboardItem[];
}) {
  const items = useAppSelector((state) => state.leaderboards.items);

  return (
    <>
      <DataHydrator leaderboards={initialLeaderboards} />
      <section className="panel">
        <h1>Leaderboard</h1>

        <div className="leaderboard-list">
          {items.map((item, index) => (
            <article key={item.user.id} className="leaderboard-item">
              <div className="rank-chip">#{index + 1}</div>
              <Image
                src={
                  item.user.avatar || "https://ui-avatars.com/api/?name=User"
                }
                alt={item.user.name}
                width={42}
                height={42}
                unoptimized
              />
              <div className="leader-meta">
                <h3>{item.user.name}</h3>
                <p>{item.user.email}</p>
              </div>
              <strong>{item.score} pts</strong>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
