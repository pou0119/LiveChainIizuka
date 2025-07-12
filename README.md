# LiveChain Iizuka

[//]: # (ここにアプリの簡単なキャッチコピーを記述)
福岡県飯塚市の「今」と「場所」をつなぐ、地域密着型NFTコレクションアプリです。

[//]: # (ここにアプリのスクリーンショット画像を配置すると、より分かりやすくなります。画像はassetsフォルダなどに入れておきましょう。)
![アプリのスクリーンショット](assets/images/app-screenshot-demo.png)

---

## 🌟 概要 (About The Project)

LiveChain Iizukaは、飯塚市内の観光スポットやイベントを巡りながら、その場所だけの特別なNFT（デジタル資産）を収集できるモバイルアプリケーションです。収集したNFTは「マイパスポート」画面でコレクションでき、飯塚での思い出を自分だけの形で記録・証明することができます。

## ✨ 主な機能 (Features)

* **インタラクティブマップ:** 飯塚市の地図を自由に探索できます。
* **現在地表示:** ユーザーの現在地をマップ上に表示し、周辺の情報を確認できます。
* **スポット情報:** 旧伊藤伝右衛門邸などの観光名所にカスタムマーカーを表示します。
* **NFTコレクション:** 訪れた場所で取得したNFTを「マイパスポート」画面で一覧表示・管理できます。
* **クライアント/サーバー構成:** Expo (React Native)製のアプリとNode.js (Express)製のサーバーが連携して動作します。

## 🛠️ 使用技術 (Built With)

### クライアントサイド
* [React Native](https://reactnative.dev/)
* [Expo](https://expo.dev/)
* [Expo Router](https://expo.github.io/router/)
* [TypeScript](https://www.typescriptlang.org/)
* [React Native Maps](https://github.com/react-native-maps/react-native-maps)
* [Expo Location](https://docs.expo.dev/versions/latest/sdk/location/)

### サーバーサイド
* [Node.js](https://nodejs.org/)
* [Express](https://expressjs.com/ja/)
* [CORS](https://www.npmjs.com/package/cors)

---

## 🚀 開発環境のセットアップ (Getting Started)

このプロジェクトをローカル環境で動かすための手順です。

### 必要なもの (Prerequisites)

* Node.js (v18.x 以上を推奨)
* npm または yarn
* Git

### インストール手順 (Installation)

1.  **リポジトリをクローン**
    ```sh
    git clone [https://github.com/pou0119/LiveChainIizuka.git](https://github.com/pou0119/LiveChainIizuka.git)
    cd LiveChainIizuka
    ```

2.  **クライアントの依存関係をインストール**
    ```sh
    cd client
    npm install
    ```

3.  **サーバーの依存関係をインストール**
    ```sh
    cd ../server
    npm install
    ```

4.  **環境変数の設定**
    `client`フォルダの直下に`.env`ファイルを作成し、Google MapsのAPIキーを設定してください。
    ```
    # client/.env
    Maps_API_KEY="YOUR_Maps_API_KEY"
    ```

---

## ▶️ 実行方法 (Usage)

本プロジェクトはクライアントとサーバーを同時に起動する必要があります。ターミナルを2つ開いて、それぞれ以下のコマンドを実行してください。

1.  **サーバーを起動 (ターミナル1)**
    ```sh
    cd server
    npm start 
    ```
    > `package.json`に`"start": "node server.js"`を追加すると便利です。

2.  **クライアントを起動 (ターミナル2)**
    ```sh
    cd client
    npx expo start
    ```
    表示されたQRコードをExpo Goアプリでスキャンするか、シミュレータで起動してください。

---

[//]: # (今後の開発計画などがあればここに記述)
## 🗺️ ロードマップ (Roadmap)

* [ ] ユーザー認証機能の実装
* [ ] データベースとの接続
* [ ] NFT取得ロジックの実装
* [ ] さらなるスポットの追加

---

[//]: # (あなたのGitHubプロフィールへのリンクなどを記載)
## 👤 製作者 (Author)

* **pou0119** - [GitHub](https://github.com/pou0119)