// server.js

const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;

app.use(cors());

// 1. 'public'フォルダを外部に公開する設定
//    （この設定により、http://.../nft1.png のようなURLで画像にアクセスできる）
app.use(express.static('public'));


// 2. ダミーデータでは、その公開URLを指定する
const dummyNfts = [
  { id: '1', name: '旧伊藤伝右衛門邸', imageUrl: 'http://192.168.0.133:3000/nft1.png' },
  // 他のNFTも同様に http://... から始まるURLにする
];

// ...（以下のAPIエンドポイントとサーバー起動のコードは同じ）
app.get('/users/:userId/nfts', (req, res) => {
  console.log(`${req.params.userId} のNFTデータへのリクエストを受け取りました。`);
  res.json(dummyNfts);
});

app.listen(port, () => {
  console.log(`サーバーが http://localhost:${port} で起動しました。`);
});