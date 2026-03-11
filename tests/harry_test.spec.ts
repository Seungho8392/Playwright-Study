import { test, expect } from '@playwright/test';

test('카카오 이모티콘 샵 유지보수 강화 시나리오', async ({ page }) => {
   // 1. 입장
   await page.goto("https://e.kakao.com");

   // --- 첫 번째 배너 구간 ---
   await page.getByRole('button', { name: 'NaN 번째 콘텐츠' }).first().click();
   const page1Promise = page.waitForEvent('popup');
   await page.getByRole('link', { name: '링크배너' }).first().click();
   const page1 = await page1Promise;
   console.log('첫번째 배너 제목: ', await page1.title());
   await page1.waitForTimeout(1500); // 1.5초 대기
   await page1.close();

   // --- 두 번째 배너 구간 ---
   await page.getByRole('button', { name: 'NaN 번째 콘텐츠' }).nth(1).click();
   const page2Promise = page.waitForEvent('popup');
   await page.getByRole('link', { name: '링크배너' }).first().click(); // 여기서 .first()는 메인창 기준이라 그대로 써도 됨
   const page2 = await page2Promise;
   console.log('두번째 배너 제목: ', await page2.title());
   await page2.waitForTimeout(1500); // 1.5초 대기
   await page2.close();

   // --- 신규 이모티콘 섹션 진입 테스트 ---
    // "신규 이모티콘" 글자를 포함하고 있는 '섹션 전체 박스'를 찾습니다.
   const newSection= page.getByText('신규 이모티콘').first();   

   // 섹션이 보일 때까지 스크롤
   await newSection.scrollIntoViewIfNeeded();

   // 신규 이모티콘 클릭 및 홈으로 이동
   await page.getByRole('link', { name: '신규 이모티콘' }).click();
   await page.getByRole('link', { name: 'kakao emoticon shop' }).click();

   // 섹션이 보일 때까지 스크롤
   await newSection.scrollIntoViewIfNeeded();

   // 0부터 9까지 총 10번 반복합니다. (컴퓨터는 0부터 세니까요!)
for (let i = 0; i < 10; i++) {
       
    // 1. 홈 화면에 올 때마다 '신규 이모티콘' 위치로 스크롤을 다시 해줍니다.
    // (상세 페이지를 갔다 오면 화면 맨 위로 올라가 버리기 때문입니다)
    const newTitle = page.getByText('신규 이모티콘').first();
    await newTitle.scrollIntoViewIfNeeded();

    // 2. [가장 중요] 시각적으로 '첫 번째' 이모티콘이 확실히 뜰 때까지 기다립니다.
    // 이렇게 하면 '.list_emoticon' 클래스 이름 없이도 안전하게 로딩을 기다릴 수 있습니다.
    const firstItem = page.locator('a:below(:text("신규 이모티콘"))').first();
    await firstItem.waitFor({ state: 'visible' });

    // 3. 🚀 [마법의 DOM 등반] 
    // 첫 번째 아이템(a)의 부모(li)의 부모(ul 상자)로 두 칸 기어올라갑니다.
    // 이 상자 안에는 10개의 이모티콘이 좌->우 순서대로 예쁘게 정렬되어 있습니다!
    const gridBox = firstItem.locator('..').locator('..');

    // 4. 거리에 속지 않고, 그 상자 안에서 진짜 HTML 순서대로 i번째 링크를 찾습니다.
    const targetItem = gridBox.getByRole('link').nth(i);

    // 5. 텍스트 추출 및 출력 split('\n')[0]을 써서 이모티콘 이름만 깔끔하게 빼냅니다.
    const currentName = await targetItem.innerText();
    console.log(`[${i + 1}/10] 신규 이모티콘은 '${currentName.split('\n')[0]}' 입니다.`);

    // 6. 클릭 후 복귀
    await targetItem.click();
    await page.getByRole('link', { name: 'kakao emoticon shop' }).click();
    
    // 홈 화면으로 완전히 돌아올 때까지 대기
    await page.waitForURL('https://e.kakao.com/'); 
}
   //  
   const popularSection= page.getByText('인기 이모티콘').first();   

   // 2. 섹션이 보일 때까지 스크롤
   await popularSection.scrollIntoViewIfNeeded();

//    await page.getByRole('link', { name: '인기 이모티콘' }).click();
//    await page.getByRole('link', { name: 'kakao emoticon shop' }).click();

//    await popularSection.scrollIntoViewIfNeeded();

//    await popularSection.locator('.link_item').first().waitFor({ state: 'visible' });

//    const firstPopularItem = popularSection.locator('.link_item').first();
//    await firstPopularItem.waitFor({ state: 'visible', timeout: 10000 });

//    // 4. 이제 아이템들을 한꺼번에 가져옵니다. (안전하게 로딩된 상태!)
//    const items = await popularSection.locator('.link_item').all();
   

console.log('------------------------------------');
  });