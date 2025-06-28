package period

import (
	"modules/src/adapters/presenter"
	"modules/src/database/model"
	"modules/src/datastructure/request"
	"modules/src/module"
	"modules/src/usecases"
	"net/http"

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
		period := &model.ScreeningPeriod{
			MovieID:   req.MovieID,
			ScreenID:  req.ScreenID,
			StartDate: req.StartDate,
			EndDate:   req.EndDate,
		}
		if err := h.Usecase.CreatePeriod(period); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "映画機関の登録に失敗しました"})
			return
		}
		c.JSON(http.StatusCreated, presenter.ToPeriodResponce(*period))
	}
}
