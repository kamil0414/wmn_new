"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

function OAutoRefresh() {
  const router = useRouter();

  useEffect(() => {
    const interval = setInterval(() => {
      router.refresh();
    }, 1000);

    return () => clearInterval(interval);
  }, [router]);

  return null;
}

export default OAutoRefresh;
