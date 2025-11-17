"use client";

import * as React from "react";
import imageCompression from "browser-image-compression";
import { useDropzone } from "react-dropzone";
import { Loader2, UploadCloud } from "lucide-react";

import { cn } from "@/lib/utils";

type Props = {
  friendId?: string;
  slug?: string;
  maxSizeMB: number;
  onUploaded: (paths: string[]) => void;
};

export function UploadDropzone({
  friendId,
  slug,
  maxSizeMB,
  onUploaded,
}: Props) {
  const [isUploading, setIsUploading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const onDrop = React.useCallback(
    async (acceptedFiles: File[]) => {
      if (!acceptedFiles.length) return;
      setIsUploading(true);
      setError(null);

      const uploadedPaths: string[] = [];

      for (const file of acceptedFiles) {
        try {
          const optimized =
            file.type.startsWith("image/") && file.size > 1 * 1024 * 1024
              ? await imageCompression(file, {
                  maxSizeMB: Math.min(2, maxSizeMB),
                  maxWidthOrHeight: 2400,
                  useWebWorker: true,
                })
              : file;

          const formData = new FormData();
          formData.append("file", optimized);
          if (friendId) {
            formData.append("friendId", friendId);
          }
          if (slug) {
            formData.append("slug", slug);
          }

          const response = await fetch("/api/admin/uploads", {
            method: "POST",
            body: formData,
          });

          const data = await response.json();

          if (!response.ok) {
            throw new Error(data.error ?? "Upload thất bại");
          }

          uploadedPaths.push(data.path);
        } catch (uploadError) {
          console.error(uploadError);
          setError(
            uploadError instanceof Error
              ? uploadError.message
              : "Có lỗi khi upload file.",
          );
        }
      }

      if (uploadedPaths.length) {
        onUploaded(uploadedPaths);
      }

      setIsUploading(false);
    },
    [friendId, slug, maxSizeMB, onUploaded],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    maxSize: maxSizeMB * 1024 * 1024,
  });

  return (
    <div className="space-y-2">
      <div
        {...getRootProps()}
        className={cn(
          "flex flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed p-6 text-center transition",
          isDragActive && "border-primary bg-primary/5",
        )}
      >
        <input {...getInputProps()} />
        {isUploading ? (
          <Loader2 className="size-6 animate-spin text-primary" />
        ) : (
          <UploadCloud className="size-6 text-primary" />
        )}
        <p className="text-sm text-muted-foreground">
          Kéo thả ảnh vào đây hoặc bấm để chọn file (tối đa {maxSizeMB}MB / ảnh)
        </p>
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}

