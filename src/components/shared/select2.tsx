"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ChevronDown, Loader2, X } from "lucide-react";
import { Icon } from "@/lib/icon-map";

export type Select2Option = {
  id: string;
  text: string;
  icon?: string;
  imageUrl?: string;
};

type Select2Props = {
  options: Select2Option[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  error?: string;
  disabled?: boolean;
  loading?: boolean;
  allowClear?: boolean;
  showIcons?: boolean;
  variant?: "light" | "dark";
};

const DROPDOWN_MAX = 280;

export function Select2({
  options,
  value,
  onChange,
  placeholder = "Select…",
  searchPlaceholder = "Search…",
  error,
  disabled = false,
  loading = false,
  allowClear = true,
  showIcons = false,
  variant = "dark",
}: Select2Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [positioned, setPositioned] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [highlightIndex, setHighlightIndex] = useState(0);
  const [dropdownStyle, setDropdownStyle] = useState<React.CSSProperties>({
    position: "fixed",
    visibility: "hidden",
    zIndex: 9999,
  });
  const containerRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  const selected = options.find((o) => o.id === value);
  const filtered = options.filter((o) => {
    const q = searchTerm.toLowerCase();
    return o.text.toLowerCase().includes(q) || o.id.toLowerCase().includes(q);
  });

  const isDark = variant === "dark";
  const isDisabled = disabled || loading;

  const updatePosition = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const margin = 8;
    const spaceBelow = Math.max(0, window.innerHeight - rect.bottom - margin);
    const maxH = Math.min(DROPDOWN_MAX, spaceBelow);

    setDropdownStyle({
      position: "fixed",
      left: Math.max(margin, Math.min(rect.left, window.innerWidth - rect.width - margin)),
      width: Math.min(rect.width, window.innerWidth - margin * 2),
      top: rect.bottom + 2,
      zIndex: 9999,
      visibility: "visible",
      maxHeight: maxH + 48,
    });
  }, []);

  useEffect(() => setMounted(true), []);

  useLayoutEffect(() => {
    if (!isOpen) {
      setPositioned(false);
      return;
    }
    updatePosition();
    setPositioned(true);

    const onResize = () => updatePosition();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [isOpen, updatePosition]);

  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: MouseEvent) => {
      const t = e.target as Node;
      if (containerRef.current?.contains(t) || dropdownRef.current?.contains(t)) return;
      setIsOpen(false);
      setSearchTerm("");
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      setSearchTerm("");
      return;
    }
    setHighlightIndex(0);
    const id = window.requestAnimationFrame(() => {
      searchRef.current?.focus({ preventScroll: true });
    });
    return () => window.cancelAnimationFrame(id);
  }, [isOpen]);

  const open = () => {
    if (isDisabled) return;
    setIsOpen(true);
  };

  const close = () => {
    setIsOpen(false);
    setSearchTerm("");
  };

  const triggerClass = isDark
    ? `flex w-full items-center justify-between gap-2 rounded-xl border bg-[#0b1126] px-3 py-2.5 text-left text-sm text-[#e8ecf8] ${
        error ? "border-red-400" : isOpen ? "border-[#2a3760]" : "border-[#1f2a4a] hover:border-[#2a3760]"
      }`
    : `flex w-full items-center justify-between gap-2 rounded-xl border bg-white px-3 py-2.5 text-left text-sm ${
        error ? "border-red-400" : "border-line"
      }`;

  const listMaxHeight = typeof dropdownStyle.maxHeight === "number"
    ? Math.max(120, dropdownStyle.maxHeight - 48)
    : DROPDOWN_MAX;

  const dropdown = (
    <div
      ref={dropdownRef}
      style={dropdownStyle}
      className={`overflow-hidden rounded-xl border shadow-lg ${
        isDark ? "border-[#1f2a4a] bg-[#0f1631]" : "border-line bg-white"
      }`}
      onMouseDown={(e) => e.preventDefault()}
    >
      <div className={`border-b p-1.5 ${isDark ? "border-[#1f2a4a]" : "border-line"}`}>
        <input
          ref={searchRef}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder={searchPlaceholder}
          className={`w-full rounded-lg border px-2.5 py-2 text-sm focus:outline-none ${
            isDark
              ? "border-[#1f2a4a] bg-[#0b1126] text-[#e8ecf8] placeholder:text-[#6b7896]"
              : "border-line"
          }`}
          onClick={(e) => e.stopPropagation()}
        />
      </div>
      <div className="overflow-y-auto overscroll-contain" style={{ maxHeight: listMaxHeight }}>
        {filtered.length ? (
          filtered.map((opt, i) => {
            const active = highlightIndex === i || value === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                onMouseEnter={() => setHighlightIndex(i)}
                onClick={() => {
                  onChange(opt.id);
                  close();
                }}
                className={`flex w-full items-center gap-2 px-3 py-2 text-left text-sm ${
                  active
                    ? "bg-royal text-white"
                    : isDark
                      ? "text-[#c7d0e0] hover:bg-[#1a2344]"
                      : "hover:bg-surface-2"
                }`}
              >
                {showIcons && opt.icon && (
                  <Icon name={opt.icon} className="h-4 w-4 shrink-0" />
                )}
                <span className="truncate">{opt.text}</span>
              </button>
            );
          })
        ) : (
          <p className={`px-3 py-2 text-sm ${isDark ? "text-ink-3" : "text-ink-3"}`}>No results</p>
        )}
      </div>
    </div>
  );

  return (
    <div ref={containerRef} className="relative w-full">
      <button
        type="button"
        disabled={isDisabled}
        aria-expanded={isOpen}
        onMouseDown={(e) => {
          e.preventDefault();
          if (isOpen) close();
          else open();
        }}
        className={`${triggerClass} ${isDisabled ? "cursor-not-allowed opacity-60" : ""}`}
      >
        <span className="flex min-w-0 flex-1 items-center gap-2">
          {showIcons && selected?.icon && <Icon name={selected.icon} className="h-4 w-4 shrink-0" />}
          <span className={`truncate ${value ? "" : "text-ink-3"}`}>
            {loading ? "Loading…" : selected?.text ?? placeholder}
          </span>
        </span>
        <span className="flex h-5 w-9 shrink-0 items-center justify-end gap-1">
          {loading && <Loader2 className="h-4 w-4 animate-spin" />}
          {allowClear && value && !isDisabled && (
            <span
              role="button"
              onMouseDown={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
              onClick={(e) => {
                e.stopPropagation();
                onChange("");
              }}
              className="rounded p-0.5 hover:bg-white/10"
            >
              <X className="h-3.5 w-3.5" />
            </span>
          )}
          <ChevronDown className={`h-4 w-4 shrink-0 ${isOpen ? "rotate-180" : ""}`} />
        </span>
      </button>
      {mounted && isOpen && positioned && createPortal(dropdown, document.body)}
      {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
    </div>
  );
}
