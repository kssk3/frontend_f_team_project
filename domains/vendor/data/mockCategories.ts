export const mockCategories = [
    {
        value: 'women',
        label: '우먼',
        children: [
            { value: 'clothing', label: '의류' },
            { value: 'bags', label: '가방' },
            { value: 'accessories', label: '액세서리' },
            { value: 'shoes', label: '슈즈' },
        ],
    },
    {
        value: 'men',
        label: '맨',
        children: [
            { value: 'clothing', label: '의류' },
            { value: 'bags', label: '가방' },
            { value: 'accessories', label: '액세서리' },
            { value: 'shoes', label: '슈즈' },
        ],
    },
    {
        value: 'life',
        label: '라이프',
        children: [
            { value: 'home', label: '홈' },
            { value: 'home-fabric', label: '홈패브릭&침구' },
            { value: 'homewear', label: '홈웨어' },
            { value: 'kitchen', label: '키친' },
            { value: 'beauty', label: '뷰티' },
            { value: 'tech', label: '테크' },
            { value: 'family', label: '패밀리(키즈/펫)' },
            { value: 'leisure', label: '레져' },
        ],
    },
] as const;
