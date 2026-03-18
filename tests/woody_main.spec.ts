import { test } from '@playwright/test';
import { KakaoEmoticonPage_New } from '../POM/woody_pom';
import { Rex } from '../POM/rex_pom';
import { EmoticonHot } from '../POM/shannon_hot';
import { Harry } from '../POM/harry_pom';

// 1번 방식
// [test.describe]란? (역할: 여러 개의 테스트(test)를 하나로 묶어주는 '커다란 보관함' 혹은 '그룹')
test.describe('카카오 이모티콘 페이지 통합 테스트', () => {
    // 시간을 무한대로 가져감 (기본 30초)
    test.setTimeout(0);
    // beforeEach라는 이름 자체가 각 함수 별 테스트(Each test)가 시작되기 전(Before)에 자동으로 실행해라
    test.beforeEach(async ({ page }) => {
        await page.goto('https://e.kakao.com/');
    });

    test('우디 시나리오', async ({ page }) => {
        // test 함수 안에서 const로 바로 만듭니다. (let 필요 없음)
        const woody = new KakaoEmoticonPage_New(page);
        await woody.runNewFlow();
    });

    test('렉스 시나리오', async ({ page }) => {
        // test 함수 안에서 const로 바로 만듭니다. (let 필요 없음)
        const rex = new Rex(page);
        await rex.runEmoticonTest();
    });

    test('섀넌 시나리오', async ({ page }) => {
        // test 함수 안에서 const로 바로 만듭니다. (let 필요 없음)
        const shannon = new EmoticonHot(page);
        await shannon.runHotTopsFlow();
    });
});


// 2번 방식
// [test.describe]란? (역할: 여러 개의 테스트(test)를 하나로 묶어주는 '커다란 보관함' 혹은 '그룹')
test.describe('카카오 이모티콘 페이지 통합 테스트', () => {
    // 시간을 무한대로 가져감 (기본 30초)
    test.setTimeout(0);
    // [1. 변수 미리 선언 (이름표 만들기) / 이렇게 밖에 꺼내놔야 아래에 있는 개별 test 함수들이 이 이름들을 인식할 수 있음
    // 선언 (let woody: Class;): "woody라는 변수를 만들 건데, 이건 앞으로 Class 타입만 들어올 거야." (이름표 달기)
    let woody: KakaoEmoticonPage_New;
    let rex: Rex;
    let shannon: EmoticonHot;
    let harry: Harry;
    
    // beforeEach + let 이 방식은 매 테스트(test)가 시작되기 바로 직전에 코드를 실행 (const랑 비슷하나 매번 선언해줄 필요가 없어서 편함)
    test.beforeEach(async ({ page, context }) => {
        // [2. 내용물 채우기] 시작 전마다 3명 모두 세팅 + 홈 이동
        // 초기화 woody = new Class(page);실제로 객체를 생성해서 변수에 집어넣음. (내용물 채우기)
        woody = new KakaoEmoticonPage_New(page);
        rex = new Rex(page);
        shannon = new EmoticonHot(page);
        harry = new Harry(page);
        await page.goto('https://e.kakao.com/', { waitUntil: 'networkidle' });
    });

    // 각 test 함수 안에 { page }를 명시해주는 것이 Playwright의 정석입니다.
    test('우디 시나리오_1', async ({ }) => {
        await woody.runNewFlow(); 
    });

    test('렉스 시나리오_1', async ({ }) => {
        await rex.runEmoticonTest(); 
    });

    test('섀넌 시나리오_1', async ({ }) => {
        await shannon.runHotTopsFlow(); 
    });

    test('해리 시나리오_1', async ({ }) => {
        await harry.runNewFlow();
    });
});