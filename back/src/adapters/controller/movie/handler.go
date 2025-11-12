package movie

import (
	"errors"
	"fmt"
	"modules/src/adapters/presenter"
	"modules/src/database/model"
	"modules/src/datastructure/request"
	"modules/src/module"
	"modules/src/usecases"
	"net/http"
	"os"
	"path/filepath"
	"strconv"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type MovieHandler struct {
	Usecase           *usecases.MovieUsecase
	posterStoragePath string
	posterBaseURL     string
}

func NewMovieHandler(uc *usecases.MovieUsecase, posterStoragePath, posterBaseURL string) *MovieHandler {
	return &MovieHandler{
		Usecase:           uc,
		posterStoragePath: posterStoragePath,
		posterBaseURL:     posterBaseURL,
	}
}

func (h *MovieHandler) Routes() module.Route {
	return NewMovieRoutes(h)
}

func (h *MovieHandler) buildPosterPath(filename string) string {
	base := strings.TrimSuffix(h.posterBaseURL, "/")
	cleanName := strings.TrimLeft(filename, "/")
	return fmt.Sprintf("%s/%s", base, cleanName)
}

func (h *MovieHandler) UploadPoster() gin.HandlerFunc {
	return func(c *gin.Context) {
		idParam := c.Param("movie_id")
		idUint64, err := strconv.ParseUint(idParam, 10, 32)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "IDが不正です"})
			return
		}
		id := uint(idUint64)

		if _, err := h.Usecase.GetMovieById(id); err != nil {
			if errors.Is(err, gorm.ErrRecordNotFound) {
				c.JSON(http.StatusNotFound, gin.H{"error": "指定した映画が見つかりません"})
				return
			}
			c.JSON(http.StatusInternalServerError, gin.H{"error": "映画情報の取得に失敗しました"})
			return
		}

		fileHeader, err := c.FormFile("poster")
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "ポスターファイルを指定してください"})
			return
		}

		ext := strings.ToLower(filepath.Ext(fileHeader.Filename))
		switch ext {
		case ".jpg", ".jpeg", ".png", ".webp":
		default:
			c.JSON(http.StatusBadRequest, gin.H{"error": "対応していないファイル形式です"})
			return
		}

		storageDir := filepath.Clean(h.posterStoragePath)
		if err := os.MkdirAll(storageDir, 0o755); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "ポスター保存先の作成に失敗しました"})
			return
		}

		filename := fmt.Sprintf("movie_%d_%d%s", id, time.Now().Unix(), ext)
		targetPath := filepath.Join(storageDir, filename)

		if err := c.SaveUploadedFile(fileHeader, targetPath); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "ポスターの保存に失敗しました"})
			return
		}

		posterPath := h.buildPosterPath(filename)
		if _, err := h.Usecase.UpdateMoviePoster(id, posterPath); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "映画ポスター情報の更新に失敗しました"})
			return
		}

		c.JSON(http.StatusOK, gin.H{"poster_path": posterPath})
	}
}

func (h *MovieHandler) GetPoster() gin.HandlerFunc {
	return func(c *gin.Context) {
		idParam := c.Param("movie_id")
		idUint64, err := strconv.ParseUint(idParam, 10, 32)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "IDが不正です"})
			return
		}
		id := uint(idUint64)

		movie, err := h.Usecase.GetMovieById(id)
		if err != nil {
			if errors.Is(err, gorm.ErrRecordNotFound) {
				c.JSON(http.StatusNotFound, gin.H{"error": "指定した映画が見つかりません"})
				return
			}
			c.JSON(http.StatusInternalServerError, gin.H{"error": "映画情報の取得に失敗しました"})
			return
		}

		if movie == nil || movie.PosterPath == "" {
			c.JSON(http.StatusNotFound, gin.H{"error": "ポスターが登録されていません"})
			return
		}

		c.JSON(http.StatusOK, gin.H{"poster_path": movie.PosterPath})
	}
}

func (h *MovieHandler) CreateMovie() gin.HandlerFunc {
	return func(c *gin.Context) {
		var req request.CreateMovieRequest
		if err := c.ShouldBindJSON(&req); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "入力形式が間違っています"})
			return
		}

		releaseDate, err := time.Parse("2006-01-02", req.ReleaseDate)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "日付はYYYY-MM-DD形式で入力してください"})
			return
		}

		movie := &model.Movie{
			Title:       req.Title,
			SubTitle:    req.SubTitle,
			Description: req.Description,
			ReleaseDate: releaseDate,
			Genre:       req.Genre,
			Director:    req.Director,
			Cast:        strings.Join(req.Cast, ","),
			Duration:    req.Duration,
			PosterPath:  "",
		}

		if err := h.Usecase.CreateMovie(movie); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "映画登録に失敗しました"})
			return
		}

		fmt.Printf("🎬 映画が登録されました: %+v\n", movie)

		c.JSON(http.StatusCreated, gin.H{"message": "映画登録が完了しました"})
	}
}

func (h *MovieHandler) GetMovies() gin.HandlerFunc {
	return func(c *gin.Context) {
		movies, err := h.Usecase.GetAllMovies()
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "映画情報の取得に失敗しました"})
			return
		}
		res := presenter.ToMovieResponseList(movies)
		c.JSON(http.StatusOK, res)
	}
}

func (h *MovieHandler) GetMovieById() gin.HandlerFunc {
	return func(c *gin.Context) {
		idParam := c.Param("movie_id")
		idUint64, err := strconv.ParseUint(idParam, 10, 32)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "IDが不正です"})
			return
		}
		id := uint(idUint64)
		movie, err := h.Usecase.GetMovieById(id)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "映画情報の取得に失敗しました"})
			return
		}
		res := presenter.ToMovieResponse(*movie)
		c.JSON(http.StatusOK, res)
	}
}
