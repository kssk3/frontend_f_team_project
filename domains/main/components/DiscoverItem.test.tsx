import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, expect, test, vi } from 'vitest';

import type { DiscoverItem as DiscoverItemData } from '../types';
import DiscoverItem from './DiscoverItem';

vi.mock('next/image', () => ({
    default: ({ alt }: { alt: string }) => <span role="img" aria-label={alt} />,
}));

afterEach(cleanup);

const item: DiscoverItemData = {
    productId: 'a0000000-0000-4000-8000-000000000002',
    title: '요즘 니트',
    subtitle: 'Style #니트',
    tags: ['KNIT LAB'],
    image: 'https://picsum.photos/seed/eql-knit-1/900/1200',
    alt: '니트 착용 컷',
};

test('카드를 누르면 그 상품의 상세 페이지로 간다', () => {
    render(<DiscoverItem item={item} />);

    expect(
        screen.getByRole('link', { name: /요즘 니트/ }).getAttribute('href'),
    ).toBe(`/product/${item.productId}`);
});

test('사진이 없으면 회색 상자만 보여 준다', () => {
    render(<DiscoverItem item={{ ...item, image: '' }} />);

    expect(screen.queryByRole('img')).toBeNull();
    expect(screen.getByRole('link', { name: /요즘 니트/ })).toBeTruthy();
});
