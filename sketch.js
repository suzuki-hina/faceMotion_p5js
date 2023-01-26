let face = document.getElementById('face');

let imageUrl;
let img;
let image;

const res = 2;
const cols = 20 / res;
const rows = 20 / res;
let w;
let m;

//点の表示・非表示の変数
let pointColorChanger = false;

//テクスチャのポイントの変数
let pP = [];
let pT = [];
let textureChanger = false;

//パーツを囲う線の頂点の数
const markNum = 27;
let mark = [];
const markPosX = [2, 3, 4, 4, 4, 3, 2, 2, 2, 6, 7, 8, 8, 8, 7, 6, 6, 6, 2, 5, 8, 8, 8, 5, 2, 2, 2];
const markPosY = [2, 2, 2, 3, 4, 4, 4, 3, 2, 2, 2, 2, 3, 4, 4, 4, 3, 2, 6, 6, 6, 7, 8, 8, 8, 7, 6];
let markChanger = false;
let markAllMouseMove = false;
let lineMouseMove = false;
let lineColorChanger = false;

//囲う線上にある点
let pointPosSet = false;
let pOL = [];
let markMouseMove = false;
let markColorChanger = false;

//アニメーションのフレームの前後
let iK = [];
let lK = [];

//アニメーションの変数
const easeOutQuint = function (t) {
  return 1 + --t * t * t * t * t;
};
const moveLimit = 1000;
let startTime = Date.now();
let moveTime = 0;
let stopTime = 0;
let isMove = false;
let animChanger  = false;


function previewFile(file) {
  // プレビュー画像を追加する要素
  const preview = document.getElementById('preview');

  // FileReaderオブジェクトを作成
  const reader = new FileReader();

  // ファイルが読み込まれたときに実行する
  reader.onload = function (e) {
    imageUrl = e.target.result; // 画像のURLはevent.target.resultで呼び出せる
    img = document.createElement("img"); // img要素を作成
    img.src = imageUrl; // 画像のURLをimg要素にセット

    if (windowWidth <= windowHeight) {
      img.width = windowWidth;
      img.height = windowWidth;
    } else if (windowWidth > windowHeight) {
      img.width = windowHeight;
      img.height = windowHeight;
    }
    preview.appendChild(img); // #previewの中に追加
  }

  // いざファイルを読み込む
  reader.readAsDataURL(file);
}


// <input>でファイルが選択されたときの処理
const fileInput = document.getElementById('button_file');
const handleFileSelect = () => {
  const files = fileInput.files;
  for (let i = 0; i < files.length; i++) {
    previewFile(files[i]);
  }
  document.getElementById('face').style.display = 'none';
  document.getElementById('preview').style.display = 'inline';
}
fileInput.addEventListener('change', handleFileSelect);



