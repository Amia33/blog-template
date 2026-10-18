import Image from "next/image";
import Link from "next/link";

import { Icon } from "@/components/ui/icon";
import { profileConfig } from "@/lib/config";

export default function ProfileCard() {
  return (
    <section className="card bg-base-100 p-3">
      <Link
        href="/about"
        aria-label="Go to About page"
        className="relative mx-auto mb-3 block max-w-[12rem] overflow-hidden rounded-box lg:max-w-none"
      >
        <Image
          src={profileConfig.avatar ?? "/avatar.png"}
          alt={`Profile image of ${profileConfig.name}`}
          width={320}
          height={320}
          className="h-auto w-full object-cover"
          priority
        />
      </Link>
      <div className="px-2 text-center">
        <h2 className="text-xl font-bold">{profileConfig.name}</h2>
        <div className="mx-auto my-2 h-1 w-5 rounded-full bg-primary" />
        {profileConfig.bio ? (
          <p className="mb-3 text-sm opacity-70">{profileConfig.bio}</p>
        ) : null}
        <div className="flex flex-wrap justify-center gap-2">
          {profileConfig.links.map((item) => (
            <a
              key={item.name}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer me"
              aria-label={item.name}
              className="btn btn-ghost btn-square btn-sm"
            >
              <Icon name={item.icon} className="text-xl" />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
