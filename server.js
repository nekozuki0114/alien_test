// expressモジュールを読み込む
const express = require('express');


// expressアプリを生成する
const app = express();

app.set('port', (process.env.PORT || 5000));
app.use(express.static('public'));
// ルート（http://localhost/）にアクセスしてきたときに「Hello」を返す
app.get('/', (req, res) => res.sendFile(__dirname + "/index.html"));

//サーバを立てる
app.listen(app.get('port'), () => console.log('Listening on port'+app.get('port')));
