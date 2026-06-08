"use client";

import { useEffect, useMemo } from "react";
import { uploadUrl } from "@/lib/api/cms";
import { Select2, type Select2Option } from "@/components/shared/select2";

type Props = {
  fieldId: string;
  fieldOptions: Select2Option[];
  onFieldChange: (value: string) => void;
  fieldError?: string;
  savedThumbnailUrl?: string;
  thumbnailFile: File | null;
  videoFile: File | null;
  onThumbnailFileChange: (file: File | null) => void;
  onVideoFileChange: (file: File | null) => void;
  loadingFields?: boolean;
  embedded?: boolean;
};

export function CourseMediaPanel({
  fieldId,
  fieldOptions,
  onFieldChange,
  fieldError,
  savedThumbnailUrl = "",
  thumbnailFile,
  videoFile,
  onThumbnailFileChange,
  onVideoFileChange,
  loadingFields,
  embedded = false,
}: Props) {
  const preview = useMemo(
    () => (thumbnailFile ? URL.createObjectURL(thumbnailFile) : ""),
    [thumbnailFile]
  );

  useEffect(() => () => {
    if (preview) URL.revokeObjectURL(preview);
  }, [preview]);

  const thumbSrc = preview || uploadUrl(savedThumbnailUrl) || "";

  const body = (
    <div className={embedded ? "space-y-4" : "space-y-4 p-4"}>
        <div>
          <label className="field-label text-ink-2">
            Field <span className="text-red-400">*</span>
          </label>
          <Select2
            options={fieldOptions}
            value={fieldId}
            onChange={onFieldChange}
            placeholder="Select a field…"
            searchPlaceholder="Search fields…"
            error={fieldError}
            loading={loadingFields}
            showIcons
            variant="dark"
            allowClear={false}
          />
        </div>

        <div className="flex flex-col gap-4">
          <div>
            <label className="field-label text-ink-2">Thumbnail image</label>
            {thumbSrc && (
              <img src={thumbSrc} alt="" className="mb-2 h-24 w-full rounded-lg object-cover" />
            )}
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              className="text-xs text-ink-3"
              onChange={(e) => onThumbnailFileChange(e.target.files?.[0] ?? null)}
            />
            <p className="mt-1 text-[11px] text-ink-3">Max 25MB · JPG, PNG, WebP</p>
          </div>
          <div>
            <label className="field-label text-ink-2">Course video</label>
            {videoFile && (
              <p className="mb-2 truncate text-xs text-gold">{videoFile.name}</p>
            )}
            <input
              type="file"
              accept="video/mp4,video/webm"
              className="text-xs text-ink-3"
              onChange={(e) => onVideoFileChange(e.target.files?.[0] ?? null)}
            />
            <p className="mt-1 text-[11px] text-ink-3">Max 2GB · MP4</p>
          </div>
        </div>
    </div>
  );

  if (embedded) {
    return (
      <div className="space-y-4">
        <div>
          <h2 className="text-base font-bold text-navy">Media uploads</h2>
          <p className="mt-1 text-xs text-ink-3">Field, thumbnail and promo video</p>
        </div>
        {body}
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-[#1f2a4a] bg-[#0f1631]">
      <div className="border-b border-[#1f2a4a] px-4 py-3">
        <h3 className="text-sm font-semibold text-navy">Media uploads</h3>
      </div>
      {body}
    </div>
  );
}
