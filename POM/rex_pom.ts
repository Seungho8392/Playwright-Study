<<<<<<< HEAD
import { test, expect } from '@playwright/test';
/*
// 브라우저 설정: 전체 화면 및 팝업 차단
test.use({
    // viewport: null 대신 명시적인 해상도를 설정합니다.
    viewport: { width: 2560, height: 14400 }, 
    launchOptions: {
      slowMo: 700, 
      args: [
        '--start-maximized', 
        '--disable-notifications'
      ]
    }
  });
*/
test('스타일 카테고리 4사이클 테스트 (최종 안정화 및 타임아웃 해결)', async ({ page }) => {
  // 전체 테스트 시간을 2분으로 늘립니다 (여유 있는 확인을 위해)
  test.setTimeout(120000);
  
  const checkLoginAndReturn = async (cycleName: string) => {
    const actionButton = page.getByRole('button', { name: /구매|선물|사용|다운로드/ }).first();
=======
import { Page, expect } from '@playwright/test';

export class Rex {
  readonly page: Page;

  // 1. 실행할 섹션 목록을 클래스 내부에 상수로 관리
  readonly sections = ['미니 이모티콘', 'MD추천', '캐릭터', '스타'];

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * ✅ 메인 실행 메서드
   * 이 메서드가 호출되면 클래스 내부에 정의된 sections를 바탕으로 4사이클을 수행합니다.
   */
  async runEmoticonTest() {
    for (let i = 0; i < this.sections.length; i++) {
      const sectionName = this.sections[i];
      console.log(`\n🚀 [Cycle ${i + 1}] ${sectionName} 시작`);
      
      // 내부 메서드들을 순서대로 호출
      await this.navigateToSection(sectionName);
      await this.clickRandomProduct(`Cycle ${i + 1}`);
      await this.checkLoginAndReturn(`Cycle ${i + 1}`);
    }
    console.log('\n🎉 모든 테스트가 성공적으로 완료되었습니다!');
  }

  // --- 기존 로직 함수들 (수정 없이 그대로 유지) ---

  async checkLoginAndReturn(cycleName: string) {
    const actionButton = this.page.getByRole('button', { name: /구매|선물|사용|다운로드/ }).first();
>>>>>>> temp-branch
    await actionButton.waitFor({ state: 'visible', timeout: 15000 });
    
    console.log(`👆 [${cycleName}] 버튼 확인됨, 클릭 시도`);
    await this.page.waitForTimeout(1000);
    await actionButton.click();
    
    await this.page.waitForURL(/accounts\.kakao\.com/, { timeout: 20000 });
    console.log(`🔐 [${cycleName}] 로그인 페이지 진입`);
    await this.page.waitForTimeout(1500);

    console.log(`🔄 [${cycleName}] 스타일 페이지로 돌아갑니다...`);
    await this.page.goto('https://e.kakao.com/item/style', { waitUntil: 'networkidle' });
    await this.page.waitForTimeout(2000);
  }

<<<<<<< HEAD
  const navigateToSection = async (sectionName: string) => {
    console.log(`🔍 ${sectionName} 섹션 찾는 중...`);

    // 1. 가장 단순하고 강력한 텍스트 기반 로케이터
    // 텍스트를 포함하고 있는 'a' 태그나 'button', 혹은 클릭 가능한 요소를 타겟팅합니다.
    const tab = page.locator(`a:has-text("${sectionName}"), li:has-text("${sectionName}")`).last();

    // 2. 스크롤을 굳이 하지 않고, 일단 버튼이 나타날 때까지 기다립니다.
    // 스타일 페이지는 상단 탭이 고정되어 있을 확률이 높습니다.
    try {
      await tab.waitFor({ state: 'attached', timeout: 5000 });
      
      // 화면에 보이지 않아도 강제로 클릭 (force: true)
      // 클릭 전 요소가 가려져 있다면 scrollIntoView가 방해될 수 있으므로 바로 클릭 시도
      console.log(`✨ ${sectionName} 섹션 클릭 시도!`);
      await tab.click({ force: true });
      
      // 클릭 후 데이터 로드 대기
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(2000);
      return; 
    } catch (e) {
      console.log(`📜 기본 방법 실패, 대체 방법으로 ${sectionName} 찾는 중...`);
      // 3. 만약 실패하면 '텍스트' 자체를 찾아서 클릭
      await page.getByText(sectionName).first().click({ force: true });
      await page.waitForTimeout(2000);
    }
  };
  const clickRandomProduct = async (cycleName: string) => {
    console.log(`🔍 [${cycleName}] 상품 리스트 갱신 확인 중...`);

    // 1. 이전 섹션의 데이터가 사라지고 새 데이터가 로드될 때까지 충분히 대기
    // 네트워크 유휴 상태뿐만 아니라 DOM이 안정화될 시간을 줍니다.
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000); 

    const productLinks = page.locator('ul[class*="list_emoticon"] li a, .item_list li a');

    // 2. ✨ 핵심: 스크롤을 끝까지 내렸다가 다시 올려서 리스트를 강제로 갱신(Hydration) 시킵니다.
    await page.mouse.wheel(0, 500);
    await page.waitForTimeout(500);
    await page.mouse.wheel(0, -500);

    await expect(async () => {
      const currentCount = await productLinks.count();
      console.log(`📡 [${cycleName}] 발견된 상품 수: ${currentCount}개`);
      expect(currentCount).toBeGreaterThan(0);
    }).toPass({ timeout: 15000 });

    const totalCount = await productLinks.count();
    // 0번째 상품은 간혹 광고나 배너일 수 있으므로 2번째~20번째 사이를 추천합니다.
    const randomIndex = Math.floor(Math.random() * Math.min(totalCount - 1, 20)) + 1;
    const targetProduct = productLinks.nth(randomIndex);

    console.log(`🎯 [${cycleName}] ${randomIndex + 1}번째 상품 클릭 시도`);
    
    // 3. 클릭 직전 요소가 클릭 가능한 상태인지 재확인
    await targetProduct.scrollIntoViewIfNeeded();
    await page.waitForTimeout(1000); 
    
    // 4. 상세 페이지 이동 대기 로직 강화
    try {
      console.log(`👆 [${cycleName}] 상세 페이지 URL 대기 시작...`);
      // 클릭과 동시에 URL 변화를 감시합니다.
      const clickAction = targetProduct.click({ force: true, delay: 100 });
      const navigationPromise = page.waitForURL(/\/(item|t)\//, { timeout: 20000 });
      
      await Promise.all([navigationPromise, clickAction]);
      console.log(`✅ [${cycleName}] 상세 페이지 진입 성공`);
    } catch (error) {
      console.log(`⚠️ [${cycleName}] 이동 실패 또는 타임아웃. 좌표 직접 클릭 시도...`);
      // 클릭이 씹히는 경우를 대비해 해당 요소의 중앙 좌표를 직접 클릭
      const box = await targetProduct.boundingBox();
      if (box) {
        await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);
      }
      await page.waitForURL(/\/(item|t)\//, { timeout: 15000 });
    }
  };
  // --- 메인 흐름 ---
  await page.goto('https://e.kakao.com/item/style', { waitUntil: 'networkidle' });

  const sections = ['미니 이모티콘', 'MD추천', '캐릭터', '스타'];

  for (let i = 0; i < sections.length; i++) {
    const sectionName = sections[i];
    console.log(`\n🚀 [Cycle ${i + 1}] ${sectionName} 시작`);
    
    await navigateToSection(sectionName);
    await clickRandomProduct(`Cycle ${i + 1}`);
    await checkLoginAndReturn(`Cycle ${i + 1}`);
  }

  console.log('\n🎉 모든 4사이클 테스트가 성공적으로 완료되었습니다!');
});
=======
  async navigateToSection(sectionName: string) {
    let isVisible = false;
    let scrollAttempts = 0;
    const sectionRegex = new RegExp(sectionName.replace('#', ''), 'i');
    
    while (!isVisible && scrollAttempts < 15) {
      const header = this.page.getByRole('link', { name: sectionRegex }).first();
      
      if (await header.isVisible()) {
        await header.scrollIntoViewIfNeeded();
        await this.page.waitForTimeout(1000);
        isVisible = true;
        console.log(`✨ ${sectionName} 섹션 클릭!`);
        await header.click();
        
        await this.page.waitForLoadState('networkidle');
        await this.page.waitForTimeout(2000); 
      } else {
        console.log(`📜 ${sectionName} 찾는 중... 스크롤`);
        await this.page.mouse.wheel(0, 800);
        await this.page.waitForTimeout(1000);
        scrollAttempts++;
      }
    }
  }

  async clickRandomProduct(cycleName: string) {
    // 1. 상품 링크 선택자 (좀 더 포괄적으로 수정 가능)
    const productLinks = this.page.locator('a[href*="/t/"], a[href*="/item/"]');
  
    console.log(`🔍 [${cycleName}] 상품 리스트 로딩 확인 중...`);
  
    // 2. 최소 하나 이상의 상품이 보일 때까지 명시적 대기 추가
    try {
      await productLinks.first().waitFor({ state: 'visible', timeout: 10000 });
    } catch (e) {
      console.log(`⚠️ [${cycleName}] 상품이 즉시 보이지 않아 스크롤을 시도합니다.`);
    }
  
    // 3. 기존의 toPass 로직 (개수 확인)
    await expect(async () => {
      // 스크롤을 좀 더 과감하게 수행하여 로딩 유도
      await this.page.mouse.wheel(0, 1000); 
      await this.page.waitForTimeout(1000);
      
      const currentCount = await productLinks.count();
      console.log(`📊 [${cycleName}] 현재 발견된 상품 수: ${currentCount}`);
      
      // 만약 특정 섹션만 상품 수가 적을 수 있다면 조건을 0보다 크게로 완화해볼 수 있습니다.
      expect(currentCount).toBeGreaterThan(0); 
    }).toPass({ timeout: 20000, intervals: [2000] });
  
    const totalCount = await productLinks.count();
    // ... 이후 동일
  }
}
>>>>>>> temp-branch
