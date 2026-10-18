import Image from "next/image";

export function MdxImage({ src, alt }: { src?: string; alt?: string }) {
  if (src && src.startsWith("/")) {
    return (
      <Image
        src={src}
        alt={alt ?? ""}
        width={1200}
        height={630}
        className="my-4 h-auto w-full rounded-box object-cover"
      />
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src ?? ""}
      alt={alt ?? ""}
      loading="lazy"
      className="my-4 rounded-box"
    />
  );
}
