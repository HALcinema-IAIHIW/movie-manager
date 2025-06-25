package request

type CreateSeatTypeRequest struct {
	Name string `json:"name" binding:"required"`
}
