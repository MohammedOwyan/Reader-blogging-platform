import { notFound } from "next/navigation";

import GetArticle from "@/lib/articles";
import NavigationBar from "@/components/header/navigationBar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import ActionButtons from "@/components/articles/actionButtons";
import Image from "next/image";
import { sanitizeHTML } from "@/lib/sanitizeHtml";

interface ArticlePageProps {
  params: { id: string };
}

export async function generateMetadata({
  params
}: ArticlePageProps) {
  const { id } = params;
  const article = await GetArticle(Number(id));
  return {
    title: article?.title,
    description: article?.summary,
  };
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { id } = await params;

  // Fetch article from database
  const article = await GetArticle(Number(id));

  console.log("article is :", article);

  if (!article) return notFound();
  // if (!article.thumbnail){
  //   return "someting went wrong"
  // }

  const safeHTML = sanitizeHTML(article.content);

  return (
    <div className="flex flex-col">
      <NavigationBar />
      <main className=" w-1/2 self-center  py-24">
        <h1 className="text-6xl">{article.title}</h1>
        <div className="flex justify-between items-center mt-16">
          <div className="flex items-center ">
            <Avatar className="w-16 h-16 mr-4">
              <AvatarImage src={article.author.ProfilePictureUrl || "#"} />
              <AvatarFallback>
                {article.author.firstName.charAt(0).toUpperCase()}
                {article.author.lastName.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="">
                {article.author.firstName + " " + article.author.lastName}
              </span>
              <div>
                <span className="text-sm text-gray-700 font-semibold">
                  {article.author.job || "UX Designer"}
                </span>
                {" . "}
                <span className="text-sm text-gray-500">
                  {new Date(article.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "2-digit",
                    year: "numeric",
                  })}
                </span>
              </div>
            </div>
          </div>
          <Button variant={"default"} className="py-0 text-xl">
            Follow
          </Button>
        </div>
        <ActionButtons />
        <div>
          <div className="w-full">
            <Image
              src={article.thumbnail || ""}
              alt={"thumbnail"}
              className="w-full h-72"
              width={400}
              height={200}
            />
          </div>
          <div dangerouslySetInnerHTML={{ __html: safeHTML }} />
        </div>
      </main>
    </div>
  );
}
