import React from 'react';
import { Link } from '@inertiajs/react';

function PageButton({ href, children, disabled }) {
    const base = 'inline-flex items-center rounded-lg px-3 py-2 text-sm font-medium transition';
    if (disabled) return <span className={`${base} text-gray-400`}>{children}</span>;
    return (
        <Link href={href} className={`${base} text-gray-700 hover:bg-gray-50`} preserveScroll>
            {children}
        </Link>
    );
}

export default function Pagination({ paginator }) {
    if (!paginator) return null;

    return (
        <div className="flex items-center justify-between gap-4 border-t border-gray-100 px-4 py-3 text-sm text-gray-600">
            <div>
                Page {paginator.current_page} of {paginator.last_page}
            </div>
            <div className="flex items-center gap-2">
                <PageButton href={paginator.prev_page_url} disabled={!paginator.prev_page_url}>
                    Prev
                </PageButton>
                <PageButton href={paginator.next_page_url} disabled={!paginator.next_page_url}>
                    Next
                </PageButton>
            </div>
        </div>
    );
}