function setup() {
  //ウィンドウのスワイプを止める
  window.addEventListener("touchstart", function (event) { event.preventDefault(); }, { passive: false });
  window.addEventListener("touchmove", function (event) { event.preventDefault(); }, { passive: false });

  //キャンバスの設定
  if (windowWidth <= windowHeight) {
    w = windowWidth / (cols - 1);
  } else if (windowWidth > windowHeight) {
    w = windowHeight / (rows - 1);
  }

  let canvas = createCanvas(w * 9, w * 9, WEBGL);
  canvas.parent(face); 
  image = loadImage("img/parkFace.jpg");
  //image = loadImage(imageUrl);

  //ポイントの位置とテクスチャの配列設定
  //パーツを囲う図形の線上の点の配列設定
  //初期と最終フレームの配列設定
  let pPx = -width / 2;
  let pTx = -width / 2;
  let pOLx = -width / 2;
  let iKx = -width / 2;
  let lKx = -width / 2;

  for (let i = 0; i < cols; i++) {
    pP[i] = [];
    pT[i] = [];
    pOL[i] = [];
    iK[i] = [];
    lK[i] = [];

    let pPy = -height / 2;
    let pTy = -height / 2;
    let pOLy = -height / 2;
    let iKy = -height / 2;
    let lKy = -height / 2;

    for (let j = 0; j < rows; j++) {
      pP[i][j] = new pointPosition(pPx, pPy);
      pPy = pPy + w;
      pT[i][j] = new pointTexture(pTx, pTy);
      pTy = pTy + w;
      pOL[i][j] = new pointOnLine(pOLx, pOLy);
      pOLy = pOLy + w;
      iK[i][j] = new initialKeyFrame(iKx, iKy);
      iKy = iKy + w;
      lK[i][j] = new lastKeyFrame(lKx, lKy);
      lKy = lKy + w;
    }
    pPx = pPx + w;
    pTx = pTx + w;
    pOLx = pOLx + w;
    iKx = iKx + w;
    lKx = lKx + w;
  }

  //パーツを囲う図形の配列設定
  let mx = 0;
  let my = 0;
  for (let i = 0; i < markNum; i++) {
    mark[i] = new Mark(mx, my);
  }

  //囲う図形の初期位置
  for (let i = 0; i < markNum; i++) {
    mark[i].mx = w * markPosX[i] - width / 2;
    mark[i].my = w * markPosY[i] - height / 2;
  }

  //ボタンの作成
  select("#button_start").mouseClicked(StartButton);
  select("#button_return_01").mouseClicked(Return01Button);
  select("#button_ok_01").mouseClicked(Ok01Button);
  select("#button_ex_01").mouseClicked(Ex01Button);
  select("#button_tool_01").mouseClicked(Tool01Button);
  select("#button_tool_02").mouseClicked(Tool02Button);
  select("#button_return_02").mouseClicked(Return02Button);
  select("#button_ok_02").mouseClicked(Ok02Button);
  select("#button_ex_02").mouseClicked(Ex02Button);
  select("#button_tool_03").mouseClicked(Tool03Button);
  select("#button_return_03").mouseClicked(Return03Button);
  select("#button_ok_03").mouseClicked(Ok03Button);
  select("#button_ex_03").mouseClicked(Ex03Button);
  select("#button_tool_04").mouseClicked(Tool04Button);
  select("#button_tool_05").mouseClicked(Tool05Button);
  select("#button_return_04").mouseClicked(Return04Button);
  select("#button_ok_04").mouseClicked(Ok04Button);

  document.getElementById('face').style.display = 'inline';
  document.getElementById('preview').style.display = 'none';

  document.getElementById('img_ex_01').style.display = 'none';
  document.getElementById('img_ex_02').style.display = 'none';
  document.getElementById('img_ex_03').style.display = 'none';

  document.getElementById('button_file').style.display = 'none';
  document.getElementById('title_01').style.visibility = 'hidden';
  document.getElementById('button_return_01').style.visibility = 'hidden';
  document.getElementById('button_ok_01').style.visibility = 'hidden';

  document.getElementById('button_ex_01').style.display = 'none';

  document.getElementById('title_02').style.display = 'none';
  document.getElementById('button_tool_01').style.display = 'none';
  document.getElementById('button_tool_02').style.display = 'none';
  document.getElementById('button_return_02').style.display = 'none';
  document.getElementById('button_ok_02').style.display = 'none';

  document.getElementById('button_ex_02').style.display = 'none';

  document.getElementById('title_03').style.display = 'none';
  document.getElementById('button_tool_03').style.display = 'none';
  document.getElementById('button_return_03').style.display = 'none';
  document.getElementById('button_ok_03').style.display = 'none';

  document.getElementById('button_ex_03').style.display = 'none';

  document.getElementById('title_04').style.display = 'none';
  document.getElementById('button_tool_04').style.display = 'none';
  document.getElementById('button_tool_05').style.display = 'none';
  document.getElementById('button_return_04').style.display = 'none';
  document.getElementById('button_ok_04').style.display = 'none';
}

