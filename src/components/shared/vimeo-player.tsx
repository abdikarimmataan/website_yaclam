export function VimeoPlayer({ vimeoId, title }: { vimeoId: string; title?: string }) {
  return (
    <div className="relative w-full overflow-hidden rounded-2xl bg-black" style={{ aspectRatio: "16 / 9" }}>
      <iframe
        src={`https://player.vimeo.com/video/${vimeoId}?title=0&byline=0&portrait=0`}
        title={title || "Lesson video"}
        className="absolute inset-0 h-full w-full"
        allow="autoplay; fullscreen; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
}
