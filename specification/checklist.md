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
  - [x] 連絡一覧取得 API
  - [x] 連絡詳細取得 API
  - [x] チーム確認状態更新 API
- [ ] Slack API連携
  - [ ] Slack APIクライアントセットアップ
  - [ ] メッセージ送信機能
  - [ ] 完了通知機能

## 4. フロントエンド実装
- [ ] レイアウト
  - [ ] ベースレイアウト作成
  - [ ] ナビゲーション実装
  - [ ] レスポンシブ対応
- [ ] ページ実装
  - [ ] ダッシュボード
    - [ ] 連絡一覧表示
    - [ ] ステータスフィルター
    - [ ] 進捗状況の可視化
  - [ ] 連絡作成フォーム
    - [ ] バリデーション
    - [ ] エラーハンドリング
  - [ ] 連絡詳細ページ
    - [ ] チーム確認状況表示
    - [ ] 確認報告機能
- [ ] コンポーネント実装
  - [ ] NotificationCard
  - [ ] ProgressIndicator
  - [ ] TeamConfirmationList
  - [ ] CreateNotificationForm

## 5. セキュリティ
- [ ] Cloudflare Zero Trust設定
- [ ] 環境変数の設定
  - [ ] Slack API Token
  - [ ] その他シークレット情報

## 6. テスト実装
- [ ] ユニットテスト
  - [ ] API Routes
  - [ ] データベース操作
  - [ ] Slack通知
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
