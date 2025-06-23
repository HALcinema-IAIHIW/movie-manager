package main

import (
	"log"
	"modules/src/config"
	"modules/src/database/model"
	"modules/src/di"
	frameworks "modules/src/frameworks/db"
	"modules/src/router"
)

func main() {

	env := config.LoadEnv()

	// DB接続
	db, err := frameworks.NewDB(env)
	if err != nil {
		log.Fatalf("DB接続エラー: %v", err)
	}

	// マイグレーション
	if err := db.AutoMigrate(
		&model.User{},
		&model.Movie{},
		&model.SeatType{},
		&model.Screening{},
		&model.Screen{},
		&model.Purchase{},
	); err != nil {
		log.Fatalf("マイグレーションエラー: %v", err)
	}

	handlers := di.NewHandlers(db)

	r := router.SetupRouter(handlers)

	// サーバー起動
	r.Run()
}
