"use client"
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader, X } from "lucide-react";
import Image from "next/image";

export default function PublishDetailsClient({ id }: { id: string }) {
    const [thumbnail, setThumbnail] = useState<File | null>(null);
    const [tags, setTags] = useState<string[]>([]);
    const [tagInput, setTagInput] = useState("");
    const [summary, setSummary] = useState("");
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [publishDisabled, setPublishDesabled] = useState<boolean>(false);
    const router = useRouter();


    const handleThumbnailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setThumbnail(file); 
    };

    const handleTagKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Enter" && tagInput.trim() !== "") {
            event.preventDefault();
            if (tags.length < 5) {
                setTags([...tags, tagInput.trim()]);
                setTagInput("");
                setErrorMessage(null);
            } else {
                setErrorMessage("You can only add up to 5 tags.");
            }
        }
    };

    const removeTag = (index: number) => {
        setTags(tags.filter((_, i) => i !== index));
    };

    const handlePublish = async () => {

        
        if (!id || !summary || !tags.length || !thumbnail) {
            alert("All fields are required!");
            return;
        }
        
        setPublishDesabled(true)
        
        const reader = new FileReader();
        reader.readAsDataURL(thumbnail);
        reader.onload = async () => {
            const base64Image = reader.result as string;

            const response = await fetch('/api/articles/publish', {
                method: 'PUT',
                body: JSON.stringify({
                    id, 
                    summary,
                    tags,
                    image: base64Image,
                    fileName: thumbnail.name,
                }),
                headers: { 'Content-Type': 'application/json' },
            });

            const data = await response.json();
            console.log("data is",data)
            if (response.ok) {
                router.push("/")
                console.log("Article updated:", data.updatedArticle);
            } else {
                console.error("Update failed:", data.error);
            }
        };
    };



    return (
        <div className="max-w-3xl mx-auto p-8 space-y-6 bg-white shadow-lg rounded-lg border mt-10">
            <h1 className="text-3xl font-bold">Publish Your Article</h1>

            <div className="space-y-4">
                <label className="block text-lg font-medium">Thumbnail</label>
                {thumbnail ? (
                    <div className="relative w-full h-60 border rounded-md overflow-hidden">
                        <Image src={URL.createObjectURL(thumbnail)} alt="Thumbnail Preview" width={400} height={400} className="w-full h-full object-cover" />
                    </div>
                ) : (
                    <label className="w-full flex flex-col items-center justify-center border-2 border-dashed p-6 rounded-md cursor-pointer hover:bg-gray-100">
                        <input type="file" accept="image/*" onChange={handleThumbnailChange} className="hidden" />
                        <span className="text-gray-600">Click to upload a thumbnail</span>
                        <p className="text-sm text-gray-500 mt-2">Include a high-quality image in your article to make it more inviting to readers.</p>
                    </label>
                )}
            </div>

            <div className="space-y-4">
                <label className="block text-lg font-medium">Tags</label>
                <p className="text-sm text-gray-500">Add up to 5 relevant tags to help readers discover your article.</p>
                <div className="flex flex-wrap gap-2 border p-3 rounded-md bg-gray-50">
                    {tags.map((tag, index) => (
                        <span key={index} className="flex items-center px-3 py-1 bg-gray-200 rounded-full text-sm">
                            {tag} <X size={14} className="ml-2 cursor-pointer" onClick={() => removeTag(index)} />
                        </span>
                    ))}
                    <Input
                        type="text"
                        placeholder="Add a tag and press Enter"
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyDown={handleTagKeyPress}
                        className="flex-1 border-none bg-transparent focus:outline-none"
                    />
                </div>
                {errorMessage && <p className="text-red-600 text-sm mt-2">{errorMessage}</p>}
            </div>

            <div className="space-y-4">
                <label className="block text-lg font-medium">Summary</label>
                <p className="text-sm text-gray-500">Provide a brief summary of your article to give readers an idea of what it{"\,"}s about.</p>
                <Textarea
                    placeholder="Write a short summary of your article..."
                    value={summary}
                    onChange={(e) => setSummary(e.target.value)}
                    className="w-full p-3 border rounded-md bg-gray-50"
                />
            </div>

            <div className="flex justify-between mt-6">
                <Button variant={"ghost"} onClick={() => router.back()} className="hover:bg-transparent hover:underline">
                    Back
                </Button>

                <Button className={publishDisabled?"bg-gray-700":""} onClick={handlePublish} disabled={publishDisabled}>
                    {publishDisabled?<Loader className="animate-spin"/>:"Publish"}
                </Button>
            </div>
        </div>
    );
}
