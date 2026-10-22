import { VENDOR_TEXT_MAX_LENGTH } from '../utils/vendorValidation';

export const vendorFields = [
    {
        kind: 'input',
        name: 'companyName',
        label: '회사명',
        type: 'text',
        maxLength: VENDOR_TEXT_MAX_LENGTH.companyName,
    },
    {
        kind: 'input',
        name: 'brandName',
        label: '브랜드명',
        type: 'text',
        maxLength: VENDOR_TEXT_MAX_LENGTH.brandName,
    },
    {
        kind: 'input',
        name: 'contactName',
        label: '담당자명',
        type: 'text',
        maxLength: VENDOR_TEXT_MAX_LENGTH.contactName,
    },
    {
        kind: 'input',
        name: 'phoneNumber',
        label: '전화번호',
        type: 'tel',
        placeholder: "'-' 없이 숫자만 입력",
    },
    {
        kind: 'select',
        name: 'inquiryType',
        label: '문의 유형',
    },
    {
        kind: 'select',
        name: 'primaryCategory',
        label: '대표 카테고리',
    },
    {
        kind: 'select',
        name: 'secondaryCategory',
        label: '2차 카테고리',
    },
    {
        kind: 'input',
        name: 'mobileNumber',
        label: '담당자 휴대폰 번호',
        type: 'tel',
        placeholder: "'-' 없이 숫자만 입력",
    },
    {
        kind: 'input',
        name: 'email',
        label: '담당자 이메일',
        type: 'email',
    },
    {
        kind: 'input',
        name: 'website',
        label: '브랜드 웹사이트',
        type: 'url',
    },
    {
        kind: 'textarea',
        name: 'otherPlatforms',
        label: '타사 입점현황',
        rows: 3,
        optional: true,
    },
    {
        kind: 'textarea',
        name: 'content',
        label: '문의 내용',
        rows: 6,
        optional: true,
        placeholder: '내용을 입력해 주세요.',
    },
] as const;
