package admin

import (
	"errors"
	"modules/src/config"
	"modules/src/database/model"
	"modules/src/datastructure/request"
	"modules/src/datastructure/response"
	"modules/src/module"
	"modules/src/usecases"
	"net/http"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

type AdminHandler struct {
	UserUC      *usecases.UserUsecase
	MovieUC     *usecases.MovieUsecase
	PeriodUC    *usecases.PeriodUsecase
	ScreeningUC *usecases.ScreeningUsecase
}

func NewAdminHandler(userUC *usecases.UserUsecase, movieUC *usecases.MovieUsecase, periodUC *usecases.PeriodUsecase, screeningUC *usecases.ScreeningUsecase) *AdminHandler {
	return &AdminHandler{
		UserUC:      userUC,
		MovieUC:     movieUC,
		PeriodUC:    periodUC,
		ScreeningUC: screeningUC,
	}
}

func (h *AdminHandler) Routes() module.Route {
	return NewAdminRoutes(h)
}

// PromoteAdmin 既存ユーザーを管理者に昇格
func (h *AdminHandler) PromoteAdmin() gin.HandlerFunc {
	return func(c *gin.Context) {
		var req request.AdminPromoteRequest
		if err := c.ShouldBindJSON(&req); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{
				"error":   "入力形式が間違っています",
				"details": err.Error(),
			})
			return
		}

		if err := h.UserUC.PromoteToAdmin(req.UserID); err != nil {
			if errors.Is(err, usecases.ErrUserNotFound) {
				c.JSON(http.StatusNotFound, gin.H{
					"error": "対象ユーザーが見つかりません",
				})
				return
			}
			if err.Error() == "既に管理者です" {
				c.JSON(http.StatusConflict, gin.H{
					"error": err.Error(),
				})
				return
			}
			c.JSON(http.StatusInternalServerError, gin.H{
				"error":   "管理者昇格に失敗しました",
				"details": err.Error(),
			})
			return
		}

		c.JSON(http.StatusCreated, gin.H{
			"message": "管理者に昇格しました",
			"user_id": req.UserID,
		})
	}
}

// AdminLogin 管理者専用ログイン
func (h *AdminHandler) AdminLogin() gin.HandlerFunc {
	return func(c *gin.Context) {
		var req request.AdminLoginRequest
		if err := c.ShouldBindJSON(&req); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{
				"error":   "入力形式が間違っています",
				"details": err.Error(),
			})
			return
		}

		// ユーザー検索
		user, err := h.UserUC.UserRepo.FindByEmail(strings.ToLower(req.Email))
		if err != nil {
			if errors.Is(err, gorm.ErrRecordNotFound) {
				c.JSON(http.StatusUnauthorized, gin.H{
					"error": "メールアドレスまたはパスワードが間違っています",
				})
				return
			}
			c.JSON(http.StatusInternalServerError, gin.H{
				"error": "認証処理中にエラーが発生しました",
			})
			return
		}

		if user == nil {
			c.JSON(http.StatusUnauthorized, gin.H{
				"error": "メールアドレスまたはパスワードが間違っています",
			})
			return
		}

		// 管理者権限チェック
		isAdmin, err := h.UserUC.UserRepo.IsAdmin(user.ID)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{
				"error": "管理者権限の確認中にエラーが発生しました",
			})
			return
		}

		if !isAdmin {
			c.JSON(http.StatusForbidden, gin.H{
				"error": "管理者権限がありません",
			})
			return
		}

		// パスワード検証
		err = bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(req.Password))
		if err != nil {
			if errors.Is(err, bcrypt.ErrMismatchedHashAndPassword) {
				c.JSON(http.StatusUnauthorized, gin.H{
					"error": "メールアドレスまたはパスワードが間違っています",
				})
				return
			}
			c.JSON(http.StatusInternalServerError, gin.H{
				"error": "認証処理中にエラーが発生しました",
			})
			return
		}

		// JWTトークン生成
		token, err := config.GenerateToken(user.ID, user.Email, user.Role.RoleName)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{
				"error": "認証トークンの生成に失敗しました",
			})
			return
		}

		// ログイン成功レスポンス
		c.JSON(http.StatusOK, response.AdminLoginResponse{
			Message: "管理者ログイン成功",
			Token:   token,
			User: response.AdminUserResponse{
				ID:             user.ID,
				Name:           user.Name,
				Email:          user.Email,
				RoleName:       user.Role.RoleName,
				PhoneNumber:    user.PhoneNumber,
				CardNumber:     user.CardNumber,
				CardExpiration: user.CardExpiration,
				IsAdmin:        true,
			},
		})
	}
}

