const cors = require('cors');
// expressモジュールを読み込む
const express = require('express');


// expressアプリを生成する
const app = express();

app.set('port', (process.env.PORT || 5000));
app.use(express.static('public'));
app.use(cors());
// ルート（http://localhost/）にアクセスしてきたときに"/index.html"を返す
app.get('/', (req, res) => res.sendFile(__dirname + "/test.html"));
app.get('/test', (req, res) => res.sendFile(__dirname + "/public/face/index.html"));
app.get('/three', (req, res) => res.sendFile(__dirname + "/test.html"));


//サーバを立てる
app.listen(app.get('port'), () => console.log('Listening on port'+app.get('port')));
