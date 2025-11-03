"use client";

import NavigationBar from "@/components/header/navigationBar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { BriefcaseBusiness, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import React, { useState, useRef, useEffect, useCallback } from "react";
import { User } from "@prisma/client";
import { Textarea } from "../ui/textarea";
import ArticleComponent from "../custom/article";
import { ArticleData } from "@/types/types";

export default function Owner({ pageOwner }: { pageOwner: User }) {
  const [editBio, setEditBio] = useState(false);
  const [bio, setBio] = useState(pageOwner?.bio || "");
  const [loading, setLoading] = useState(false);
  const [profilePic, setProfilePic] = useState(
    pageOwner?.ProfilePictureUrl || ""
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [articles, setArticles] = useState<ArticleData[]>([]);
  const [articlesLoading, setArticlesLoading] = useState<boolean>(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const limit = 5;

  // 🌀 Fetch articles
  const fetchArticles = useCallback(async () => {
    if (!hasMore || articlesLoading) return;
    try {
      setArticlesLoading(true);
      const res = await fetch(
        `/api/articles?page=${page}&limit=${limit}&type=user&id=${pageOwner.id}`
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to fetch articles");

      setArticles((prev) => {
        const existingIds = new Set(prev.map((a) => a.id));
        const unique = data.filter((a: ArticleData) => !existingIds.has(a.id));
        return [...prev, ...unique];
      });

      // لو أقل من limit يبقى مفيش تاني
      if (data.length < limit) setHasMore(false);
    } catch (err) {
      console.error("Error fetching articles:", err);
    } finally {
      setArticlesLoading(false);
    }
  }, [page, hasMore, articlesLoading]);

  useEffect(() => {
    fetchArticles();
  }, [page]);

  // 🧭 Infinite scroll handler
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >=
          document.body.offsetHeight - 200 &&
        !articlesLoading &&
        hasMore
      ) {
        setPage((prev) => prev + 1);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [articlesLoading, hasMore]);

  // ✏️ Bio edit handlers
  const handleAddBioClick = () => setEditBio(true);

  const handleCancel = () => {
    setBio(pageOwner?.bio || "");
    setEditBio(false);
  };

  const handleSubmit = async () => {
    if (!bio.trim()) return;
    setLoading(true);

    try {
      const res = await fetch("/api/update_profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bio }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update bio");

      setBio(data.updatedUser.bio);
      setEditBio(false);
    } catch (error) {
      console.error("Error updating bio:", error);
    } finally {
      setLoading(false);
    }
  };

  // 🖼️ Profile picture handlers
  const handleImageClick = () => fileInputRef.current?.click();

  const handleImageChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const objectURL = URL.createObjectURL(file);
    setProfilePic(objectURL);

    const formData = new FormData();
    formData.append("profilePicture", file);

    try {
      const res = await fetch("/api/update_profile_pic", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to upload image");

      setProfilePic(data.updatedUser.ProfilePictureUrl);
    } catch (error) {
      console.error("Error updating profile picture:", error);
    }
  };

  return (
    <>
      <div className="sticky top-0 w-full z-30">
        <NavigationBar />
      </div>

      <div className="flex flex-row-reverse w-full justify-between">
        {/* Sidebar */}
        <aside className="w-2/5 h-screen pl-12 pt-10 pr-14 font-semibold border-solid border-gray-300 border-l">
          <div
            className="relative group w-40 h-40 cursor-pointer"
            onClick={handleImageClick}
          >
            <Avatar className="size-40">
              <AvatarImage src={profilePic} />
              <AvatarFallback className="bg-gray-500 text-white text-6xl font-medium">
                {pageOwner?.firstName?.charAt(0).toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-full">
              <Pencil className="text-white w-10 h-10" />
            </div>
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              className="hidden"
              onChange={handleImageChange}
            />
          </div>

          <div className="text-lg mt-3">
            <span>{pageOwner?.firstName + " " + pageOwner?.lastName}</span>
            <span className="block text-sm text-gray-600 mt-3">
              UX designer <BriefcaseBusiness size={16} className="inline" />
            </span>
          </div>

          {/* Bio Section */}
          <div className="mt-16">
            {editBio ? (
              <div className="space-y-2">
                <Textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Write your bio..."
                  className="w-full border-none max-h-60 min-h-48 h-52 font-normal !text-lg"
                />
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="text-gray-500"
                    onClick={handleCancel}
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleSubmit} disabled={loading}>
                    {loading ? "Saving..." : "Submit"}
                  </Button>
                </div>
              </div>
            ) : bio ? (
              <div>
                <span className="border-b-2 border-black text-2xl w-fit block">
                  Bio
                </span>
                <p className="text-gray-700 font-normal text-base mt-10 min-h-16">
                  {bio}
                </p>
                <Button
                  variant={"outline"}
                  className="text-gray-500 mt-2"
                  onClick={handleAddBioClick}
                >
                  Edit Bio
                </Button>
              </div>
            ) : (
              <Button
                variant={"outline"}
                className="text-gray-500"
                onClick={handleAddBioClick}
              >
                Add bio to your profile
              </Button>
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
            {articles.map((article: ArticleData) => (
              <ArticleComponent article={article} key={article.id} />
            ))}

            {articlesLoading && (
              <p className="text-center text-gray-500 mt-4">Loading more...</p>
            )}

            {!hasMore && (
              <p className="text-center text-gray-400 mt-4">No more articles</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
