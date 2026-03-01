# PWA Bulletin Board (pwa-bbs)

## 概要
ユーザー主体の通知機能付きPWA掲示板。

## 起動方法

### 1. バックエンド (FastAPI)
別のターミナルで以下を実行します：
```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python app/main.py
```
※ APIは `http://localhost:8888` で起動します。

### 2. フロントエンド (React + Vite)
別のターミナルで以下を実行します：
```bash
cd frontend
npm install
npm run dev
```
※ ブラウザで `http://localhost:5173` (デフォルト) にアクセスします。

## 使い方
1. `/register` でユーザー登録を行います。
2. `/login` でログインします。
3. スレッドを作成したり、既存のスレッドに投稿したりできます。
4. PWAとしてインストールするには、ブラウザの「ホーム画面に追加」を選択します。

## 開発ルール (詳細は GEMINI.md を参照)
- 日本語でのコメント・出力を厳守。
- コミット時は `git add -A`, `git commit -m "何をしたか: なぜやったか"`, `git push` をセットで実行。
- 作業ログは `logs/WORK_LOG.md` に追記。
