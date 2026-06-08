"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  Maximize,
  Minimize,
  Pause,
  Play,
  RotateCcw,
  RotateCw,
  Volume2,
  VolumeX,
  X,
} from "lucide-react";

export type PreviewSampleVideo = {
  id: string;
  title: string;
  src: string;
  poster?: string | null;
};

function formatTime(seconds: number) {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

function PreviewPlayer({
  src,
  poster,
  playerRef,
  videoRef,
  embedded = false,
}: {
  src: string;
  poster?: string | null;
  playerRef: React.RefObject<HTMLDivElement | null>;
  videoRef: React.RefObject<HTMLVideoElement | null>;
  embedded?: boolean;
}) {
  const [playing, setPlaying] = useState(false);
  const [current, setCurrent] = useState(0);
  const [duration, setDuration] = useState(0);
  const [muted, setMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const revealControls = useCallback(() => {
    setShowControls(true);
    if (hideTimer.current) clearTimeout(hideTimer.current);
    if (playing && isFullscreen) {
      hideTimer.current = setTimeout(() => setShowControls(false), 3000);
    }
  }, [playing, isFullscreen]);

  const togglePlay = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) void video.play();
    else video.pause();
  }, [videoRef]);

  const skip = useCallback(
    (seconds: number) => {
      const video = videoRef.current;
      if (!video) return;
      const max = Number.isFinite(video.duration) ? video.duration : 0;
      video.currentTime = Math.min(Math.max(0, video.currentTime + seconds), max);
      revealControls();
    },
    [videoRef, revealControls]
  );

  const toggleMute = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setMuted(video.muted);
  }, [videoRef]);

  const toggleFullscreen = useCallback(() => {
    const el = playerRef.current;
    if (!el) return;
    if (document.fullscreenElement) void document.exitFullscreen();
    else void el.requestFullscreen();
  }, [playerRef]);

  const seek = useCallback(
    (value: number) => {
      const video = videoRef.current;
      if (!video || !Number.isFinite(video.duration)) return;
      video.currentTime = value;
      setCurrent(value);
    },
    [videoRef]
  );

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    const onTime = () => setCurrent(video.currentTime);
    const onMeta = () => setDuration(video.duration);
    const onVolume = () => setMuted(video.muted);

    video.addEventListener("play", onPlay);
    video.addEventListener("pause", onPause);
    video.addEventListener("timeupdate", onTime);
    video.addEventListener("loadedmetadata", onMeta);
    video.addEventListener("volumechange", onVolume);

    return () => {
      video.removeEventListener("play", onPlay);
      video.removeEventListener("pause", onPause);
      video.removeEventListener("timeupdate", onTime);
      video.removeEventListener("loadedmetadata", onMeta);
      video.removeEventListener("volumechange", onVolume);
    };
  }, [videoRef, src]);

  useEffect(() => {
    const onFs = () => {
      const active = document.fullscreenElement === playerRef.current;
      setIsFullscreen(active);
      setShowControls(true);
    };
    document.addEventListener("fullscreenchange", onFs);
    return () => document.removeEventListener("fullscreenchange", onFs);
  }, [playerRef]);

  useEffect(() => {
    if (!isFullscreen) {
      setShowControls(true);
      if (hideTimer.current) clearTimeout(hideTimer.current);
      return;
    }
    revealControls();
    return () => {
      if (hideTimer.current) clearTimeout(hideTimer.current);
    };
  }, [isFullscreen, playing, revealControls]);

  const progress = duration > 0 ? (current / duration) * 100 : 0;

  return (
    <div
      ref={playerRef}
      className={`group relative w-full bg-black ${
        isFullscreen
          ? "flex h-screen w-screen items-center justify-center"
          : embedded
            ? "h-full min-h-0"
            : "aspect-video"
      }`}
      onMouseMove={revealControls}
      onTouchStart={revealControls}
      onClick={togglePlay}
    >
      <video
        ref={videoRef}
        key={src}
        className={isFullscreen ? "max-h-full max-w-full" : "h-full w-full"}
        playsInline
        preload="auto"
        poster={poster ?? undefined}
        onClick={(e) => e.stopPropagation()}
      >
        <source src={src} type="video/mp4" />
        <source src={src} type="video/webm" />
      </video>

      <div
        className={`pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent transition-opacity duration-300 ${
          showControls || !playing ? "opacity-100" : "opacity-0"
        }`}
      />

      <div
        className={`absolute inset-x-0 bottom-0 flex justify-center px-3 pb-3 pt-10 transition-opacity duration-300 sm:px-5 sm:pb-4 ${
          showControls || !playing ? "opacity-100" : "opacity-0"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-full max-w-[900px]">
        <input
          type="range"
          min={0}
          max={duration || 0}
          step={0.1}
          value={current}
          onChange={(e) => seek(Number(e.target.value))}
          className="preview-progress mb-3 h-1 w-full cursor-pointer appearance-none rounded-full bg-white/25 accent-white"
          aria-label="Seek"
        />

        <div className="flex items-center justify-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={togglePlay}
            className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-white transition-colors hover:bg-white/15"
            aria-label={playing ? "Pause" : "Play"}
          >
            {playing ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" />}
          </button>

          <button
            type="button"
            onClick={() => skip(-10)}
            className="relative grid h-9 w-9 shrink-0 place-items-center rounded-full text-white transition-colors hover:bg-white/15"
            aria-label="Rewind 10 seconds"
          >
            <RotateCcw size={22} />
            <span className="absolute text-[9px] font-bold">10</span>
          </button>

          <button
            type="button"
            onClick={() => skip(10)}
            className="relative grid h-9 w-9 shrink-0 place-items-center rounded-full text-white transition-colors hover:bg-white/15"
            aria-label="Forward 10 seconds"
          >
            <RotateCw size={22} />
            <span className="absolute text-[9px] font-bold">10</span>
          </button>

          <span className="min-w-[88px] text-center text-[13px] tabular-nums text-white">
            {formatTime(current)} / {formatTime(duration)}
          </span>

          <button
            type="button"
            onClick={toggleMute}
            className="grid h-9 w-9 place-items-center rounded-full text-white transition-colors hover:bg-white/15"
            aria-label={muted ? "Unmute" : "Mute"}
          >
            {muted ? <VolumeX size={20} /> : <Volume2 size={20} />}
          </button>

          <button
            type="button"
            onClick={toggleFullscreen}
            className="grid h-9 w-9 place-items-center rounded-full text-white transition-colors hover:bg-white/15"
            aria-label={isFullscreen ? "Exit full screen" : "Full screen"}
          >
            {isFullscreen ? <Minimize size={20} /> : <Maximize size={20} />}
          </button>
        </div>
        </div>
      </div>

      {!playing && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            togglePlay();
          }}
          className="absolute inset-0 grid place-items-center"
          aria-label="Play"
        >
          <span className="grid h-16 w-16 place-items-center rounded-full bg-white/90 text-navy shadow-lg">
            <Play size={28} className="ml-1 fill-current" />
          </span>
        </button>
      )}
    </div>
  );
}

export function CoursePreviewVideo({
  poster,
  title,
  samples,
}: {
  poster?: string | null;
  title: string;
  samples: PreviewSampleVideo[];
}) {
  const [open, setOpen] = useState(false);
  const [activeId, setActiveId] = useState(samples[0]?.id ?? "");
  const [mounted, setMounted] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const playerRef = useRef<HTMLDivElement>(null);

  const active = samples.find((s) => s.id === activeId) ?? samples[0];

  useEffect(() => setMounted(true), []);

  const close = useCallback(() => {
    if (document.fullscreenElement) void document.exitFullscreen();
    setOpen(false);
    videoRef.current?.pause();
  }, []);

  const openModal = () => {
    if (!samples.length) return;
    setActiveId(samples[0].id);
    setOpen(true);
  };

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") videoRef.current && (videoRef.current.currentTime -= 10);
      if (e.key === "ArrowRight") videoRef.current && (videoRef.current.currentTime += 10);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, close]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  useEffect(() => {
    if (!open || !active) return;
    const video = videoRef.current;
    if (!video) return;
    video.load();
    const play = () => {
      void video.play().catch(() => {});
    };
    if (video.readyState >= 2) play();
    else video.addEventListener("loadeddata", play, { once: true });
    return () => video.removeEventListener("loadeddata", play);
  }, [open, active?.src]);

  if (!samples.length || !active) return null;

  const modal =
    open && mounted
      ? createPortal(
          <div
            className="fixed inset-0 z-[200] flex items-center justify-center overflow-hidden bg-black/90 p-3 sm:p-4"
            onClick={(e) => {
              if (e.target === e.currentTarget) close();
            }}
            role="dialog"
            aria-modal="true"
            aria-label="Course preview"
          >
            <div
              className="relative flex h-[calc(100dvh-1.5rem)] w-full max-w-[960px] flex-col overflow-hidden rounded-xl border-2 border-white/20 bg-[#1c1d1f] text-white shadow-[0_24px_80px_rgba(0,0,0,0.65)] sm:h-[calc(100dvh-2rem)]"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="z-20 shrink-0 border-b border-white/10 bg-[#1c1d1f] px-4 py-4 sm:px-5">
                <div className="mx-auto flex max-w-[900px] items-start justify-between gap-4">
                  <div className="min-w-0 pr-2">
                    <p className="text-[13px] font-semibold text-[#d1d7dc]">Course preview</p>
                    <h2 className="mt-1 line-clamp-2 text-[18px] font-bold leading-snug sm:text-[19px]">
                      {title}
                    </h2>
                  </div>
                  <button
                    type="button"
                    onClick={close}
                    className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-white/20 bg-[#2d2f31] text-white transition-colors hover:bg-white/15"
                    aria-label="Close preview"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>

              <div className="flex min-h-0 flex-1 flex-col border-b border-white/10">
                <PreviewPlayer
                  src={active.src}
                  poster={active.poster}
                  playerRef={playerRef}
                  videoRef={videoRef}
                  embedded
                />
              </div>

              {samples.length > 1 ? (
                <div className="shrink-0 border-t border-white/10 px-4 py-3 sm:px-5">
                  <p className="mb-2 text-[14px] font-bold">Free sample videos:</p>
                  <ul className="mx-auto flex max-w-[900px] flex-col gap-1">
                    {samples.map((sample) => {
                      const isActive = sample.id === activeId;
                      return (
                        <li key={sample.id}>
                          <button
                            type="button"
                            onClick={() => setActiveId(sample.id)}
                            className={`flex w-full items-center gap-2.5 rounded-lg border p-1.5 text-left transition-colors ${
                              isActive
                                ? "border-white/25 bg-white/10"
                                : "border-transparent hover:border-white/10 hover:bg-white/5"
                            }`}
                          >
                            <span className="relative h-11 w-[84px] shrink-0 overflow-hidden rounded border border-white/10 bg-[#2d2f31]">
                              {sample.poster ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                  src={sample.poster}
                                  alt=""
                                  className="h-full w-full object-cover opacity-80"
                                />
                              ) : null}
                              <span className="absolute inset-0 grid place-items-center bg-black/30">
                                <Play size={16} className="fill-white text-white" />
                              </span>
                            </span>
                            <span
                              className={`line-clamp-1 text-[13px] leading-snug ${
                                isActive ? "font-semibold text-white" : "text-[#d1d7dc]"
                              }`}
                            >
                              {sample.title}
                            </span>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ) : null}
            </div>
          </div>,
          document.body
        )
      : null;

  return (
    <>
      <button
        type="button"
        onClick={openModal}
        className="absolute inset-0 z-10 h-full w-full cursor-pointer"
        aria-label="Play course preview"
      >
        {poster ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={poster} alt="" className="absolute inset-0 h-full w-full object-cover" />
        ) : (
          <span className="absolute inset-0 bg-[#0D1B4B]" />
        )}
        <span className="absolute inset-0 flex items-center justify-center bg-black/25 transition-colors hover:bg-black/40">
          <span className="grid h-[72px] w-[72px] place-items-center rounded-full bg-white text-navy shadow-[0_8px_32px_rgba(0,0,0,0.35)] transition-transform hover:scale-105">
            <Play size={30} className="ml-1 fill-current" />
          </span>
        </span>
      </button>
      {modal}
    </>
  );
}
