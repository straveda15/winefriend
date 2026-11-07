"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { getEnquiryCountsAction } from "@/app/actions";

type EnquiryCounts = { total: number; new: number; handled: number };

function signature(counts: EnquiryCounts) {
  return `${counts.total}:${counts.new}:${counts.handled}`;
}

/** Polls the existing authenticated enquiries read and refreshes server-rendered counts when they change. */
export function EnquiriesCountWatcher({ counts }: { counts: EnquiryCounts }) {
  const router = useRouter();
  const currentSignature = signature(counts);
  const knownSignature = useRef(currentSignature);

  useEffect(() => {
    knownSignature.current = currentSignature;
    let active = true;
    let checking = false;
    const timer = window.setInterval(async () => {
      if (checking) return;
      checking = true;
      try {
        const latest = await getEnquiryCountsAction();
        if (!active) return;
        const nextSignature = signature(latest);
        if (nextSignature !== knownSignature.current) {
          knownSignature.current = nextSignature;
          router.refresh();
        }
      } catch {
        // A temporary network error is retried on the next interval.
      } finally {
        checking = false;
      }
    }, 5000);

    return () => {
      active = false;
      window.clearInterval(timer);
    };
  }, [currentSignature, router]);

  return null;
}
