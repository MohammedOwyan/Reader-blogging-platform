import prisma from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// Named export for POST method
export async function POST(req: NextRequest) {
  try {
    // Parse the body if needed
    const { firstName, lastName, email , password ,token } = await req.json();

    const secretKey = process.env.RECAPTCHA_SECRET_KEY;
    const jwtSecret = process.env.JWT_SECRET

    const recaptchaResponse = await fetch(
      `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${token}`,
      { method: "POST" }
    );
    

    const recaptchaData = await recaptchaResponse.json();

    if (!recaptchaData.success || recaptchaData.score < 0.5) {
      return NextResponse.json({ success: false, message: "reCAPTCHA verification failed.", score: recaptchaData.score },{ status:400 });
    }
    

    if (!recaptchaData.success) {
      return NextResponse.json({ success: false, message: "reCAPTCHA verification failed." },{status:400});
    }


    const existingUser = await prisma.user.findUnique({where:{email}})
    
    if(existingUser){
      return NextResponse.json({message:"User already exists"},{status:400})
    }

    const hashedPassword = await bcrypt.hash(password,10)

    const user = await prisma.user.create({
      data: { email, firstName, lastName, password: hashedPassword },
    });
    if(!jwtSecret){
      throw new Error('no JWT secret')
    }
    const jwtToken = jwt.sign({userId:user.id, email:user.email}, jwtSecret ,{expiresIn: "7d"})
    const response = NextResponse.json( {success:true ,jwtToken,...user} , { status: 200 })
    response.cookies.set("token", jwtToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60, // 7 أيام
      path: "/",
      sameSite:"lax"
    });
    
    return response
  } catch (err) {
    console.log(err)
    return NextResponse.json({ message: `Error processing the request `, }, { status: 400 });
  }
}
