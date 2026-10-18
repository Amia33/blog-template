import Categories from "@/components/widget/categories";
import ProfileCard from "@/components/widget/profile-card";
import Tags from "@/components/widget/tags";

export default function Sidebar() {
  return (
    <aside className="flex w-full flex-col gap-4">
      <ProfileCard />
      <div className="flex w-full flex-col gap-4 lg:sticky lg:top-20">
        <Categories />
        <Tags />
      </div>
    </aside>
  );
}
