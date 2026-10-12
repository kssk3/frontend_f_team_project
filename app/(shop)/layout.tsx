export default function ShopLayout({ children }: LayoutProps<'/'>) {
    return (
        <>
            {/* TODO: 헤더 */}
            <main className="flex flex-1 flex-col">{children}</main>
            {/* TODO: 푸터 */}
        </>
    );
}
