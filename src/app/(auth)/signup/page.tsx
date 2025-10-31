
import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import SignupForm from '@/components/form/form'
export default function Page() {
  return (
    <div className='h-full w-full flex'>
      <div className='flex flex-col justify-between h-full w-5/12 float-left bg-cover pt-20 pl-16 pr-36 pb-44' style={{ backgroundImage: `url(/assets/desert-night.jpg)` }}>
        <div>
          <Link href={"/"}>
            <Image width="200" height="100" src="/logo-dark.svg" alt="logo" />
          </Link>
        </div>
        <div >
          <span className='text-white text-7xl font-bold block mb-10'>Your words matter</span>
          <span className='text-white text-4xl leading-relaxed font-light'> Join Reader to share your stories and inspire others around the world.</span>
        </div>
      </div>
      <div className='flex-1 flex-col flex items-center justify-center py-10'>
        <h1 className='text-6xl font-semibold'>Join Reader</h1>
        <div className='flex-1'></div>
        <SignupForm/>
      </div>
    </div>
  )
}
