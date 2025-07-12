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

app.listen(port, () => {
  console.log(`サーバーが http://localhost:${port} で起動しました。`);
});