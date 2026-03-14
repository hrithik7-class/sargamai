"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import type { LucideProps } from "lucide-react";
import {
  BarChart3,
  Music,
  Headphones,
  Loader2,
  AlertCircle,
  RefreshCw,
  ShieldCheck,
  ShieldAlert,
  TrendingUp,
  XCircle,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  CartesianGrid,
  Legend,
} from "recharts";
import { fetchAnalytics, type AnalyticsResponse, ApiError } from "@/lib/api";

// ── Colour palette matching the app theme ─────────────────────────────────
const CHART_COLORS = [
  "#00d4ff", // electric blue
  "#38e0ff", // blue hover
  "#94a3b8", // muted slate
  "#1e293b", // darker slate
  "#66e6ff", // light blue
  "#00a8cc", // dark blue
  "#7dd3fc", // sky blue
  "#99eeff", // pale blue
];

const TEAL = "#00d4ff";

// ── Custom tooltip ─────────────────────────────────────────────────────────
function ChartTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: { value: number; name?: string; fill?: string }[];
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-neutral-500 border border-lavender-600 rounded-lg px-3 py-2 text-xs shadow-lg">
      {label && <p className="font-semibold text-jet-black mb-1">{label}</p>}
      {payload.map((p, i) => (
        <p key={i} className="text-neutral-300">
          <span style={{ color: p.fill ?? TEAL }}>●</span>{" "}
          {p.name ? `${p.name}: ` : ""}{p.value}
        </p>
      ))}
    </div>
  );
}

// ── Stat card ──────────────────────────────────────────────────────────────
function StatCard({
  label,
  value,
  sub,
  icon: Icon,
  color,
}: {
  label: string;
  value: string | number;
  sub?: string;
  icon: React.FC<LucideProps>;
  color: string;
}) {
  return (
    <div className="bg-neutral-500 rounded-xl border border-lavender-600 p-4 sm:p-5 shadow-sm">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="text-neutral-300 text-xs sm:text-sm font-medium truncate">{label}</p>
          <p className={`text-2xl sm:text-3xl font-bold mt-0.5 font-heading ${color}`}>{value}</p>
          {sub && <p className="text-[11px] text-neutral-300 mt-0.5">{sub}</p>}
        </div>
        <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-lavender-700 flex items-center justify-center shrink-0">
          <Icon className={`w-4 h-4 sm:w-5 sm:h-5 ${color}`} />
        </div>
      </div>
    </div>
  );
}

