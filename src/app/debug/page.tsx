"use client";

import { useSession } from "next-auth/react";

export default function DebugSession() {
  const { data: session, status } = useSession();

  if (status === "loading") return <p>Loading session...</p>;

  return (
    <pre className="text-sm p-4 bg-gray-900 text-white rounded">
      {JSON.stringify(session, null, 2)}
    </pre>
  );
}
