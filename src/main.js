import 'https://static.line-scdn.net/liff/edge/2/sdk.js';
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import {
  getFirestore,
  getDoc,
  doc,
  updateDoc
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";
import { getAuth, signInAnonymously } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";


let db, userId;
let noticeSettingData = {}, nomalSettingData = {};


// Firestore初期化
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


// userIdを表示
function setUserId(){
  document.getElementById("userId").textContent = userId;
}


// それぞれのラジオボタン、チェックボックス起動
function setButton(){
  // 通知曜日チェックボックス
  document.querySelectorAll('.chipDays').forEach(chip => {
    chip.addEventListener('click', async () => {
      const Ref = doc(db, 'users', userId);
      const dayIndex = Number(chip.getAttribute('value'));
      if (!chip.classList.contains('active')){
        const selectedCount = noticeSettingData.week.filter(v => v).length;
        if (selectedCount < 5) {
          chip.classList.add('active');
          noticeSettingData.week[dayIndex] = true;
        }
      }else{
        chip.classList.remove('active');
        noticeSettingData.week[dayIndex] = false;
      }
      await updateDoc(Ref, { ['noticeSetting.week']: noticeSettingData.week });
    });
  });

  // 通知時間
  const time = document.getElementById('time');
  time.addEventListener('change', async () => {
    noticeSettingData.time = time.value;
    const Ref = doc(db, 'users', userId);
    await updateDoc(Ref, { ['noticeSetting.time']: time.value});
  });

  // 欠時数テキストの表示表示方法ラジオボタン
  const radiosAbsenceText = document.querySelectorAll('input[name="absenceText"]');
  radiosAbsenceText.forEach(radio => {
    radio.addEventListener('change', async () => {
      const Ref = doc(db, 'users', userId);
      await updateDoc(Ref, { ['nomalSetting.absenceText']: Number(radio.value)});
    });
  });
}


// それぞれのラジオボタン、チェックボックスのデフォルトを設定
function setButtonDefault(){
  // 通知曜日チェックボックス
  for (let i = 0; i < 7; i++){
    const chip = document.getElementById(`d${i}`);
    const isChecked = noticeSettingData.week[i];
    // いったん全てのchipDaysを消してから再設定する
    chip.classList.remove('active');
    // trueならクラスを追加
    if (isChecked){
      chip.classList.add('active');
    }
  }

  // 通知時間
  document.getElementById('time').value = noticeSettingData.time;

  // 欠時数テキストの表示表示方法ラジオボタン
  const absenceText = nomalSettingData.absenceText;
  document.getElementById(`a${absenceText}`).checked = true;
}


// 最初のliff作成
function firstLiffBuilder(){
  // userIdを表示
  setUserId();

  // それぞれのラジオボタン、チェックボックス起動
  setButton();
  // それぞれのラジオボタン、チェックボックスのデフォルトを設定
  setButtonDefault();
}




// メインの処理
async function main(){
  // DB初期化
  await initFirebase();
  // liff初期化とuserId取得
  userId = await firstLiff();

  // 設定状況を取得
  const kari = await getData('users', userId);
  noticeSettingData = kari.noticeSetting;
  nomalSettingData = kari.nomalSetting;

  // Liffを完成
  firstLiffBuilder();
}


main();