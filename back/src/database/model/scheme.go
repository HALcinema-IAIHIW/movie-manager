package model

import (
	"time"

	"gorm.io/gorm"
)

type User struct {
	gorm.Model
	Name           string
	Email          string `gorm:"unique"`
	Password       string
	RoleID         uint
	Role           Role `gorm:"foreignKey:RoleID" json:"role"`
	PhoneNumber    string
	CardNumber     string
	CardExpiration *time.Time
	Admin          *Admin `gorm:"foreignKey:UserID" json:"admin,omitempty"`
}

type Role struct {
	ID       uint   `gorm:"primaryKey"`
	RoleName string `gorm:"unique;not null" json:"role"` // "一般", "大学生", "中学生～高校生", "小学生、幼児"
	PriceYen int    `gorm:"not null"`                    // チケット価格
}

type Admin struct {
	gorm.Model
	UserID uint  `gorm:"not null;uniqueIndex"`
	User   *User `gorm:"foreignKey:UserID"`
}

type Movie struct {
	gorm.Model
	Title       string `gorm:"not null"`
	SubTitle    string
	Description string
	ReleaseDate time.Time
	Genre       string
	Director    string
	Cast        string
	PosterPath  string
	Duration    int
}

// スクリーン自体
type Screen struct {
	gorm.Model
	MaxRow    string
	MaxColumn int
}

type Seat struct {
	gorm.Model
	ScreenID uint   `gorm:"not null;uniqueIndex:idx_seat_screen_row_col"`
	Row      string `gorm:"not null;uniqueIndex:idx_seat_screen_row_col"`
	Column   int    `gorm:"not null;uniqueIndex:idx_seat_screen_row_col"`

	Screen Screen `gorm:"foreignKey:ScreenID"`
}

// 上映期間
type ScreeningPeriod struct {
	gorm.Model
	MovieID   uint      `gorm:"not null"`
	StartDate time.Time `gorm:"not null"`
	EndDate   time.Time `gorm:"not null"`

	Movie Movie `gorm:"foreignKey:MovieID"`
}

// 上映スクリーン
type Screening struct {
	gorm.Model
	ScreenID          uint      `gorm:"not null"`
	ScreeningPeriodID uint      `gorm:"not null"`
	Date              time.Time `gorm:"not null"`
	StartTime         time.Time `gorm:"not null"`
	Duration          int       `gorm:"not null"`

	Screen          Screen          `gorm:"foreignKey:ScreenID"`
	ScreeningPeriod ScreeningPeriod `gorm:"foreignKey:ScreeningPeriodID"`
	Movie           Movie           `gorm:"-"`
}

// 1回の購入トランザクション
type Purchase struct {
	gorm.Model
	UserID       uint `gorm:"not null" json:"user_id"`
	ScreeningID  uint `gorm:"not null" json:"screening_id"`
	PurchaseTime time.Time
	TotalPrice   int

	User             User              `gorm:"foreignKey:UserID" json:"user,omitempty"`
	Screening        Screening         `gorm:"foreignKey:ScreeningID"`
	PurchaseDetails  []PurchaseDetail  `gorm:"foreignKey:PurchaseID"`
	ReservationSeats []ReservationSeat `gorm:"foreignKey:PurchaseID"`
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

	Purchase Purchase `gorm:"foreignKey:PurchaseID"`
	Role     Role     `gorm:"foreignKey:RoleID"`
}
