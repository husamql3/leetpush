import { UserContext } from "@/context/userContext.tsx";
import { useContext } from "react";

export default function EditButton() {
  const { setUsername } = useContext(UserContext);

  return (
    <div className="flex justify-end mt-1">
      <button
        onClick={() => setUsername("")}
        className="text-xs text-zinc-600 hover:text-zinc-400 transition-colors duration-150 px-1 py-0.5"
      >
        Change user
      </button>
    </div>
  );
}
