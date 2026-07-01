import { useEffect, useRef } from "react";
import { UserStreakI } from "@/types/leetpush.interface.ts";
import { formatStreak, getDayColor, streakEmoji } from "@/lib/utils.ts";

export default function Streak({ data }: { data: UserStreakI }) {
  const endRef = useRef<HTMLDivElement>(null);
  const streakArray = formatStreak(data.fullSubmissionArray);

  useEffect(() => {
    if (endRef.current && streakArray.length > 0) {
      endRef.current.scrollLeft = endRef.current.scrollWidth;
    }
  }, [streakArray]);

  return (
    <div className="rounded-xl bg-zinc-900 border border-zinc-800 px-4 py-3">
      <div className="flex items-center justify-between mb-3">
        <p className="text-zinc-500 text-xs font-medium uppercase tracking-wide">Streak</p>
        <p className="text-zinc-300 text-xs">
          Max{" "}
          <span className="text-zinc-100 font-semibold">{data.maxStreak}</span>
          {" "}{streakEmoji(data.maxStreak)}
        </p>
      </div>

      <div
        className="scrollbar-hidden flex gap-3 overflow-x-scroll"
        ref={endRef}
      >
        {streakArray.map((entry, i) => (
          <div
            key={i}
            className="scrollbar-hidden flex min-w-[91px] flex-col gap-1.5"
          >
            <div className="grid grid-cols-5 gap-x-0.5 gap-y-0.5">
              {entry.days.map((daysEntry, j) => (
                <div
                  key={j}
                  className="h-[13px] w-[13px] rounded-[3px]"
                  style={{ backgroundColor: getDayColor(daysEntry.value) }}
                />
              ))}
            </div>
            <p className="text-zinc-600 text-center text-xs">{entry.month}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
