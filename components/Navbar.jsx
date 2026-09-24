"use client";

import { useRouter } from "next/navigation";
import { logout } from "../lib/auth";

export default function Navbar() {
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <header className="border-b bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
        <h1 className="text-xl font-bold text-gray-900">
          Product Admin
        </h1>

        <button
          onClick={handleLogout}
          className="rounded bg-black px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-800"
        >
          Logout
        </button>
      </div>
    </header>
  );
}