function draw() {
  background(0);
  noStroke();

  //アニメーションの設定
  if(animChanger == true){
    if (isMove) {
      moveTime = (Date.now() - startTime) / moveLimit;
      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          let xKey = lK[i][j].x - iK[i][j].x;
          let yKey = lK[i][j].y - iK[i][j].y;
  
          let xKeyD = xKey * easeOutQuint(moveTime);
          let yKeyD = yKey * easeOutQuint(moveTime);
  
          pP[i][j].x = iK[i][j].x + xKeyD;
          pP[i][j].y = iK[i][j].y + yKeyD;
  
          if (Date.now() - startTime >= moveLimit) {
            isMove = false;
            stopTime = Date.now();
            pP[i][j].x = lK[i][j].x;
            pP[i][j].y = lK[i][j].y;
          }
        }
      }
    } else {
      if (Date.now() - stopTime > moveLimit) {
        startTime = Date.now();
        isMove = true;
      }
    }
  }else{
    if (Date.now() - stopTime > moveLimit) {
      startTime = Date.now();
      isMove = false;
    }
  }
  

  //マウスによる移動
  if (markMouseMove == true) {
    if (mouseIsPressed == true) {
      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          let d = dist(pP[i][j].x, pP[i][j].y, mouseX - width / 2, mouseY - height / 2);
          if (d < w / 4) {
            pP[i][j].x = mouseX - width / 2;
            pP[i][j].y = mouseY - height / 2;
          }
        }
      }
    }
  }

  //テクスチャ平面の描画
  if (textureChanger == true) {
    noFill();
    textureMode(NORMAL);

    for (let j = 0; j < rows - 1; j++) {
      beginShape(TRIANGLE_STRIP);
      texture(image);
      for (let i = 0; i < cols; i++) {
        let x1 = pP[i][j].x;
        let y1 = pP[i][j].y;
        let u = map(pT[i][j].x, 0 - width / 2, w * (cols - 1) - width / 2, 0, 1);
        let v1 = map(pT[i][j].y, 0 - height / 2, w * (rows - 1) - height / 2, 0, 1);
        vertex(x1, y1, u, v1);

        let x2 = pP[i][j + 1].x;
        let y2 = pP[i][j + 1].y;
        let u2 = map(pT[i][j + 1].x, 0 - width / 2, w * (cols - 1) - width / 2, 0, 1);
        let v2 = map(pT[i][j + 1].y, 0 - height / 2, w * (rows - 1) - height / 2, 0, 1);
        vertex(x2, y2, u2, v2);
      }
      endShape();
    }
  }

  //ポイントの色
  if (pointColorChanger == true) {
    for (let j = 0; j < rows - 1; j++) {
      for (let i = 0; i < cols; i++) {
        stroke(255);
        strokeWeight(10);
        point(pP[i][j].x, pP[i][j].y);

        stroke(255);
        strokeWeight(0);
        point(pT[i][j].x, pT[i][j].y);
      }
    }
  }

  //囲う図形のマウス移動
  if (lineMouseMove == true) {
    if (mouseIsPressed == true) {
      for (let i = 0; i < markNum; i++) {
        let dis = dist(mark[i].mx, mark[i].my, mouseX - width / 2, mouseY - height / 2);
        if (dis < w / 4) {
          mark[i].mx = mouseX - width / 2;
          mark[i].my = mouseY - height / 2;
        }
      }
    }
  }

  //囲う図形全体のマウス移動
  if (markAllMouseMove == true) {
    if (mouseIsPressed == true) {
      for (let i = 0; i < markNum; i++) {
        let dis = dist(mark[i].mx, mark[i].my, mouseX - width / 2, mouseY - height / 2);

        if (dis < w / 4) {
          mark[i].mx = mouseX - width / 2;
          mark[i].my = mouseY - height / 2;

          let disdisX = pmouseX - mouseX - width / 2;
          let disdisY = pmouseY - mouseY - height / 2;

          if (0 < i && i < 9) {
            for (let j = 0; j < 8; j++) {
              mark[j].mx = mark[j].mx - disdisX - width / 2;
              mark[j].my = mark[j].my - disdisY - height / 2;
              mark[8].mx = mark[0].mx;
              mark[8].my = mark[0].my;
            }
          }
          else if (9 < i && i < 18) {
            for (let j = 9; j < 17; j++) {
              mark[j].mx = mark[j].mx - disdisX - width / 2;
              mark[j].my = mark[j].my - disdisY - height / 2;
              mark[17].mx = mark[9].mx;
              mark[17].my = mark[9].my;
            }
          }
          else if (18 < i && i < 27) {
            for (let j = 18; j < 26; j++) {
              mark[j].mx = mark[j].mx - disdisX - width / 2;
              mark[j].my = mark[j].my - disdisY - height / 2;
              mark[26].mx = mark[18].mx;
              mark[26].my = mark[18].my;
            }
          }
        }
      }
    }
  }

  if (lineColorChanger == true) {
    stroke(255);
    fill(255);

    //右目を囲う図形の描画
    for (let k = 0; k < markNum / 3 - 1; k++) {
      strokeWeight(5);
      line(mark[k].mx, mark[k].my, mark[k + 1].mx, mark[k + 1].my);
      strokeWeight(30);
      point(mark[k].mx, mark[k].my);
    }
    strokeWeight(5);
    line(mark[markNum / 3 - 1].mx, mark[markNum / 3 - 1].my, mark[0].mx, mark[0].my);

    //左目を囲う図形の描画
    for (let k = markNum / 3; k < markNum / 3 * 2 - 1; k++) {
      strokeWeight(5);
      line(mark[k].mx, mark[k].my, mark[k + 1].mx, mark[k + 1].my);
      strokeWeight(30);
      point(mark[k].mx, mark[k].my);
    }
    strokeWeight(5);
    line(mark[markNum / 3 * 2 - 1].mx, mark[markNum / 3 * 2 - 1].my, mark[markNum / 3].mx, mark[markNum / 3].my);

    //口を囲う図形の描画
    for (let k = markNum / 3 * 2; k < markNum - 1; k++) {
      strokeWeight(5);
      line(mark[k].mx, mark[k].my, mark[k + 1].mx, mark[k + 1].my);
      strokeWeight(30);
      point(mark[k].mx, mark[k].my);
    }
    strokeWeight(5);
    line(mark[markNum - 1].mx, mark[markNum - 1].my, mark[markNum / 3 * 2].mx, mark[markNum / 3 * 2].my);
  }

  //点と直線の距離
  if (markChanger == true) {
    for (let k = 0; k < markNum - 1; k++) {
      for (let j = 0; j < rows - 1; j++) {
        for (let i = 0; i < cols; i++) {
          let a = mark[k].my - mark[k + 1].my;
          let b = -(mark[k].mx - mark[k + 1].mx);
          let c = (mark[k].my - mark[k + 1].my) * -mark[k].mx + mark[k].my * (mark[k].mx - mark[k + 1].mx);
          let d = abs(a * pT[i][j].x + b * pT[i][j].y + c) / sqrt(sq(a) + sq(b));

          if (markColorChanger == true) {
            if ((mark[k].mx - w / 2 < pT[i][j].x && pT[i][j].x < mark[k + 1].mx + w / 2) || (mark[k + 1].mx - w / 2 < pT[i][j].x && pT[i][j].x < mark[k].mx + w / 2)) {
              if ((mark[k].my - w / 2 < pT[i][j].y && pT[i][j].y < mark[k + 1].my + w / 2) || (mark[k + 1].my - w / 2 < pT[i][j].y && pT[i][j].y < mark[k].my + w / 2)) {
                if (d < w / 2) {
                  if (0 <= k && k < markNum / 3 - 1) {
                    fill(255, 0, 0);
                    noStroke();
                    ellipse(pT[i][j].x, pT[i][j].y, 10, 10);
                  }
                  else if (markNum / 3 <= k && k < markNum / 3 * 2 - 1) {
                    fill(255, 0, 0);
                    noStroke();
                    ellipse(pT[i][j].x, pT[i][j].y, 10, 10);
                  }
                  else if (markNum / 3 * 2 <= k && k < markNum - 1) {
                    fill(255, 0, 0);
                    noStroke();
                    ellipse(pT[i][j].x, pT[i][j].y, 10, 10);
                  }
                }
              }
            }
          }

          if (pointPosSet == true) {
            if ((mark[k].mx - w / 2 < pT[i][j].x && pT[i][j].x < mark[k + 1].mx + w / 2) || (mark[k + 1].mx - w / 2 < pT[i][j].x && pT[i][j].x < mark[k].mx + w / 2)) {
              if ((mark[k].my - w / 2 < pT[i][j].y && pT[i][j].y < mark[k + 1].my + w / 2) || (mark[k + 1].my - w / 2 < pT[i][j].y && pT[i][j].y < mark[k].my + w / 2)) {
                if (d < w / 2) {
                  if (0 <= k && k < markNum / 3 - 1) {
                    if (mark[k].mx == mark[k + 1].mx) {
                      pOL[i][j].pOLx = mark[k].mx;
                      pOL[i][j].pOLy = pT[i][j].y;
                    }
                    else if (mark[k].my == mark[k + 1].my) {
                      pOL[i][j].pOLx = pT[i][j].x;
                      pOL[i][j].pOLy = mark[k].my;
                    }
                    else {
                      let m1, m2, l1, l2;
                      m1 = (mark[k + 1].my - mark[k].my) / (mark[k + 1].mx - mark[k].mx);
                      l1 = mark[k].my - (m1 * mark[k].mx);

                      m2 = -1 / m1;
                      l2 = pT[i][j].y - (m2 * pT[i][j].x);

                      pOL[i][j].pOLx = (l2 - l1) / (m1 - m2);
                      pOL[i][j].pOLy = (l2 * m1 - l1 * m2) / (m1 - m2);
                    }
                  }
                  else if (markNum / 3 <= k && k < markNum / 3 * 2 - 1) {
                    if (mark[k].mx == mark[k + 1].mx) {
                      pOL[i][j].pOLx = mark[k].mx;
                      pOL[i][j].pOLy = pT[i][j].y;
                    }
                    else if (mark[k].my == mark[k + 1].my) {
                      pOL[i][j].pOLx = pT[i][j].x;
                      pOL[i][j].pOLy = mark[k].my;
                    }
                    else {
                      let m1, m2, l1, l2;
                      m1 = (mark[k + 1].my - mark[k].my) / (mark[k + 1].mx - mark[k].mx);
                      l1 = mark[k].my - (m1 * mark[k].mx);

                      m2 = -1 / m1;
                      l2 = pT[i][j].y - (m2 * pT[i][j].x);

                      pOL[i][j].pOLx = (l2 - l1) / (m1 - m2);
                      pOL[i][j].pOLy = (l2 * m1 - l1 * m2) / (m1 - m2);
                    }
                  }
                  else if (markNum / 3 * 2 <= k && k < markNum - 1) {
                    if (mark[k].mx == mark[k + 1].mx) {
                      pOL[i][j].pOLx = mark[k].mx;
                      pOL[i][j].pOLy = pT[i][j].y;
                    }
                    else if (mark[k].my == mark[k + 1].my) {
                      pOL[i][j].pOLx = pT[i][j].x;
                      pOL[i][j].pOLy = mark[k].my;
                    }
                    else {
                      let m1, m2, l1, l2;
                      m1 = (mark[k + 1].my - mark[k].my) / (mark[k + 1].mx - mark[k].mx);
                      l1 = mark[k].my - (m1 * mark[k].mx);

                      m2 = -1 / m1;
                      l2 = pT[i][j].y - (m2 * pT[i][j].x);

                      pOL[i][j].pOLx = (l2 - l1) / (m1 - m2);
                      pOL[i][j].pOLy = (l2 * m1 - l1 * m2) / (m1 - m2);
                    }
                  }
                  else {
                    pOL[i][j].pOLx = pT[i][j].x;
                    pOL[i][j].pOLy = pT[i][j].y;
                  }

                  pT[i][j].x = pOL[i][j].pOLx;
                  pT[i][j].y = pOL[i][j].pOLy;

                  pP[i][j].x = pOL[i][j].pOLx;
                  pP[i][j].y = pOL[i][j].pOLy;
                }
              }
            }
          }
        }
      }
    }
  }
}

