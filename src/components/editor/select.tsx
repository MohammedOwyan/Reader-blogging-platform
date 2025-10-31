import React from 'react'
import { Select, SelectContent, SelectGroup, SelectItem,  SelectTrigger, SelectValue } from '../ui/select'
import { SelectMenuProps } from '@/types/types'

export default function SelectMenu({handleChange}:SelectMenuProps) {
  return (
    <Select onValueChange={handleChange}>
    <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Heading" />
    </SelectTrigger>
    <SelectContent>
        <SelectGroup>
            <SelectItem value="h1">Heading 1</SelectItem>
            <SelectItem value="h2">Heading 2</SelectItem>
            <SelectItem value="h3">Heading 3</SelectItem>
            <SelectItem value="p">paragraph</SelectItem>
        </SelectGroup>
    </SelectContent>
</Select>
  )
}