// CreateMovie 管理者専用映画作成
func (h *AdminHandler) CreateMovie() gin.HandlerFunc {
	return func(c *gin.Context) {
		var req request.CreateMovieRequest
		if err := c.ShouldBindJSON(&req); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{
				"error":   "入力形式が間違っています",
				"details": err.Error(),
			})
			return
		}

		// リクエストをモデルに変換
		releaseDate, err := time.Parse("2006-01-02", req.ReleaseDate)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{
				"error": "公開日の形式が正しくありません",
			})
			return
		}

		// キャストを文字列に変換（DBでは文字列として保存）
		castString := ""
		if len(req.Cast) > 0 {
			for i, actor := range req.Cast {
				if i > 0 {
					castString += ", "
				}
				castString += actor
			}
		}

		movie := &model.Movie{
			Title:       req.Title,
			SubTitle:    req.SubTitle,
			Description: req.Description,
			ReleaseDate: releaseDate,
			Genre:       req.Genre,
			Director:    req.Director,
			Cast:        castString,
			Duration:    req.Duration,
		}

		// 映画を作成
		if err := h.MovieUC.CreateMovie(movie); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{
				"error":   "映画の作成に失敗しました",
				"details": err.Error(),
			})
			return
		}

		c.JSON(http.StatusCreated, gin.H{
			"message":  "映画が正常に作成されました",
			"movie_id": movie.ID,
		})
	}
}

// CreateScreeningPeriod 管理者専用上映期間作成
func (h *AdminHandler) CreateScreeningPeriod() gin.HandlerFunc {
	return func(c *gin.Context) {
		var req request.PeriodRequest
		if err := c.ShouldBindJSON(&req); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{
				"error":   "入力形式が間違っています",
				"details": err.Error(),
			})
			return
		}

		// 日付をパース
		startDate, err := time.Parse("2006-01-02", req.StartDate)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{
				"error": "開始日の形式が正しくありません",
			})
			return
		}

		endDate, err := time.Parse("2006-01-02", req.EndDate)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{
				"error": "終了日の形式が正しくありません",
			})
			return
		}

		period := &model.ScreeningPeriod{
			MovieID:   req.MovieID,
			StartDate: startDate,
			EndDate:   endDate,
		}

		// 上映期間を作成
		if err := h.PeriodUC.CreatePeriod(period); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{
				"error":   "上映期間の作成に失敗しました",
				"details": err.Error(),
			})
			return
		}

		c.JSON(http.StatusCreated, gin.H{
			"message":   "上映期間が正常に作成されました",
			"period_id": period.ID,
		})
	}
}

// CreateScreening 管理者専用上映スケジュール作成
func (h *AdminHandler) CreateScreening() gin.HandlerFunc {
	return func(c *gin.Context) {
		var req request.CreateScreeningRequest
		if err := c.ShouldBindJSON(&req); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{
				"error":   "入力形式が間違っています",
				"details": err.Error(),
			})
			return
		}

		screening := &model.Screening{
			ScreeningPeriodID: req.ScreeningPeriodID,
			Date:              req.Date,
			StartTime:         req.StartTime,
			Duration:          req.Duration,
		}

		// 上映スケジュールを作成
		_, err := h.ScreeningUC.CreateScreening(screening)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{
				"error":   "上映スケジュールの作成に失敗しました",
				"details": err.Error(),
			})
			return
		}

		c.JSON(http.StatusCreated, gin.H{
			"message":      "上映スケジュールが正常に作成されました",
			"screening_id": screening.ID,
		})
	}
}
