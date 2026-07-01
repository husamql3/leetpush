export default function Logo() {
  return (
    <div className="flex items-center gap-2.5">
      <img src="logo.png" alt="leetpush logo" width={26} height={26} />
      <h1 className="text-xl font-bold tracking-tight">
        Leet<span className="text-lp-yellow">Push</span>
      </h1>
    </div>
  );
}
