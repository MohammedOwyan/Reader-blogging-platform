"use client";


import React from "react";
import { Button } from "../ui/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons"
import { faBell, faPenToSquare } from "@fortawesome/free-regular-svg-icons";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { redirect } from "next/navigation";
import { Input } from "../ui/input";
import Image from "next/image";
import { Dropdown } from "@/components/header/dropdownmenu";
import { SignInDialog } from "../auth/signin-form";
import { useSession } from "next-auth/react";



export default function NavigationBar() {

  const { data: session } = useSession();
  const isAuth = !!session;
  console.log(session)
  return (
    <nav className="flex bg-white flex-row justify-between items-center px-12 py-5 border-b border-gray-300">
      <div className="flex gap-20 w-1/2">

        <Image src={"/logo.svg"} alt="" width={150} height={50}></Image>
        <div className='flex items-center h-12 w-80 border border-solid border-gray-300 rounded-full'>
          <Button style={{ borderRadius: "30px 0 0 30px", height: "100%" }} variant={"ghost"} >
            <FontAwesomeIcon icon={faMagnifyingGlass} className='text-gray-600' />
          </Button>
          <Input type="search" placeholder="search..." style={{ outline: "none", boxShadow: "none" }} className="border-none shadow-none "></Input>
        </div>
      </div>
      <div className="flex justify-between items-center w-60 ">


        {isAuth ? <>
          <div className="flex justify-center flex-wrap content-center rounded-full size-11 hover:bg-gray-100 cursor-pointer">
            <div className="relative ">
              <FontAwesomeIcon className="text-gray-800 " style={{ fontSize: "25px" }} icon={faBell} />
              <span className="absolute top-0 right-0 rounded-full bg-orange-500 w-2.5 h-2.5"></span>
            </div>
          </div>

          <Dropdown>
            <div className="flex justify-center content-center rounded-full border border-gray-300 p-0.5">
              <Avatar>
                <AvatarImage src={session.user?.image || undefined} />
                <AvatarFallback>{session.user?.name?.charAt(0) || "U"}</AvatarFallback>
              </Avatar>
            </div>
          </Dropdown>
        </> :
          <SignInDialog>
            <Button variant={"outline"}>Sign in</Button>
          </SignInDialog>
        }

        <Button variant={"outline"} size={"default"} onClick={() => redirect('/write')}>
          <FontAwesomeIcon icon={faPenToSquare} />
          <span className="font-semibold">{" "}Write</span>
        </Button>
      </div>
    </nav>
  );
}
