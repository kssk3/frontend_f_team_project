import HelpLnb from './_component/HelpLnb';

// EQL CS CENTER 레이아웃: 좌측 메뉴(240px) + 본문
export default function HelpLayout({ children }: LayoutProps<'/help'>) {
    return (
        <div className="px-gutter mt-[60px] flex pb-[120px]">
            <HelpLnb />
            <div className="ml-[60px] min-w-0 flex-1">{children}</div>
        </div>
    );
}
