package dto

type UpdateScreeningRequest struct {
	StartTime   *string `json:"start_time,omitempty" binding:"omitempty,datetime=2006-01-02T15:04:05Z07:00"`
	Duration    *int    `json:"duration,omitempty,gte=1"`
	Language    *string `json:"language,omitempty"`
	IsSubtitled *bool   `json:"is_subtitled,omitempty"`
	IsDubbed    *bool   `json:"is_dubbed,omitempty"`
	IsActive    *bool   `json:"is_active,omitempty"`
	Status      *string `json:"status,omitempty,oneof=scheduled,cancelled,delayed"`
}
