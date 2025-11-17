package util

import "path/filepath"

// 戻り値の例: "/public/uploads/poster/myfile.png"
// fileがmyfile.pngになる
func BuildPosterPath(filename string) string {
	return filepath.ToSlash(filepath.Join("/public/uploads/posters", filename))
}
