import { test } from '@playwright/test';
import { Rex } from '../POM/rex_pom';

test('카카오 이모티콘 샵 통합 테스트 실행', async ({ page }) => {
    const rex = new Rex(page);

    // 1. 초기 메인 페이지 진입
    await page.goto('https://e.kakao.com/', { waitUntil: 'networkidle' });
    test.setTimeout(120000);

    // 2. 실행 권한 위임 (이 내부에서 스타일 페이지 이동까지 자동으로 수행함)
    await rex.runEmoticonTest();
});