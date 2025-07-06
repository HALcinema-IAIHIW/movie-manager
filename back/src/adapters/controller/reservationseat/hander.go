package reservationseat

import (
	"fmt"
	"modules/src/adapters/presenter"
	"net/http"

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
