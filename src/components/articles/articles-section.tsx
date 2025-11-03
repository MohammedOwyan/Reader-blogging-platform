"use client";
import { useState, useEffect, useRef } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Article } from "@/types/article-type";
import ArticleComponent from "../custom/article";
import { ArticleData } from "@/types/types";

export default function ArticlesSection() {
  const [articles, setArticles] = useState<ArticleData[]>([]);
  const [selectedValue, setSelectedValue] = useState("forYou");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const lastArticleRef = useRef<HTMLDivElement | null>(null);

  // 🔁 Fetch articles
  const fetchArticles = async function (pageNum: number, filter: string) {
    if (loading) return;
    setLoading(true);

    try {
      const res = await fetch(
        `/api/articles?page=${pageNum}&limit=10&type=${filter}`
      );
      if (!res.ok) {
        console.error("Failed to fetch articles");
        setLoading(false);
        return;
      }

      const newArticles = await res.json();

      if (newArticles.length === 0) {
        setHasMore(false);
      } else {
        // 🧩 تأكد من عدم التكرار
        setArticles((prev) => {
          const ids = new Set(prev.map((a) => String(a.id)));
          const unique = newArticles.filter(
            (a: Article) => !ids.has(String(a.id))
          );
          return [...prev, ...unique];
        });
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  // 📡 لما الصفحة تتغير
  useEffect(() => {
    fetchArticles(page, selectedValue);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, selectedValue]);

  // 🔁 لما المستخدم يغير الفلتر، نعيد التحميل من أول
  useEffect(() => {
    setArticles([]);
    setPage(1);
    setHasMore(true);
  }, [selectedValue]);

  // 👀 المراقب (infinite scroll)
  useEffect(() => {
    if (!hasMore) return;

    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore && !loading) {
        setPage((prev) => prev + 1);
      }
    });

    const currentRef = lastArticleRef.current;
    if (currentRef) observer.observe(currentRef);

    return () => {
      if (currentRef) observer.unobserve(currentRef);
    };
  }, [hasMore, loading]);

  return (
    <div>
      <div className="flex justify-between mt-12 pb-10 border-b-2 border-gray-200">
        <h1 className="capitalize font-semibold text-2xl">Articles</h1>

        <Select
          value={selectedValue}
          onValueChange={(value) => setSelectedValue(value)}
        >
          <SelectTrigger className="w-[180px] outline-none">
            <SelectValue>{selectedValue}</SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="forYou">For you</SelectItem>
            <SelectItem value="following">Following</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        {articles.map((article, index) => {
          if (index === articles.length - 1) {
            return (
              <div key={article.id} ref={lastArticleRef}>
                <ArticleComponent article={article} />
              </div>
            );
          } else {
            return <ArticleComponent key={article.id} article={article} />;
          }
        })}

        {loading && (
          <p className="text-center my-4">Loading more articles...</p>
        )}
        {!hasMore && !loading && (
          <p className="text-center my-4 text-gray-500">No more articles</p>
        )}
      </div>
    </div>
  );
}
