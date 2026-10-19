"use client";

import Image from "next/image";

type MomentImageData = {
  src: string;
  alt: string;
  width: number;
  height: number;
  blurDataURL: string;
  remote: boolean;
};

export default function MomentGallery({
  images,
}: {
  images: MomentImageData[];
}) {
  if (images.length === 0) return null;

  return (
    <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
      {images.map((image, index) => (
        <figure
          key={`${image.src}-${index}`}
          className="overflow-hidden rounded-box bg-base-200"
        >
          {image.remote || image.width === 0 || image.height === 0 ? (
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
