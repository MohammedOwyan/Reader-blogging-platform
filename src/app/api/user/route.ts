import prisma from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export function GET(req:NextRequest){
    try{

        
        const data = req.body
        
        const { id }= data
        
        const user = prisma.user.findUnique({
            where:{
                id
            }
        })
        return NextResponse.json({data:})
    }catch(error){
        
    }

    
}