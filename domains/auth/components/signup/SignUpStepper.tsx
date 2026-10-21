import { cn } from '@/shared/lib/cn';

const STEPS = ['본인인증', '회원가입', '가입 완료'];

export default function SignUpStepper({ current }: { current: number }) {
    return (
        <ol className="relative mb-17.5 flex justify-between">
            {/* 단계를 잇는 회색 선 */}
            <span className="absolute top-5 right-3 left-5 h-px bg-gray-300" />

            {STEPS.map((label, i) => {
                const no = i + 1;
                const active = no === current;
                const done = no < current;
                const align =
                    i === 0
                        ? 'items-start'
                        : i === STEPS.length - 1
                          ? 'items-end'
                          : 'items-center';

                return (
                    <li
                        key={label}
                        className={cn('relative flex flex-1 flex-col', align)}
                    >
                        <div className="flex h-10 items-center">
                            {active ? (
                                <span className="flex size-10 items-center justify-center rounded-full border border-black bg-white text-base">
                                    {no}
                                </span>
                            ) : (
                                <span
                                    className={cn(
                                        'size-2.5',
                                        done ? 'bg-black' : 'bg-gray-300',
                                    )}
                                />
                            )}
                        </div>
                        <span
                            className={cn(
                                'mt-4 text-sm',
                                active ? 'font-medium' : 'text-gray-500',
                            )}
                        >
                            {label}
                        </span>
                    </li>
                );
            })}
        </ol>
    );
}
