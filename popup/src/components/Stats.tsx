import { UserStatsI } from "@/types/leetpush.interface.ts";

export default function Stats({ data }: { data: UserStatsI }) {
  const { allQuestionsCount, acSubmissionNum } = data;

  const total = {
    easy: allQuestionsCount[1].count,
    medium: allQuestionsCount[2].count,
    hard: allQuestionsCount[3].count,
  };

  const solved = {
    easy: acSubmissionNum[1].count,
    medium: acSubmissionNum[2].count,
    hard: acSubmissionNum[3].count,
  };

  const rows = [
    { label: "Easy", color: "text-lp-green", bar: "bg-lp-green", track: "bg-lp-green-dark", pct: (solved.easy / total.easy) * 100, s: solved.easy, t: total.easy },
    { label: "Medium", color: "text-lp-yellow", bar: "bg-lp-yellow", track: "bg-lp-yellow-dark", pct: (solved.medium / total.medium) * 100, s: solved.medium, t: total.medium },
    { label: "Hard", color: "text-lp-red", bar: "bg-lp-red", track: "bg-lp-red-dark", pct: (solved.hard / total.hard) * 100, s: solved.hard, t: total.hard },
  ];

  return (
    <div className="rounded-xl bg-zinc-900 border border-zinc-800 px-4 py-3">
      <div className="flex flex-col gap-2.5">
        {rows.map(({ label, color, bar, track, pct, s, t }) => (
          <div key={label} className="flex items-center gap-3">
            <span className={`${color} text-xs font-medium w-12 shrink-0`}>{label}</span>
            <div className={`${track} relative flex-1 h-2 rounded-full overflow-hidden`}>
              <div className={`${bar} absolute inset-y-0 left-0 rounded-full transition-all duration-500`} style={{ width: `${pct}%` }} />
            </div>
            <span className="text-zinc-500 text-xs w-16 text-right shrink-0">
              <span className="text-zinc-200 font-semibold">{s}</span>/{t}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
