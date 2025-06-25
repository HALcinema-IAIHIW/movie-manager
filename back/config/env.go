package config

import (
	"log"
	"os"

	"github.com/joho/godotenv"
)

type Env struct {
	// PostgreSQL用
	PostgresHost     string
	PostgresPort     string
	PostgresUser     string
	PostgresPassword string
	PostgresName     string

	// MongoDB用
	MongoHost     string
	MongoPort     string
	MongoUser     string
	MongoPassword string
	MongoDatabase string
}

func LoadEnv() Env {
	if err := godotenv.Load(); err != nil {
		log.Printf(".envファイルが見つかりません")
	}

	return Env{
		// PostgreSQL
		PostgresHost:     os.Getenv("POSTGRES_HOST"),
		PostgresPort:     os.Getenv("POSTGRES_PORT"),
		PostgresUser:     os.Getenv("POSTGRES_USER"),
		PostgresPassword: os.Getenv("POSTGRES_PASSWORD"),
		PostgresName:     os.Getenv("POSTGRES_DATABASE"),

		// MongoDB
		MongoHost:     os.Getenv("MONGO_HOST"),
		MongoPort:     os.Getenv("MONGO_PORT"),
		MongoUser:     os.Getenv("MONGO_USER"),
		MongoPassword: os.Getenv("MONGO_PASSWORD"),
		MongoDatabase: os.Getenv("MONGO_DATABASE"),
	}
}
