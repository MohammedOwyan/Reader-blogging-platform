"use client";

import { useState } from "react";
import { GoogleReCaptchaProvider, useGoogleReCaptcha } from "react-google-recaptcha-v3";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import validator from "validator";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { signIn } from "next-auth/react";
import toast from "react-hot-toast";

function Form() {
  const router = useRouter();
  const { executeRecaptcha } = useGoogleReCaptcha();
  const [formData, setFormData] = useState({ firstName: "", lastName: "", email: "", password: "", confirmPassword: "" });
  const [formErrors, setFormErrors] = useState({ firstName: "", lastName: "", email: "", password: "", confirmPassword: "", recaptcha: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const validatePassword = (password: string) => {
    const isValid = validator.isStrongPassword(password);
    return isValid;
  };

  const checkFormErrors = () => {
    const errors = { firstName: "", lastName: "", email: "", password: "", confirmPassword: "", recaptcha: "" };
    let hasErrors = false;

    if (!formData.firstName) {
      errors.firstName = "First name field is required";
      hasErrors = true;
    }
    if (!formData.lastName) {
      errors.lastName = "Last name field is required";
      hasErrors = true;
    }
    if (!formData.email) {
      errors.email = "Email field is required";
      hasErrors = true;
    } else if (!validator.isEmail(formData.email)) {
      errors.email = "Invalid email";
      hasErrors = true;
    }
    if (!formData.password) {
      errors.password = "Password field is required";
      hasErrors = true;
    } else if (!validatePassword(formData.password)) {
      errors.password = "Use strong password";
      hasErrors = true;
    }
    if (!formData.confirmPassword) {
      errors.confirmPassword = "You must confirm password";
      hasErrors = true;
    } else if (formData.confirmPassword !== formData.password) {
      errors.confirmPassword = "Passwords do not match";
      hasErrors = true;
    }

    setFormErrors(errors);
    return hasErrors;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    if (checkFormErrors()) {
      setLoading(false);
      return;
    }

    if (!executeRecaptcha) {
      setFormErrors(prev => ({ ...prev, recaptcha: "reCAPTCHA not yet available." }));
      setLoading(false);
      return;
    }

    const token = await executeRecaptcha("signup");

    if (!token) {
      setFormErrors(prev => ({ ...prev, recaptcha: "Please complete the reCAPTCHA." }));
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, token }),
      });

      const data = await response.json();

      console.log(data);
      
      if (data.success) {
        router.push("/");
      }else if(response.status === 409){
        toast.error("User already exist")
      } else {
        setFormErrors(prev => ({ ...prev, recaptcha: "Signup failed. reCAPTCHA verification failed." }));
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };
  const handleGoogleSignIn = async () => {
    await signIn("google", { callbackUrl: "/" });
  };

  return (
    <form onSubmit={handleSubmit} className='flex gap-5 flex-col w-7/12'>
      <Button type={"button"} onClick={handleGoogleSignIn} className="w-full h-12 flex items-center justify-center gap-2 bg-black text-white py-2 rounded-lg hover:bg-gray-800 mt-4">
        <Image src={"/images/flat-color-icons--google.svg"} width={30} height={30} alt="google icon"></Image>Sign up with Google
      </Button>
      <div className="text-center text-gray-500 my-1">OR</div>
      <div className='grid grid-cols-2 gap-10'>
        <div>
          <Label htmlFor='firstName' className={`text-lg font-light ${formErrors.firstName ? "text-red-500" : ""}`}>First name</Label>
          <Input type='text' id='firstName' className={`h-11 ${formErrors.firstName ? "border-red-500 focus-visible:ring-red-500" : ""}`} onChange={(e) => setFormData({ ...formData, firstName: e.target.value })} />
          {formErrors.firstName && <p className="text-red-500">{formErrors.firstName}</p>}
        </div>
        <div>
          <Label htmlFor='lastName' className={`text-lg font-light ${formErrors.lastName ? "text-red-500" : ""}`}>Last name</Label>
          <Input type='text' id='lastName' className={`h-11 ${formErrors.lastName ? "border-red-500 focus-visible:ring-red-500" : ""}`} onChange={(e) => setFormData({ ...formData, lastName: e.target.value })} />
          {formErrors.lastName && <p className="text-red-500">{formErrors.lastName}</p>}
        </div>
      </div>
      <div>
        <Label htmlFor='email' className={`text-lg font-light ${formErrors.email ? "text-red-500" : ""}`}>Email</Label>
        <Input type='email' id='email' className={`h-11 ${formErrors.email ? "border-red-500 focus-visible:ring-red-500" : ""}`} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
        {formErrors.email && <p className="text-red-500">{formErrors.email}</p>}
      </div>
      <div className="relative">
        <Label htmlFor='password' className={`text-lg font-light ${formErrors.password ? "text-red-500" : ""}`}>Password</Label>
        <div className="relative">
          <Input type={showPassword ? "text" : "password"} id='password' className={`h-11 pr-10 ${formErrors.password ? "border-red-500 focus-visible:ring-red-500" : ""}`} onChange={(e) => setFormData({ ...formData, password: e.target.value })} />
          <button type="button" className="absolute right-2 top-2 p-2" onClick={() => setShowPassword(!showPassword)}>
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>
        {formErrors.password && <p className="text-red-500">{formErrors.password}</p>}
      </div>
      <div className="relative">
        <Label htmlFor='confirmPassword' className={`text-lg font-light ${formErrors.confirmPassword ? "text-red-500" : ""}`}>Confirm password</Label>
        <div className="relative">
          <Input type={showConfirmPassword ? "text" : "password"} id='confirmPassword' className={`h-11 pr-10 ${formErrors.confirmPassword ? "border-red-500 focus-visible:ring-red-500" : ""}`} onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })} />
          <button type="button" className="absolute right-2 top-2 p-2" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
            {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>
        {formErrors.confirmPassword && <p className="text-red-500">{formErrors.confirmPassword}</p>}
      </div>
      <Button type='submit' className='h-11' disabled={loading}>
        {loading ? <FontAwesomeIcon icon={faSpinner} className="animate-spin" /> : "Sign up"}
      </Button>
      <span className="font-light text-lg text-center text-gray-600">Already have an account <Link className="underline text-black font-medium" href={"/login"}>Login</Link></span>
    </form>
  );
}

export default function SignupForm() {
  return (
    <GoogleReCaptchaProvider reCaptchaKey="6Le52soqAAAAAA-we2v2poFBkoZ0tHypcqCwvY_v">
      <Form />
    </GoogleReCaptchaProvider>
  );
}
