package screening

import (
	"fmt"
	"modules/src/adapters/presenter"
	"modules/src/database/model"
	"modules/src/datastructure/request"
	"modules/src/datastructure/response"
	"modules/src/module"
	"modules/src/usecases"
	"strconv"

	"net/http"
	"time"

	"github.com/gin-gonic/gin"
)

type ScreeningHandler struct {
	Usecase *usecases.ScreeningUsecase
}

func NewScreeningHandler(uc *usecases.ScreeningUsecase) *ScreeningHandler {
	return &ScreeningHandler{Usecase: uc}
}

func (h *ScreeningHandler) Routes() module.Route {
	return NewScreeningRoutes(h)
}

func (h *ScreeningHandler) CreateScreening() gin.HandlerFunc {
	return func(c *gin.Context) {
		var req request.CreateScreeningRequest
		if err := c.ShouldBindJSON(&req); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		screening := &model.Screening{
			ScreeningPeriodID: req.ScreeningPeriodID,
			Date:              req.Date,
			StartTime:         req.StartTime,
			Duration:          req.Duration,
		}

		result, err := h.Usecase.CreateScreening(screening)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "上映作成に失敗しました"})
			return
		}

		endTime := result.StartTime.Add(time.Duration(result.Duration) * time.Minute).Format("15:04")

		c.JSON(http.StatusCreated, response.ScreeningResponse{
			ID:                result.ID,
			ScreeningPeriodID: result.ScreeningPeriodID,
			MovieID:           result.ScreeningPeriod.MovieID,
			ScreenID:          result.ScreeningPeriod.ScreenID,
			Date:              result.Date,
			StartTime:         result.StartTime,
			EndTime:           endTime,
		})
	}
}

func (h *ScreeningHandler) GetScreeningsByDate() gin.HandlerFunc {
	return func(c *gin.Context) {
		dateStr := c.Query("date")
		if dateStr == "" {
			c.JSON(http.StatusBadRequest, gin.H{"error": "クエリパラメータ 'date' は必須です"})
			return
		}

		date, err := time.Parse("2006-01-02", dateStr)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "日付形式が不正です (例: 2025-06-22)"})
			return
		}

		screenings, err := h.Usecase.GetScreeningsByDate(date)
		fmt.Printf("取得件数: %d\n", len(screenings))
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "上映情報の取得に失敗しました"})
			return
		}

		movieMap := make(map[string]*response.MovieTLResponse)

		for _, s := range screenings {
			movie := s.ScreeningPeriod.Movie
			fmt.Println(movie.Title)
			screen := s.ScreeningPeriod.Screen

			endTime := s.StartTime.Add(time.Duration(s.Duration) * time.Minute)

			key := fmt.Sprintf("%d-%d-%s", movie.ID, screen.ID, s.Date.Format("2006-01-02"))

			if _, exists := movieMap[key]; !exists {
				movieMap[key] = &response.MovieTLResponse{
					MovieId: movie.ID,
					Title:   movie.Title,
					// PosterURL: movie.PosterURL,
					ScreenID: screen.ID,
					Showings: []response.ShowingInfo{},
					Date:     s.Date.Format("2006-01-02"),
				}
			}

			movieMap[key].Showings = append(movieMap[key].Showings, response.ShowingInfo{
				ScreeningID: s.ID,
				StartTime:   s.StartTime.Format("15:04"),
				EndTime:     endTime.Format("15:04"),
			})
		}

		var resList []response.MovieTLResponse
		for _, v := range movieMap {
			resList = append(resList, *v)
		}

		c.JSON(http.StatusOK, resList)
	}
}

func (h *ScreeningHandler) GetScreeningByID() gin.HandlerFunc {
	return func(c *gin.Context) {
		id, err := strconv.Atoi(c.Param("id"))
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "IDの形式が不正です"})
			return
		}

		screening, err := h.Usecase.GetScreeningByID(uint(id))
		if err != nil {
			c.JSON(http.StatusNotFound, gin.H{"error": "該当する上映が見つかりません"})
			return
		}

		c.JSON(http.StatusOK, presenter.ToScreeningResponse(*screening))
	}
}
