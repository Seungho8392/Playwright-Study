import { test } from "@playwright/test";
import { KakaoEmoticonPage_New } from "../POM/woody_pom";
import { Rex } from "../POM/rex_pom";
import { EmoticonHot } from "../POM/shannon_hot";

// 여러 테스트를 하나의 그룹으로 묶는 공간
test.describe("카카오 이모티콘샵 통합 테스트", () => {
  // 테스트 전체 실행 시간을 2분으로 설정
  test.setTimeout(120000);

  // 각 POM 객체를 담을 변수를 미리 선언
  // beforeEach에서 실제 객체를 생성한다
  let woody: KakaoEmoticonPage_New;
  let rex: Rex;
  let hot: EmoticonHot;

  // 각 테스트가 시작되기 전에 실행되는 공통 작업
  test.beforeEach(async ({ page }) => {
    // 카카오 이모티콘샵 메인 페이지 진입
    await page.goto("https://e.kakao.com/", { waitUntil: "networkidle" });

    // 각 테스트에서 사용할 POM 객체 생성
    woody = new KakaoEmoticonPage_New(page);
    rex = new Rex(page);
    hot = new EmoticonHot(page);
  });

  // 우디 시나리오
  test("우디 신규 이모티콘 플로우", async () => {
    // 우디가 만든 신규 이모티콘 테스트 실행
    await test.step("신규 이모티콘 페이지 흐름 확인", async () => {
      await woody.runNewFlow();
    });
  });

  // 거니 시나리오
  test("거니 스타일 이모티콘 테스트", async () => {
    // 거니가 만든 스타일 페이지 테스트 실행
    await test.step("스타일 페이지 이모티콘 검증", async () => {
      await rex.runEmoticonTest();
    });
  });

  // 섀넌 시나리오 (HOT)
  test("섀넌 인기 HOT 이모티콘 검증", async () => {
    await test.step("HOT 페이지 1위 + 500위 검증", async () => {
      // 리포트에 테스트 이름 표시하기 위해 step 사용
      await hot.runHotTopsFlow();
    });
  });
});
