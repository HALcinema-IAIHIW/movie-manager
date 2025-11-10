# movie-manager
仮想の映画館予約管理システムを構築したプロジェクト。映画ポスター登録/取得APIを中心に他メンバーへ共有するための手順とエンドポイント仕様をまとめる。

## 作業依頼
- dockerでファイルサーバーを作る
- 登録するエンドポイントを作成する
  - その際、`back/src/database/model/scheme.go` にあるMovieテーブルと結びつけること

## 調査・検証結果
- `back/docker-compose.yml` の `file-server` (nginx) サービスを含め、Postgres と Mongo を `docker compose --env-file .env up -d` で起動し、`env GOCACHE=/tmp/go-build go run ./src/driver/main.go` でAPIを起動することで、バックエンドが正常に立ち上がることを確認。
- 通常環境では `back/` で `go run ./src/driver/main.go` を実行するだけで Gin サーバーが起動する（本 CLI 環境では権限の都合で `GOCACHE` を `/tmp` に切り替えて実行した）。
- `POST /movies/` に映画情報を送信すると `HTTP 201` と完了メッセージが返り、`GET /movies/` で登録内容が取得できた。
- `POST /movies/1/poster` に PNG ファイルを送信すると `HTTP 200` と `poster_url` が返り、`back/storage/posters/` に `movie_1_<timestamp>.png` が保存され、Movieテーブルの `poster_path` に `http://localhost:8081/posters/...` が更新されることを確認。
- `GET /movies/1` および `GET /movies/1/poster` で登録済みURLが取得でき、さらに `http://localhost:8081/posters/...` から直接ダウンロードした画像がアップロード元と一致するため、ファイルサーバー経由での配信も確認済み。
- 検証終了後は `docker compose down` とプロセス停止で環境をクリーンアップ済み。テストデータ（映画1件と保存済みポスター1枚）は必要に応じて削除する。

## Dockerでのバックエンド実行と保存先
- `back/Dockerfile` を追加し、`docker-compose.yml` に `backend` サービスを定義。`docker compose --env-file .env up -d postgres-db mongo-db file-server backend` で全コンポーネントをDocker上で起動できる。
- `backend` サービスは `POSTER_STORAGE_PATH=/app/storage/posters` を使い、`file-server` と共有する `poster-data` ボリュームにポスターを書き込む。ホストにマウントせず Docker ボリューム(`back_poster-data`)内に保存されるため、「Docker内に保存」される構成になる。
- ホストからアップロード済みポスターを確認したい場合は `docker run --rm -v back_poster-data:/data alpine ls /data` などでボリュームを覗ける。もちろん `http://localhost:8081/posters/<ファイル>` からも取得可能。
- `BACKEND_PORT` を指定して `BACKEND_PORT=8082 docker compose ...` のように起動すると、ホストポートを切り替えられる（コンテナ内は常に 8080 でリッスン）。`.env` の `POSTER_STORAGE_PATH`/`FILE_SERVER_BASE_URL` はホスト実行向けで、Docker実行時は compose の `environment` で上書きしている。

## curl例（Request & Response）
- `POST /movies/`
  - ```bash
    curl -i -H "Content-Type: application/json" \
      -d '{"title":"Test Movie","subtitle":"Sub","description":"Desc","release_date":"2025-01-01","genre":"Action","director":"Dir","cast":["Actor1","Actor2"],"duration":120}' \
      http://localhost:8080/movies/
    ```
  - Response: `HTTP/1.1 201 Created` / `{"message":"映画登録が完了しました"}`
- `GET /movies/`
  - ```bash
    curl -i http://localhost:8080/movies/
    ```
  - Response: `HTTP/1.1 200 OK` / `[{"id":1,"title":"Test Movie",...,"poster_path":""}]`
- `POST /movies/1/poster`
  - ```bash
    curl -i -F "poster=@/path/to/poster.png" http://localhost:8080/movies/1/poster
    ```
  - Response: `HTTP/1.1 200 OK` / `{"poster_url":"http://localhost:8081/posters/movie_1_1762755888.png"}`
- `GET /movies/1`
  - ```bash
    curl -i http://localhost:8080/movies/1
    ```
  - Response: `HTTP/1.1 200 OK` / `{"id":1,"title":"Test Movie",...,"poster_path":"http://localhost:8081/posters/movie_1_1762755888.png"}`
- `GET /movies/1/poster`
  - ```bash
    curl -i http://localhost:8080/movies/1/poster
    ```
  - Response: `HTTP/1.1 200 OK` / `{"poster_url":"http://localhost:8081/posters/movie_1_1762755888.png"}`
- nginxファイルサーバーからの取得
  - ```bash
    curl -i http://localhost:8081/posters/movie_1_1762755888.png --output poster.png
    ```
  - Response: `HTTP/1.1 200 OK`（バイナリを `poster.png` に保存）
