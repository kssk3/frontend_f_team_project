'use client';

import { useState } from 'react';
import { VerifiedIdentity } from '../../types/auth.types';
import SignUpForm from '../SignUpForm';
import SignUpStepper from './SignUpStepper';
import AgreementSection from './AgreementSection';
import IdentityVerification from './IdentityVerification';
import SignUpComplete from './SignUpComplete';
import AlertModal from '@/shared/components/ui/AlertModal';
import { checkDuplicateMemberAction } from '../../actions/checkMember.actions';

type Step = 1 | 2 | 3;

export default function SignUpWizard() {
    const [step, setStep] = useState<Step>(1);
    const [agreed, setAgreed] = useState(false);
    const [identity, setIdentity] = useState<VerifiedIdentity | null>(null);
    const [alertMessage, setAlertMessage] = useState('');

    const onVerified = async (result: VerifiedIdentity) => {
        // 본인인증 직후 같은 휴대폰 번호로 가입된 회원이 있으면 다음 단계로 넘어가지 않는다
        const res = await checkDuplicateMemberAction(result.phone);
        if (!res.success) {
            setAlertMessage(res.message ?? '회원 조회에 실패했습니다.');
            return;
        }
        if (res.data?.exists) {
            setAlertMessage('이미 가입된 회원입니다.');
            return;
        }

        setIdentity(result);
        setStep(2);
        window.scrollTo({ top: 0 });
    };

    return (
        <>
            <SignUpStepper current={step} />

            {step === 1 && (
                <>
                    <AgreementSection checked={agreed} onChange={setAgreed} />
                    <IdentityVerification
                        disabled={!agreed}
                        onVerified={onVerified}
                    />
                </>
            )}

            {step === 2 && identity && (
                <SignUpForm identity={identity} onSuccess={() => setStep(3)} />
            )}

            {step === 3 && <SignUpComplete name={identity?.name ?? ''} />}

            <AlertModal
                open={alertMessage !== ''}
                message={alertMessage}
                onClose={() => setAlertMessage('')}
            />
        </>
    );
}