function StartButton() {
  document.getElementById('button_start').style.display = 'none';
  document.getElementById('face').style.visibility = 'visible';
  document.getElementById('button_file').style.display = 'inline';
  document.getElementById('title_01').style.visibility = 'visible';
  document.getElementById('button_return_01').style.visibility = 'visible';
  document.getElementById('button_ok_01').style.visibility = 'visible';
}


function Return01Button() {
  document.getElementById('face').style.display = 'inline';
  document.getElementById('preview').style.display = 'none';

  document.getElementById('button_start').style.display = 'inline';
  document.getElementById('face').style.visibility = 'hidden';
  document.getElementById('button_file').style.display = 'none';
  document.getElementById('title_01').style.visibility = 'hidden';
  document.getElementById('button_return_01').style.visibility = 'hidden';
  document.getElementById('button_ok_01').style.visibility = 'hidden';

  var obj = document.getElementById("button_file");
  obj.value = "";
}

function Ok01Button() {
  document.getElementById('face').style.display = 'none';
  document.getElementById('preview').style.display = 'none';
  document.getElementById('img_ex_01').style.display = 'inline';
  textureChanger = false;

  document.getElementById('button_file').style.display = 'none';
  document.getElementById('title_01').style.display = 'none';
  document.getElementById('button_return_01').style.display = 'none';
  document.getElementById('button_ok_01').style.display = 'none';

  document.getElementById('button_ex_01').style.display = 'inline';
  document.getElementById('title_02').style.display = 'inline';
  document.getElementById('button_return_02').style.display = 'inline';
}


