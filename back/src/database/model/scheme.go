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
	RoleID   int
	Role     Role `gorm:"foreignKey:RoleID"`
}

type Role struct {
	ID       uint   `gorm:"primaryKey"`
	RoleName string `gorm:"unique;not null"` // "一般", "大学生", "中学生～高校生", "小学生、幼児"
	PriceYen int    `gorm:"not null"`        // チケット価格
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

// スクリーン自体
type Screen struct {
	gorm.Model
	MaxRow    string
	MaxColumn int
}

// 上映期間
type ScreeningPeriod struct {
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
	ScreeningPeriodID uint      `gorm:"not null"`
	Date              time.Time `gorm:"not null"`
	StartTime         time.Time `gorm:"not null"`
	Duration          int       `gorm:"not null"`

	ScreeningPeriod ScreeningPeriod `gorm:"foreignKey:ScreeningPeriodID"`
}

// 1回の購入トランザクション
type Purchase struct {
	gorm.Model
	UserID       uint `gorm:"not null" json:"user_id"`
	ScreeningID  uint `gorm:"not null" json:"screening_id"`
	PurchaseTime time.Time
	TotalPrice   int

	User            User             `gorm:"foreignKey:UserID" json:"user,omitempty"`
	Screening       Screening        `gorm:"foreignKey:ScreeningID"`
	PurchaseDetails []PurchaseDetail `gorm:"foreignKey:PurchaseID"`
}

// どの座席を押さえたか
type ReservationSeat struct {
	gorm.Model
	PurchaseID  uint `gorm:"not null"`
	SeatID      uint `gorm:"not null"`
	IsCancelled bool `gorm:"default:false"`
	CancelledAt *time.Time

	Purchase Purchase `gorm:"foreignKey:PurchaseID"`
	Seat     Seat     `gorm:"foreignKey:SeatID"`
}

// どのRoleを何枚購入したか
type PurchaseDetail struct {
	gorm.Model
	PurchaseID uint
	RoleID     uint // ロール別にチケット購入
	Quantity   int
	PriceYen   int // Roleの単価をコピーして保存
	Subtotal   int // Quantity * PriceYen

	Role Role `gorm:"foreignKey:RoleID"`
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
