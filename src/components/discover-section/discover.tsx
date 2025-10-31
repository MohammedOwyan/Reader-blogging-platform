
import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { Button } from '../ui/button'


export default function Discover({ className }: { className?: string }) {

  return (
    <aside className={`w-1/4 h-screen fixed right-0 top-[89px] pl-12 pt-10 pr-14 font-semibold ${className}`}>
      <h2 className='text-xl mb-5'>People you might be intersted</h2>
      <div className='flex justify-between items-center mb-6'>
        <div className='flex'>
          <Avatar className='w-14 h-14 mr-4'>
            <AvatarImage src='https://picsum.photos/200' />
            <AvatarFallback>BL</AvatarFallback>
          </Avatar>
          <div>
            <span className='block'>Mohamed islam</span>
            <span className='text-[15px] text-gray-500'>UX Designer</span>
          </div>
        </div>
        <Button variant={"outline"}>Follow</Button>
      </div>
      <h2 className='text-xl mb-5'>My reading list</h2>
      <div>
      {/* this place for the image */}

      </div>
      

    </aside>
  )
}
