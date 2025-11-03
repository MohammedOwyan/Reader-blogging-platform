"use client";

import { TagComponentProps } from '@/types/tag-types';

export default function Tag({ className, children }: TagComponentProps) {

  return (
    <div className={` min-w-fit bg-gray-100 font-medium text-black text-center h-12 rounded-full content-center  px-8 capitalize ${className}`} >{children}</div>
  )
}
