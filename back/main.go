package main

import (
	"log"
	"modules/config"

	// "modules/database"
	"modules/database/model"
	"modules/router"
)

func main() {

	env := config.LoadEnv()

	// DB接続
	db, err := model.NewDB(env)
	if err != nil {
		log.Fatalf("DB接続エラー: %v", err)
	}

	// マイグレーション
	if err := db.AutoMigrate(
		&model.User{},
		&model.Movie{},
		&model.SeatType{},
	); err != nil {
		log.Fatalf("マイグレーションエラー: %v", err)
	}

	r := router.SetupRouter(db)

	// サーバー起動
	r.Run()
}
