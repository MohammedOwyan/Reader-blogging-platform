import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import Tag from "./tag";
import { ArticleComponentProps } from "@/types/types";
import { redirect } from "next/navigation";
import { forwardRef } from "react";

const ArticleComponent = forwardRef<HTMLDivElement, ArticleComponentProps>(
  ({ article, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className="flex items-center h-96 py-8 border-b-2 border-gray-200 gap-6 cursor-pointer"
        onClick={() => redirect(`/articles/${article.id}`)}
        {...props}
      >
        {/* الجزء الخاص بالمحتوى */}
        <div className="flex flex-col justify-between h-full flex-1">
          <div className="flex">
            <Avatar className="w-12 h-12 mr-4">
              <AvatarImage src={article.author.ProfilePictureUrl || "#"} />
              <AvatarFallback>
                {article.author.firstName.charAt(0).toUpperCase()}
                {article.author.lastName.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <span className="block">
                {article.author.firstName + " " + article.author.lastName}
              </span>
              <span className="text-[15px] text-gray-500">{article.author.job}</span>
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

          <h2 className="!text-4xl font-bold">{article.title}</h2>
          <p className="text-sm text-gray-500">{article.summary}</p>

          <div className="flex">
            {article.tags?.map((tag) => (
              <Tag className="text-gray-500 mr-3" key={tag}>
                {tag}
              </Tag>
            ))}
          </div>
        </div>

        {article.thumbnail ? (
          <div className="w-1/3 h-[200px] rounded-md overflow-hidden">
            <Image
              src={article.thumbnail}
              alt="Styled Image"
              width={400}
              height={300}
              className="object-cover w-full h-full"
            />
          </div>
        ) : null}
      </div>
    );
  }
);

ArticleComponent.displayName = "ArticleComponent";

export default ArticleComponent;
