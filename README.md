<p align="center">
  <svg xmlns="http://www.w3.org/2000/svg" width="640" height="88" viewBox="0 0 640 88" role="img" aria-label="Green Channel Web 配信サブウィンドウ">
    <defs>
      <linearGradient id="gch-banner-grad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#129954"/>
        <stop offset="1" stop-color="#0d7a3d"/>
      </linearGradient>
    </defs>
    <rect width="640" height="88" rx="6" fill="url(#gch-banner-grad)"/>
    <text x="320" y="38" text-anchor="middle" fill="#fff" font-family="Segoe UI, Roboto, Hiragino Sans, Meiryo, sans-serif" font-size="20" font-weight="700">Green Channel Web 配信サブウィンドウ</text>
    <text x="320" y="64" text-anchor="middle" fill="#e8fff0" font-family="Segoe UI, Roboto, Hiragino Sans, Meiryo, sans-serif" font-size="13">Chrome / Edge 拡張機能 · 非公式</text>
  </svg>
</p>

## Green Channel Web 配信サブウィンドウ

[グリーンチャンネルWeb](https://sp.gch.jp/) のライブ配信ページで、各チャンネルの映像を**別ウィンドウ**に切り出して表示する拡張機能です。

- **グリーンチャンネル風レイアウトで読む**：[readme.html](./readme.html) をブラウザで開く  
- **プライバシーポリシー**：[privacy.html](./privacy.html)

---

## 重要：非公式であること

本拡張は **JRA・グリーンチャンネル公式の提供物ではありません**。利用規約・著作権は [グリーンチャンネルWeb](https://sp.gch.jp/) および関連サイトの定めに従ってください。公式サポートの対象外です。

---

## 主な機能

| 内容 | 説明 |
|------|------|
| **サブウィンドウで開く** | 1ch〜5ch のタブ付近にボタンを追加し、選択チャンネルをポップアップ型ウィンドウで開きます。 |
| **映像中心表示** | 別ウィンドウではヘッダー・フッター等を隠し、プレイヤー周りを画面いっぱいに近い形で表示します。 |
| **配信休止時** | サイト側でチャンネルが `disabled` または番組名に「休止」がある場合、ボタンを押せないようにします。 |
| **タブバー削減** | `chrome.windows` API の `popup` 型で開き、通常タブより UI がコンパクトになります。 |

---

## 動作環境

- Google **Chrome** または Microsoft **Edge**（Chromium 系、Manifest V3 対応）
- 対象サイト：`https://sp.gch.jp/*`

---

## インストール（開発用・未パッケージ）

1. `chrome://extensions`（Edge は `edge://extensions`）を開く  
2. **デベロッパーモード**をオン  
3. **パッケージ化されていない拡張機能を読み込む**で、フォルダ **`grcEx`** を指定  

※ リポジトリ直下に `grcEx` があり、その中に `manifest.json` があります。

---

## 使い方

1. [グリーンチャンネルWeb](https://sp.gch.jp/) にログインし、ライブ配信トップを表示します。  
2. チャンネル（1ch〜5ch）の下に表示される **「サブウィンドウで開く」** を押します。  
3. 別ウィンドウが開いたら、そこで該当チャンネルが選ばれた状態のプレイヤーが表示されます。  

ポップアップがブロックされる場合は、当該サイトでポップアップを許可してください。

---

## ファイル構成（概要）

| パス | 役割 |
|------|------|
| `grcEx/manifest.json` | 拡張の定義（権限・バックグラウンド・コンテンツスクリプト） |
| `grcEx/content.js` | ボタン表示・チャンネル同期・メッセージ送信 |
| `grcEx/background.js` | ポップアップウィンドウの作成 |
| `grcEx/inject.css` | ボタン配置・サブウィンドウ用の表示調整 |
| `gch-pages.css` | **readme.html** / **privacy.html** 向けの共通スタイル（グリーンチャンネル風） |
| `readme.html` | README 本文のブラウザ表示版 |
| `privacy.html` | プライバシーポリシー |

---

## 権限について（要約）

- **`windows`** … ポップアップ型の別ウィンドウを開くため  
- **コンテンツスクリプト（sp.gch.jp）** … ボタン追加とページ上のチャンネル状態の参照のみ  

詳細は [**プライバシーポリシー**](./privacy.html) を参照してください。

---

## 既知の制限・注意

- 一般の HTTPS ページでは、ブラウザの仕様上 **アドレスバーを完全に非表示にすることはできません**。  
- サブウィンドウ内の映像は、ウィンドウの縦横比に合わせ **`object-fit: cover`** で左右の余白を抑える調整をしています（上下がわずかにトリミングされる場合があります）。  
- プレイヤーが iframe 主体の場合、内側の描画までは CSS で制御できないことがあります。  

---

## ライセンス

未指定の場合は、リポジトリに `LICENSE` が追加されるまで利用条件は未定です。配布・改変する場合は制作者の意向に従ってください。

---

> ドキュメント（`readme.html` / `privacy.html`）の配色・構成は、サービス案内の参考として [グリーンチャンネルWeb](https://sp.gch.jp/) の雰囲気に寄せています（公式デザインの複製ではありません）。
