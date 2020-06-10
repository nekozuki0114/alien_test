// もろもろの準備
var video = document.getElementById("js-local-stream");           // video 要素を取得
var canvas = document.getElementById("canvas");         // canvas 要素の取得
var context = canvas.getContext("2d");                  // canvas の context の取得
var stampNose = new Image();                            // 鼻のスタンプ画像を入れる Image オブジェクト
var stampEars = new Image();                            // 耳のスタンプ画像を入れる Image オブジェクト
var stampTear = new Image();                            // ★涙のスタンプ画像を入れる Image オブジェクト
var stampSurp = new Image();                            // ★驚きのスタンプ画像を入れる Image オブジェクト
var stampEyes = new Image();                            // ★ハートのスタンプ画像を入れる Image オブジェクト
stampNose.src = "face/nose.png";                             // 鼻のスタンプ画像のファイル名
stampEars.src = "face/ears.png";                             // 耳のスタンプ画像のファイル名
stampTear.src = "face/tear.png";                             // ★涙のスタンプ画像のファイル名
stampSurp.src = "face/surp.png";                             // ★驚きのスタンプ画像のファイル名
stampEyes.src = "face/eyes.png";                             // ★ハートのスタンプ画像のファイル名

// getUserMedia によるカメラ映像の取得
var media = navigator.mediaDevices.getUserMedia({       // メディアデバイスを取得
  video: {facingMode: "user"},                          // カメラの映像を使う（スマホならインカメラ）
  audio: false                                          // マイクの音声は使わない
});
media.then((stream) => {                                // メディアデバイスが取得できたら
  video.srcObject = stream;
  //video.src = window.URL.createObjectURL(stream);       // video 要素にストリームを渡す
});

// clmtrackr の開始
var tracker = new clm.tracker();  // tracker オブジェクトを作成
tracker.init(pModel);             // tracker を所定のフェイスモデル（※1）で初期化
tracker.start(video);             // video 要素内でフェイストラッキング開始

// 感情分類の開始
var classifier = new emotionClassifier();               // emotionClassifier オブジェクトを作成
classifier.init(emotionModel);                          // classifier を所定の感情モデル（※2）で初期化

// 描画ループ
function drawLoop() {
  requestAnimationFrame(drawLoop);                      // drawLoop 関数を繰り返し実行
  var positions = tracker.getCurrentPosition();         // 顔部品の現在位置の取得
  var parameters = tracker.getCurrentParameters();      // 現在の顔のパラメータを取得
  var emotion = classifier.meanPredict(parameters);     // そのパラメータから感情を推定して emotion に結果を入れる
  context.clearRect(0, 0, canvas.width, canvas.height); // canvas をクリア
  //tracker.draw(canvas);                                 // canvas にトラッキング結果を描画
  drawStamp(positions, stampNose, 62, 2.5, 0.0, 0.0);   // 鼻のスタンプを描画
  drawStamp(positions, stampEars, 33, 3.0, 0.0, -1.8);  // 耳のスタンプを描画
  if(emotion[3].value > 0.4) {                          // ★感情 sad の値が一定値より大きければ
    drawStamp(positions, stampTear, 23, 0.4, 0.0, 0.8); // ★涙のスタンプを描画（右目尻）
    drawStamp(positions, stampTear, 28, 0.4, 0.0, 0.8); // ★涙のスタンプを描画（左目尻）
  }
  if(emotion[4].value > 0.8) {                          // ★感情 surprised の値が一定値より大きければ
    drawStamp(positions, stampSurp, 14, 1.0, 0.7, 0.0); // ★驚きのスタンプを描画（顔の左）
  }
  if(emotion[5].value > 0.4) {                          // ★感情 happy の値が一定値より大きければ
    drawStamp(positions, stampEyes, 27, 0.6, 0.0, 0.0); // ★ハートのスタンプを描画（右目）
    drawStamp(positions, stampEyes, 32, 0.6, 0.0, 0.0); // ★ハートのスタンプを描画（左目）
  }
}
drawLoop();                                             // drawLoop 関数をトリガー

// スタンプを描く drawStamp 関数
// (顔部品の位置データ, 画像, 基準位置, 大きさ, 横シフト, 縦シフト)
function drawStamp(pos, img, bNo, scale, hShift, vShift) {
  var eyes = pos[32][0] - pos[27][0];                   // 幅の基準として両眼の間隔を求める
  var nose = pos[62][1] - pos[33][1];                   // 高さの基準として眉間と鼻先の間隔を求める
  var wScale = eyes / img.width;                        // 両眼の間隔をもとに画像のスケールを決める
  var imgW = img.width * scale * wScale;                // 画像の幅をスケーリング
  var imgH = img.height * scale * wScale;               // 画像の高さをスケーリング
  var imgL = pos[bNo][0] - imgW / 2 + eyes * hShift;    // 画像のLeftを決める
  var imgT = pos[bNo][1] - imgH / 2 + nose * vShift;    // 画像のTopを決める
  context.drawImage(img, imgL, imgT, imgW, imgH);       // 画像を描く
}
