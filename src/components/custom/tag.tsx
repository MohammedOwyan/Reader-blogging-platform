"use client";

import { useRef } from 'react';
// import React from 'react'

import { TagComponentProps } from '@/types/tag-types';

export default function Tag({ className, children }: TagComponentProps) {

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    scrollContainerRef.current?.scrollBy({ left: -200, behavior: "smooth" });
  };

  const scrollRight = () => {
    scrollContainerRef.current?.scrollBy({ left: 200, behavior: "smooth" });
  };

  return (
    <div className={` min-w-fit bg-gray-100 font-medium text-black text-center h-12 rounded-full content-center  px-8 capitalize ${className}`} >{children}</div>
  )
}
