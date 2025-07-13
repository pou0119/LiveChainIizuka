// server.js

const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const app = express();
const port = 3000;

app.use(cors());
app.use(express.static('public'));

// SQLite DB接続
const db = new sqlite3.Database('places.db');

// 初回起動時にテーブル作成＆サンプルデータ投入
db.serialize(() => {
  // 施設テーブル
  db.run(`
    CREATE TABLE IF NOT EXISTS places (
      id TEXT PRIMARY KEY,
      name TEXT,
      description TEXT,
      imageUrl TEXT,
      ticketPrice INTEGER,
      nftPreviewImages TEXT,
      officialWebsite TEXT
    )
  `);

  // NFTコレクションテーブル
  db.run(`
    CREATE TABLE IF NOT EXISTS user_nfts (
      id TEXT PRIMARY KEY,
      userId TEXT,
      placeId TEXT,
      nftName TEXT,
      imageUrl TEXT,
      acquiredAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (placeId) REFERENCES places (id)
    )
  `);

  // サンプルデータ（必要に応じて初回のみ投入）
  db.get("SELECT COUNT(*) as count FROM places", (err, row) => {
    if (row.count === 0) {
      db.run(`
        INSERT INTO places (id, name, description, imageUrl, ticketPrice, nftPreviewImages, officialWebsite)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `, [
        'denemon-tei-123',
        '旧伊藤伝右衛門邸',
        '筑豊の炭鉱王と呼ばれた伊藤伝右衛門とその妻である白蓮が暮らした邸宅。広大な庭園と豪華な建物が見どころです。',
        'http://192.168.0.133:3000/denemon.png',
        500,
        JSON.stringify([
          'http://192.168.0.133:3000/nft1.png',
          'http://192.168.0.133:3000/nft2.png',
          'http://192.168.0.133:3000/nft3.png'
        ]),
        'https://www.kankou-iizuka.jp/denemon/'
      ]);
      db.run(`
        INSERT INTO places (id, name, description, imageUrl, ticketPrice, nftPreviewImages, officialWebsite)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `, [
        'kaho-gekijyo-456',
        '嘉穂劇場',
        '1931年に開場した歴史ある劇場。日本の伝統的な劇場建築様式を今に伝えています。',
        'http://192.168.0.133:3000/kaho.png',
        400,
        JSON.stringify([]),
        'https://kahogekijyo.com/'
      ]);
    }
  });

  // サンプルNFTデータ（mineraruユーザー用）
  db.get("SELECT COUNT(*) as count FROM user_nfts WHERE userId = 'mineraru'", (err, row) => {
    if (row.count === 0) {
      db.run(`
        INSERT INTO user_nfts (id, userId, placeId, nftName, imageUrl)
        VALUES (?, ?, ?, ?, ?)
      `, [
        'nft-001',
        'mineraru',
        'denemon-tei-123',
        '旧伊藤伝右衛門邸 - 春の庭園',
        'http://192.168.0.133:3000/nft1.png'
      ]);
      db.run(`
        INSERT INTO user_nfts (id, userId, placeId, nftName, imageUrl)
        VALUES (?, ?, ?, ?, ?)
      `, [
        'nft-002',
        'mineraru',
        'denemon-tei-123',
        '旧伊藤伝右衛門邸 - 秋の紅葉',
        'http://192.168.0.133:3000/nft2.png'
      ]);
      db.run(`
        INSERT INTO user_nfts (id, userId, placeId, nftName, imageUrl)
        VALUES (?, ?, ?, ?, ?)
      `, [
        'nft-003',
        'mineraru',
        'kaho-gekijyo-456',
        '嘉穂劇場 - 夜の外観',
        'http://192.168.0.133:3000/kaho.png'
      ]);
    }
  });
});

// 施設一覧API
app.get('/places', (req, res) => {
  db.all("SELECT * FROM places", (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    // nftPreviewImagesを配列に戻す
    rows.forEach(row => {
      row.nftPreviewImages = JSON.parse(row.nftPreviewImages || '[]');
    });
    res.json(rows);
  });
});

// 施設詳細API
app.get('/places/:id', (req, res) => {
  db.get("SELECT * FROM places WHERE id = ?", [req.params.id], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(404).json({ error: '施設が見つかりません' });
    row.nftPreviewImages = JSON.parse(row.nftPreviewImages || '[]');
    res.json(row);
  });
});

// ユーザーのNFTコレクション取得API
app.get('/users/:userId/nfts', (req, res) => {
  const userId = req.params.userId;
  
  db.all(`
    SELECT 
      un.id,
      un.nftName as name,
      un.imageUrl,
      p.name as placeName,
      un.acquiredAt
    FROM user_nfts un
    LEFT JOIN places p ON un.placeId = p.id
    WHERE un.userId = ?
    ORDER BY un.acquiredAt DESC
  `, [userId], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// NFT取得API（QRコードスキャン時に呼び出される）
app.post('/users/:userId/acquire-nft', (req, res) => {
  const userId = req.params.userId;
  const { placeId, nftName, imageUrl } = req.body;
  
  if (!placeId || !nftName || !imageUrl) {
    return res.status(400).json({ error: '必要なパラメータが不足しています' });
  }
  
  const nftId = `nft-${Date.now()}`;
  
  db.run(`
    INSERT INTO user_nfts (id, userId, placeId, nftName, imageUrl)
    VALUES (?, ?, ?, ?, ?)
  `, [nftId, userId, placeId, nftName, imageUrl], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    
    res.json({
      success: true,
      nftId: nftId,
      message: 'NFTを取得しました！'
    });
  });
});

app.listen(port, () => {
  console.log(`サーバーが http://localhost:${port} で起動しました。`);
});