import { FaXTwitter, FaLinkedinIn } from "react-icons/fa6";

export default function Footer() {
  return (
    <footer className="mt-3 flex items-center justify-between">
      <span className="text-zinc-700 text-xs">v1.8.0</span>
      <p className="text-zinc-700 text-xs flex items-center gap-1">
        &copy; {new Date().getFullYear()}
        <span className="text-zinc-600 flex items-center gap-1">
          Hüsam
          <a
            href="https://twitter.com/husamahmud"
            target="_blank"
            className="text-zinc-600 hover:text-zinc-400 transition-colors duration-150"
          >
            <FaXTwitter size="12" />
          </a>
          <a
            href="https://www.linkedin.com/in/husamahmud/"
            target="_blank"
            className="text-zinc-600 hover:text-zinc-400 transition-colors duration-150"
          >
            <FaLinkedinIn size="12" />
          </a>
        </span>
      </p>
    </footer>
  );
}
