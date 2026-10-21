import { SignInInput, SignUpInput } from '../types/auth.types';

export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// 이름: 한글(완성형)·영문만, 영문 이름용 띄어쓰기 허용 (숫자·특수문자 불가)
const NAME_REGEX = /^[가-힣a-zA-Z ]+$/;
// 입력 중 바로 지울 문자 (한글 조합 중인 자모 ㄱ,ㅏ 등은 남겨 둔다)
export const NAME_INVALID_CHARS = /[^가-힣ㄱ-ㅎㅏ-ㅣa-zA-Z ]/g;

/** 이름 검증: 문제가 없으면 '' */
export function validateName(name: string): string {
    const value = name.trim();
    if (!value) return '이름을 입력해 주세요.';
    if (!NAME_REGEX.test(value)) return '이름은 한글 또는 영문만 입력할 수 있습니다.';
    if (value.length < 2) return '이름은 최소 2자 이상 입력해야 합니다.';
    if (value.length > 20) return '이름은 20자 이하로 입력해 주세요.';
    return '';
}

// 회원가입 가능 최소 나이 (만 나이)
const MIN_SIGNUP_AGE = 14;

/** 생년월일(YYYYMMDD) 검증: 실제 달력에 있는 날짜인지 + 만 14세 이상인지. 문제가 없으면 '' */
export function validateBirth(birth: string): string {
    if (!/^\d{8}$/.test(birth)) return '생년월일 8자리를 입력해 주세요. (예: 19990101)';

    const year = Number(birth.slice(0, 4));
    const month = Number(birth.slice(4, 6));
    const day = Number(birth.slice(6, 8));

    // Date 는 2월 30일 → 3월 2일처럼 넘치는 날짜를 자동으로 넘겨 버린다.
    // 만든 날짜의 연·월·일이 입력값과 그대로 같아야 실제로 있는 날짜 (윤년 포함)
    const date = new Date(year, month - 1, day);
    const isRealDate =
        date.getFullYear() === year &&
        date.getMonth() === month - 1 &&
        date.getDate() === day;
    if (year < 1940 || !isRealDate) return '존재하지 않는 날짜입니다. 생년월일을 다시 확인해 주세요.';

    const today = new Date();
    if (date > today) return '생년월일은 오늘 이후 날짜일 수 없습니다.';

    // 만 나이: 올해 생일이 아직 안 지났으면 1살 뺀다
    const hadBirthday =
        today.getMonth() > month - 1 ||
        (today.getMonth() === month - 1 && today.getDate() >= day);
    const age = today.getFullYear() - year - (hadBirthday ? 0 : 1);
    if (age < MIN_SIGNUP_AGE) return `만 ${MIN_SIGNUP_AGE}세 이상만 가입할 수 있습니다.`;

    return '';
}

export function validateSignInInput (
    input: SignInInput,
): Record<string, string> {
        const errors: Record<string, string> = {};
    
    if(!input.email || !input.email.trim()) {
        errors.email = '이메일 주소를 입력해 주세요.';
    } else if (!EMAIL_REGEX.test(input.email.trim())) {
        errors.email = '올바른 이메일 형식이 아닙니다.'; 
    }

    if (!input.password) {
        errors.password= '비밀번호를 입력해 주세요.';
    } else if (input.password.length < 7 ) {
        errors.password = '비밀번호는 최소 7자 이상이어야 합니다.';
     }

     return errors;
}

export function validateSignUpInput(
    input: SignUpInput,
): Record<string, string> {
    const errors: Record<string, string> = {};

    const nameError = validateName(input.name ?? '');
    if (nameError) {
        errors.name = nameError;
    }

    if (!input.email || !input.email.trim()) {
        errors.email = '이메일 주소를 입력해 주세요.';
    } else if (!EMAIL_REGEX.test(input.email.trim())) {
        errors.email = '올바른 이메일 형식이 아닙니다.';
    }

    if (!input.password) {
        errors.password = '비밀번호를 입력해 주세요.';
    } else if (input.password.length < 7) {
        errors.password = '비밀번호는 최소 7자 이상이어야 합니다.';
    }
    if (!input.passwordConfirm) {
        errors.passwordConfirm = '비밀번호 확인을 입력해 주세요.';
    } else if (input.password !== input.passwordConfirm) {
        errors.passwordConfirm = '비밀번호가 일치하지 않습니다.';
    }

    return errors;
}
