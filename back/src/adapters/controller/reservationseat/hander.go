package reservationseat

import (
	"fmt"
	"modules/src/adapters/presenter"
	"net/http"
	"strconv"

	"modules/src/database/model"        // modelパッケージのパスを確認
	"modules/src/datastructure/request" // requestパッケージをインポート
	"modules/src/module"                // moduleパッケージをインポート
	"modules/src/usecases"              // usecasesパッケージをインポート

	"github.com/gin-gonic/gin"
)

type ReservationSeatHandler struct {
	Usecase *usecases.ReservationSeatUsecase // 新しいユースケースを使用
}

func NewReservationSeatHandler(uc *usecases.ReservationSeatUsecase) *ReservationSeatHandler {
	return &ReservationSeatHandler{Usecase: uc}
}

// Routeインターフェースを実装（ルーターを返す）
func (h *ReservationSeatHandler) Routes() module.Route {
	return NewReservationSeatRouter(h)
}

// 座席予約を作成するハンドラーメソッド
func (h *ReservationSeatHandler) CreateReservationSeat() gin.HandlerFunc {
	return func(c *gin.Context) {
		var req request.CreateReservationSeatRequest // 新しいリクエスト構造体を使用
		if err := c.ShouldBindJSON(&req); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "入力形式が間違っています", "details": err.Error()})
			return
		}

		reservationSeat := &model.ReservationSeat{
			PurchaseID:  req.PurchaseID,
			SeatID:      req.SeatID,
			IsCancelled: false, // デフォルトでfalse
		}

		if err := h.Usecase.CreateReservationSeat(reservationSeat); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "座席予約の登録に失敗しました", "details": err.Error()})
			return
		}

		fmt.Printf("🪑 座席が予約されました: %+v\n", reservationSeat)

		c.JSON(http.StatusCreated, gin.H{
			"message":           "座席予約が登録されました",
			"ReservationSeatID": reservationSeat.ID,
			"PurchaseID":        reservationSeat.PurchaseID,
			"SeatID":            reservationSeat.SeatID,
		})
	}
}
func (h *ReservationSeatHandler) GetAllReservationSeats() gin.HandlerFunc {
	return func(c *gin.Context) {
		reservationSeats, err := h.Usecase.GetAllReservationSeats()
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "座席予約情報の取得に失敗しました", "details": err.Error()})
			return
		}

		// presenterを使ってレスポンス形式に変換
		res := presenter.ToReservationSeatResponseList(reservationSeats)

		c.JSON(http.StatusOK, res)
	}
}

func (h *ReservationSeatHandler) GetReservedSeatsByScreenID() gin.HandlerFunc {
	return func(c *gin.Context) {
		screenIDParam := c.Param("screenID") // ルーターで ":screenID" と定義したパスパラメータ名
		screenIDUint64, err := strconv.ParseUint(screenIDParam, 10, 64)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "無効なスクリーンIDが指定されました", "details": err.Error()})
			return
		}
		screenID := uint(screenIDUint64)

		reservedSeats, err := h.Usecase.GetReservedSeatsByScreenID(screenID)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "予約座席の取得に失敗しました", "details": err.Error()})
			return
		}

		if len(reservedSeats) == 0 {
			c.JSON(http.StatusOK, []interface{}{})
			return
		}

		c.JSON(http.StatusOK, reservedSeats)
	}
}

func (h *ReservationSeatHandler) GetReservedSeatsByScreeningID() gin.HandlerFunc {
	return func(c *gin.Context) {
		screeningIDParam := c.Param("screeningID")
		screeningIDUint64, err := strconv.ParseUint(screeningIDParam, 10, 64)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "無効な上映IDが指定されました", "details": err.Error()})
			return
		}
		screeningID := uint(screeningIDUint64)

		reservedSeats, err := h.Usecase.GetReservedSeatsByScreeningID(screeningID)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "予約座席の取得に失敗しました", "details": err.Error()})
			return
		}

		if len(reservedSeats) == 0 {
			c.JSON(http.StatusOK, []interface{}{}) // 予約がない場合は空の配列を返す
			return
		}

		c.JSON(http.StatusOK, reservedSeats)
	}
}
