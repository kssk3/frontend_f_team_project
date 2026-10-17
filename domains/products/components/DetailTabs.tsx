'use client';

import { cn } from '@/shared/utils/cn';
// useRef = 필요할 때 요소에 직접 위치 참조시킴
import { useRef, useState } from 'react';

const TABS = [ 
    { key: 'description', label: '상품 설명'},
    { key: 'review', label: '리뷰', count: 0},
    { key: 'faq', label: '문의', count: 0},
] as const;

// TABS 추가하면 타입 자동으로 따라오게 함
type TabKey = (typeof TABS)[number]['key'];

interface DetailTabsProps {
    description: React.ReactNode;
}

export 