import React from 'react';
import { HiOutlineChevronLeft, HiOutlineChevronRight } from 'react-icons/hi';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    if (totalPages <= 1) return null;

    const getPageNumbers = () => {
        const total = totalPages;
        const current = currentPage;
        const delta = 2; // Number of pages to show before and after current
        const range = [];
        const rangeWithDots = [];
        let l;

        for (let i = 1; i <= total; i++) {
            if (i === 1 || i === total || (i >= current - delta && i <= current + delta)) {
                range.push(i);
            }
        }

        for (let i of range) {
            if (l) {
                if (i - l === 2) {
                    rangeWithDots.push(l + 1);
                } else if (i - l !== 1) {
                    rangeWithDots.push('...');
                }
            }
            rangeWithDots.push(i);
            l = i;
        }

        return rangeWithDots;
    };

    return (
        <div className="flex flex-wrap items-center justify-center gap-2 mt-12 py-8">
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-3 rounded-xl bg-white/5 border border-white/10 text-white disabled:opacity-20 disabled:cursor-not-allowed hover:bg-white/10 transition-all group"
            >
                <HiOutlineChevronLeft size={20} className="group-active:-translate-x-1 transition-transform" />
            </button>

            <div className="flex flex-wrap items-center justify-center gap-2 px-2">
                {getPageNumbers().map((page, index) => (
                    page === '...' ? (
                        <span key={`dots-${index}`} className="w-10 text-center text-surface-600 font-bold">...</span>
                    ) : (
                        <button
                            key={page}
                            onClick={() => onPageChange(page)}
                            className={`w-12 h-12 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${currentPage === page
                                ? 'bg-primary-500 text-white shadow-premium'
                                : 'text-surface-500 hover:text-white hover:bg-white/5 border border-transparent hover:border-white/10'
                                }`}
                        >
                            {page.toString().padStart(2, '0')}
                        </button>
                    )
                ))}
            </div>

            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-3 rounded-xl bg-white/5 border border-white/10 text-white disabled:opacity-20 disabled:cursor-not-allowed hover:bg-white/10 transition-all group"
            >
                <HiOutlineChevronRight size={20} className="group-active:translate-x-1 transition-transform" />
            </button>
        </div>
    );
};

export default Pagination;
