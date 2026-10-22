// 지금 만들어진 페이지 주소 목록. app 폴더의 page.tsx 위치와 같은 모양으로 적는다.
// 페이지를 새로 만들면 여기에 한 줄 추가한다 (빠뜨리면 implementedRoutes.test.ts 가 알려 준다).
// 목록에 없는 주소로 가는 메뉴 링크는 이동하지 않고 "준비 중" 안내를 띄운다 (NavLink).
export const IMPLEMENTED_ROUTES = [
    '/',
    '/admin',
    '/cart',
    '/cart/empty',
    '/cart/notempty',
    '/help/vendor',
    '/login',
    '/member/find-id',
    '/member/find-pw',
    '/member/join',
    '/member/join/form',
    '/member/non-member-order',
    '/member/reset-password',
    '/product/[id]',
] as const;

// '/product/[id]' 의 [id] 처럼 대괄호 칸은 아무 값 한 칸과 맞는다
const isDynamicSegment = (segment: string) => /^\[[^\]]+\]$/.test(segment);

function matchesRoute(pathname: string, route: string) {
    const pathSegments = pathname.split('/').filter(Boolean);
    const routeSegments = route.split('/').filter(Boolean);

    return (
        pathSegments.length === routeSegments.length &&
        routeSegments.every(
            (segment, index) =>
                isDynamicSegment(segment) || segment === pathSegments[index],
        )
    );
}

export function isImplemented(href: string): boolean {
    // 외부 주소(https:, mailto: 등)는 이 사이트의 페이지가 아니므로 막지 않는다
    if (!href.startsWith('/')) return true;

    const pathname = href.split(/[?#]/)[0];
    return IMPLEMENTED_ROUTES.some((route) => matchesRoute(pathname, route));
}
