package movie

import (
	"modules/src/adapters/presenter"
	"modules/src/database/model"
	"modules/src/datastructure/request"
	"modules/src/module"
	"modules/src/usecases"

	"fmt"
	"net/http"
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
			Description: req.Description,
			ReleaseDate: releaseDate,
			Genre:       req.Genre,
			Director:    req.Director,
			Duration:    req.Duration,
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
