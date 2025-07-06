package presenter

import (
	"modules/src/database/model"
	"modules/src/datastructure/response"
)

func ToReservationSeatResponse(reservationSeat model.ReservationSeat) response.ReservationSeatResponse {
	return response.ReservationSeatResponse{
		ID:          reservationSeat.ID,
		PurchaseID:  reservationSeat.PurchaseID,
		SeatID:      reservationSeat.SeatID,
		IsCancelled: reservationSeat.IsCancelled,
		CancelledAt: reservationSeat.CancelledAt,
		CreatedAt:   reservationSeat.CreatedAt,
		UpdatedAt:   reservationSeat.UpdatedAt,
	}
}

func ToReservationSeatResponseList(reservationSeats []model.ReservationSeat) []response.ReservationSeatResponse {
	var res []response.ReservationSeatResponse
	for _, rs := range reservationSeats {
		res = append(res, ToReservationSeatResponse(rs))
	}
	return res
}
