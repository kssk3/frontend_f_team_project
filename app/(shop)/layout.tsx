import Header from '../_component/Header';

export default function ShopLayout({ children }: LayoutProps<'/'>) {
    return (
        <>
            <Header />
            <div className="pt-header flex flex-1 flex-col">{children}</div>
        </>
    );
}
