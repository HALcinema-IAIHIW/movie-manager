package router

import (
	"modules/internal/di"
	"modules/module"
	"reflect"
)

func InitRoutes(h *di.Handlers) []module.Route {
	var routes []module.Route

	v := reflect.ValueOf(*h)
	for i := 0; i < v.NumField(); i++ {
		if rp, ok := v.Field(i).Interface().(module.RouteProvider); ok {
			routes = append(routes, rp.Routes())
		}

	}
	return routes
}
