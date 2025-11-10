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

	// File Server 用
	FileServerBaseURL string
	PosterStoragePath string
}

func LoadEnv() Env {
	if err := godotenv.Load(); err != nil {
		log.Printf(".envファイルが見つかりません")
	}

	posterStoragePath := os.Getenv("POSTER_STORAGE_PATH")
	if posterStoragePath == "" {
		posterStoragePath = "storage/posters"
	}

	fileServerBaseURL := os.Getenv("FILE_SERVER_BASE_URL")
	if fileServerBaseURL == "" {
		fileServerBaseURL = "http://localhost:8081/posters"
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

		// File Server
		FileServerBaseURL: fileServerBaseURL,
		PosterStoragePath: posterStoragePath,
	}
}
