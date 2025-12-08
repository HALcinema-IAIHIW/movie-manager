package seat

import (
	"errors"
	"fmt"
	"gorm.io/gorm"
	"modules/src/adapters/presenter"
	"modules/src/database/model"
	"modules/src/datastructure/request"
	"modules/src/module"
	"modules/src/usecases"
	"net/http"
	"strconv"
	"strings"

	"github.com/gin-gonic/gin"
)

type SeatHandler struct {
	Usecase *usecases.SeatUsecase
}

func NewSeatHandler(uc *usecases.SeatUsecase) *SeatHandler {
	return &SeatHandler{Usecase: uc}
}

func (h *SeatHandler) Routes() module.Route {
	return NewSeatRoutes(h)
}

func (h *SeatHandler) CreateSeat() gin.HandlerFunc {
	return func(c *gin.Context) {
		var req request.CreateSeatRequest
		if err := c.ShouldBindJSON(&req); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		seat := &model.Seat{
			ScreenID: req.ScreenID,
			Row:      req.Row,
			Column:   req.Column,
		}
		err := h.Usecase.CreateSeat(seat)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "座席の登録に失敗しました"})
			return
		}

		c.JSON(http.StatusCreated, presenter.ToSeatResponse(*seat))
	}
}

func (h *SeatHandler) GetSeatsByScreenID() gin.HandlerFunc {
	return func(c *gin.Context) {
		screenIDStr := c.Param("screen_id")                     // URLパスから"screen_id"を取得
		screenID, err := strconv.ParseUint(screenIDStr, 10, 32) // 文字列をuintに変換
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "無効なスクリーンIDです"})
			return
		}

		seats, err := h.Usecase.GetSeatsByScreenID(uint(screenID))
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "指定されたスクリーンの座席の取得に失敗しました"})
			return
		}

		c.JSON(http.StatusOK, presenter.ToSeatResponseList(seats))
	}
}

func (h *SeatHandler) GetSeats() gin.HandlerFunc {
	return func(c *gin.Context) {
		seats, err := h.Usecase.GetAllSeats()
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "座席の取得に失敗しました"})
			return
		}
		c.JSON(http.StatusOK, presenter.ToSeatResponseList(seats))
	}
}

func (h *SeatHandler) GetSeatByRowColumnScreenID() gin.HandlerFunc {
	return func(c *gin.Context) {
		screenIDParam := c.Param("screen_id")
		seatIdStr := c.Param("seatIdStr")

		// デバッグログ
		fmt.Printf("DEBUG: GetSeatByRowColumnScreenID received - screenIDParam: '%s', seatIdStr: '%s'\n",
			screenIDParam, seatIdStr)

		// screenID の数値変換
		screenIDUint64, err := strconv.ParseUint(screenIDParam, 10, 64)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "無効なスクリーンIDが指定されました", "details": fmt.Sprintf("'%s'を数値に変換できません: %v", screenIDParam, err)})
			return
		}
		screenID := uint(screenIDUint64)

		var rowParam string
		var columnInt int

		if len(seatIdStr) < 2 { // 最低でも"A1"のような2文字が必要
			c.JSON(http.StatusBadRequest, gin.H{"error": "無効な座席ID形式が指定されました", "details": fmt.Sprintf("座席ID '%s'の形式が不正です", seatIdStr)})
			return
		}
		rowParam = strings.ToUpper(seatIdStr[0:1])
		colStr := seatIdStr[1:]

		colVal, parseErr := strconv.Atoi(colStr)
		if parseErr != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "無効な列番号が指定されました", "details": fmt.Sprintf("座席ID '%s'の列番号を数値に変換できません: %v", seatIdStr, parseErr)})
			return
		}
		columnInt = colVal

		// ユースケースを呼び出す
		seat, err := h.Usecase.GetSeatByRowColumnScreenID(rowParam, columnInt, screenID)
		if err != nil {
			if errors.Is(err, gorm.ErrRecordNotFound) {
				c.JSON(http.StatusNotFound, gin.H{"error": "指定された座席が見つかりません"})
				return
			}
			c.JSON(http.StatusInternalServerError, gin.H{"error": "座席情報の取得に失敗しました", "details": err.Error()})
			return
		}
		if seat == nil {
			c.JSON(http.StatusNotFound, gin.H{"error": "指定された座席が見つかりません"})
			return
		}

		c.JSON(http.StatusOK, presenter.ToSeatResponse(*seat))
	}
}

// スクリーンの最大行・列まで座席を一括生成
func (h *SeatHandler) GenerateSeats() gin.HandlerFunc {
	return func(c *gin.Context) {
		screenIDStr := c.Param("screen_id")
		screenID, err := strconv.ParseUint(screenIDStr, 10, 32) // 10進数として解釈し、32bitに収まる値としてチェック
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "無効なスクリーンIDです"})
			return
		}

		created, err := h.Usecase.GenerateSeatsByScreenID(uint(screenID)) // uint64にキャストしてます
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "座席の一括生成に失敗しました", "details": err.Error()})
			return
		}

		c.JSON(http.StatusCreated, gin.H{"created_count": created})
	}
}
