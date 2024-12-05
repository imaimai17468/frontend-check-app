import { expect, test } from '@playwright/test';

test('連絡作成フロー', async ({ page }) => {
  // ホームページにアクセス
  await page.goto('/');

  // 新規連絡作成ページに移動
  await page.click('text=新規連絡作成');
  await expect(page).toHaveURL('/notifications/create');

  // フォームに入力
  await page.fill('input[name="title"]', 'テスト連絡');
  await page.fill('textarea[name="content"]', 'テスト内容です');
  await page.click('text=フロントエンドチーム1');

  // フォームを送信
  await page.click('button[type="submit"]');

  // 送信成功のトーストメッセージを確認
  await expect(page.getByText('連絡を作成しました')).toBeVisible();

  // ホームページにリダイレクトされることを確認
  await expect(page).toHaveURL('/');

  // 作成した連絡が一覧に表示されることを確認
  await expect(page.getByText('テスト連絡')).toBeVisible();
});
