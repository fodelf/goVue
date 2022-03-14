/*
 * @Description: web服务
 * @Author: 吴文周
 * @Github: https://github.com/fodelf
 * @Date: 2022-03-12 06:28:23
 * @LastEditors: 吴文周
 * @LastEditTime: 2022-03-14 22:26:51
 */
package pkg

import (
	"fmt"
	"net/http"
	"os"
	"path"
)

func Serveinit() {
	dir, _ := os.Getwd()
	http.Handle("/", http.FileServer(http.Dir(path.Join(dir, "example"))))
	http.HandleFunc("/message", Message)
	done := make(chan bool)
	go http.ListenAndServe(":8080", nil)
	fmt.Println("serve stsart at http://localhost:8080")
	Open("http://localhost:8080")
	<-done
}