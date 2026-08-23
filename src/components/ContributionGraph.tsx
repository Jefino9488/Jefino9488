"use client";

import { useCallback, useEffect, useState } from "react";

interface ContributionDay {
  date: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
}

const LEVEL_CLASSES: Record<0 | 1 | 2 | 3 | 4, string> = {
  // bg-line stays visible against the tile surface in both dark & sage scopes
  0: "bg-line",
  1: "bg-primary/25",
  2: "bg-primary/50",
  3: "bg-primary/75",
  4: "bg-primary",
};

/** Cell pitch: h-2.5/w-2.5 cell (10px) + 3px gap. */
const WEEK_PX = 13;

export default function ContributionGraph() {
  const [contributions, setContributions] = useState<ContributionDay[]>([]);
  const [totalContributions, setTotalContributions] = useState(0);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);

  const getLevel = useCallback((count: number): 0 | 1 | 2 | 3 | 4 => {
    if (count === 0) return 0;
    if (count < 3) return 1;
    if (count < 6) return 2;
    if (count < 9) return 3;
    return 4;
  }, []);

  useEffect(() => {
    const CACHE_KEY = "gh_contributions_cache";
    const CACHE_TTL = 60 * 60 * 1000; // 1 hour

    const loadFromCache = (): boolean => {
      try {
        const cached =
          localStorage.getItem(CACHE_KEY) || sessionStorage.getItem(CACHE_KEY);
        if (!cached) return false;
        const { data, ts } = JSON.parse(cached);
        if (Date.now() - ts > CACHE_TTL) {
          localStorage.removeItem(CACHE_KEY);
          sessionStorage.removeItem(CACHE_KEY);
          return false;
        }
        setContributions(data.contributions);
        setTotalContributions(data.total);
        setLoading(false);
        return true;
      } catch {
        return false;
      }
    };

    const saveToCache = (contributions: ContributionDay[], total: number) => {
      try {
        const payload = JSON.stringify({
          data: { contributions, total },
          ts: Date.now(),
        });
        localStorage.setItem(CACHE_KEY, payload);
        sessionStorage.setItem(CACHE_KEY, payload);
      } catch {
        /* quota exceeded — ignore */
      }
    };

    if (loadFromCache()) return;

    const fetchContributions = async () => {
      try {
        const username = "Jefino9488";
        const currentYear = new Date().getFullYear();
        const response = await fetch(
          `https://github-contributions-api.jogruber.de/v4/${username}?y=${currentYear}`,
        );
        const data = await response.json();

        if (data && data.contributions) {
          const contributionDays: ContributionDay[] = data.contributions.map(
            (day: { date: string; count: number }) => ({
              date: day.date,
              count: day.count,
              level: getLevel(day.count),
            }),
          );

          const yearKey = Object.keys(data.total)[0];
          const total = data.total[yearKey] || 0;

          setContributions(contributionDays);
          setTotalContributions(total);
          saveToCache(contributionDays, total);
        } else {
          setFailed(true);
        }
      } catch (error) {
        console.error("Failed to fetch GitHub contributions:", error);
        setFailed(true);
      } finally {
        setLoading(false);
      }
    };

    const deferredWindow = window as Window & {
      requestIdleCallback?: (
        callback: () => void,
        options?: { timeout: number },
      ) => number;
      cancelIdleCallback?: (id: number) => void;
    };

    if (typeof deferredWindow.requestIdleCallback === "function") {
      const id = deferredWindow.requestIdleCallback(
        () => fetchContributions(),
        {
          timeout: 1000,
        },
      );
      return () => {
        if (typeof deferredWindow.cancelIdleCallback === "function") {
          deferredWindow.cancelIdleCallback(id);
        }
      };
    }

    const timeoutId = window.setTimeout(() => fetchContributions(), 250);
    return () => window.clearTimeout(timeoutId);
  }, [getLevel]);

  // Organize contributions into weeks (GitHub style — column = week, row = weekday)
  const organizeIntoWeeks = () => {
    if (contributions.length === 0) return [];

    const weeks: (ContributionDay | null)[][] = [];
    const contributionMap = new Map(contributions.map((c) => [c.date, c]));

    const firstDate = new Date(contributions[0].date);
    const lastDate = new Date(contributions[contributions.length - 1].date);

    const startDate = new Date(firstDate);
    startDate.setDate(startDate.getDate() - startDate.getDay());

    const currentDate = new Date(startDate);
    let currentWeek: (ContributionDay | null)[] = [];

    while (currentDate <= lastDate || currentWeek.length > 0) {
      const dayOfWeek = currentDate.getDay();

      if (dayOfWeek === 0 && currentWeek.length > 0) {
        weeks.push(currentWeek);
        currentWeek = [];
      }

      const dateStr = currentDate.toISOString().split("T")[0];
      const contribution = contributionMap.get(dateStr);

      if (contribution) {
        currentWeek.push(contribution);
      } else if (currentDate >= firstDate && currentDate <= lastDate) {
        currentWeek.push({ date: dateStr, count: 0, level: 0 });
      } else {
        currentWeek.push(null);
      }

      currentDate.setDate(currentDate.getDate() + 1);

      if (currentDate > lastDate && currentWeek.length > 0) {
        while (currentWeek.length < 7) {
          currentWeek.push(null);
        }
        weeks.push(currentWeek);
        break;
      }
    }

    return weeks;
  };

  const weeks = organizeIntoWeeks();

  // Month labels derived from actual week spans so they align with columns
  const MONTHS = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const monthLabels = (() => {
    const out: { name: string; weeks: number }[] = [];
    for (const week of weeks) {
      const firstDay = week.find(Boolean);
      if (!firstDay) continue;
      const m = new Date(firstDay.date).getMonth();
      const last = out[out.length - 1];
      if (!last || MONTHS.indexOf(last.name) !== m) {
        out.push({ name: MONTHS[m], weeks: 1 });
      } else {
        last.weeks += 1;
      }
    }
    return out;
  })();

  if (loading) {
    return (
      <div className="tile p-7" aria-label="Loading activity">
        <div className="skeleton h-3 w-32" />
        <div className="mt-5 flex justify-center gap-[3px]">
          {Array.from({ length: 26 }).map((_, i) => (
            <div key={i} className="flex flex-col gap-[3px]">
              {Array.from({ length: 7 }).map((_, j) => (
                <div key={j} className="skeleton h-2.5 w-2.5 rounded-sm" />
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (failed || weeks.length === 0) {
    return (
      <div className="tile flex flex-col items-start justify-between gap-4 p-7 sm:flex-row sm:items-center">
        <div className="space-y-1.5">
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-fg-faint">
            Activity
          </p>
          <p className="text-sm text-fg-muted">
            Live contribution data is unavailable right now.
          </p>
        </div>
        <a
          href="https://github.com/Jefino9488"
          target="_blank"
          rel="noopener noreferrer"
          className="press shrink-0 rounded-full border border-line bg-elevated px-4 py-2 font-mono text-xs text-foreground transition-colors hover:border-line-strong"
        >
          View profile on GitHub
        </a>
      </div>
    );
  }

  return (
    <div className="tile p-6 sm:p-7">
      {/* Header */}
      <div className="mb-5 flex flex-wrap items-baseline justify-between gap-2">
        <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-fg-faint">
          Activity
        </p>
        <p className="font-mono text-xs tabular-nums text-fg-muted">
          <span className="font-medium text-foreground">
            {totalContributions.toLocaleString("en-US")}
          </span>{" "}
          contributions in {new Date().getFullYear()}
        </p>
      </div>

      {/* Graph */}
      <div className="hide-scrollbar flex w-full justify-center overflow-x-auto pb-1">
        <div className="min-w-fit">
          {/* Month labels — symmetric 31px left spacer (28px day labels + 3px gap) */}
          <div className="mb-1.5 hidden text-[10px] text-fg-faint sm:flex">
            {/* Left spacer: 31px exactly matches day labels (28px) + flex gap (3px) */}
            <div
              aria-hidden
              className="hidden shrink-0 md:block"
              style={{ width: "31px" }}
            />

            {monthLabels.map((m) => (
              <span
                key={m.name}
                className="shrink-0"
                style={{ width: `${m.weeks * WEEK_PX}px` }}
              >
                {m.name}
              </span>
            ))}

            {/* Right spacer: 31px */}
            <div
              aria-hidden
              className="hidden shrink-0 md:block"
              style={{ width: "31px" }}
            />
          </div>

          <div className="flex items-center gap-[3px]">
            {/* Day labels on left (28px wide -> w-7) */}
            <div className="hidden w-7 flex-col justify-around py-px pr-2 font-mono text-[9px] leading-none text-fg-faint md:flex">
              <span>Mon</span>
              <span>Wed</span>
              <span>Fri</span>
            </div>

            {/* Grid */}
            <div className="flex gap-[3px]">
              {weeks.map((week, weekIndex) => (
                <div key={weekIndex} className="flex flex-col gap-[3px]">
                  {week.map((day, dayIndex) =>
                    day ? (
                      <div
                        key={`${weekIndex}-${dayIndex}`}
                        title={`${day.date}: ${day.count} contributions`}
                        className={`h-2.5 w-2.5 rounded-[3px] transition-transform duration-150 hover:scale-125 ${LEVEL_CLASSES[day.level]}`}
                      />
                    ) : (
                      <div
                        key={`${weekIndex}-${dayIndex}`}
                        className="h-2.5 w-2.5"
                      />
                    ),
                  )}
                </div>
              ))}
            </div>

            {/* Balancing spacer on right (28px wide -> w-7) to ensure perfect left/right margin symmetry */}
            <div aria-hidden className="hidden w-7 md:block" />
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="mt-4 flex items-center justify-between">
        <a
          href={`https://github.com/Jefino9488?tab=overview&from=${new Date().getFullYear()}-01-01`}
          target="_blank"
          rel="noopener noreferrer"
          className="group inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-[0.18em] text-fg-faint transition-colors hover:text-primary"
        >
          github.com/Jefino9488
        </a>
        <div className="flex items-center gap-1.5">
          <span className="mr-1 font-mono text-[9px] uppercase tracking-wider text-fg-faint">
            Less
          </span>
          {([0, 1, 2, 3, 4] as const).map((level) => (
            <span
              key={level}
              className={`h-2.5 w-2.5 rounded-[3px] ${LEVEL_CLASSES[level]}`}
            />
          ))}
          <span className="ml-1 font-mono text-[9px] uppercase tracking-wider text-fg-faint">
            More
          </span>
        </div>
      </div>
    </div>
  );
}
