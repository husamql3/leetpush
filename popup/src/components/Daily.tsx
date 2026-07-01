import { DailyProblemI } from "@/types/leetpush.interface.ts";

const DIFFICULTY_STYLES = {
  Easy: "text-lp-green bg-lp-green-dark",
  Medium: "text-lp-yellow bg-lp-yellow-dark",
  Hard: "text-lp-red bg-lp-red-dark",
};

export default function Daily({ data }: { data: DailyProblemI }) {
  const diffStyle =
    DIFFICULTY_STYLES[data.question.difficulty as keyof typeof DIFFICULTY_STYLES] ??
    "text-zinc-400 bg-zinc-800";

  return (
    <div className="rounded-xl bg-zinc-900 border border-zinc-800 px-4 py-3">
      <p className="text-zinc-500 text-xs font-medium uppercase tracking-wide mb-2">
        Daily Problem
      </p>
      <div className="flex items-start gap-2 flex-wrap">
        <a
          target="_blank"
          href={`https://leetcode.com${data.link}`}
          rel="noreferrer"
          className="text-sm font-medium text-zinc-100 hover:text-lp-yellow transition-colors duration-150"
          aria-label={`Open daily problem: ${data.question.title}`}
        >
          {data.question.title}
        </a>
        <span className={`shrink-0 px-1.5 py-0.5 text-xs font-semibold rounded-md ${diffStyle}`}>
          {data.question.difficulty}
        </span>
      </div>
      {data.question.topicTags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-2">
          {data.question.topicTags.slice(0, 4).map((tag) => (
            <span
              key={tag.name}
              className="px-1.5 py-0.5 text-xs rounded-md bg-zinc-800 text-zinc-400 border border-zinc-700"
            >
              {tag.name}
            </span>
          ))}
          {data.question.topicTags.length > 4 && (
            <span className="px-1.5 py-0.5 text-xs text-zinc-600">
              +{data.question.topicTags.length - 4}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
