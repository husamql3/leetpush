import Links from "@/components/Links.tsx";
import Logo from "@/components/Logo.tsx";
import LeetCode from "@/components/LeetCode.tsx";
import Footer from "@/components/Footer.tsx";
import InputForm from "@/components/InputForm.tsx";
import { useContext } from "react";
import { UserContext } from "@/context/userContext.tsx";
import EditButton from "@/components/EditButton.tsx";

export default function App() {
  const { username } = useContext(UserContext);

  return (
    <main className="bg-zinc-950 px-4 py-4 text-zinc-100">
      <div className="flex items-center justify-between mb-1">
        <Logo />
        <Links />
      </div>
      {username ? <LeetCode /> : <InputForm />}
      {username && <EditButton />}
      <Footer />
    </main>
  );
}
