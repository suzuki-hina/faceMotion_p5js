let img;

let res = 2;
let cols = 20 / res;
let rows = 20 / res;
let windowBase;
let w;
let windowBaseHarf;

//点の表示・非表示の変数
let pointColorChanger = true;

//テクスチャのポイントの変数
let pP = [];
let pT = [];

//パーツを囲う線の頂点の数
let markNum = 27;
let mark = [];
let markColorChanger = true;

//囲う線上にある点
let pointPosSet = false;
let pOL = [];
let lineLength;

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

function setup() {
  //ウィンドウのスワイプを止める
  window.addEventListener("touchstart", function (event) { event.preventDefault(); }, { passive: false });
  window.addEventListener("touchmove", function (event) { event.preventDefault(); }, { passive: false });

  createCanvas(windowWidth, windowHeight, WEBGL);
  img = loadImage("img/parkFace.png");

  if(windowWidth <= windowHeight){
    windowBase = windowWidth;
    w = windowWidth / cols;
    lineLength = windowBase / 10;
    windowBaseHarf = windowWidth / 2;
  }else if(windowWidth > windowHeight){
    windowBase = windowHeight;
    w = windowHeight / rows;
    lineLength = windowBase / 10;
    windowBaseHarf = windowHeight / 2;
  }

  //ポイントの位置とテクスチャの配列設定
  let pPx = -width / 2;
  let pTx = -width / 2;
  for (let i = 0; i < cols; i++) {
    pP[i] = [];
    pT[i] = [];

    let pPy = -height / 2;
    let pTy = -height / 2;
    for (let j = 0; j < rows; j++) {
      pP[i][j] = new pointPosition(pPx, pPy);
      pPy = pPy + w;
      pT[i][j] = new pointTexture(pTx, pTy);
      pTy = pTy + w;
    }
    pPx = pPx + w;
    pTx = pTx + w;
  }

  //パーツを囲う図形の配列設定
  let mx = 0;
  let my = 0;
  for (let i = 0; i < markNum; i++) {
    mark[i] = new Mark(mx, my);
  }

  //右目を囲う図形の初期位置
  mark[0].mx = lineLength * 2 - windowBaseHarf;
  mark[0].my = lineLength * 2 - windowBaseHarf;
  mark[1].mx = lineLength * 3 - windowBaseHarf;
  mark[1].my = lineLength * 2 - windowBaseHarf;
  mark[2].mx = lineLength * 4 - windowBaseHarf;
  mark[2].my = lineLength * 2 - windowBaseHarf;
  mark[3].mx = lineLength * 4 - windowBaseHarf;
  mark[3].my = lineLength * 3 - windowBaseHarf;
  mark[4].mx = lineLength * 4 - windowBaseHarf;
  mark[4].my = lineLength * 4 - windowBaseHarf;
  mark[5].mx = lineLength * 3 - windowBaseHarf;
  mark[5].my = lineLength * 4 - windowBaseHarf;
  mark[6].mx = lineLength * 2 - windowBaseHarf;
  mark[6].my = lineLength * 4 - windowBaseHarf;
  mark[7].mx = lineLength * 2 - windowBaseHarf;
  mark[7].my = lineLength * 3 - windowBaseHarf;
  mark[8].mx = lineLength * 2 - windowBaseHarf;
  mark[8].my = lineLength * 2 - windowBaseHarf;

  //左目を囲う図形の初期位置
  mark[9].mx = lineLength * 6 - windowBaseHarf;
  mark[9].my = lineLength * 2 - windowBaseHarf;
  mark[10].mx = lineLength * 7 - windowBaseHarf;
  mark[10].my = lineLength * 2 - windowBaseHarf;
  mark[11].mx = lineLength * 8 - windowBaseHarf;
  mark[11].my = lineLength * 2 - windowBaseHarf;
  mark[12].mx = lineLength * 8 - windowBaseHarf;
  mark[12].my = lineLength * 3 - windowBaseHarf;
  mark[13].mx = lineLength * 8 - windowBaseHarf;
  mark[13].my = lineLength * 4 - windowBaseHarf;
  mark[14].mx = lineLength * 7 - windowBaseHarf;
  mark[14].my = lineLength * 4 - windowBaseHarf;
  mark[15].mx = lineLength * 6 - windowBaseHarf;
  mark[15].my = lineLength * 4 - windowBaseHarf;
  mark[16].mx = lineLength * 6 - windowBaseHarf;
  mark[16].my = lineLength * 3 - windowBaseHarf;
  mark[17].mx = lineLength * 6 - windowBaseHarf;
  mark[17].my = lineLength * 2 - windowBaseHarf;

  //口を囲う図形の初期位置
  mark[18].mx = lineLength * 2 - windowBaseHarf;
  mark[18].my = lineLength * 6 - windowBaseHarf;
  mark[19].mx = lineLength * 5 - windowBaseHarf;
  mark[19].my = lineLength * 6 - windowBaseHarf;
  mark[20].mx = lineLength * 8 - windowBaseHarf;
  mark[20].my = lineLength * 6 - windowBaseHarf;
  mark[21].mx = lineLength * 8 - windowBaseHarf;
  mark[21].my = lineLength * 7 - windowBaseHarf;
  mark[22].mx = lineLength * 8 - windowBaseHarf;
  mark[22].my = lineLength * 8 - windowBaseHarf;
  mark[23].mx = lineLength * 5 - windowBaseHarf;
  mark[23].my = lineLength * 8 - windowBaseHarf;
  mark[24].mx = lineLength * 2 - windowBaseHarf;
  mark[24].my = lineLength * 8 - windowBaseHarf;
  mark[25].mx = lineLength * 2 - windowBaseHarf;
  mark[25].my = lineLength * 7 - windowBaseHarf;
  mark[26].mx = lineLength * 2 - windowBaseHarf;
  mark[26].my = lineLength * 6 - windowBaseHarf;

  //パーツを囲う図形の線上の点の配列設定
  //初期フレームの配列設定
  //最終フレームの配列設定
  let pOLx = -width / 2;
  let iKx = -width / 2;
  let lKx = -width / 2;

  for (let i = 0; i < cols; i++) {
    pOL[i] = [];
    iK[i] = [];
    lK[i] = [];

    let pOLy = -height / 2;
    let iKy = -height / 2;
    let lKy = -height / 2;
    for (let j = 0; j < rows; j++) {
      pOL[i][j] = new pointOnLine(pOLx, pOLy);
      pOLy = pOLy + w;
      iK[i][j] = new initialKeyFrame(iKx, iKy);
      iKy = iKy + w;
      lK[i][j] = new lastKeyFrame(lKx, lKy);
      lKy = lKy + w;
    }
    pOLx = pOLx + w;
    iKx = iKx + w;
    lKx = lKx + w;
  }
}

