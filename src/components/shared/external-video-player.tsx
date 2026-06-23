import { externalLessonEmbedUrl } from "@/lib/lesson-media";

export function ExternalVideoPlayer({ url, title }: { url: string; title?: string }) {
  const embedUrl = externalLessonEmbedUrl(url);

  if (!embedUrl) {
    return (
      <div
        className="relative w-full overflow-hidden rounded-2xl bg-black"
        style={{ aspectRatio: "16 / 9" }}
      >
        <div className="absolute inset-0 flex items-center justify-center px-4 text-center text-white/90">
          <span className="text-[14px] font-semibold">Lesson link not available</span>
        </div>
      </div>
    );
  }

  return (
    <div
      className="relative w-full overflow-hidden rounded-2xl bg-black"
      style={{ aspectRatio: "16 / 9" }}
    >
      <iframe
        src={embedUrl}
        title={title || "Lesson video"}
        className="absolute inset-0 h-full w-full"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
      />
    </div>
  );
}
