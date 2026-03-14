"use client";

import { useEffect } from "react";
import { useAppDispatch } from "@/src/states/hooks";
import { setLeaderboards } from "@/src/states/slices/leaderboardsSlice";
import { setThreadDetail } from "@/src/states/slices/threadDetailSlice";
import { setThreads } from "@/src/states/slices/threadsSlice";
import type {
  DetailThread,
  LeaderboardItem,
  ThreadWithOwner,
} from "@/src/types/forum";

interface DataHydratorProps {
  threads?: ThreadWithOwner[];
  detailThread?: DetailThread | null;
  leaderboards?: LeaderboardItem[];
}

export default function DataHydrator({
  threads,
  detailThread,
  leaderboards,
}: DataHydratorProps) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (threads) {
      dispatch(setThreads(threads));
    }
  }, [dispatch, threads]);

  useEffect(() => {
    if (typeof detailThread !== "undefined") {
      dispatch(setThreadDetail(detailThread));
    }
  }, [detailThread, dispatch]);

  useEffect(() => {
    if (leaderboards) {
      dispatch(setLeaderboards(leaderboards));
    }
  }, [dispatch, leaderboards]);

  return null;
}
