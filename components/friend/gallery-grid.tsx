"use client";

import Image from "next/image";
import { useState } from "react";

import { getStoragePublicUrl } from "@/lib/storage";
import { Skeleton } from "@/components/ui/skeleton";

type Props = {
  photos: string[];
};

export function FriendGalleryGrid({ photos }: Props) {
  if (!photos.length) {
    return (
      <p className="text-sm text-muted-foreground">
        Gallery sẽ xuất hiện tại đây khi bạn upload ảnh cho hồ sơ này.
      </p>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {photos.map((photo, index) => (
        <GalleryImage key={photo + index} path={photo} />
      ))}
    </div>
  );
}

function GalleryImage({ path }: { path: string }) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const imageUrl = getStoragePublicUrl(path);

  if (!imageUrl || hasError) {
    return (
      <div className="group relative flex aspect-[4/3] items-center justify-center overflow-hidden rounded-2xl border bg-muted p-4">
        <p className="text-xs text-muted-foreground">
          {hasError ? "Không thể tải ảnh" : "Đường dẫn không hợp lệ"}
        </p>
      </div>
    );
  }

  return (
    <figure className="group relative aspect-[4/3] overflow-hidden rounded-2xl border bg-muted">
      {isLoading && (
        <Skeleton className="absolute inset-0 h-full w-full" />
      )}
      <Image
        src={imageUrl}
        alt={path}
        fill
        className="object-cover transition-transform duration-300 group-hover:scale-105"
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setIsLoading(false);
          setHasError(true);
        }}
      />
    </figure>
  );
}

