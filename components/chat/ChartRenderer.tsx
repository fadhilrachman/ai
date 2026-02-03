"use client";

import React, { useEffect, useRef } from "react";
import {
  Chart as ChartJS,
  registerables,
  ChartConfiguration,
} from "chart.js";

// Register all Chart.js components
ChartJS.register(...registerables);

// Define ChartConfig to match Chart.js structure + existing needs
export interface ChartConfig {
  type: string;
  data: {
    labels?: string[];
    datasets: any[];
  };
  options?: any;
}

interface ChartRendererProps {
  config: ChartConfig;
}

const ChartRenderer: React.FC<ChartRendererProps> = ({ config }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartInstanceRef = useRef<ChartJS | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    // Destroy existing chart if it exists
    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    // Create new chart
    const ctx = canvasRef.current.getContext("2d");
    if (ctx) {
      // Default options for dark theme
      const defaultOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            labels: {
              color: "#ECECF1",
            },
          },
          tooltip: {
            backgroundColor: "#343541",
            titleColor: "#ECECF1",
            bodyColor: "#ECECF1",
            borderColor: "#565869",
            borderWidth: 1,
          },
        },
        scales: {
          x: {
            grid: {
              color: "#444654",
            },
            ticks: {
              color: "#D1D5DB",
            },
          },
          y: {
            grid: {
              color: "#444654",
            },
            ticks: {
              color: "#D1D5DB",
            },
          },
        },
      };

      const finalOptions = {
        ...defaultOptions,
        ...config.options,
        plugins: {
          ...defaultOptions.plugins,
          ...config.options?.plugins,
        },
        scales: {
          ...defaultOptions.scales,
          ...config.options?.scales,
        },
      };

      const chartConfig: ChartConfiguration = {
        type: config.type as any,
        data: config.data,
        options: finalOptions,
      };

      chartInstanceRef.current = new ChartJS(ctx, chartConfig);
    }

    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
    };
  }, [config]);

  return (
    <div className="w-full mt-4 bg-[#202123] rounded-md p-4 border border-[#565869]">
      <div className="w-full h-72 relative">
        <canvas ref={canvasRef} />
      </div>
    </div>
  );
};

export default ChartRenderer;
