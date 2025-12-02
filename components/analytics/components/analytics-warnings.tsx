// components/analytics/components/analytics-warnings.tsx

"use client";

import { AlertCircle, AlertTriangle, Info, X } from "lucide-react";
import { useState } from "react";
import type { AnalyticsWarning } from "@/lib/types/analytics";

interface AnalyticsWarningsProps {
  warnings: AnalyticsWarning[];
  dataQualityStatus?: string;
}

export default function AnalyticsWarnings({
  warnings,
  dataQualityStatus,
}: AnalyticsWarningsProps) {
  const [dismissed, setDismissed] = useState<Set<number>>(new Set());

  if (!warnings || warnings.length === 0) return null;

  const visibleWarnings = warnings.filter((_, index) => !dismissed.has(index));

  if (visibleWarnings.length === 0) return null;

  const dismissWarning = (index: number) => {
    setDismissed((prev) => new Set([...prev, index]));
  };

  const getIcon = (severity: string) => {
    switch (severity) {
      case "error":
        return <AlertCircle className="h-5 w-5" />;
      case "warning":
        return <AlertTriangle className="h-5 w-5" />;
      case "info":
      default:
        return <Info className="h-5 w-5" />;
    }
  };

  const getStyles = (severity: string) => {
    switch (severity) {
      case "error":
        return {
          container: "bg-red-50 border-red-500",
          icon: "text-red-600",
          text: "text-red-800",
          button: "text-red-600 hover:text-red-800",
        };
      case "warning":
        return {
          container: "bg-yellow-50 border-yellow-500",
          icon: "text-yellow-600",
          text: "text-yellow-800",
          button: "text-yellow-600 hover:text-yellow-800",
        };
      case "info":
      default:
        return {
          container: "bg-blue-50 border-blue-500",
          icon: "text-blue-600",
          text: "text-blue-800",
          button: "text-blue-600 hover:text-blue-800",
        };
    }
  };

  return (
    <div className="space-y-3">
      {visibleWarnings.map((warning, index) => {
        const styles = getStyles(warning.severity);
        return (
          <div
            key={index}
            className={`${styles.container} border-l-4 p-4 shadow-sm`}
          >
            <div className="flex items-start gap-3">
              <div className={`${styles.icon} flex-shrink-0 mt-0.5`}>
                {getIcon(warning.severity)}
              </div>
              <div className="flex-1 min-w-0">
                <p className={`${styles.text} font-medium text-sm`}>
                  {warning.message}
                </p>
                {warning.metadata?.requirement && (
                  <p className={`${styles.text} text-xs mt-1 opacity-80`}>
                    Requirement: {warning.metadata.requirement}
                  </p>
                )}
                {warning.metadata?.missingMetrics &&
                  warning.metadata.missingMetrics.length > 0 && (
                    <p className={`${styles.text} text-xs mt-1 opacity-80`}>
                      Missing metrics:{" "}
                      {warning.metadata.missingMetrics.join(", ")}
                    </p>
                  )}
                {dataQualityStatus && warning.severity === "info" && (
                  <p className={`${styles.text} text-xs mt-1 opacity-80`}>
                    Showing cached data. Analytics will automatically retry on
                    next refresh.
                  </p>
                )}
              </div>
              <button
                onClick={() => dismissWarning(index)}
                className={`${styles.button} flex-shrink-0 transition-colors`}
                aria-label="Dismiss warning"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
