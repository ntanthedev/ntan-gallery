import { ArrowDown, ArrowUp, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Props = {
  photos: string[];
  onChange: (next: string[]) => void;
};

export function GalleryListEditor({ photos, onChange }: Props) {
  if (photos.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        Chưa có ảnh nào. Upload ảnh mới hoặc thêm đường dẫn thủ công.
      </p>
    );
  }

  function removePhoto(index: number) {
    onChange(photos.filter((_, i) => i !== index));
  }

  function movePhoto(index: number, direction: "up" | "down") {
    const newIndex = direction === "up" ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= photos.length) return;
    const updated = [...photos];
    const [item] = updated.splice(index, 1);
    updated.splice(newIndex, 0, item);
    onChange(updated);
  }

  function updatePath(index: number, value: string) {
    const updated = [...photos];
    updated[index] = value;
    onChange(updated);
  }

  return (
    <div className="space-y-3">
      {photos.map((photo, index) => (
        <div
          key={photo + index}
          className="flex items-center gap-2 rounded-xl border p-2"
        >
          <span className="text-xs text-muted-foreground">#{index + 1}</span>
          <Input
            value={photo}
            onChange={(event) => updatePath(index, event.target.value)}
            className="flex-1 text-sm"
          />
          <div className="flex gap-1">
            <Button
              size="icon"
              variant="ghost"
              onClick={() => movePhoto(index, "up")}
              disabled={index === 0}
            >
              <ArrowUp className="size-4" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              onClick={() => movePhoto(index, "down")}
              disabled={index === photos.length - 1}
            >
              <ArrowDown className="size-4" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              onClick={() => removePhoto(index)}
            >
              <Trash2 className="size-4" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}

