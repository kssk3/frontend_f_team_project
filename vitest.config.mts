import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';

export default defineConfig({
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./', import.meta.url)),
        },
    },
    test: {
        // 컴포넌트(UI) 테스트만 수집 — node:test 기반 *.test.ts 는 제외
        include: ['**/*.test.tsx'],
        exclude: ['node_modules/**', '.next/**'],
        environment: 'jsdom',
    },
});
