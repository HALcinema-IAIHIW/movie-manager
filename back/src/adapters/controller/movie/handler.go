package movie

import (
	"modules/src/adapters/presenter"
	"modules/src/database/model"
	"modules/src/datastructure/request"
	"modules/src/module"
	"modules/src/usecases"
	"strconv"

	"fmt"
	"net/http"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
)

type MovieHandler struct {
	Usecase *usecases.MovieUsecase
}

func NewMovieHandler(uc *usecases.MovieUsecase) *MovieHandler {
	return &MovieHandler{Usecase: uc}
}

func (h *MovieHandler) Routes() module.Route {
	return NewMovieRoutes(h)
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
			PosterPath:  req.PosterPath,
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
