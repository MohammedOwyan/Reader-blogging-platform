"use client";
import { useState } from "react";
import { useSearchParams } from "next/navigation";

export default function ResetPassword() {
    const searchParams = useSearchParams();
    const token = searchParams.get("token");
    const [password, setPassword] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const res = await fetch("/api/auth/reset-password", {
            method: "POST",
            body: JSON.stringify({ token, password }),
            headers: { "Content-Type": "application/json" },
        });

        const data = await res.json();
        alert(data.message);
    };

    return (
        <form onSubmit={handleSubmit}>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="New Password" required />
            <button type="submit">Reset Password</button>
        </form>
    );
}