function draw() {
  background(0);
  noStroke();

  if (keyIsPressed) {
    //移動のリセット
    if (key == "r") {
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
    }

    //囲う図形の線上に点が移動する
    if (key == "c") {
      pointPosSet = true;
    }
    else if(key == "v"){
      pointPosSet = false;
    }

    //移動前の位置のキーフレームを打つ
    if (key == "i") {
      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          iK[i][j].x = pP[i][j].x;
          iK[i][j].y = pP[i][j].y;
        }
      }
    }

    //移動後の位置のキーフレームを打つ
    if (key == "l") {
      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          lK[i][j].x = pP[i][j].x;
          lK[i][j].y = pP[i][j].y;
        }
      }
    }

    //移動前の位置にポイントを移動させる
    if (key == "o") {
      isMove = false;
      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          pP[i][j].x = iK[i][j].x;
          pP[i][j].y = iK[i][j].y;
        }
      }
    }

    //アニメーションさせる
    if (key == "k") {
      isMove = true;
      stopTime = 0;
    }
  }

  //アニメーションの設定
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
    }
  }

  //マウスによる移動
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      if (mouseIsPressed == true) {
        if (keyIsPressed) {
          if (key == "a") {
            let d = dist(
              pP[i][j].x,
              pP[i][j].y,
              mouseX - width / 2,
              mouseY - height / 2
            );
            if (d < 10) {
              pP[i][j].x = mouseX - width / 2;
              pP[i][j].y = mouseY - height / 2;
            }
          }
        }
      }
    }
  }

  //テクスチャ平面の描画
  noFill();
  textureMode(NORMAL);

  for (let j = 0; j < rows - 1; j++) {
    beginShape(TRIANGLE_STRIP);
    texture(img);
    for (let i = 0; i < cols; i++) {
      let x1 = pP[i][j].x;
      let y1 = pP[i][j].y;
      let u = map(pT[i][j].x, 0 - width / 2, w * (cols - 1) - width / 2, 0, 1);
      let v1 = map(
        pT[i][j].y,
        0 - height / 2,
        w * (rows - 1) - height / 2,
        0,
        1
      );
      vertex(x1, y1, u, v1);

      let x2 = pP[i][j + 1].x;
      let y2 = pP[i][j + 1].y;
      let u2 = map(
        pT[i][j + 1].x,
        0 - width / 2,
        w * (cols - 1) - width / 2,
        0,
        1
      );
      let v2 = map(
        pT[i][j + 1].y,
        0 - height / 2,
        w * (rows - 1) - height / 2,
        0,
        1
      );
      vertex(x2, y2, u2, v2);
    }
    endShape();
  }

  //テクスチャ平面の点の表示・非表示
  if (keyIsPressed) {
    //線の表示・非表示
    if (key == "w") {
      pointColorChanger = false;
    }
    if (key == "e") {
      pointColorChanger = true;
    }
  }

  //ポイントの色
  if (pointColorChanger == true) {
    for (let j = 0; j < rows - 1; j++) {
      for (let i = 0; i < cols; i++) {
        stroke(255);
        strokeWeight(10);
        point(pP[i][j].x, pP[i][j].y);

        stroke(255, 0, 255);
        strokeWeight(5);
        point(pT[i][j].x, pT[i][j].y);
      }
    }
  }

  //囲う図形のマウス移動
  for (let i = 0; i < markNum; i++) {
    if (mouseIsPressed == true) {
      let dis = dist(mark[i].mx, mark[i].my, mouseX - width / 2, mouseY - height / 2);

      if (dis < w/4) {
        mark[i].mx = mouseX - width / 2;
        mark[i].my = mouseY - height / 2;
      }
    }
  }

  if (keyIsPressed) {
    //線の表示・非表示
    if (key == "z") {
      markColorChanger = false;
    }
    if (key == "x") {
      markColorChanger = true;
    }
  }

  if (markColorChanger == true) {
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
    for (let k = markNum / 3 ; k < markNum / 3 * 2 - 1; k++) {
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
  for (let k = 0; k < markNum - 1; k++) {
    for (let j = 0; j < rows - 1; j++) {
      for (let i = 0; i < cols; i++) {
        let a = mark[k].my - mark[k + 1].my;
        let b = -(mark[k].mx - mark[k + 1].mx);
        let c = (mark[k].my - mark[k + 1].my) * -mark[k].mx + mark[k].my * (mark[k].mx - mark[k + 1].mx);
        let d = abs(a * pT[i][j].x + b * pT[i][j].y + c) / sqrt(sq(a) + sq(b));

        if ((mark[k].mx - w / 2 < pT[i][j].x && pT[i][j].x < mark[k + 1].mx + w / 2) || (mark[k + 1].mx - w / 2 < pT[i][j].x && pT[i][j].x < mark[k].mx + w / 2)) {
          if ((mark[k].my - w / 2 < pT[i][j].y && pT[i][j].y < mark[k + 1].my + w / 2) || (mark[k + 1].my - w / 2 < pT[i][j].y && pT[i][j].y < mark[k].my + w / 2)) {
            if (d < w / 2) {
              if(0 <= k && k < markNum/3 - 1){
                fill(255, 0, 0);
                noStroke();
                ellipse(pT[i][j].x, pT[i][j].y, 10, 10);
              }
              else if(markNum/3 <= k && k < markNum/3 * 2 - 1){
                fill(0, 255, 0);
                noStroke();
                ellipse(pT[i][j].x, pT[i][j].y, 10, 10);
              } 
              else if(markNum/3 * 2 <= k && k < markNum - 1){
                fill(0, 0, 255);
                noStroke();
                ellipse(pT[i][j].x, pT[i][j].y, 10, 10);
              }  
            }
          }
        }

        if (pointPosSet == 1) {
          if ((mark[k].mx - w / 2 < pT[i][j].x && pT[i][j].x < mark[k + 1].mx + w / 2) || (mark[k + 1].mx - w / 2 < pT[i][j].x && pT[i][j].x < mark[k].mx + w / 2)) {
            if ((mark[k].my - w / 2 < pT[i][j].y && pT[i][j].y < mark[k + 1].my + w / 2) || (mark[k + 1].my - w / 2 < pT[i][j].y && pT[i][j].y < mark[k].my + w / 2)) {
              if (d < w / 2) {
                if(0 <= k && k < markNum/3 - 1){
                  // 線分が垂直の場合
                  if (mark[k].mx == mark[k + 1].mx) {
                    pOL[i][j].pOLx = mark[k].mx;
                    pOL[i][j].pOLy = pT[i][j].y;
                  }

                  // 線分が水平の場合
                  else if (mark[k].my == mark[k + 1].my) {
                    pOL[i][j].pOLx = pT[i][j].x;
                    pOL[i][j].pOLy = mark[k].my;
                  }
                
                  //それ以外
                  else {
                    let m1, m2, l1, l2;
                    //線分の傾き
                    m1 = (mark[k + 1].my - mark[k].my) / (mark[k + 1].mELx - mark[k].mx);
                    //線分のY切片
                    l1 = mark[k].my - (m1 * mark[k].mx);

                    //垂線の傾き
                    m2 = -1 / m1;
                    //垂線のY切片
                    l2 = pT[i][j].y - (m2 * pT[i][j].x);

                    // 交点算出
                    pOL[i][j].pOLx = (l2 - l1) / (m1 - m2);
                    pOL[i][j].pOLy = (l2 * m1 - l1 * m2) / (m1 - m2);
                  }

                  pT[i][j].x = pOL[i][j].pOLx;
                  pT[i][j].y = pOL[i][j].pOLy;

                  pP[i][j].x = pOL[i][j].pOLx;
                  pP[i][j].y = pOL[i][j].pOLy;
                }
                
                else if(markNum/3 <= k && k < markNum/3 * 2 - 1){
                  // 線分が垂直の場合
                  if (mark[k].mx == mark[k + 1].mx) {
                    pOL[i][j].pOLx = mark[k].mx;
                    pOL[i][j].pOLy = pT[i][j].y;
                  }

                  // 線分が水平の場合
                  else if (mark[k].my == mark[k + 1].my) {
                    pOL[i][j].pOLx = pT[i][j].x;
                    pOL[i][j].pOLy = mark[k].my;
                  }
                
                  //それ以外
                  else {
                    let m1, m2, l1, l2;
                    //線分の傾き
                    m1 = (mark[k + 1].my - mark[k].my) / (mark[k + 1].mELx - mark[k].mx);
                    //線分のY切片
                    l1 = mark[k].my - (m1 * mark[k].mx);

                    //垂線の傾き
                    m2 = -1 / m1;
                    //垂線のY切片
                    l2 = pT[i][j].y - (m2 * pT[i][j].x);

                    // 交点算出
                    pOL[i][j].pOLx = (l2 - l1) / (m1 - m2);
                    pOL[i][j].pOLy = (l2 * m1 - l1 * m2) / (m1 - m2);
                  }

                  pT[i][j].x = pOL[i][j].pOLx;
                  pT[i][j].y = pOL[i][j].pOLy;

                  pP[i][j].x = pOL[i][j].pOLx;
                  pP[i][j].y = pOL[i][j].pOLy;
                }

                else if(markNum/3 * 2 <= k && k < markNum - 1){
                  // 線分が垂直の場合
                  if (mark[k].mx == mark[k + 1].mx) {
                    pOL[i][j].pOLx = mark[k].mx;
                    pOL[i][j].pOLy = pT[i][j].y;
                  }

                  // 線分が水平の場合
                  else if (mark[k].my == mark[k + 1].my) {
                    pOL[i][j].pOLx = pT[i][j].x;
                    pOL[i][j].pOLy = mark[k].my;
                  }
                
                  //それ以外
                  else {
                    let m1, m2, l1, l2;
                    //線分の傾き
                    m1 = (mark[k + 1].my - mark[k].my) / (mark[k + 1].mELx - mark[k].mx);
                    //線分のY切片
                    l1 = mark[k].my - (m1 * mark[k].mx);

                    //垂線の傾き
                    m2 = -1 / m1;
                    //垂線のY切片
                    l2 = pT[i][j].y - (m2 * pT[i][j].x);

                    // 交点算出
                    pOL[i][j].pOLx = (l2 - l1) / (m1 - m2);
                    pOL[i][j].pOLy = (l2 * m1 - l1 * m2) / (m1 - m2);
                  }

                  pT[i][j].x = pOL[i][j].pOLx;
                  pT[i][j].y = pOL[i][j].pOLy;

                  pP[i][j].x = pOL[i][j].pOLx;
                  pP[i][j].y = pOL[i][j].pOLy;
                }
                else{
                  pOL[i][j].pOLx = pT[i][j].x;
                  pOL[i][j].pOLy = pT[i][j].y;
                }
              }
            }
          }
        }
      }
    }
  }
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
