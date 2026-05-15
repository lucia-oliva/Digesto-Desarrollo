/* eslint-disable react/prop-types */
import { useMemo, useState } from "react";
import defaultPalette from "./palette";

export default function ConsejoBase({
  title = "Consejo Superior",
  subtitle = "",
  tabs = [],
  content = {},
  palette = defaultPalette,
  counts: countsOverride = null,
  initialTabKey,
}) {
  const firstKey = initialTabKey ?? tabs[0]?.key ?? "";
  const [activeTab, setActiveTab] = useState(firstKey);

  const getPal = (key) => palette[key] ?? palette.default;
  const pal = getPal(activeTab);

  const inferredCounts = useMemo(() => {
    const getCount = (k) => {
      const node = content[k];
      if (Array.isArray(node?.props?.items)) return node.props.items.length;
      return 0;
    };
    return Object.fromEntries(tabs.map((t) => [t.key, getCount(t.key)]));
  }, [content, tabs]);

  const counts = countsOverride ?? inferredCounts;

  return (
    <div
      className="mx-auto mt-20 max-w-6xl overflow-hidden bg-white md:mb-4 md:rounded-2xl"
      style={{
        boxShadow:
          "4px 4px 19px 5px rgba(0,0,0,0.06), 0px 10px 15px -3px rgba(0,0,0,0.08)",
      }}
    >
      <div className="h-1 w-full bg-gradient-to-r from-blue-500 via-indigo-500 to-sky-500" />

      <div className="flex flex-col md:flex-row">
        <aside className="w-full bg-gray-50/80 md:w-72 md:border-r md:border-gray-200">
          <div className="sticky top-0 z-10 border-b border-gray-200 bg-gray-50/80 p-4">
            <p className="text-sm font-semibold text-gray-700">{title}</p>
            {subtitle ? <p className="text-xs text-gray-500">{subtitle}</p> : null}
          </div>

          <nav className="divide-y divide-gray-200">
            {tabs.map((tab) => {
              const active = activeTab === tab.key;
              const p = getPal(tab.key);
              return (
                <div key={tab.key} className="md:last:border-b md:border-gray-200">
                  <button
                    onClick={() => setActiveTab(tab.key)}
                    className={[
                      "group flex w-full items-center justify-between gap-3 px-5 py-3 text-left text-sm transition",
                      active
                        ? "bg-white font-semibold"
                        : "hover:bg-white hover:shadow-sm text-gray-800",
                    ].join(" ")}
                  >
                    <span className="flex items-center gap-3">
                      <span
                        className={[
                          "h-2.5 w-2.5 rounded-full transition",
                          active ? p.marker : "bg-gray-300 group-hover:bg-blue-400",
                        ].join(" ")}
                      />
                      <span className={active ? p.label : "text-gray-800"}>
                        {tab.label}
                      </span>
                    </span>

                    <span
                      className={[
                        "rounded-full px-2 py-0.5 text-xs ring-1 ring-inset",
                        active
                          ? [p.badgeBg, p.badgeText, "ring-current"].join(" ")
                          : "bg-gray-100 text-gray-600 ring-gray-200",
                      ].join(" ")}
                    >
                      {counts?.[tab.key] ?? 0}
                    </span>
                  </button>

                  {active && (
                    <div className="md:hidden border-t border-gray-200 bg-white px-5 py-4">
                      <PanelTitle colorMarker={p.marker} colorTitle={p.label}>
                        {tab.label}
                      </PanelTitle>
                      <div className="mt-3">{content[tab.key]}</div>
                    </div>
                  )}
                </div>
              );
            })}
          </nav>
        </aside>

        <main className="hidden flex-1 md:block">
          <div className="p-6">
            <PanelTitle colorMarker={pal.marker} colorTitle={pal.label}>
              {tabs.find((t) => t.key === activeTab)?.label}
            </PanelTitle>
            <div className="mt-4 animate-[fadeIn_200ms_ease-out]">
              {content[activeTab]}
            </div>
          </div>
        </main>
      </div>

      <style>{`
        @keyframes fadeIn { 
          from { opacity: 0; transform: translateY(4px); } 
          to { opacity: 1; transform: translateY(0); } 
        }
      `}</style>
    </div>
  );
}

export function PanelTitle({
  children,
  colorMarker = "bg-blue-600",
  colorTitle = "text-gray-900",
}) {
  return (
    <div className="flex items-center gap-3">
      <div className={["h-5 w-1 rounded-full", colorMarker].join(" ")} />
      <h2 className={["text-xl font-semibold", colorTitle].join(" ")}>
        {children}
      </h2>
    </div>
  );
}

export function SectionList({ items = [], pal }) {
  if (!Array.isArray(items) || items.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-gray-300 p-6 text-center text-sm text-gray-500">
        No hay datos disponibles.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      {items.map((row, i) => (
        <div
          key={i}
          className={[
            "rounded-xl border p-4 shadow-sm transition hover:shadow-md",
            i % 2 === 0 ? pal?.tintBg ?? "bg-gray-50" : "bg-white",
            i % 2 === 0 ? pal?.tintBorder ?? "border-gray-200" : "border-gray-200",
          ].join(" ")}
        >
          <div className="space-y-1">
            <p
              className={[
                "text-xs font-semibold uppercase tracking-wide",
                pal?.label ?? "text-gray-600",
              ].join(" ")}
            >
              {row[0]} <span className="normal-case text-gray-900">{row[1]}</span>
            </p>
            {row[2] && (
              <p
                className={[
                  "text-xs font-semibold uppercase tracking-wide",
                  pal?.label ?? "text-gray-600",
                ].join(" ")}
              >
                {row[2]} <span className="normal-case text-gray-900">{row[3]}</span>
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export function KeyValueGrid({ pairs = [], pal }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {pairs.map(([label, value], i) => (
        <div
          key={label + i}
          className={[
            "rounded-xl border p-4 shadow-sm transition hover:shadow-md",
            pal?.tintBg ?? "bg-gray-50",
            pal?.tintBorder ?? "border-gray-200",
          ].join(" ")}
        >
          <p
            className={[
              "text-xs font-semibold uppercase tracking-wide",
              pal?.label ?? "text-gray-700",
            ].join(" ")}
          >
            {label}
          </p>
          <p
            className={[
              "mt-1 text-sm",
              pal?.label ?? "text-gray-900",
            ].join(" ")}
          >
            {value}
          </p>
        </div>
      ))}
    </div>
  );
}