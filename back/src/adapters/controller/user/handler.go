package user

import (
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
	UserUC *usecases.UserUsecase
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
