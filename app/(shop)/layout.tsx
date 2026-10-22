import Header from '../_component/Header';
import Footer from '../_component/Footer';
import TopButton from '../../shared/components/ui/Topbutton';
import ComingSoonProvider from '@/shared/components/ComingSoonProvider';

export default function ShopLayout({ children }: LayoutProps<'/'>) {
    return (
        // 아직 없는 페이지로 가는 메뉴를 누르면 "준비 중" 안내 모달을 띄운다 (NavLink)
        <ComingSoonProvider>
            {/* EQL과 같은 PC 전용 최소 폭 (이보다 좁으면 가로 스크롤) */}
            <div className="flex min-w-[1280px] flex-1 flex-col">
                <Header />
                <div className="pt-header flex flex-1 flex-col">{children}</div>
                <TopButton />
                <Footer />
            </div>
        </ComingSoonProvider>
    );
}
