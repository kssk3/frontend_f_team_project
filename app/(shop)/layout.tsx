import Header from '../_component/Header';
import Footer from '../_component/Footer';
import TopButton from '../../shared/components/ui/Topbutton';

export default function ShopLayout({ children }: LayoutProps<'/'>) {
    return (
        // EQL과 같은 PC 전용 최소 폭 (이보다 좁으면 가로 스크롤)
        <div className="flex min-w-[1280px] flex-1 flex-col">
            <Header />
            <div className="pt-header flex flex-1 flex-col">{children}</div>
            <TopButton />
            <Footer />
        </div>
    );
}
