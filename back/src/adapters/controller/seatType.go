package controller

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"

	"modules/src/database/model"
	"modules/src/datastructure/request"
)

// interfaceでおおもとのmodelsとかの型を定義し、そこから選ぶ
// Todo:
// // Create handles the endpoint that creates the TODO.
// func (h *TODOHandler) Create(ctx context.Context, req *model.CreateTODORequest) (*model.CreateTODOResponse, error) {
// 	result, err := h.svc.CreateTODO(ctx, req.Subject, req.Description)
//	if err != nil {
//		return nil, err
//	}
//	return &model.CreateTODOResponse{TODO: *result}, nil
// レイヤーごとの干渉がよくない

func CreateSeatType(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		var req request.CreateSeatTypeRequest
		if err := c.ShouldBindJSON(&req); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		seat := model.SeatType{
			Name: req.Name,
		}

		if err := db.Create(&seat).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "SeatTypeをデータベース登録失敗しました"})
			return
		}

		c.JSON(http.StatusCreated, gin.H{"message": "シートの種類を作成しました", "id": seat.ID})
	}
}
