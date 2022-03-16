/*
 * @Description: esbuild构建相关
 * @Author: 吴文周
 * @Github: https://github.com/fodelf
 * @Date: 2022-03-12 06:24:21
 * @LastEditors: 吴文周
 * @LastEditTime: 2022-03-16 22:47:14
 */
package pkg

import (
	"fmt"
	"os"
	"path"

	"github.com/evanw/esbuild/pkg/api"
)
func BuildInit (){
	dir, _ := os.Getwd()
	EntryPoint := path.Join(dir, "packages", "src", "debugger.ts")
	api.Build(api.BuildOptions{
		// LogLevel:    api.LogLevelInfo,
		EntryPoints: []string{EntryPoint},
		// Outdir:      "www/js",
		Outfile:   path.Join(dir, "example", "js", "index.js"),
		Bundle:    true,
		Sourcemap: api.SourceMapLinked,
		// Plugins:     []api.Plugin{hmr},
		Write:  true,
		Format: api.FormatESModule,
		Watch: &api.WatchMode{
			OnRebuild: func(result api.BuildResult) {
				if len(result.Errors) > 0 {
					fmt.Printf("watch build failed: %d errors\n", len(result.Errors))
				} else {
					fmt.Println(result.OutputFiles[0].Path)
					for _, value := range NodeCache{
						//fmt.Println(index, "\t",value)
						b := []byte(result.OutputFiles[0].Path)
						value.DataQueue <- b
						// fmt.Println(value)
				 }
				}
			},
		},
	})
}