function Ex01Button() {
  textureChanger = true;
  lineMouseMove = false;
  markAllMouseMove = true;
  lineColorChanger = true;
  markChanger = true;

  pointColorChanger = false;
  markColorChanger = false;

  document.getElementById('face').style.display = 'inline';
  document.getElementById('img_ex_01').style.display = 'none';

  document.getElementById('button_ex_01').style.display = 'none';

  document.getElementById('title_02').style.display = 'inline';
  document.getElementById('button_tool_01').style.display = 'inline';
  document.getElementById('button_tool_02').style.display = 'inline';
  document.getElementById('button_return_02').style.display = 'inline';
  document.getElementById('button_ok_02').style.display = 'inline';
}

function Tool01Button() {
  lineMouseMove = false;
  markAllMouseMove = true;
}

function Tool02Button() {
  lineMouseMove = true;
  markAllMouseMove = false;
}

function Return02Button() {
  textureChanger = false;
  lineMouseMove = false;
  markAllMouseMove = false;
  lineColorChanger = false;
  markChanger = false;

  pointColorChanger = false;
  markColorChanger = false;

  document.getElementById('button_file').style.display = 'inline';
  document.getElementById('title_01').style.display = 'inline';
  document.getElementById('button_return_01').style.display = 'inline';
  document.getElementById('button_ok_01').style.display = 'inline';

  document.getElementById('button_ex_01').style.display = 'none';
  document.getElementById('title_02').style.display = 'none';
  document.getElementById('button_tool_01').style.display = 'none';
  document.getElementById('button_tool_02').style.display = 'none';
  document.getElementById('button_return_02').style.display = 'none';
  document.getElementById('button_ok_02').style.display = 'none';
}

