"use client";

import React from "react";

export function Logo({ className }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <svg
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="size-full"
      >
        <rect width="40" height="40" rx="12" fill="url(#brand-gradient)" />
        <path
          d="M12 20L18 26L28 14"
          stroke="white"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M20 10C25.5228 10 30 14.4772 30 20C30 25.5228 25.5228 30 20 30"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray="2 4"
        />
        <defs>
          <linearGradient
            id="brand-gradient"
            x1="0"
            y1="0"
            x2="40"
            y2="40"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#006BFF" />
            <stop offset="1" stopColor="#3B82F6" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}
