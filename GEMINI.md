# GEMINI.md

## Overview
ユーザー主体の通知機能付きPWA掲示板。Twitter等のプラットフォームにおける情報過多や利権化を避け、シンプルかつ日常に役立つ情報提供（天気、交通、ニュース等）を通じてユーザーの定着を目指す。

## Goal
- 掲示板の基本機能（スレッド作成、書き込み、閲覧）の完備
- 自身のスレッド・返信に対する通知機能の実装
- 日常情報提供専用スレッド（お知らせ専用）の実装
- カテゴリ分け機能の実装
- PWA対応によるモバイルでの快適な閲覧体験

## Architecture
- **Type**: SPA (Single Page Application)
- **Frontend**: React, TypeScript, Vite
- **Backend**: Python, FastAPI
- **Database**: PostgreSQL (開発時はSQLite可)
- **Infrastructure**: Docker, Nginx (PWAサービスワーカー対応)

## Directory Structure
- `frontend/`: React + TypeScript + Vite ソースコード
- `backend/`: Python + FastAPI ソースコード
- `docs/`: 設計書・ドキュメント
- `scripts/`: 開発・デプロイ用スクリプト

## Key Files
- `frontend/src/App.tsx`: メインコンポーネント
- `frontend/src/service-worker.ts`: PWAサービスワーカー
- `backend/app/main.py`: エントリポイント
- `backend/app/models.py`: DBモデル
- `backend/app/schemas.py`: Pydanticスキーマ
- `backend/app/routers/`: ルーティング
- `Dockerfile` / `docker-compose.yml`: コンテナ定義

## Rules

### Must
- **通知設定**: 全ての通知はユーザーがON/OFFを切り替え可能にすること。
- **PWA準拠**: オフライン時のキャッシュ閲覧を可能にすること。
- **認証**: ユーザー認証を必須とし、匿名投稿は許可しない。（匿名を許容する場合も、通知はログインユーザーのみに制限する）
- **情報スレッド**: 日常情報提供スレッドは投稿不可の「読み取り専用」として実装すること。

### Must Not
- **プライバシー**: ユーザーの個人情報を不必要に収集しないこと。
- **広告/ポップアップ**: 過度な広告や利用を妨げるポップアップを配置しないこと。
- **SNS連携**: 他のSNSとの連携機能は原則として実装しないこと。
- **AI生成**: 投稿内容にAI自動生成コンテンツを強制的に表示しないこと。

## Conventions

### Commit Messages
コミットメッセージやプルリクエストの作成時は、以下の形式に従うこと。
`[Type]: [Subject]`

- `feat`: 新機能
- `fix`: バグ修正
- `docs`: ドキュメント
- `style`: コードスタイル変更
- `refactor`: リファクタリング
- `test`: テスト
- `chore`: その他

### Code Style
- **Frontend**: Prettierによる自動フォーマットを適用
- **Backend**: Blackによる自動フォーマットを適用
- **Naming**: 変数・関数名は、役割を自己説明的に示す明確な命名を行うこと。
