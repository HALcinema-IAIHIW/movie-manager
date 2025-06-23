package model

import (
	"time"

	"gorm.io/gorm"
)

type User struct {
	gorm.Model
	Name     string
	Email    string `gorm:"unique"`
	Password string
	Role     string `gorm:"default:'user'"` // "user", "admin"
}

type Movie struct {
	gorm.Model
	Title       string `gorm:"not null"`
	Description string
	ReleaseDate time.Time
	Genre       string
	Director    string
	PosterPath  string
	Duration    int
}

// 上映期間
type ScreeningPlan struct {
	gorm.Model
	MovieID   uint      `gorm:"not null"`
	ScreenID  uint      `gorm:"not null"`
	StartDate time.Time `gorm:"not null"`
	EndDate   time.Time `gorm:"not null"`

	Movie  Movie  `gorm:"foreignKey:MovieID"`
	Screen Screen `gorm:"foreignKey:ScreenID"`
}

// 上映スクリーン
type Screening struct {
	gorm.Model
	PlanID    uint      `gorm:"not null"`
	StartTime time.Time `gorm:"not null"`
	Duration  int       `gorm:"not null"`

	Plan ScreeningPlan `gorm:"foreignKey:PlanID"`
	// Movie  Movie         `gorm:"foreignKey:MovieID"`
	// Screen Screen        `gorm:"foreignKey:ScreenID"`
}

type Screen struct {
	gorm.Model
	MaxRow    int
	MaxColumn string
}

type Seat struct {
	gorm.Model
	ScreenID   uint   `gorm:"not null"`
	Row        string `gorm:"not null"`
	Column     int    `gorm:"not null"`
	SeatTypeID uint   `gorm:"not null"`

	Screen   Screen   `gorm:"foreignKey:ScreenID"`
	SeatType SeatType `gorm:"foreignKey:SeatTypeID"`
}

type SeatType struct {
	gorm.Model
	Name string `gorm:"not null"`
}

type Ticket struct {
	gorm.Model
	Type     string `gorm:"not null"`
	PriceYen int    `gorm:"not null"`
}

type ReservationSeat struct {
	gorm.Model
	UserID      uint `gorm:"not null;index:idx_seat_screening,unique"`
	ScreeningID uint `gorm:"not null;index:idx_seat_screening,unique"`
	SeatID      uint `gorm:"not null;index:idx_seat_screening,unique"`
	TicketID    uint `gorm:"not null"`
	PurchaseID  uint `gorm:"not null"`
	IsCancelled bool `gorm:"default:false"`
	CancelledAt *time.Time

	User      User      `gorm:"foreignKey:UserID"`
	Seat      Seat      `gorm:"foreignKey:SeatID"`
	Screening Screening `gorm:"foreignKey:ScreeningID"`
	Ticket    Ticket    `gorm:"foreignKey:TicketID"`
	Purchase  Purchase  `gorm:"foreignKey:PurchaseID"`
}

type PaymentStatus string

const (
	Pending PaymentStatus = "pending"
	Paid    PaymentStatus = "paid"
	Failed  PaymentStatus = "failed"
)

type Purchase struct {
	gorm.Model
	UserID        uint              `gorm:"not null" json:"user_id"`
	ScreeningID   uint              `gorm:"not null" json:"screening_id"`
	TotalPrice    int               `gorm:"not null" json:"total_price"`
	PaymentStatus PaymentStatus     `gorm:"type:varchar(20)" json:"payment_status"`
	PurchaseTime  time.Time         `gorm:"not null" json:"purchase_time"`
	Reservations  []ReservationSeat `gorm:"foreignKey:PurchaseID" json:"reservations,omitempty"` // 1つのPurchaseに複数のReservationを持たせる

	User      User      `gorm:"foreignKey:UserID" json:"user,omitempty"`
	Screening Screening `gorm:"foreignKey:ScreeningID" json:"screening,omitempty"`
}
