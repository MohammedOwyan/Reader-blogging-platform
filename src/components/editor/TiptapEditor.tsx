"use client";

import React, { useEffect, useRef, useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import { Button } from "../ui/button";
import { Toggle } from "../ui/toggle";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { faBell } from "@fortawesome/free-regular-svg-icons";
import {
  faBold,
  faImage,
  faItalic,
  faLink,
  faList,
  faList12,
  faStrikethrough,
  faUnderline,
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "@tiptap/extension-link";
import { Underline } from "@tiptap/extension-underline";
import Image from "next/image";
import { Image as TiptapImage } from "@tiptap/extension-image";
import SelectMenu from "./select";
import { Input } from "../ui/input";
import { useRouter } from "next/navigation";

import { useSession } from "next-auth/react";

const TiptapEditor = () => {
  const [editorReady, setEditorReady] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [title, setTitle] = useState("");
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
  }, [status, router]);

  const editor = useEditor({
    extensions: [
      StarterKit, // Includes common tools like bold, italic, etc.
      Underline,
      Link,
      TiptapImage,
      Placeholder.configure({
        placeholder: "start typing",
        includeChildren: true,
      }),
    ],
    content: ``,
    immediatelyRender: false,
  });

  useEffect(() => {
    if (editor) {
      setEditorReady(true);
    }
  }, [editor]);

  if (!editorReady) {
    return <div>Loading editor...</div>;
  }

  if (!editor) {
    return null;
  }
  const handleHeadingChange = (value: "h1" | "h2" | "h3" | "p") => {
    if (value === "h1") {
      editor.chain().focus().toggleHeading({ level: 1 }).run();
    } else if (value === "h2") {
      editor.chain().focus().toggleHeading({ level: 2 }).run();
    } else if (value === "h3") {
      editor.chain().focus().toggleHeading({ level: 3 }).run();
    } else {
      editor.chain().focus().setParagraph().run();
    }
  };
  const handleImageClick = () => {
    fileInputRef.current?.click();
  };
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && editor) {
      const reader = new FileReader();
      reader.onload = () => {
        editor
          .chain()
          .focus()
          .setImage({ src: reader.result as string })
          .run();
      };
      reader.readAsDataURL(file);
    }
  };
  const handlePublish = async () => {
    const content = editor.getHTML();

    const response = await fetch("/api/articles/save", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ content, title, userId: session?.user.id }),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
      return;
    }
    const article = await response.json();
    console.log(article.id);

    router.push(`/publish/${article.article.id}`);
  };

  return (
    <div>
      <nav className="flex bg-white flex-row justify-between items-center px-60 py-5 ">
        <Image src={"/logo.svg"} alt="logo" width={150} height={30} />

        <div className="flex justify-between items-center w-60 ">
          <Button onClick={handlePublish}>Publish</Button>
          <div className="flex justify-center flex-wrap content-center rounded-full size-11 hover:bg-gray-100 cursor-pointer">
            <div className="relative ">
              <FontAwesomeIcon
                className="text-gray-800 "
                style={{ fontSize: "25px" }}
                icon={faBell}
              />
              <span className="absolute top-0 right-0 rounded-full bg-orange-500 w-2.5 h-2.5"></span>
            </div>
          </div>
          <Avatar className="size-11 ">
            <AvatarImage src="#" />
            <AvatarFallback className="bg-gray-400 text-white">
              MI
            </AvatarFallback>
          </Avatar>
        </div>
      </nav>
      <div className="container flex flex-col items-center mx-auto mt-10 w-2/3">
        <div className="flex justify-between w-full py-4">
          <SelectMenu handleChange={handleHeadingChange} />
          <Toggle
            className={`${
              editor.isActive("bold") ? "!bg-black   !text-white" : ""
            }`}
            onClick={() => editor.chain().focus().toggleBold().run()}
          >
            <FontAwesomeIcon icon={faBold} />
          </Toggle>
          <Toggle
            className={`${
              editor.isActive("italic") ? "!bg-black   !text-white" : ""
            }`}
            onClick={() => editor.chain().focus().toggleItalic().run()}
          >
            <FontAwesomeIcon icon={faItalic} />
          </Toggle>
          <Toggle
            className={`${
              editor.isActive("underline") ? "!bg-black   !text-white" : ""
            }`}
            onClick={() => editor.chain().focus().toggleUnderline().run()}
          >
            <FontAwesomeIcon icon={faUnderline} />
          </Toggle>
          <Toggle
            className={`${
              editor.isActive("strike") ? "!bg-black   !text-white" : ""
            }`}
            onClick={() => editor.chain().focus().toggleStrike().run()}
          >
            <FontAwesomeIcon icon={faStrikethrough} />
          </Toggle>
          {/* <button onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}>H1</button> */}
          <Toggle
            className={`${
              editor.isActive("bulletList") ? "!bg-black   !text-white" : ""
            }`}
            onClick={() => editor.chain().focus().toggleBulletList().run()}
          >
            <FontAwesomeIcon icon={faList} />
          </Toggle>
          <Toggle
            className={`${
              editor.isActive("orderedList") ? "!bg-black   !text-white" : ""
            }`}
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
          >
            <FontAwesomeIcon icon={faList12} />
          </Toggle>
          <Toggle
            className={`${
              editor.isActive("link") ? "!bg-black   !text-white" : ""
            }`}
            onClick={() =>
              editor
                .chain()
                .focus()
                .setLink({ href: "https://example.com" })
                .run()
            }
          >
            <FontAwesomeIcon icon={faLink} />
          </Toggle>
          <Button variant={"ghost"} size={"icon"} onClick={handleImageClick}>
            <FontAwesomeIcon icon={faImage} />
          </Button>
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            style={{ display: "none" }}
            onChange={handleImageUpload}
          />
        </div>
        <Input
          placeholder="Title"
          className=" !text-3xl  w-full border-none outline-none focus:!outline-none focus:!ring-0 shadow-none"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <EditorContent
          className="text-lg mt-6 border-t-2 pt-5 self-start w-full"
          editor={editor}
        />
      </div>
    </div>
  );
};

export default TiptapEditor;
