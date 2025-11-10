# syntax=docker/dockerfile:1

FROM golang:1.22-alpine AS builder
WORKDIR /app

ENV GOTOOLCHAIN=auto

# 依存関係をキャッシュするために分割コピー
COPY go.mod go.sum ./
RUN go mod download

COPY . .
RUN CGO_ENABLED=0 GOOS=linux go build -o movie-server ./src/driver/main.go

FROM alpine:3.20
WORKDIR /app

ENV PORT=8080 \
    POSTER_STORAGE_PATH=/app/storage/posters

# 既定のファイルサーバーURLはホスト側アクセスを想定
ENV FILE_SERVER_BASE_URL=http://localhost:8081/posters

RUN addgroup -S movie && adduser -S movie -G movie
COPY --from=builder /app/movie-server /app/movie-server

# ストレージディレクトリ（マウント前提だが存在させておく）
RUN mkdir -p /app/storage/posters && chown -R movie:movie /app/storage

USER movie
EXPOSE 8080
ENTRYPOINT ["/app/movie-server"]
