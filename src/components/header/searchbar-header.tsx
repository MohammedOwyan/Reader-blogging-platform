import React from 'react'
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import Tag from '../custom/tag';

export default function SearchHeader() {
    const tags: string[] = ["design", "development", "UX", "marketing"];
    return (
        <div className=' w-full  pt-8' >
            {/* <div className='flex items-center h-12 w-1/3 border border-solid border-gray-300 rounded-full'>
                <Button style={{ borderRadius: "30px 0 0 30px", height: "100%" }} variant={"ghost"} >
                    <FontAwesomeIcon icon={faMagnifyingGlass} className='text-gray-600' />
                </Button>
                <Input type="search" placeholder="search..." style={{ outline: "none", boxShadow: "none" }} className="border-none shadow-none "></Input>
            </div> */}
            <div className="flex items-center w-full">
                <span className='text-nowrap mx-10 text-lg text-gray-500'>My topics:</span>
                <div className="flex justify-between w-full">
                    {
                        tags.map((tag) => {
                            return <Tag key={tag} >{tag}</Tag>
                        })
                    }
                </div>
            </div>
        </div>
    );
}
