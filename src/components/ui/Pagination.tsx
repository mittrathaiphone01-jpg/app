import { cn } from '@/lib/utils';
import React from 'react'
import { Button } from '../ui-elements/button';
import { MessageOutlineIcon, NextIcon, PrevIcon, TrashIcon } from '@/assets/icons';

type PaginationProps = {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    className?: string;
    totalData: number
    sum_paid_amount?: number

}

const Pagination = ({ currentPage, totalPages, onPageChange, className, totalData, sum_paid_amount }: PaginationProps) => {

    // if (totalPages <= 1) return null
    // const pages = Array.from({ length: totalPages }, (_, i) => i + 1)
    const pages: (number | string)[] = []
    const windowSize = 3

    //หา block ปัจจุบัน
    const currentBlock = Math.ceil(currentPage / windowSize)
    let start = (currentBlock - 1) * windowSize + 1
    let end = Math.min(start + windowSize - 1, totalPages)

    // --- ปรับ start/end เวลาย้อนกลับ ---
    // ถ้า currentPage < start ของ block → เลื่อน block ไป
    if (currentPage < start) {
        start = Math.max(currentPage - (windowSize - 1), 1)
        end = start + windowSize - 1
    }
    end = Math.min(end, totalPages)
    for (let i = start; i <= end; i++) {
        pages.push(i);
    }

    // --- ต่อท้ายด้วย ... + หน้าสุดท้าย (ถ้ายังไม่ถึง) ---
    if (end < totalPages) {
        pages.push("...", totalPages);
    }

    return (
        <div className={cn("flex items-center gap-2", className)}>
            <div className='w-full'>
               {sum_paid_amount ? (
                 <p className='text-base  pr-5'>ราคาที่ชำระแล้ว {Number(sum_paid_amount).toLocaleString() || 0} บาท</p>
               ): ("")}
            </div>

            <div className='w-full flex justify-end items-center gap-2'>
                <p className='text-sm pr-5'>ทั้งหมด {Number(totalData).toLocaleString()} รายการ</p>
                <button
                    className=" w-10 flex justify-center py-1 rounded-md   disabled:opacity-50  text-dark-3 dark:text-dark-7 hover:bg-dark-8 border border-dark-7 hover:bg-primary/20  dark:hover:bg-gray-600"
                    disabled={currentPage === 1}
                    onClick={() => onPageChange(currentPage - 1)}
                >
                    <PrevIcon />
                </button>

                {pages.map((p, i) =>
                    p === "..." ? (
                        <span key={i} className="px-2 text-2xl">
                            ...
                        </span>
                    ) : (
                        <button
                            key={i}
                            className={cn(
                                "px-0 w-10 py-1 rounded",
                                p === currentPage
                                    ? "bg-primary text-white"
                                    : " border border-dark-7 hover:bg-primary/20  dark:hover:bg-gray-600"
                            )}
                            onClick={() => onPageChange(p as number)}
                        >
                            {p}
                        </button>
                    )
                )}

                <button
                    className="w-10 py-1 flex justify-center  disabled:opacity-50 hover:bg-dark-8  text-dark-3 dark:text-dark-7 rounded-md border border-dark-7 hover:bg-primary/20  dark:hover:bg-gray-600"
                    disabled={currentPage === totalPages}
                    onClick={() => onPageChange(currentPage + 1)}
                >
                    <NextIcon />
                </button>

            </div>
        </div>
    )
}

export default Pagination