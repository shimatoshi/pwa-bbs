# PWA-BBS 開発・トラブルシューティング ログ (2025-03-05)

## 1. 概要
Termux環境における `pwa-bbs` バックエンドのセットアップ中に発生したビルドエラーの解決と、環境最適化の記録。

## 2. 発生していた問題
- **事象**: `pip install -r requirements.txt` 実行時にビルドが失敗し、バックエンドが立ち上がらない。
- **原因**: 
    - `cryptography` および `bcrypt` のビルドに必要なシステムライブラリ（Rust, OpenSSL, libffi等）が不足していた。
    - `python-jose[cryptography]` のように、Termux環境ではビルドが重い、あるいは複雑な依存関係が含まれていた。

## 3. 実施した対策

### A. 依存関係の軽量化 (`backend/requirements.txt`)
ビルドエラーを回避し、かつ機能を維持するために以下の修正を行った。
- `python-jose[cryptography]` → `python-jose`
    - JWTの署名にHS256（対称鍵）のみを使用しているため、重い `cryptography` ライブラリを不要とした。
- `passlib[bcrypt]` → `bcrypt`
    - `auth.py` 内で `passlib` を介さず直接 `bcrypt` を使用していたため、依存関係を整理。

### B. ビルド環境の整備
Termuxでネイティブモジュールをビルドするために必要なパッケージを特定。
```bash
pkg update -y && pkg install -y rust binutils openssl libffi python-pip build-essential
```

## 4. 実行結果
- **バックエンド**: `requirements.txt` のインストールに成功し、`./start_api.sh` にてポート `8888` で正常稼働を確認。
- **フロントエンド**: バックエンドとの通信、スレッド作成、書き込み等の基本機能が正常に動作することを確認。

## 5. Git 連携
修正内容をリポジトリに反映。
- **コミットメッセージ**: `fix: Termux環境でのビルドエラー回避のためrequirements.txtを軽量化`
- **プッシュ先**: `origin master` (upstream 設定済み)

## 6. 結論 (Frog 性能保証)
本対応により、リソースの限られたモバイル環境（Termux）においても、適切なライブラリ選択と環境構築手順を踏むことで、モダンなPWA（FastAPI + React）がフルスタックで動作することが実証された。

---
**作成者**: Japanese-Developer Agent (Frog)
**場所**: `pwa-bbs/docs/troubleshooting_log_20250305.md`
