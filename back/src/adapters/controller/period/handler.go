package period

import (
	"modules/src/adapters/presenter"
	"modules/src/database/model"
	"modules/src/datastructure/request"
	"modules/src/module"
	"modules/src/usecases"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
)

type PeriodHandler struct {
	Usecase *usecases.PeriodUsecase
}

func NewPeriodHandler(uc *usecases.PeriodUsecase) *PeriodHandler {
	return &PeriodHandler{Usecase: uc}
}

func (h *PeriodHandler) Routes() module.Route {
	return NewPeriodRoutes(h)
}

func (h *PeriodHandler) CreatePeriod() gin.HandlerFunc {
	return func(c *gin.Context) {
		var req request.PeriodRequest
		if err := c.ShouldBindJSON(&req); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		layout := "2006-01-02"
		startDate, err := time.Parse(layout, req.StartDate)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "開始日の形式が不正です。YYYY-MM-DDで入力してください"})
			return
		}
		endDate, err := time.Parse(layout, req.EndDate)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "終了日の形式が不正です。YYYY-MM-DDで入力してください"})
			return
		}

		period := &model.ScreeningPeriod{
			MovieID:   req.MovieID,
			ScreenID:  req.ScreenID,
			StartDate: startDate,
			EndDate:   endDate,
		}
		if err := h.Usecase.CreatePeriod(period); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "映画機関の登録に失敗しました"})
			return
		}
		c.JSON(http.StatusCreated, presenter.ToPeriodResponse(*period))
	}
}

func (h *PeriodHandler) GetPeriod() gin.HandlerFunc {
	return func(c *gin.Context) {
		periods, err := h.Usecase.GetAllPeriods()
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "上映期間の取得に失敗しました"})
			return
		}

		res := presenter.ToPeriodsResponses(periods)
		c.JSON(http.StatusOK, res)
	}
}

func (h *PeriodHandler) GetPeriodsByDate() gin.HandlerFunc {
	return func(c *gin.Context) {
		dateStr := c.Query("date")
		if dateStr == "" {
			c.JSON(http.StatusBadRequest, gin.H{"error": "日付を指定してください"})
			return
		}

		date, err := time.Parse("2006-01-02", dateStr)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "日付形式が不正です（例: 2025-07-01）"})
			return
		}

		periods, err := h.Usecase.GetPeriodsByDate(date)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "上映期間の取得に失敗しました"})
			return
		}

		res := presenter.ToPeriodsResponses(periods)
		c.JSON(http.StatusOK, res)
	}
}
