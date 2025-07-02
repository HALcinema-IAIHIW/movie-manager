// internal/initializer.go
package internal

import (
	"modules/src/config"
	"modules/src/database/model"
	"modules/src/di"
	frameworks "modules/src/frameworks/db"
	"modules/src/router"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type Initializer struct {
	DB       *gorm.DB
	Handlers *di.Handlers
	Engine   *gin.Engine
}

func NewInitializer() (*Initializer, error) {
	// 環境変数等ロード
	env := config.LoadEnv()

	// DB接続
	db, err := frameworks.NewDB(env)
	if err != nil {
		return nil, err
	}

	// マイグレーション
	if err := db.AutoMigrate(
		&model.User{},
		&model.Movie{},
		&model.Seat{},
		&model.SeatType{},
		&model.Screening{},
		&model.Screen{},
		&model.Purchase{},
		&model.PurchaseDetail{},
	); err != nil {
		return nil, err
	}

	// ハンドラ生成（DIコンテナ的にまとめてる想定）
	handlers := di.NewHandlers(db)

	// Gin Engine初期化
	engine := gin.Default()

	return &Initializer{
		DB:       db,
		Handlers: handlers,
		Engine:   engine,
	}, nil
}

func (i *Initializer) SetupRouter() *gin.Engine {
	return router.SetupRouter(i.Handlers)
}
