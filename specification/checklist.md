# フロントエンドギルド連絡確認ツール 実装チェックリスト

## 1. 初期セットアップ
- [x] プロジェクトの初期化
  - [x] `bun create next-app`でプロジェクト作成
  - [x] TypeScript設定
  - [x] Tailwind設定
  - [x] Biome設定
    - [x] ESLint設定の削除
    - [x] Prettier設定の削除
    - [x] biome.json作成
  - [x] lefthook設定
    - [x] lefthookのインストール
    - [x] Git Hooks設定
  - [x] shadcnのセットアップ
  - [x] Cloudflare D1のセットアップ
    - [x] wranglerのインストール
    - [x] D1データベースの作成
    - [x] wrangler.tomlの設定
  - [x] Drizzle ORMのセットアップ
    - [x] drizzle-ormのインストール
    - [x] drizzle-kitのインストール
    - [x] drizzle.config.tsの設定
    - [x] スキーマの定義
    - [x] マイグレーションの実行
  - [x] zodのセットアップ
    - [x] zodのインストール
    - [x] スキーマ定義
    - [x] 型の出力

## 2. データベース設計と実装
- [x] スキーマ定義（Drizzle）
  - [x] notifications テーブル
    - id (uuid)
    - title (string)
    - content (text)
    - created_at (datetime)
    - created_by (string)
    - status (enum: 'in_progress', 'completed')
  - [x] team_confirmations テーブル
    - id (uuid)
    - notification_id (uuid, foreign key)
    - team_mention (string)
    - status (enum: 'pending', 'confirmed')
    - confirmed_at (datetime, nullable)
  - [x] teams テーブル
    - id (uuid)
    - name (string)
    - slack_mention (string)
- [x] マイグレーションファイルの作成
- [x] シードデータの作成（チーム情報）

## 3. バックエンド実装
- [x] API Routes実装
  - [x] 連絡作成 API
    - [x] zodバリデーション
    - [x] エラーハンドリング
  - [x] 連絡一覧取得 API
    - [x] クエリパラメータバリデーション
    - [x] エラーハンドリング
  - [x] 連絡詳細取得 API
  - [x] チーム確認状態更新 API
    - [x] zodバリデーション
    - [x] エラーハンドリング
- [x] Slack API連携
  - [x] Slack APIクライアントセットアップ
    - [x] @slack/web-apiのインストール
    - [x] SlackClientクラスの実装
  - [x] メッセージ送信機能
    - [x] 通知作成時の送信
    - [x] メッセージテンプレート作成
  - [x] 完了通知機能
    - [x] 全チーム確認完了時の通知
    - [x] 完了通知テンプレート作成

## 4. フロントエンド実装
- [x] レイアウト
  - [x] ベースレイアウト作成
    - [x] RootLayout
    - [x] MainLayout
    - [x] Header
  - [x] ナビゲーション実装
    - [x] ホームリンク
    - [x] 新規連絡作成リンク
  - [x] レスポンシブ対応
    - [x] コンテナ設定
    - [x] ヘッダーレスポンシブ対応
- [x] アーキテクチャ設計
  - [x] Server Components優先
    - [x] ページコンポーネントをServer Componentとして実装
    - [x] Client Componentは必要な場合のみ葉で使用
  - [x] ページロジックの分離
    - [x] appディレクトリのページからロジックを分離
    - [x] 専用のページコンポーネントを作成
  - [x] ローディング状態の実装
    - [x] Suspenseによるローディング制御
    - [x] スケルトンUIの実装
- [x] ページ実装
  - [x] ダッシュボード
    - [x] 連絡一覧表示
    - [x] ステータスフィルター
    - [x] 進捗状況の可視化
  - [x] 連絡作成フォーム
    - [x] zodバリデーション
    - [x] エラーメッセージの表示
    - [x] 送信中の状態管理
  - [x] 連絡詳細ページ
    - [x] チーム確認状況表示
    - [x] 確認報告機能
- [x] コンポーネント実装
  - [x] NotificationCard
    - [x] カードレイアウト
    - [x] ステータスバッジ
    - [x] 進捗バー
  - [x] ProgressIndicator
  - [x] TeamConfirmationList
    - [x] 確認状況カード
    - [x] 確認ボタン
    - [x] 更新処理
  - [x] CreateNotificationForm
    - [x] フォームレイアウト
    - [x] チーム選択UI
    - [x] 送信処理

## 5. セキュリティ
- [ ] Cloudflare Zero Trust設定
- [x] 環境変数の設定
  - [x] Slack API Token
  - [ ] その他シークレット情報

## 6. テスト実装
- [x] ユニットテスト
  - [x] API Routes
  - [ ] データベース操作（保留）
  - [ ] Slack通知（保留）
  - [x] zodスキーマ
  - [x] コンポーネント
    - [x] NotificationCard
    - [x] TeamConfirmationCard
    - [x] CreateNotificationForm
    - [x] NotificationDetail
    - [x] Dashboard
- [ ] E2Eテスト
  - [ ] 連絡作成フロー
  - [ ] 確認報告フロー

## 7. デプロイメント
- [ ] Cloudflareへのデプロイ設定
- [ ] CI/CD設定
- [ ] 本番環境の環境変数設定

## 8. ドキュメント
- [ ] README更新
- [ ] API仕様書作成
- [ ] 環境構築手順書作成
- [ ] 運用マニュアル作成
