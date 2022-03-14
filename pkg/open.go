/*
 * @Description: 打开浏览器
 * @Author: 吴文周
 * @Github: https://github.com/fodelf
 * @Date: 2022-03-11 10:36:26
 * @LastEditors: 吴文周
 * @LastEditTime: 2022-03-12 06:31:17
 */
package pkg

import (
	"os/exec"
	"runtime"
)
func Open(url string) error {
	var cmd string
	var args []string

	switch runtime.GOOS {
	case "windows":
			cmd = "cmd"
			args = []string{"/c", "start"}
	case "darwin":
			cmd = "open"
	default: // "linux", "freebsd", "openbsd", "netbsd"
			cmd = "xdg-open"
	}
	args = append(args, url)
	return exec.Command(cmd, args...).Start()
}