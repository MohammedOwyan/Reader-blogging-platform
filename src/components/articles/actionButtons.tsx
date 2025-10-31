"use client";

import { useState } from "react";
import { Button } from "../ui/button";
import { Bookmark, Heart } from "lucide-react";


export default function ActionButtons() {
    const [ isLiked, setIsLiked ] = useState(false);
    const [ isSaved , setIsSaved ] = useState(false);

    return (
        <div className="flex justify-end border-y-2 py-4 my-8 gap-8">
            <Button variant={"ghost"} size={"icon"} onClick={() => setIsSaved(!isSaved)}><Bookmark className=" !size-7"  fill={isSaved?"#000":"#fff"}/></Button>
            <Button variant={"ghost"} size={"icon"} onClick={() => setIsLiked(!isLiked)}><Heart className=" !size-7 " strokeWidth={2} fill={isLiked?"#dc2626":"#fff"}/></Button>
        </div>
    )
}
