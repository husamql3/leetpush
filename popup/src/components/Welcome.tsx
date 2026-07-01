interface WelcomeProps {
  username: string;
  totalProblems: number | undefined;
}

export default function Welcome({ username, totalProblems }: WelcomeProps) {
  return (
    <div className="flex items-center justify-between px-1 py-2">
      <p className="text-zinc-400 text-sm">
        Hi,{" "}
        <span className="text-zinc-100 font-semibold">{username}</span>
      </p>
      <p className="text-zinc-500 text-sm">
        Solved:{" "}
        <span className="text-zinc-200 font-semibold">{totalProblems ?? "—"}</span>
      </p>
    </div>
  );
}
