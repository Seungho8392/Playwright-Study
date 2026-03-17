import {Page, expect } from '@playwright/test';

export class Harry {
    readonly page: Page;

    constructor(page: Page){
        this.page = page;
    }

    async gotoHome(){
        await this.page.goto("https://e.kakao.com");
    }

    async checkBanners(){
        console.log('---------------------------배너 영역---------------------------')
        const bannerCount = 2; // 혹은 버튼 개수를 카운트해서 유동적으로 변경 가능
        for (let i = 0; i < bannerCount; i++) {
            await this.page.getByRole('button', { name: 'NaN 번째 콘텐츠' }).nth(i).click();
            const banner = this.page.getByRole('link', { name: '링크배너' }).first();   
            
            const page1Promise = this.page.waitForEvent('popup');
            await banner.click();
            const popup = await page1Promise;

            const title = await popup.title();
            console.log(` - 배너${i + 1} 이름 : ${title}`);
            console.log()
            await popup.close();
        }
    }

    async verfiyNewEmoticons(){
        console.log('---------------------------신규 이모티콘 영역---------------------------')
        const firstItem = this.page.locator('a:below(:text("신규 이모티콘"))').first();
        await firstItem.waitFor({ state: 'visible' });
        const items = firstItem.locator('..').locator('..').getByRole('link');

        const emoticonList = [];
        const count = await items.count();
        for (let i = 0; i < Math.min(count, 10); i++) {
            const text = await items.nth(i).innerText();
            const href = await items.nth(i).getAttribute('href') || '';
            emoticonList.push({
                name: text.replace('소리켜짐', '').split('\n')[0].trim(),
                url: href.startsWith('http') ? href : `https://e.kakao.com${href}`
        });
    }

    const sampled = emoticonList.sort(() => 0.5 - Math.random()).slice(0, 2);
    for (const item of sampled) {
      console.log(`🎲 랜덤 검증 대상: [${item.name}]`);
      await this.page.goto(item.url);
      const titleLocator = this.page.getByRole('heading', { name: item.name }).first();
      
      try {
        await titleLocator.waitFor({ state: 'visible', timeout: 3000 });
        console.log(`   ✅ 검증 성공: 상세페이지 확인!`);
        console.log()
      } catch {
        await expect(this.page.getByText(item.name).first()).toBeVisible();
        console.log(`   ✅ 검증 성공: 전체 텍스트 확인!`);
        console.log()
      }
      await this.page.getByRole('link', { name: 'kakao emoticon shop' }).click();
    }
  }

  async checkPopularEmoticons() {
    console.log('--------------------------인기 이모티콘 영역-------------------------');
    for (let i = 0; i < 10; i++) {
      await this.gotoHome();
      const targetBox = this.page.locator('li:has(a[href*="/t/"])').nth(i);
      await targetBox.scrollIntoViewIfNeeded();
      
      const rawText = await targetBox.innerText();
      const cleanLines = rawText.replace('소리켜짐', '').split('\n').map(l => l.trim()).filter(l => l);
      const emoName = cleanLines.length > 1 ? cleanLines[1] : cleanLines[0];
      
      console.log(`현재 인기 ${i + 1}위 이모티콘 : '${emoName}'`);
      console.log()
      await targetBox.locator('a').first().click();
      await this.page.waitForURL(/\/t\//);
    }
  }

  async printStyleTags() {
    console.log('-----------------------------스타일 영역----------------------------');
    await this.gotoHome();
    const styleTags = this.page.locator('a:below(:text("스타일"))').filter({ hasText: /[가-힣a-zA-Z]/ });
    for (let i = 0; i < 3; i++) {
      const tagName = (await styleTags.nth(i).innerText()).replace(/\n/g, ' ').trim();
      console.log(`${i + 1}번째 스타일은 '${tagName}' 입니다.`);
      console.log()
    }
  }
}