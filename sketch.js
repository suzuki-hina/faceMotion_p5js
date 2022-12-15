let img;

let res = 2;
let cols = 30 / res;
let rows = 30 / res;
let windowBase;
let w;
let windowBaseHarf;

//点の表示・非表示の変数
let pointColorChanger = true;

//テクスチャのポイントの変数
let pP = [];
let pT = [];

//パーツを囲う線の頂点の数
let markNum = 9;
let mark_eye_L = [];
let mark_eye_R = [];
let mark_mouth = [];
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
    windowBaseHarf = windowWidth / 2;
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
  let mELx = 0;
  let mELy = 0;
  let mERx = 0;
  let mERy = 0;
  let mMx = 0;
  let mMy = 0;
  for (let i = 0; i < markNum; i++) {
    mark_eye_L[i] = new markEyeLeft(mELx, mELy);
    mark_eye_R[i] = new markEyeRight(mERx, mERy);
    mark_mouth[i] = new markMouth(mMx, mMy);
  }

  for (let i = 0; i < 8; i++) {
    
  }

  //左目を囲う図形の初期位置
  mark_eye_L[0].mELx = lineLength * 6 - windowBaseHarf;
  mark_eye_L[0].mELy = lineLength * 2 - windowBaseHarf;
  mark_eye_L[1].mELx = lineLength * 7 - windowBaseHarf;
  mark_eye_L[1].mELy = lineLength * 2 - windowBaseHarf;
  mark_eye_L[2].mELx = lineLength * 8 - windowBaseHarf;
  mark_eye_L[2].mELy = lineLength * 2 - windowBaseHarf;
  mark_eye_L[3].mELx = lineLength * 8 - windowBaseHarf;
  mark_eye_L[3].mELy = lineLength * 3 - windowBaseHarf;
  mark_eye_L[4].mELx = lineLength * 8 - windowBaseHarf;
  mark_eye_L[4].mELy = lineLength * 4 - windowBaseHarf;
  mark_eye_L[5].mELx = lineLength * 7 - windowBaseHarf;
  mark_eye_L[5].mELy = lineLength * 4 - windowBaseHarf;
  mark_eye_L[6].mELx = lineLength * 6 - windowBaseHarf;
  mark_eye_L[6].mELy = lineLength * 4 - windowBaseHarf;
  mark_eye_L[7].mELx = lineLength * 6 - windowBaseHarf;
  mark_eye_L[7].mELy = lineLength * 3 - windowBaseHarf;
  mark_eye_L[8].mELx = lineLength * 6 - windowBaseHarf;
  mark_eye_L[8].mELy = lineLength * 2 - windowBaseHarf;

  //右目を囲う図形の初期位置
  mark_eye_R[0].mERx = lineLength * 2 - windowBaseHarf;
  mark_eye_R[0].mERy = lineLength * 2 - windowBaseHarf;
  mark_eye_R[1].mERx = lineLength * 3 - windowBaseHarf;
  mark_eye_R[1].mERy = lineLength * 2 - windowBaseHarf;
  mark_eye_R[2].mERx = lineLength * 4 - windowBaseHarf;
  mark_eye_R[2].mERy = lineLength * 2 - windowBaseHarf;
  mark_eye_R[3].mERx = lineLength * 4 - windowBaseHarf;
  mark_eye_R[3].mERy = lineLength * 3 - windowBaseHarf;
  mark_eye_R[4].mERx = lineLength * 4 - windowBaseHarf;
  mark_eye_R[4].mERy = lineLength * 4 - windowBaseHarf;
  mark_eye_R[5].mERx = lineLength * 3 - windowBaseHarf;
  mark_eye_R[5].mERy = lineLength * 4 - windowBaseHarf;
  mark_eye_R[6].mERx = lineLength * 2 - windowBaseHarf;
  mark_eye_R[6].mERy = lineLength * 4 - windowBaseHarf;
  mark_eye_R[7].mERx = lineLength * 2 - windowBaseHarf;
  mark_eye_R[7].mERy = lineLength * 3 - windowBaseHarf;
  mark_eye_R[8].mERx = lineLength * 2 - windowBaseHarf;
  mark_eye_R[8].mERy = lineLength * 2 - windowBaseHarf;

  //口を囲う図形の初期位置
  mark_mouth[0].mMx = lineLength * 2 - windowBaseHarf;
  mark_mouth[0].mMy = lineLength * 6 - windowBaseHarf;
  mark_mouth[1].mMx = lineLength * 5 - windowBaseHarf;
  mark_mouth[1].mMy = lineLength * 6 - windowBaseHarf;
  mark_mouth[2].mMx = lineLength * 8 - windowBaseHarf;
  mark_mouth[2].mMy = lineLength * 6 - windowBaseHarf;
  mark_mouth[3].mMx = lineLength * 8 - windowBaseHarf;
  mark_mouth[3].mMy = lineLength * 7 - windowBaseHarf;
  mark_mouth[4].mMx = lineLength * 8 - windowBaseHarf;
  mark_mouth[4].mMy = lineLength * 8 - windowBaseHarf;
  mark_mouth[5].mMx = lineLength * 5 - windowBaseHarf;
  mark_mouth[5].mMy = lineLength * 8 - windowBaseHarf;
  mark_mouth[6].mMx = lineLength * 2 - windowBaseHarf;
  mark_mouth[6].mMy = lineLength * 8 - windowBaseHarf;
  mark_mouth[7].mMx = lineLength * 2 - windowBaseHarf;
  mark_mouth[7].mMy = lineLength * 7 - windowBaseHarf;
  mark_mouth[8].mMx = lineLength * 2 - windowBaseHarf;
  mark_mouth[8].mMy = lineLength * 6 - windowBaseHarf;

  //パーツを囲う図形の線上の点の配列設定
  let pOLx = -width / 2;
  for (let i = 0; i < cols; i++) {
    pOL[i] = [];
    let pOLy = -height / 2;
    for (let j = 0; j < rows; j++) {
      pOL[i][j] = new pointOnLine(pOLx, pOLy);
      pOLy = pOLy + w;
    }
    pOLx = pOLx + w;
  }

  //初期フレームの配列設定
  let iKx = -width / 2;
  for (let i = 0; i < cols; i++) {
    iK[i] = [];
    let iKy = -height / 2;
    for (let j = 0; j < rows; j++) {
      iK[i][j] = new initialKeyFrame(iKx, iKy);
      iKy = iKy + w;
    }
    iKx = iKx + w;
  }

  //最終フレームの配列設定
  let lKx = -width / 2;
  for (let i = 0; i < cols; i++) {
    lK[i] = [];
    let lKy = -height / 2;
    for (let j = 0; j < rows; j++) {
      lK[i][j] = new lastKeyFrame(lKx, lKy);
      lKy = lKy + w;
    }
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

          if (key == "s") {
            let d = dist(
              pT[i][j].x,
              pT[i][j].y,
              mouseX - width / 2,
              mouseY - height / 2
            );
            if (d < 10) {
              pT[i][j].x = mouseX - width / 2;
              pT[i][j].y = mouseY - height / 2;
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

        stroke(0, 255, 0);
        strokeWeight(5);
        point(pT[i][j].x, pT[i][j].y);
      }
    }
  }

  //左目を囲う図形のマウス移動
  for (let i = 0; i < markNum; i++) {
    if (mouseIsPressed == true) {
      let d_eyeL = dist(
        mark_eye_L[i].mELx,
        mark_eye_L[i].mELy,
        mouseX - width / 2,
        mouseY - height / 2
      );
      if (d_eyeL < w/4) {
        mark_eye_L[i].mELx = mouseX - width / 2;
        mark_eye_L[i].mELy = mouseY - height / 2;
      }
    }
  }

  //右目を囲う図形のマウス移動
  for (let i = 0; i < markNum; i++) {
    if (mouseIsPressed == true) {
      let d_eyeR = dist(
        mark_eye_R[i].mERx,
        mark_eye_R[i].mERy,
        mouseX - width / 2,
        mouseY - height / 2
      );
      if (d_eyeR < w/4) {
        mark_eye_R[i].mERx = mouseX - width / 2;
        mark_eye_R[i].mERy = mouseY - height / 2;
      }
    }
  }

  //口を囲う図形のマウス移動
  for (let i = 0; i < markNum; i++) {
    if (mouseIsPressed == true) {
      let d_mouth = dist(
        mark_mouth[i].mMx,
        mark_mouth[i].mMy,
        mouseX - width / 2,
        mouseY - height / 2
      );
      if (d_mouth < w/4) {
        mark_mouth[i].mMx = mouseX - width / 2;
        mark_mouth[i].mMy = mouseY - height / 2;
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

    //左目を囲う図形の描画
    strokeWeight(5);
    for (let i = 0; i < markNum - 1; i++) {
      line(
        mark_eye_L[i].mELx,
        mark_eye_L[i].mELy,
        mark_eye_L[i + 1].mELx,
        mark_eye_L[i + 1].mELy
      );
    }
    line(
      mark_eye_L[8].mELx,
      mark_eye_L[8].mELy,
      mark_eye_L[0].mELx,
      mark_eye_L[0].mELy
    );

    strokeWeight(30);
    for (let i = 0; i < markNum; i++) {
      point(mark_eye_L[i].mELx, mark_eye_L[i].mELy);
    }

    //右目を囲う図形の描画
    strokeWeight(5);
    for (let i = 0; i < markNum - 1; i++) {
      line(
        mark_eye_R[i].mERx,
        mark_eye_R[i].mERy,
        mark_eye_R[i + 1].mERx,
        mark_eye_R[i + 1].mERy
      );
    }
    line(
      mark_eye_R[8].mERx,
      mark_eye_R[8].mERy,
      mark_eye_R[0].mERx,
      mark_eye_R[0].mERy
    );

    strokeWeight(30);
    for (let i = 0; i < markNum; i++) {
      point(mark_eye_R[i].mERx, mark_eye_R[i].mERy);
    }

    //口を囲う図形の描画
    strokeWeight(5);
    for (let i = 0; i < markNum - 1; i++) {
      stroke(255);
      line(
        mark_mouth[i].mMx,
        mark_mouth[i].mMy,
        mark_mouth[i + 1].mMx,
        mark_mouth[i + 1].mMy
      );
    }
    stroke(255);
    line(
      mark_mouth[8].mMx,
      mark_mouth[8].mMy,
      mark_mouth[0].mMx,
      mark_mouth[0].mMy
    );

    strokeWeight(30);
    for (let i = 0; i < markNum; i++) {
      point(mark_mouth[i].mMx, mark_mouth[i].mMy);
    }
  }

  //点と直線の距離
  for (let k = 0; k < markNum - 1; k++) {
    for (let j = 0; j < rows - 1; j++) {
      for (let i = 0; i < cols; i++) {
        let a = mark_eye_L[k].mELy - mark_eye_L[k + 1].mELy;
        let b = -(mark_eye_L[k].mELx - mark_eye_L[k + 1].mELx);
        let c =
          (mark_eye_L[k].mELy - mark_eye_L[k + 1].mELy) * -mark_eye_L[k].mELx +
          mark_eye_L[k].mELy * (mark_eye_L[k].mELx - mark_eye_L[k + 1].mELx);
        let d = abs(a * pT[i][j].x + b * pT[i][j].y + c) / sqrt(sq(a) + sq(b));

        if (
          (mark_eye_L[k].mELx - w / 2 < pT[i][j].x &&
            pT[i][j].x < mark_eye_L[k + 1].mELx + w / 2) ||
          (mark_eye_L[k + 1].mELx - w / 2 < pT[i][j].x &&
            pT[i][j].x < mark_eye_L[k].mELx + w / 2)
        ) {
          if (
            (mark_eye_L[k].mELy - w / 2 < pT[i][j].y &&
              pT[i][j].y < mark_eye_L[k + 1].mELy + w / 2) ||
            (mark_eye_L[k + 1].mELy - w / 2 < pT[i][j].y &&
              pT[i][j].y < mark_eye_L[k].mELy + w / 2)
          ) {
            if (d < w / 2) {
              fill(255, 0, 0);
              noStroke();
              ellipse(pT[i][j].x, pT[i][j].y, 10, 10);
            }
          }
        }

        if (pointPosSet == 1) {
          if (
            (mark_eye_L[k].mELx - w / 2 < pT[i][j].x &&
              pT[i][j].x < mark_eye_L[k + 1].mELx + w / 2) ||
            (mark_eye_L[k + 1].mELx - w / 2 < pT[i][j].x &&
              pT[i][j].x < mark_eye_L[k].mELx + w / 2)
          ) {
            if (
              (mark_eye_L[k].mELy - w / 2 < pT[i][j].y &&
                pT[i][j].y < mark_eye_L[k + 1].mELy + w / 2) ||
              (mark_eye_L[k + 1].mELy - w / 2 < pT[i][j].y &&
                pT[i][j].y < mark_eye_L[k].mELy + w / 2)
            ) {
              if (d < w / 2) {
                // 線分が垂直の場合
                if (mark_eye_L[k].mELx == mark_eye_L[k + 1].mELx) {
                  pOL[i][j].pOLx = mark_eye_L[k].mELx;
                  pOL[i][j].pOLy = pT[i][j].y;
                  //pP[i][j].y = pT[i][j].y;
                }
                // 線分が水平の場合
                else if (mark_eye_L[k].mELy == mark_eye_L[k + 1].mELy) {
                  pOL[i][j].pOLx = pT[i][j].x;
                  //pP[i][j].x = pT[i][j].x;
                  pOL[i][j].pOLy = mark_eye_L[k].mELy;
                }
                //それ以外
                else {
                  let m1, m2, l1, l2;
                  //線分の傾き
                  m1 =
                    (mark_eye_L[k + 1].mELy - mark_eye_L[k].mELy) /
                    (mark_eye_L[k + 1].mELx - mark_eye_L[k].mELx);
                  //線分のY切片
                  l1 = mark_eye_L[k].mELy - (m1 * mark_eye_L[k].mELx);

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

class markEyeLeft {
  constructor(x, y) {
    this.x = y;
    this.x = y;
  }
}

class markEyeRight {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

class markMouth {
  constructor(x, y) {
    this.x = x;
    this.y = y;
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
