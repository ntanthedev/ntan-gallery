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
    <div className="grid gap-4 sm:grid-cols-2">
      {photos.map((photo) => (
        <figure
          key={photo}
          className="group relative flex aspect-[4/3] items-end overflow-hidden rounded-2xl border bg-gradient-to-br from-primary/10 via-secondary/10 to-muted p-4"
        >
          <figcaption className="text-xs font-medium text-foreground/80">
            {photo}
          </figcaption>
        </figure>
      ))}
    </div>
  );
}

