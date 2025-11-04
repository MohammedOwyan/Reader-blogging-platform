"use client"
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ReactNode } from "react";
import { signIn } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export function SignInDialog({ children }: { children: ReactNode }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const router = useRouter();
    // const session = useSession();


    const handleLogin = async () => {
        const res = await signIn("credentials", {
            redirect: false,
            email,
            password,
        });

        if (res?.error) {
            setError("Invalid email or password");
        } else {
            window.location.href = "/";
        }
    };

    const handleGoogleSignIn = async () => {
        
        const res = await signIn("google", {callbackUrl:"/"});
        console.log("google auth response: ", res)
    };

    return (
        <Dialog>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className="sm:max-w-[600px] h-[700px] flex flex-col justify-center p-8 rounded-2xl">
                <DialogHeader className="!text-center">
                    <DialogTitle className="text-3xl font-bold">Welcome Back</DialogTitle>
                    <DialogDescription className="text-sm text-gray-500">
                        Sign in to continue to your account.
                    </DialogDescription>
                </DialogHeader>
                <Button onClick={handleGoogleSignIn} className="w-full h-12 flex items-center justify-center gap-2 bg-black text-white py-2 rounded-lg hover:bg-gray-800 mt-4">
                    <Image src={"/images/flat-color-icons--google.svg"} width={30} height={30} alt="google icon"></Image>Sign In with Google
                </Button>
                <div className="text-center text-gray-500 my-1">OR</div>
                <div className="flex flex-col gap-6 py-6">
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="email" className="font-medium">
                            Email
                        </Label>
                        <Input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="p-2 border rounded-lg h-12"
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <div className="flex justify-between items-center">
                            <Label htmlFor="password" className="font-medium">
                                Password
                            </Label>
                            <Button
                                variant="link"
                                className="text-black underline text-sm"
                                // onClick={() => router.push("/forgot-password")}
                            >
                                Forgot password?
                            </Button>
                        </div>
                        <Input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="p-2 border rounded-lg h-12"
                        />
                    </div>
                    {error && <p className="text-red-500 text-center">{error}</p>}
                </div>
                <DialogFooter className="flex !justify-between items-center">
                    <Button onClick={handleLogin} className="bg-black h-12 w-32 text-lg text-white py-2 px-4 rounded-lg hover:bg-gray-800">
                        Sign In
                    </Button>
                    <span className="text-sm text-gray-500">
                        Don't have an account?{" "}
                        <Button variant="link" className="text-black underline" onClick={() => router.push("/signup")}>
                            Create account
                        </Button>
                    </span>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
