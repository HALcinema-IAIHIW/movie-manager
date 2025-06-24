package main

import (
	"log"
	"modules/src/internal"
)

func main() {

	initializer, err := internal.NewInitializer()
	if err != nil {
		log.Fatalf("初期化失敗: %v", err)
	}

	r := initializer.SetupRouter()
	// サーバー起動
	r.Run()
}
