package role

import (
	"modules/src/adapters/presenter"
	"modules/src/database/model"
	"modules/src/datastructure/request"
	"modules/src/module"
	"modules/src/usecases"
	"net/http"

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
			c.JSON(http.StatusInternalServerError, gin.H{"error": "スクリーンの登録に失敗しました"})
			return
		}
		c.JSON(http.StatusCreated, presenter.ToRoleResponse(*role))
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
