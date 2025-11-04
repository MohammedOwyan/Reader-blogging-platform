"use client"
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage("");
        setError("");

        const res = await fetch("/api/auth/forgot-password", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email }),
        });

        const data = await res.json();

        console.log("data is",data)
        
        if (res.ok) {
            setMessage("If this email is registered, you will receive a password reset link.");
        } else {
            setError(data.error || "Something went wrong. Please try again.");
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
            <Card className="w-full max-w-md p-6 rounded-xl shadow-lg bg-white">
                <CardHeader>
                    <CardTitle className="text-2xl text-center">Forgot Password?</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-gray-600 text-center mb-4">
                        Enter your email, and we'll send you a link to reset your password.
                    </p>
                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        <div>
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="h-12 p-2 border rounded-lg"
                                required
                            />
                        </div>
                        {error && <p className="text-red-500 text-center">{error}</p>}
                        {message && <p className="text-green-500 text-center">{message}</p>}
                        <Button type="submit" className="bg-black text-white h-12 w-full rounded-lg hover:bg-gray-800">
                            Send Reset Link
                        </Button>
                    </form>
                    <Button variant="link" className="w-full text-center mt-4" onClick={() => router.push("/signin")}>Back to Sign In</Button>
                </CardContent>
            </Card>
        </div>
    );
}
