package user

import (
	"log"
	"modules/src/adapters/presenter"
	"modules/src/datastructure/request"
	"modules/src/datastructure/response"
	"modules/src/module"
	"modules/src/usecases"
	"net/http"

	"strconv"

	"github.com/gin-gonic/gin"
)

type UserHandler struct {
	UserUC          *usecases.UserUsecase
	PurchaseUsecase *usecases.PurchaseUsecase
}

func NewUserHandler(uc *usecases.UserUsecase) *UserHandler {
	return &UserHandler{UserUC: uc}
}

func (h *UserHandler) Routes() module.Route {
	return NewUserRoutes(h)
}

func (h *UserHandler) CreateUser() gin.HandlerFunc {
	return func(c *gin.Context) {
		var req request.CreateUserRequest
		if err := c.ShouldBindJSON(&req); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		user, err := h.UserUC.RegisterUser(usecases.RegisterUserInput{
			Name:     req.Name,
			Email:    req.Email,
			Password: req.Password,
			RoleName: req.RoleName,
		})
		if err != nil {
			if err == usecases.ErrEmailExists {
				c.JSON(http.StatusConflict, gin.H{"error": err.Error()})
			} else {
				c.JSON(http.StatusInternalServerError, gin.H{"error": "ユーザー作成に失敗しました"})
			}
			return
		}

		c.JSON(http.StatusCreated, gin.H{
			"message": "ユーザー登録が完了しました",
			"user_id": user.ID,
		})
	}
}

func (h *UserHandler) GetAllUsers() gin.HandlerFunc {
	return func(c *gin.Context) {
		users, err := h.UserUC.GetUser()
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "ユーザー一覧取得に失敗しました"})
			return
		}

		res := presenter.ToUserResponseList(users)
		c.JSON(http.StatusOK, res)
	}
}

func (h *UserHandler) GetUserByID() gin.HandlerFunc {
	return func(c *gin.Context) {
		idParam := c.Param("id")
		id, err := strconv.ParseUint(idParam, 10, 32)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "IDは数値で指定してください"})
			return
		}

		user, err := h.UserUC.GetUserByID(uint(id))
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "ユーザー取得中にエラーが発生しました"})
			return
		}
		if user == nil {
			c.JSON(http.StatusNotFound, gin.H{"error": "ユーザーが見つかりません"})
			return
		}

		res := response.UserResponse{
			ID:       user.ID,
			Name:     user.Name,
			Email:    user.Email,
			RoleName: user.Role.RoleName,
		}

		c.JSON(http.StatusOK, res)
	}
}

func (h *UserHandler) Login() gin.HandlerFunc {
	return func(c *gin.Context) {
		var req request.LoginRequest
		// JSONリクエストボディを構造体にバインドし、バリデーションを実行
		if err := c.ShouldBindJSON(&req); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "入力形式が間違っています", "details": err.Error()})
			return
		}

		// ユースケースでユーザー認証を実行
		token, user, err := h.UserUC.LoginUser(req.Email, req.Password)
		if err != nil {
			c.JSON(http.StatusUnauthorized, gin.H{"error": err.Error()})
			return
		}

		log.Printf("DEBUG: userID=%d, roleID=%d, roleName=%s", user.ID, user.RoleID, user.Role.RoleName)

		// ログイン成功レスポンス
		c.JSON(http.StatusOK, response.LoginResponse{
			Message: "ログイン成功",
			Token:   token,
			User: response.UserResponse{
				ID:       user.ID,
				Name:     user.Name,
				Email:    user.Email,
				RoleName: user.Role.RoleName,
			},
		})
	}
}

func (h *UserHandler) Logout() gin.HandlerFunc {
	return func(c *gin.Context) {
		// フロントエンド側で localStorage/sessionStorage から token を削除
		c.JSON(http.StatusOK, gin.H{
			"message": "ログアウトしました",
			"token":   "",
			"user":    nil,
		})
	}
}

func (h *UserHandler) GetLoggedInUserReservations() gin.HandlerFunc {
	return func(c *gin.Context) {
		userID, exists := c.Get("userID")
		if !exists {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "認証が必要です"})
			return
		}
		loggedInUserID := userID.(uint)

		reservations, err := h.PurchaseUsecase.GetUserReservations(loggedInUserID)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "予約情報の取得に失敗しました", "details": err.Error()})
			return
		}

		if len(reservations) == 0 {
			c.JSON(http.StatusNotFound, gin.H{"message": "予約情報が見つかりませんでした"})
			return
		}

		c.JSON(http.StatusOK, reservations)
	}
}
