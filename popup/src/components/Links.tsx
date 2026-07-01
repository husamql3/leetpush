import { LINKS } from "@/data/links.tsx";

export default function Links() {
  return (
    <div className="flex items-center gap-1.5">
      {LINKS.map(({ link, icon }) => (
        <a
          href={link}
          key={link}
          target="_blank"
          className="text-zinc-500 hover:text-zinc-300 transition-colors duration-150"
        >
          {icon}
        </a>
      ))}
    </div>
  );
}
