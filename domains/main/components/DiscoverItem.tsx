import Image from 'next/image';
import Link from 'next/link';

import { type DiscoverItem } from '@/domains/main/types';

export default function DisCoverItem({ item }: { item: DiscoverItem }) {
    return (
        <Link href={item.href} className="block">
            <div className="relative aspect-[3/4] overflow-hidden bg-[#f2f2f2]">
                <Image
                    src={item.image}
                    alt={item.alt}
                    fill
                    sizes="23vw"
                    className="object-contain"
                />
            </div>

            <div className="mt-5 pr-5">
                <p className="line-clamp-2 w-[330px] max-w-full text-xl leading-[1.25] font-medium">
                    {item.title}
                </p>
                <p className="mt-2 line-clamp-2 w-[390px] max-w-full text-sm leading-[1.25] font-medium text-[#767676]">
                    {item.subtitle}
                </p>
                <ul className="mt-[11px] flex">
                    {item.tags.map((tag) => (
                        <li
                            key={tag}
                            className="h-[30px] truncate rounded-[15px] border border-[#ccc] px-2.5 text-[13px] leading-[28px] font-medium text-[#999]"
                        >
                            {tag}
                        </li>
                    ))}
                </ul>
            </div>
        </Link>
    );
}
