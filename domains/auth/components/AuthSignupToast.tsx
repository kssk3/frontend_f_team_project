import SignupToast from '@/domains/main/components/SignupToast';
import { isLoggedIn } from '../dal';

export default async function AuthSignupToast() {
    return <SignupToast isLoggedIn={await isLoggedIn()} />;
}