export default function AnalyticsPage() {
  const { data: session } = useSession();
  const accessToken = (session as any)?.accessToken as string | undefined;

  const [data, setData] = useState<AnalyticsResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!accessToken) return;
    setLoading(true);
    setError(null);
    try {
      setData(await fetchAnalytics(accessToken));
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "Could not load analytics");
    } finally {
      setLoading(false);
    }
  }, [accessToken]);

  useEffect(() => { load(); }, [load]);

  const completionRate =
    data && data.total > 0
      ? Math.round((data.completed / data.total) * 100)
      : 0;

  const safeRate =
    data && data.copyright_safe_count + data.copyright_unsafe_count > 0
      ? Math.round(
          (data.copyright_safe_count /
            (data.copyright_safe_count + data.copyright_unsafe_count)) *
            100,
        )
      : null;

  return (
    <div className="p-3 sm:p-6 lg:p-8 max-w-[1400px] mx-auto min-w-0">
      {/* Page header */}
      <div className="mb-5 sm:mb-7 flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-teal/15 flex items-center justify-center">
            <BarChart3 className="w-5 h-5 text-teal" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-jet-black font-heading leading-tight">
              Analytics
            </h1>
            <p className="text-xs sm:text-sm text-neutral-300">
              Insights into your music generation activity.
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={load}
          disabled={loading}
          className="p-2 rounded-lg text-neutral-300 hover:text-jet-black hover:bg-lavender-700 transition-colors disabled:opacity-50"
          aria-label="Refresh analytics"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
        </button>
      </div>

      {error && (
        <div className="mb-6 flex items-center gap-2 rounded-lg bg-red-950/40 border border-red-800 px-3 py-2.5">
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
          <p className="text-xs text-red-400">{error}</p>
          <button type="button" onClick={load} className="ml-auto text-xs font-medium text-red-400 underline">
            Retry
          </button>
        </div>
      )}

      {loading && !data ? (
        <div className="flex items-center justify-center py-24">
          <Loader2 className="w-8 h-8 text-teal animate-spin" />
        </div>
      ) : !data ? null : (
        <>
          {/* ── KPI cards ──────────────────────────────────────────── */}
          <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-3 sm:gap-4 mb-6 sm:mb-8">
            <StatCard label="Total Tracks" value={data.total} icon={Music} color="text-teal" />
            <StatCard label="Completed" value={data.completed} sub={`${completionRate}% completion`} icon={Headphones} color="text-green-500" />
            <StatCard label="In Progress" value={data.in_progress} icon={Loader2} color="text-teal" />
            <StatCard label="Failed" value={data.failed} icon={XCircle} color="text-red-400" />
            <StatCard label="Copyright Safe" value={data.copyright_safe_count} sub={safeRate !== null ? `${safeRate}% of checked` : undefined} icon={ShieldCheck} color="text-teal" />
            <StatCard label="Avg Similarity" value={data.avg_copyright_score !== null ? `${data.avg_copyright_score}%` : "—"} sub="lower is safer" icon={ShieldAlert} color="text-teal" />
          </div>

          {/* ── Charts row 1: Activity line + Genre bar ───────────── */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6 mb-6">

            {/* Line chart — tracks per day */}
            <div className="bg-neutral-500 rounded-xl border border-lavender-600 p-4 sm:p-5">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-4 h-4 text-teal" />
                <h2 className="text-sm font-semibold text-jet-black">Generation Activity (Last 30 Days)</h2>
              </div>
              {data.by_day.every((d) => d.count === 0) ? (
                <div className="h-48 flex items-center justify-center">
                  <p className="text-xs text-neutral-300">No activity in the last 30 days.</p>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={data.by_day} margin={{ top: 4, right: 8, left: -24, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" />
                    <XAxis
                      dataKey="date"
                      tick={{ fontSize: 10, fill: "#94a3b8" }}
                      tickFormatter={(v: string) => {
                        const d = new Date(v);
                        return `${d.getDate()}/${d.getMonth() + 1}`;
                      }}
                      interval={4}
                    />
                    <YAxis tick={{ fontSize: 10, fill: "#94a3b8" }} allowDecimals={false} />
                    <Tooltip content={<ChartTooltip />} />
                    <Line
                      type="monotone"
                      dataKey="count"
                      stroke={TEAL}
                      strokeWidth={2}
                      dot={false}
                      activeDot={{ r: 4, fill: TEAL }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </div>

            {/* Bar chart — tracks by genre */}
            <div className="bg-neutral-500 rounded-xl border border-lavender-600 p-4 sm:p-5">
              <div className="flex items-center gap-2 mb-4">
                <BarChart3 className="w-4 h-4 text-teal" />
                <h2 className="text-sm font-semibold text-jet-black">Tracks by Genre</h2>
              </div>
              {data.by_genre.length === 0 ? (
                <div className="h-48 flex items-center justify-center">
                  <p className="text-xs text-neutral-300">No data yet.</p>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart
                    data={data.by_genre}
                    margin={{ top: 4, right: 8, left: -24, bottom: 0 }}
                    barCategoryGap="30%"
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" vertical={false} />
                    <XAxis
                      dataKey="genre"
                      tick={{ fontSize: 10, fill: "#94a3b8" }}
                      tickFormatter={(v: string) => v.charAt(0).toUpperCase() + v.slice(1, 8)}
                    />
                    <YAxis tick={{ fontSize: 10, fill: "#94a3b8" }} allowDecimals={false} />
                    <Tooltip content={<ChartTooltip />} />
                    <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                      {data.by_genre.map((_, i) => (
                        <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          {/* ── Charts row 2: Language donut + status breakdown ───── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">

            {/* Donut chart — by language */}
            <div className="bg-neutral-500 rounded-xl border border-lavender-600 p-4 sm:p-5">
              <div className="flex items-center gap-2 mb-4">
                <Music className="w-4 h-4 text-teal" />
                <h2 className="text-sm font-semibold text-jet-black">Tracks by Language</h2>
              </div>
              {data.by_language.length === 0 ? (
                <div className="h-44 flex items-center justify-center">
                  <p className="text-xs text-neutral-300">No data yet.</p>
                </div>
              ) : (
                <div className="flex items-center gap-4">
                  <ResponsiveContainer width="50%" height={160}>
                    <PieChart>
                      <Pie
                        data={data.by_language}
                        dataKey="count"
                        nameKey="language"
                        cx="50%"
                        cy="50%"
                        innerRadius={45}
                        outerRadius={70}
                        paddingAngle={3}
                      >
                        {data.by_language.map((_, i) => (
                          <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip content={<ChartTooltip />} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="flex-1 space-y-1.5">
                    {data.by_language.map((l, i) => (
                      <div key={l.language} className="flex items-center gap-2">
                        <span
                          className="w-2.5 h-2.5 rounded-sm shrink-0"
                          style={{ backgroundColor: CHART_COLORS[i % CHART_COLORS.length] }}
                        />
                        <span className="text-xs text-jet-black capitalize truncate flex-1">{l.language}</span>
                        <span className="text-xs font-semibold text-jet-black">{l.count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Status breakdown */}
            <div className="bg-neutral-500 rounded-xl border border-lavender-600 p-4 sm:p-5">
              <div className="flex items-center gap-2 mb-4">
                <ShieldCheck className="w-4 h-4 text-teal" />
                <h2 className="text-sm font-semibold text-jet-black">Status Breakdown</h2>
              </div>
              {data.total === 0 ? (
                <div className="h-44 flex items-center justify-center">
                  <p className="text-xs text-neutral-300">No tracks yet.</p>
                </div>
              ) : (
                <div className="space-y-3 mt-2">
                  {[
                    { label: "Completed", value: data.completed, color: "bg-teal", textColor: "text-teal" },
                    { label: "In Progress", value: data.in_progress, color: "bg-teal", textColor: "text-teal" },
                    { label: "Failed", value: data.failed, color: "bg-red-400", textColor: "text-red-400" },
                    { label: "Copyright Safe", value: data.copyright_safe_count, color: "bg-green-400", textColor: "text-green-500" },
                    { label: "Copyright Review", value: data.copyright_unsafe_count, color: "bg-orange-400", textColor: "text-orange-500" },
                  ].map((row) => (
                    <div key={row.label}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-neutral-300">{row.label}</span>
                        <span className={`text-xs font-semibold ${row.textColor}`}>{row.value}</span>
                      </div>
                      <div className="h-2 rounded-full bg-lavender-700 overflow-hidden">
                        <div
                          className={`h-full rounded-full ${row.color} transition-all duration-500`}
                          style={{ width: `${data.total > 0 ? Math.round((row.value / data.total) * 100) : 0}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
