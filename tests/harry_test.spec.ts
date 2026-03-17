import { test } from '@playwright/test';
import { Harry } from '../POM/harry_pom';

test('카카오 이모티콘 샵 홈 화면 검증', async ({ page }) => {
   test.setTimeout(120000)
   const harry = new Harry(page);

   // 1. 홈 진입
   await harry.gotoHome();

   // 2. 배너 영역 확인
   await harry.checkBanners();

   // 3. 신규 이모티콘 랜덤 거증
   await harry.verfiyNewEmoticons();

   // 4. 인기 이모티콘 리스트 확인
   await harry.checkPopularEmoticons();

   // 5. 스타일 태그 확인
   await harry.printStyleTags()

   console.log('\n🎉 모든 섹션 테스트가 성공적으로 완료되었습니다!');

});