// server action 반환 형태 : 모든 서버 액션이 돌려주는 결과 모양

export interface ActionState<T=unknown> {
    success: boolean;               // 성공했는지 여부
    message?: string;               // 브라우저 화면에 띄울 안내 메세지
    errors?: Record<string, string>; // 칸별 에러
    data?: T                         // 성공 시 돌려줄 추가 정보
}

// 초기상태
export const INITIAL_ACTION_STATE: ActionState = {
    success: false,
}