function Ok02Button() {
  textureChanger = false;
  pointPosSet = true;
  lineColorChanger = true;
  markMouseMove = false;
  lineMouseMove = false;
  markAllMouseMove = false;

  pointColorChanger = false;
  markColorChanger = true;

  document.getElementById('face').style.display = 'none';
  document.getElementById('img_ex_02').style.display = 'inline';

  document.getElementById('title_02').style.display = 'none';
  document.getElementById('button_tool_01').style.display = 'none';
  document.getElementById('button_tool_02').style.display = 'none';
  document.getElementById('button_return_02').style.display = 'none';
  document.getElementById('button_ok_02').style.display = 'none';

  document.getElementById('button_ex_02').style.display = 'inline';
  document.getElementById('title_03').style.display = 'inline';
  document.getElementById('button_return_03').style.display = 'inline';
}

function Ex02Button() {
  document.getElementById('face').style.display = 'inline';
  document.getElementById('img_ex_02').style.display = 'none';

  textureChanger = true;
  pointPosSet = false;

  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      iK[i][j].x = pP[i][j].x;
      iK[i][j].y = pP[i][j].y;
    }
  }

  lineMouseMove = false;
  markAllMouseMove = false;
  lineColorChanger = false;
  markMouseMove = true;

  pointColorChanger = true;
  markColorChanger = true;

  document.getElementById('button_ex_02').style.display = 'none';
  document.getElementById('title_03').style.display = 'inline';
  document.getElementById('button_tool_03').style.display = 'inline';
  document.getElementById('button_return_03').style.display = 'inline';
  document.getElementById('button_ok_03').style.display = 'inline';
}

function Tool03Button() {
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      pP[i][j].x = iK[i][j].x;
      pP[i][j].y = iK[i][j].y;
    }
  }
}

