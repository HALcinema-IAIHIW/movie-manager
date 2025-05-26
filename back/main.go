package main

import (
	"fmt"
	"log"
	"modules/config"
	"modules/database/model"
	"modules/router"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

func main() {

	env := config.LoadEnv()

	// DSN生成
	dsn := fmt.Sprintf(
		"host=%s user=%s password=%s dbname=%s port=%s sslmode=disable",
		env.DBHost,
		env.DBUser,
		env.DBPassword,
		env.DBName,
		env.DBPort,
	)

	// DB接続
	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatalf("DB接続エラー: %v", err)
	}

	if err := db.AutoMigrate(&model.User{}); err != nil {
		log.Fatalf("マイグレーションエラー: %v", err)
	}

	r := router.SetupRouter(db)

	// サーバー起動
	r.Run()
}
//あ