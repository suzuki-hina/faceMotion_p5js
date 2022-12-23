let img;

const res = 2;
const cols = 20 / res;
const rows = 20 / res;
let windowBase;
let w;

//点の表示・非表示の変数
let pointColorChanger = true;

//テクスチャのポイントの変数
let pP = [];
let pT = [];

//パーツを囲う線の頂点の数
const markNum = 27;
let mark = [];
let lineMouseMove = true;
let lineColorChanger = true;

//囲う線上にある点
let pointPosSet = false;
let pOL = [];
let markMouseMove = false;
let markColorChanger = true;

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

//ボタンつくる
let textureButton;
let resetButton;
let TdecisionButton;
let deformButton;
let DdecisionButton;
let animationButton;


function setup() {
  //ウィンドウのスワイプを止める
  window.addEventListener("touchstart", function (event) { event.preventDefault(); }, { passive: false });
  window.addEventListener("touchmove", function (event) { event.preventDefault(); }, { passive: false });

  createCanvas(windowWidth, windowHeight, WEBGL);
  img = loadImage("img/parkFace.png");

  if (windowWidth <= windowHeight) {
    windowBase = windowWidth;
    w = windowWidth / cols;
  } else if (windowWidth > windowHeight) {
    windowBase = windowHeight;
    w = windowHeight / rows;
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
  mark[0].mx = w * 2 - width / 2;
  mark[0].my = w * 2 - height / 2;
  mark[1].mx = w * 3 - width / 2;
  mark[1].my = w * 2 - height / 2;
  mark[2].mx = w * 4 - width / 2;
  mark[2].my = w * 2 - height / 2;
  mark[3].mx = w * 4 - width / 2;
  mark[3].my = w * 3 - height / 2;
  mark[4].mx = w * 4 - width / 2;
  mark[4].my = w * 4 - height / 2;
  mark[5].mx = w * 3 - width / 2;
  mark[5].my = w * 4 - height / 2;
  mark[6].mx = w * 2 - width / 2;
  mark[6].my = w * 4 - height / 2;
  mark[7].mx = w * 2 - width / 2;
  mark[7].my = w * 3 - height / 2;
  mark[8].mx = w * 2 - width / 2;
  mark[8].my = w * 2 - height / 2;

  //左目を囲う図形の初期位置
  mark[9].mx = w * 6 - width / 2;
  mark[9].my = w * 2 - height / 2;
  mark[10].mx = w * 7 - width / 2;
  mark[10].my = w * 2 - height / 2;
  mark[11].mx = w * 8 - width / 2;
  mark[11].my = w * 2 - height / 2;
  mark[12].mx = w * 8 - width / 2;
  mark[12].my = w * 3 - height / 2;
  mark[13].mx = w * 8 - width / 2;
  mark[13].my = w * 4 - height / 2;
  mark[14].mx = w * 7 - width / 2;
  mark[14].my = w * 4 - height / 2;
  mark[15].mx = w * 6 - width / 2;
  mark[15].my = w * 4 - height / 2;
  mark[16].mx = w * 6 - width / 2;
  mark[16].my = w * 3 - height / 2;
  mark[17].mx = w * 6 - width / 2;
  mark[17].my = w * 2 - height / 2;

  //口を囲う図形の初期位置
  mark[18].mx = w * 2 - width / 2;
  mark[18].my = w * 6 - height / 2;
  mark[19].mx = w * 5 - width / 2;
  mark[19].my = w * 6 - height / 2;
  mark[20].mx = w * 8 - width / 2;
  mark[20].my = w * 6 - height / 2;
  mark[21].mx = w * 8 - width / 2;
  mark[21].my = w * 7 - height / 2;
  mark[22].mx = w * 8 - width / 2;
  mark[22].my = w * 8 - height / 2;
  mark[23].mx = w * 5 - width / 2;
  mark[23].my = w * 8 - height / 2;
  mark[24].mx = w * 2 - width / 2;
  mark[24].my = w * 8 - height / 2;
  mark[25].mx = w * 2 - width / 2;
  mark[25].my = w * 7 - height / 2;
  mark[26].mx = w * 2 - width / 2;
  mark[26].my = w * 6 - height / 2;

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

  //ボタンの作成
  textureButton = createButton("texture");
  textureButton.position(w, w * 9);
  textureButton.size(w, w);
  textureButton.mousePressed(TextureButton);

  resetButton = createButton("reset");
  resetButton.position(w * 2, w * 9);
  resetButton.size(w, w);
  resetButton.mousePressed(ResetButton);

  TdecisionButton = createButton("Tdecision");
  TdecisionButton.position(w * 3, w * 9);
  TdecisionButton.size(w, w);
  TdecisionButton.mousePressed(TDecisionButton);

  deformButton = createButton("deform");
  deformButton.position(w * 4, w * 9);
  deformButton.size(w, w);
  deformButton.mousePressed(DeformButton);

  DdecisionButton = createButton("Ddecision");
  DdecisionButton.position(w * 5, w * 9);
  DdecisionButton.size(w, w);
  DdecisionButton.mousePressed(DDecisionButton);

  animationButton = createButton("animation");
  animationButton.position(w * 6, w * 9);
  animationButton.size(w, w);
  animationButton.mousePressed(AnimationButton);
}

function draw() {
  background(0);
  noStroke();

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
  if (markMouseMove == true) {
    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        if (mouseIsPressed == true) {
          let d = dist(pP[i][j].x, pP[i][j].y, mouseX - width / 2, mouseY - height / 2);
          if (d < 10) {
            pP[i][j].x = mouseX - width / 2;
            pP[i][j].y = mouseY - height / 2;
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
  if (lineMouseMove == true) {
    for (let i = 0; i < markNum; i++) {
      if (mouseIsPressed == true) {
        let dis = dist(mark[i].mx, mark[i].my, mouseX - width / 2, mouseY - height / 2);

        if (dis < w / 4) {
          mark[i].mx = mouseX - width / 2;
          mark[i].my = mouseY - height / 2;
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
                  fill(0, 255, 0);
                  noStroke();
                  ellipse(pT[i][j].x, pT[i][j].y, 10, 10);
                }
                else if (markNum / 3 * 2 <= k && k < markNum - 1) {
                  fill(0, 0, 255);
                  noStroke();
                  ellipse(pT[i][j].x, pT[i][j].y, 10, 10);
                }
              }
            }
          }
        }

        if (pointPosSet == 1) {
          if ((mark[k].mx - w / 2 < pT[i][j].x && pT[i][j].x < mark[k + 1].mx + w / 2) || (mark[k + 1].mx - w / 2 < pT[i][j].x && pT[i][j].x < mark[k].mx + w / 2)) {
            if ((mark[k].my - w / 2 < pT[i][j].y && pT[i][j].y < mark[k + 1].my + w / 2) || (mark[k + 1].my - w / 2 < pT[i][j].y && pT[i][j].y < mark[k].my + w / 2)) {
              if (d < w / 2) {
                if (0 <= k && k < markNum / 3 - 1) {
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
                    m1 = (mark[k + 1].my - mark[k].my) / (mark[k + 1].mx - mark[k].mx);
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
                }

                else if (markNum / 3 <= k && k < markNum / 3 * 2 - 1) {
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
                    m1 = (mark[k + 1].my - mark[k].my) / (mark[k + 1].mx - mark[k].mx);
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
                }

                else if (markNum / 3 * 2 <= k && k < markNum - 1) {
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
                    m1 = (mark[k + 1].my - mark[k].my) / (mark[k + 1].mx - mark[k].mx);
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

function TextureButton() {
  pointPosSet = true;
  pointColorChanger = true;
  markMouseMove = false;
  lineMouseMove = true;
  lineColorChanger = true;
  markColorChanger = true;
  markMouseMove = false;
}

function ResetButton() {
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

  pointColorChanger = true;
  lineMouseMove = true;
  lineColorChanger = true;
  markColorChanger = true;
  markMouseMove = false;
}

function TDecisionButton() {
  pointPosSet = false;

  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      iK[i][j].x = pP[i][j].x;
      iK[i][j].y = pP[i][j].y;
    }
  }

  pointColorChanger = true;
  lineMouseMove = false;
  lineColorChanger = false;
  markColorChanger = true;
  markMouseMove = true;
}

function DeformButton() {
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      lK[i][j].x = pP[i][j].x;
      lK[i][j].y = pP[i][j].y;
    }
  }

  pointColorChanger = true;
  markColorChanger = true;
  markMouseMove = true;
}

function DDecisionButton() {
  isMove = false;
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      pP[i][j].x = iK[i][j].x;
      pP[i][j].y = iK[i][j].y;
    }
  }

  pointColorChanger = true;
  markColorChanger = true;
  markMouseMove = true;
}

function AnimationButton() {
  pointColorChanger = false;
  markColorChanger = false;
  isMove = true;
  stopTime = 0;
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
