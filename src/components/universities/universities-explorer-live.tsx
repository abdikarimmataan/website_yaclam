"use client";

import { useEffect, useRef, useState } from "react";
import { UniversitiesExplorer } from "@/components/universities/universities-explorer";
import { getUniversityLevelTabs } from "@/lib/api/university-category.service";
import { getUniversitiesFromManage } from "@/lib/api/university-manage.service";
import { fetchUniversityDataVersion } from "@/lib/api/university-sync.service";
import type { University } from "@/lib/api/university.types";
import type { Scholarship } from "@/lib/types";
import type { LevelTab } from "@/lib/api/university-explorer";

const POLL_MS = 4000;

type UniversitiesExplorerLiveProps = {
  initialUniversities: University[];
  initialLevelTabs: LevelTab[];
  scholarships: Scholarship[];
  emptyStateText?: string;
};

export function UniversitiesExplorerLive({
  initialUniversities,
  initialLevelTabs,
  scholarships,
  emptyStateText,
}: UniversitiesExplorerLiveProps) {
  const [universities, setUniversities] = useState(initialUniversities);
  const [levelTabs, setLevelTabs] = useState(initialLevelTabs);
  const versionRef = useRef<string | null>(null);

  useEffect(() => {
    setUniversities(initialUniversities);
  }, [initialUniversities]);

  useEffect(() => {
    setLevelTabs(initialLevelTabs);
  }, [initialLevelTabs]);

  useEffect(() => {
    let cancelled = false;

    async function refreshExplorerData() {
      const [nextUniversities, nextLevelTabs] = await Promise.all([
        getUniversitiesFromManage(),
        getUniversityLevelTabs(),
      ]);
      if (cancelled) return;
      setUniversities(nextUniversities);
      setLevelTabs(nextLevelTabs);
    }

    async function poll() {
      if (document.visibilityState === "hidden") return;
      try {
        const version = await fetchUniversityDataVersion();
        if (cancelled) return;
        if (versionRef.current !== null && versionRef.current !== version) {
          await refreshExplorerData();
        }
        versionRef.current = version;
      } catch {
        // Ignore transient network errors while polling.
      }
    }

    void fetchUniversityDataVersion()
      .then((version) => {
        if (!cancelled) versionRef.current = version;
      })
      .catch(() => {});

    void poll();
    const intervalId = window.setInterval(() => {
      void poll();
    }, POLL_MS);

    const onVisible = () => {
      void poll();
    };
    document.addEventListener("visibilitychange", onVisible);

    return () => {
      cancelled = true;
      window.clearInterval(intervalId);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, []);

  return (
    <UniversitiesExplorer
      universities={universities}
      scholarships={scholarships}
      levelTabs={levelTabs}
      emptyStateText={emptyStateText}
    />
  );
}
