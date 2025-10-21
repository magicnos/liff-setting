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



// それぞれのラジオボタンを起動
async function setRadioButton(){

  // 欠時数テキストの表示表示方法ラジオボタン
  const radiosAbsenceText = document.querySelectorAll('input[name="absenceText"]');
  radiosAbsenceText.forEach(radio => {
    radio.addEventListener('change', async () => {
      const Ref = doc(db, userId, 'setting');
      switch (radio.value){
        case 1:
          await updateDoc(Ref, { absenceText: 1 });
          break;
        case 2:
          await updateDoc(Ref, { absenceText: 2 });
          break;
        case 3:
          await updateDoc(Ref, { absenceText: 3 });
          break;
        case 4:
          await updateDoc(Ref, { absenceText: 4 });
          break;
        case 5:
          await updateDoc(Ref, { absenceText: 5 });
          break;
        case 6:
          await updateDoc(Ref, { absenceText: 6 });
          break;
        default:
          break;
      }
    });
  });

}


// 欠時数テキストの表示表示方法ラジオボタンのデフォルトを設定
function absenceTextDefault(){
  const setting = settingData.absenceText;
  switch (setting){
    case 1:
      document.getElementById("a1").checked = true;
      break;
    case 2:
      document.getElementById("a2").checked = true;
      break;
    case 3:
      document.getElementById("a3").checked = true;
      break;
    case 4:
      document.getElementById("a4").checked = true;
      break;
    case 5:
      document.getElementById("a5").checked = true;
      break;
    case 6:
      document.getElementById("a6").checked = true;
      break;
    default:
      break;
  }
}





// 最初のliffを作成
function firstLiffBuilder(){
  // userIdを表示
  setUserId();

  // それぞれのラジオボタンを起動
  setRadioButton();
  // 欠時数テキスト表示方法ラジオボタンのデフォルトを設定
  absenceTextDefault();
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

  // Liffを完成
  firstLiffBuilder();
}


main();