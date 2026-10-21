'use client';
import { useFormStatus } from 'react-dom';
import { cn } from '@/shared/utils/cn';
import { Button } from '@/shared/components/ui/button';

export default function SubmitButton({ className }: { className?: string }) {
    const { pending } = useFormStatus();

    return (
        <Button
            type="submit"
            disabled={pending}
            className={cn(
                'disabled:bg-input rounded-none bg-black text-white disabled:opacity-100',
                className,
            )}
        >
            {pending ? '검증 중...' : '등록'}
        </Button>
    );
}
