import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { getSiteSettings } from "@/lib/public-data.functions";

/**
 * Renders the official Libélula Teatro logo (uploaded via /admin) when
 * available, falling back to a clean SVG mark + wordmark with the same
 * visual identity (grey circle + stylised dragonfly wing).
 */
export function LibelulaLogo({
  size = 40,
  variant = "default",
  showWordmark = true,
  className,
}: {
  size?: number;
  variant?: "default" | "inverse";
  showWordmark?: boolean;
  className?: string;
}) {
  const fetchSettings = useServerFn(getSiteSettings);
  const { data } = useQuery({
    queryKey: ["site-settings"],
    queryFn: () => fetchSettings(),
    staleTime: 60_000,
  });
  const customUrl = variant === "inverse" ? data?.logo_dark_url : data?.logo_url;
  if (customUrl) {
    return (
      <img
        src={customUrl}
        alt="Libélula Teatro"
        width={size}
        height={size}
        className={className ?? "object-contain"}
        style={{ height: size, width: "auto" }}
      />
    );
  }
  return (
    <div className={`flex items-center gap-3 ${className ?? ""}`}>
      <FallbackMark size={size} variant={variant} />
      {showWordmark && (
        <span
          className={`font-display text-base font-medium tracking-tight ${
            variant === "inverse" ? "text-background" : "text-foreground"
          }`}
        >
          libélula teatro
        </span>
      )}
    </div>
  );
}

function FallbackMark({ size, variant }: { size: number; variant: "default" | "inverse" }) {
  const fg = variant === "inverse" ? "#f5f3ee" : "#3a3a3a";
  const bg = variant === "inverse" ? "#2b2b2b" : "#d9d6d0";
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" aria-hidden="true">
      <circle cx="40" cy="40" r="38" fill={bg} />
      {/* Stylised dragonfly wing silhouette */}
      <path
        d="M40 22 C 30 30, 22 38, 24 50 C 32 48, 42 44, 46 36 C 50 28, 46 24, 40 22 Z"
        fill={fg}
        opacity="0.95"
      />
      <path
        d="M40 22 C 50 30, 58 38, 56 50 C 48 48, 38 44, 34 36 C 30 28, 34 24, 40 22 Z"
        fill={fg}
        opacity="0.7"
      />
      <circle cx="40" cy="22" r="2.2" fill={fg} />
    </svg>
  );
}