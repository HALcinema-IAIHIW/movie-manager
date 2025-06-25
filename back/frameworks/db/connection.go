package frameworks

import (
	"fmt"
	"modules/config"
	"time"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

func NewDB(env config.Env) (*gorm.DB, error) {
	dsn := fmt.Sprintf(
		"host=%s user=%s password=%s dbname=%s port=%s sslmode=disable",
		env.PostgresHost,
		env.PostgresUser,
		env.PostgresPassword,
		env.PostgresName,
		env.PostgresPort,
	)
	return connectWithRetry(postgres.Open(dsn), 5)
}

func connectWithRetry(dialector gorm.Dialector, retryCount uint) (*gorm.DB, error) {
	var db *gorm.DB
	var err error

	for i := uint(0); i < retryCount; i++ {
		db, err = gorm.Open(dialector)
		if err == nil {
			fmt.Printf(("DB接続成功"))
			return db, nil
		}
		fmt.Printf("DB接続リトライ中 (%d%d)...\n", i+1, retryCount)
		time.Sleep(2 * time.Second)
	}

	return nil, fmt.Errorf("DB接続に失敗しました： %w", err)
}
