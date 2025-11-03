import NavigationBar from "@/components/header/navigationBar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { BriefcaseBusiness } from "lucide-react";
import { User } from "@prisma/client";
import ArticleComponent from "../custom/article";
import { headers } from "next/headers";
import { ArticleData } from "@/types/types";

export default async function Visitor({ pageOwner }: { pageOwner: User }) {
  // 🧩 Fetch user's articles (server-side)

  const host = (await headers()).get("host");
  const protocol = process.env.NODE_ENV === "production" ? "https" : "http";

  const res = await fetch(
    `${protocol}://${host}/api/articles?type=user&id=${pageOwner.id}`
  );

  const articles = await res.json();

  console.log("response is", articles);

  return (
    <>
      <div className="sticky top-0 w-full z-30">
        <NavigationBar />
      </div>

      <div className="flex flex-row-reverse w-full justify-between">
        {/* Sidebar */}
        <aside className="w-2/5 h-screen pl-12 pt-10 pr-14 font-semibold border-solid border-gray-300 border-l">
          <div className="relative w-40 h-40">
            <Avatar className="size-40">
              <AvatarImage src={pageOwner?.ProfilePictureUrl || ""} />
              <AvatarFallback className="bg-gray-500 text-white text-6xl font-medium">
                {pageOwner?.firstName?.charAt(0).toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
          </div>

          <div className="text-lg mt-3">
            <span>{pageOwner?.firstName + " " + pageOwner?.lastName}</span>
            <span className="block text-sm text-gray-600 mt-3">
              UX designer <BriefcaseBusiness size={16} className="inline" />
            </span>
          </div>

          {/* Bio Section */}
          <div className="mt-16">
            {pageOwner?.bio ? (
              <div>
                <span className="border-b-2 border-black text-2xl w-fit block">
                  Bio
                </span>
                <p className="text-gray-700 font-normal text-base mt-10 min-h-16">
                  {pageOwner.bio}
                </p>
              </div>
            ) : (
              <p className="text-gray-500 italic mt-4">No bio available</p>
            )}
          </div>
        </aside>

        {/* Articles Section */}
        <div className="mt-32 px-40 w-full">
          <span className="block text-4xl font-bold">
            {pageOwner.firstName + " " + pageOwner.lastName}
          </span>
          <div className="mt-16 w-auto border-b-2 border-gray-400">
            <span className="w-fit inline-block text-xl text-center pb-2 border-b-2 border-transparent shadow-[0px_2px_0px_0px_black]">
              Home
            </span>
            <span className="w-fit inline-block text-xl text-center text-gray-500 ml-9">
              About
            </span>
          </div>

          {/* Articles list */}
          <div className="mt-10">
            {articles && articles.length > 0 ? (
              articles.map((article: ArticleData) => (
                <ArticleComponent article={article} key={article.id} />
              ))
            ) : (
              <p className="text-center text-gray-400 mt-4">
                No articles found
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
