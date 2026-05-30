"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

interface Props {
  id:        string;
  published: boolean;
  endpoint:  "publications" | "research";
}

export default function PublishToggle({ id, published, endpoint }: Props) {
  const router = useRouter();
  const [isPub, setIsPub] = useState(published);
  const [pending, startTransition] = useTransition();

  async function toggle() {
    const next = !isPub;
    setIsPub(next);
    try {
      await fetch(`/api/${endpoint}/${id}`, {
        method:  "PATCH",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ published: next }),
      });
      startTransition(() => { router.refresh(); });
    } catch {
      setIsPub(!next); // revert on error
    }
  }

  return (
    <button
      onClick={toggle}
      disabled={pending}
      style={{
        fontSize:"10px",
        padding:"3px 10px",
        border:"none",
        cursor:pending ? "wait" : "pointer",
        transition:"all 0.15s",
        borderRadius:"2px",
        opacity: pending ? 0.6 : 1,
        backgroundColor: isPub ? "rgba(74,180,120,0.12)" : "rgba(255,255,255,0.05)",
        color:            isPub ? "#4ab478"              : "rgba(200,196,190,0.45)",
        borderBottom:    `1px solid ${isPub ? "rgba(74,180,120,0.25)" : "rgba(255,255,255,0.08)"}`,
      }}
      title={isPub ? "Click to unpublish" : "Click to publish"}
    >
      {isPub ? "Published" : "Draft"}
    </button>
  );
}
