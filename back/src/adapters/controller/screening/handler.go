package screening

import (
	"modules/src/database/model"
	"modules/src/datastructure/request"
	"modules/src/datastructure/response"
	"modules/src/module"
	"modules/src/usecases"

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
			// PlanID:    req.PlanId,
			StartTime: req.StartTime,
			Duration:  req.Duration,
		}

		result, err := h.Usecase.CreateScreening(screening)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "作成失敗"})
			return
		}

		endTime := result.StartTime.Add(time.Duration(result.Duration) * time.Minute)
		c.JSON(http.StatusCreated, response.ScreeningResponse{
			// PlanID:    result.PlanID,
			StartTime: result.StartTime,
			EndTime:   endTime,
		})
	}
}

func (h *ScreeningHandler) GetScreeningsByDate() gin.HandlerFunc {
	return func(c *gin.Context) {
		dateStr := c.Query("date")
		date, err := time.Parse("2006-01-02", dateStr)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "日付形式が不正です (例: 2025-06-22)"})
			return
		}

		result, err := h.Usecase.GetScreeningsByDate(date)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "取得失敗"})
			return
		}
		c.JSON(http.StatusOK, result)
	}
}
