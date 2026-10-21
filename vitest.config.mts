import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';

export default defineConfig({
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./', import.meta.url)),
        },
    },
    test: {
        // 단위(*.test.ts)·컴포넌트(*.test.tsx) 테스트를 모두 수집
        include: ['**/*.test.{ts,tsx}'],
        exclude: ['node_modules/**', '.next/**'],
        environment: 'jsdom',
    },
});