function Return03Button() {
  pointPosSet = false;

  let pPx = -width / 2;
  let pTx = -width / 2;
  for (let i = 0; i < cols; i++) {
    pP[i] = [];
    pT[i] = [];

    let pPy = -height / 2;
    let pTy = -height / 2;
    for (let j = 0; j < rows; j++) {
      pP[i][j] = new pointPosition(pPx, pPy);
      pT[i][j] = new pointTexture(pTx, pTy);
      pPy = pPy + w;
      pTy = pTy + w;
    }
    pPx = pPx + w;
    pTx = pTx + w;
  }

  lineColorChanger = true;
  markMouseMove = false;
  lineMouseMove = false;
  markAllMouseMove = true;

  pointColorChanger = false;
  markColorChanger = false;

  document.getElementById('title_02').style.display = 'inline';
  document.getElementById('button_tool_01').style.display = 'inline';
  document.getElementById('button_tool_02').style.display = 'inline';
  document.getElementById('button_return_02').style.display = 'inline';
  document.getElementById('button_ok_02').style.display = 'inline';

  document.getElementById('button_ex_02').style.display = 'none';
  document.getElementById('title_03').style.display = 'none';
  document.getElementById('button_tool_03').style.display = 'none';
  document.getElementById('button_return_03').style.display = 'none';
  document.getElementById('button_ok_03').style.display = 'none';
}

function Ok03Button() {
  document.getElementById('face').style.display = 'none';
  document.getElementById('img_ex_03').style.display = 'inline';

  textureChanger = false;
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      lK[i][j].x = pP[i][j].x;
      lK[i][j].y = pP[i][j].y;
    }
  }

  pointColorChanger = false;
  markColorChanger = false;
  markMouseMove = true;

  document.getElementById('title_03').style.display = 'none';
  document.getElementById('button_tool_03').style.display = 'none';
  document.getElementById('button_return_03').style.display = 'none';
  document.getElementById('button_ok_03').style.display = 'none';
  document.getElementById('button_ex_03').style.display = 'inline';
  document.getElementById('title_04').style.display = 'inline';
  document.getElementById('button_return_04').style.display = 'inline';
}



function Ex03Button() {
  document.getElementById('face').style.display = 'inline';
  document.getElementById('img_ex_03').style.display = 'none';

  textureChanger = true;
  isMove = false;
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      pP[i][j].x = iK[i][j].x;
      pP[i][j].y = iK[i][j].y;
    }
  }
  

  document.getElementById('button_ex_03').style.display = 'none';
  document.getElementById('title_04').style.display = 'inline';
  document.getElementById('button_tool_04').style.display = 'inline';
  document.getElementById('button_tool_05').style.display = 'inline';
  document.getElementById('button_return_04').style.display = 'inline';
  document.getElementById('button_ok_04').style.display = 'inline';
}

function Tool04Button() {
  pointColorChanger = false;
  markColorChanger = false;
  animChanger = true;
  isMove = true;
  stopTime = 0;
}

function Tool05Button() {
  animChanger = false;
  isMove = false;
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      pP[i][j].x = iK[i][j].x;
      pP[i][j].y = iK[i][j].y;
    }
  }
}

function Return04Button() {
  pointPosSet = false;

  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      iK[i][j].x = pP[i][j].x;
      iK[i][j].y = pP[i][j].y;
    }
  }

  lineMouseMove = false;
  markAllMouseMove = false;
  lineColorChanger = false;
  markMouseMove = true;

  pointColorChanger = true;
  markColorChanger = true;

  document.getElementById('title_03').style.display = 'inline';
  document.getElementById('button_tool_03').style.display = 'inline';
  document.getElementById('button_return_03').style.display = 'inline';
  document.getElementById('button_ok_03').style.display = 'inline';
  document.getElementById('button_ex_03').style.display = 'none';
  document.getElementById('title_04').style.display = 'none';
  document.getElementById('button_tool_04').style.display = 'none';
  document.getElementById('button_tool_05').style.display = 'none';
  document.getElementById('button_return_04').style.display = 'none';
  document.getElementById('button_ok_04').style.display = 'none';
}

function Ok04Button() {

}

class pointPosition {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

class pointTexture {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

class Mark {
  constructor(x, y) {
    this.x = y;
    this.x = y;
  }
}

class pointOnLine {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

class initialKeyFrame {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

class lastKeyFrame {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

