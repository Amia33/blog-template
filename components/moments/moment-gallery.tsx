"use client";

import Image from "next/image";

type MomentImageData = {
  src: string;
  alt: string;
  width: number;
  height: number;
  blurDataURL: string;
  remote: boolean;
  optimizable: boolean;
};

export default function MomentGallery({
  images,
}: {
  images: MomentImageData[];
}) {
  if (images.length === 0) return null;

  const galleryColumns =
    images.length === 1
      ? "max-w-md grid-cols-1"
      : images.length === 2
        ? "grid-cols-2"
        : "grid-cols-2 sm:grid-cols-3";

  return (
    <div className={`mt-3 grid gap-2 ${galleryColumns}`}>
      {images.map((image, index) => (
        <figure
          key={`${image.src}-${index}`}
          className="gallery-figure overflow-hidden rounded-box bg-base-200"
        >
          {!image.optimizable || image.width === 0 || image.height === 0 ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={image.src}
              alt={image.alt}
              loading="lazy"
              className="h-full w-full object-cover"
            />
          ) : (
            <Image
              src={image.src}
              alt={image.alt}
              width={image.width}
              height={image.height}
              sizes="(min-width: 640px) 33vw, 50vw"
              placeholder={image.blurDataURL ? "blur" : "empty"}
              blurDataURL={image.blurDataURL || undefined}
              className="h-full w-full object-cover"
            />
          )}
        </figure>
      ))}
    </div>
  );
}
