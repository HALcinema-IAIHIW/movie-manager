package usecases

import (
	"errors"
	"fmt"
	"modules/src/database/model"
	"modules/src/datastructure/request"
	"modules/src/repository"

	"github.com/lib/pq"
)

type PurchaseUsecase struct {
	PurchaseRepo repository.PurchaseRepository
}

// NewPurchaseUsecase は新しい PurchaseUsecase のインスタンスを作成します。
func NewPurchaseUsecase(repo repository.PurchaseRepository) *PurchaseUsecase {
	return &PurchaseUsecase{PurchaseRepo: repo}
}

func (uc *PurchaseUsecase) CreatePurchase(purchase *model.Purchase, detailsReq []request.CreatePurchaseDetailRequest) error {
	var totalPrice int
	var purchaseDetails []model.PurchaseDetail

	for _, detailReq := range detailsReq {
		role, err := uc.PurchaseRepo.GetRoleByID(detailReq.RoleID)
		if err != nil {
			return fmt.Errorf("ロール情報の取得に失敗しました (RoleID: %d): %w", detailReq.RoleID, err)
		}
		if role == nil {
			return fmt.Errorf("指定されたロールが見つかりません (RoleID: %d)", detailReq.RoleID)
		}

		subtotal := detailReq.Quantity * role.PriceYen
		totalPrice += subtotal

		purchaseDetails = append(purchaseDetails, model.PurchaseDetail{
			RoleID:   detailReq.RoleID,
			Quantity: detailReq.Quantity,
			PriceYen: role.PriceYen,
			Subtotal: subtotal,
		})
	}

	purchase.TotalPrice = totalPrice
	purchase.PurchaseDetails = purchaseDetails

	err := uc.PurchaseRepo.CreatePurchase(purchase)
	if err != nil {
		var pgErr *pq.Error
		if errors.As(err, &pgErr) {
			switch pgErr.Code {
			case "23505": // unique_violation
				return errors.New("入力された購入情報はすでに存在します")
			case "23503": // foreign_key_violation
				return fmt.Errorf("関連するユーザー、上映情報、またはロールが見つかりません: %s", pgErr.Detail)
			default:
				return fmt.Errorf("データベースエラーが発生しました（コード: %s, 詳細: %s）", pgErr.Code, pgErr.Detail)
			}
		}
		return fmt.Errorf("購入情報の登録に失敗しました: %w", err)
	}
	return nil
}

// GetAllPurchases はすべての購入情報を取得します。
func (uc *PurchaseUsecase) GetAllPurchases() ([]model.Purchase, error) {
	purchases, err := uc.PurchaseRepo.GetAllPurchases()
	if err != nil {
		return nil, fmt.Errorf("購入情報の取得に失敗しました: %w", err)
	}
	return purchases, nil
}

// GetPurchaseByID は指定されたIDの購入情報を取得します。
func (uc *PurchaseUsecase) GetPurchaseByID(id uint) (*model.Purchase, error) {
	purchase, err := uc.PurchaseRepo.GetPurchaseByID(id)
	if err != nil {
		return nil, fmt.Errorf("指定されたIDの購入情報の取得に失敗しました: %w", err)
	}
	if purchase == nil {
		return nil, errors.New("指定された購入情報が見つかりません")
	}
	return purchase, nil
}
