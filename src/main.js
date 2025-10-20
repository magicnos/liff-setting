import './style.css';

const LIFF_ID = import.meta.env.VITE_LIFF_ID; // ← .envファイルから取得

async function main() {
  await liff.init({ liffId: LIFF_ID });

  const app = document.querySelector('#app');

  if (!liff.isLoggedIn()) {
    liff.login();
    return;
  }

  const profile = await liff.getProfile();
  app.innerHTML = `
    <h1>こんにちは、${profile.displayName} さん！</h1>
    <button id="logout">ログアウト</button>
  `;

  document.querySelector('#logout').addEventListener('click', () => {
    liff.logout();
    location.reload();
  });
}

main().catch(console.error);
