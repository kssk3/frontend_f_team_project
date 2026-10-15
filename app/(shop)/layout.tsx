import Header from '../_component/Header';
import Footer from '../_component/Footer';
import TopButton from '../_component/Main';

export default function ShopLayout({ children }: LayoutProps<'/'>) {
    return (
        <>
            <Header />
            <div className="pt-header flex flex-1 flex-col">{children}</div>
            <TopButton />
            <Footer />
        </>
    );
}
