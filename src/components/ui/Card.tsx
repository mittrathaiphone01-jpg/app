import { cn } from '@/lib/utils';
import React from 'react'
type Props = {
    children: React.ReactNode;
    className?: string;
};

const Card = ({ children, className }: Props) => {
    return (
        <div className={cn("flex flex-col items-start gap-2 rounded-[10px] bg-white px-6 pb-6  shadow-1 dark:bg-gray-dark dark:shadow-card h-fit ", className)}>
            <div className='mt-6 w-full '>{children}</div>
        </div>
    )
}

export default Card