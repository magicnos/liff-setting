import 'https://static.line-scdn.net/liff/edge/2/sdk.js';
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import {
  getFirestore,
  getDoc,
  doc,
  updateDoc,
  deleteField
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";
import { getAuth, signInAnonymously } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";


let db, userId;
let settingData = {};


// Fires初期化
async function initFirebase(){
  const firebaseConfig = {
    apiKey: "AIzaSyBdp66vY1UQJWQNpUaq_GBd-zcNnZXTXgg",
    authDomain: "linebot-799ed.firebaseapp.com",
    projectId: "linebot-799ed",
  };

  const app = initializeApp(firebaseConfig);
  db = getFirestore(app);
  const auth = getAuth();

  // 匿名ログイン
  await signInAnonymously(auth);
}


// liff初期化
async function firstLiff(){
  const liffId = '2008322054-bznRynae';
  try{
    // LIFF初期化
    await liff.init({ liffId });

    // ユーザープロフィール取得
    const profile = await liff.getProfile();
    return profile.userId;
  }catch (error){
    alert("エラーが起きました。再度開きなおすか、下記のエラー内容をお知らせください。\n" + "LIFF初期化に失敗しました: " + error);
  }
}


// Firestoreからデータ取得(コレクション/ドキュメント)
async function getData(path1, path2){
  const docRef = doc(db, path1, path2);
  const snap = await getDoc(docRef);

  if (snap.exists()){
    return snap.data();
  }else{
    return null;
  }
}


// チェックボック有効化
function onCheckBox(){
  document.querySelectorAll('.chipDays').forEach(chip => {
    chip.addEventListener('click', () => {
      chip.classList.toggle('active');
    });
  });
}


// userIdを表示
function setUserId(){
  document.getElementById("userId").textContent = userId;
}




// メインの処理
async function main(){
  // DB初期化
  await initFirebase();
  // liff初期化とuserId取得
  userId = await firstLiff();

  // 設定状況を取得
  settingData = await getData(userId, 'setting');

  // チェックボックス有効化
  onCheckBox();

  // userIdを表示
  setUserId();
}


main();