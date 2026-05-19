# Soccer Team Manager v6 shared

この版は、全員のスマホで同じデータを共有するために Cloudflare Workers + KV を使います。

## 1. Cloudflare側

1. Cloudflareにログイン
2. Workers & Pages → Create Worker
3. `worker.js` の中身を貼り付けて Deploy
4. KV namespace を作成
5. Workerの Settings → Bindings → KV namespace bindings
6. Variable name を `SOCCER_KV` にする
7. 作ったKV namespaceを選ぶ
8. Deploy

Worker URL例：

https://xxxx.yourname.workers.dev

## 2. GitHub側

1. `app.js` の上の方にある以下を探す

const API_URL="";

2. ここにWorker URLを貼る

const API_URL="https://xxxx.yourname.workers.dev";

3. `index.html`, `style.css`, `app.js` をGitHubにアップロード

## 3. スマホで開く

URL末尾に `?v=6` を付けて開く。

例：

https://hideomizu.github.io/xxxx/index.html?v=6

## 注意

- これは軽量な共有DBです。
- パスワードは本格的なサーバー認証ではありません。
- 本名、住所、電話番号、健康情報、写真は入れないでください。
- 保存方式は「最後に保存した人の内容が勝つ」方式です。
