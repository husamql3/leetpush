import Welcome from "@/components/Welcome.tsx";
import Daily from "@/components/Daily.tsx";
import Spinner from "@/components/ui/Spinner.tsx";
import Stats from "@/components/Stats.tsx";
import Streak from "@/components/Streak.tsx";

import {
  DailyProblemI,
  UserStatsI,
  UserStreakI,
} from "@/types/leetpush.interface.ts";
import { useContext } from "react";
import { UserContext } from "@/context/userContext.tsx";
import { useDailyProblem } from "@/hooks/tanstack/queries/useDailyProblem";
import { useUserStats } from "@/hooks/tanstack/queries/useUserStats";
import { useUserStreak } from "@/hooks/tanstack/queries/useUserStreak";

export default function LeetCode() {
  const { username } = useContext(UserContext);

  const {
    data: dailyProblemData,
    error: dailyProblemError,
    isLoading: isDailyProblemLoading,
  } = useDailyProblem();

  const {
    data: userStatsData,
    error: userStatsError,
    isLoading: isUserStatsLoading,
  } = useUserStats(username);

  const {
    data: userStreakData,
    error: userStreakError,
    isLoading: isUserStreakLoading,
  } = useUserStreak(username);

  const isLoading =
    isDailyProblemLoading || isUserStatsLoading || isUserStreakLoading;
  const error = dailyProblemError || userStatsError || userStreakError;
  const totalProblems = userStatsData?.acSubmissionNum[0]?.count;

  return (
    <div className="space-y-2.5 mt-1">
      {isLoading ? (
        <Spinner />
      ) : error ? (
        <div className="rounded-xl bg-zinc-900 border border-zinc-800 px-4 py-3 text-sm font-medium text-red-400">
          {error.message}
        </div>
      ) : (
        <>
          <Welcome username={username} totalProblems={totalProblems} />
          <Stats data={userStatsData ?? ({} as UserStatsI)} />
          <Streak data={userStreakData ?? ({} as UserStreakI)} />
          <Daily data={dailyProblemData ?? ({} as DailyProblemI)} />
        </>
      )}
    </div>
  );
}
