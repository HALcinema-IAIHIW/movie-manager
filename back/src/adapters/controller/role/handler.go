package role

import (
	"errors"
	"fmt"
	"log"
	"modules/src/adapters/presenter"
	"modules/src/database/model"
	"modules/src/datastructure/request"
	"modules/src/module"
	"modules/src/usecases"
	"net/http"

	"gorm.io/gorm"

	"github.com/gin-gonic/gin"
)

type RoleHandler struct {
	Usecase *usecases.RoleUsecase
}

func NewRoleHandler(uc *usecases.RoleUsecase) *RoleHandler {
	return &RoleHandler{Usecase: uc}
}

func (h *RoleHandler) Routes() module.Route {
	return NewRoleRoutes(h)
}

func (h *RoleHandler) CreateRoles() gin.HandlerFunc {
	return func(c *gin.Context) {
		var req request.CreateRoleRequest
		if err := c.ShouldBindJSON(&req); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		role := &model.Role{
			RoleName: req.RoleName,
			PriceYen: req.PriceYen,
		}
		if err := h.Usecase.CreateRole(role); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "roleの登録に失敗しました"})
			return
		}
		c.JSON(http.StatusCreated, presenter.ToRoleResponse(role))
	}
}

func (h *RoleHandler) GetRoles() gin.HandlerFunc {
	return func(c *gin.Context) {
		role, err := h.Usecase.GetAllRoles()
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "取得失敗"})
			return
		}
		c.JSON(http.StatusOK, presenter.ToRoleResponseList(role))
	}
}

func (h *RoleHandler) GetRoleByName() gin.HandlerFunc {
	return func(c *gin.Context) {
		roleNameParam := c.Param("name") // URLパスパラメータからロール名を取得

		role, err := h.Usecase.GetRoleByName(roleNameParam) // ユースケースを呼び出す
		if err != nil {
			if errors.Is(err, gorm.ErrRecordNotFound) {
				c.JSON(http.StatusNotFound, gin.H{"error": fmt.Sprintf("ロール '%s' が見つかりません", roleNameParam)})
				return
			}
			c.JSON(http.StatusInternalServerError, gin.H{"error": "ロール情報の取得に失敗しました", "details": err.Error()})
			return
		}
		if role == nil { // ユースケースがnilを返す可能性も考慮
			c.JSON(http.StatusNotFound, gin.H{"error": fmt.Sprintf("ロール '%s' が見つかりません", roleNameParam)})
			return
		}
		roleResponse := presenter.ToRoleResponse(role)

		log.Printf("取得したロールID: %v", roleResponse.ID)
		c.JSON(http.StatusOK, presenter.ToRoleResponse(role)) // presenterを使ってレスポンスを整形
	}
}
