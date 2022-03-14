/*
 * @Description: websocket
 * @Author: 吴文周
 * @Github: https://github.com/fodelf
 * @Date: 2022-03-12 06:20:34
 * @LastEditors: 吴文周
 * @LastEditTime: 2022-03-12 06:34:09
 */
package pkg

import (
	"fmt"
	"net/http"
	"sync"

	"github.com/gorilla/websocket"
)

// 单个websocket链接节点
type Node struct {
	Conn *websocket.Conn
	//并行转串行,
	DataQueue chan []byte
}

//读写锁
var rwlocker sync.RWMutex
//websocket 链接缓存
var NodeCache =[]Node{}


func Message(writer http.ResponseWriter, request *http.Request) {
	conn, err := (&websocket.Upgrader{
		CheckOrigin: func(r *http.Request) bool {
			return true
		},
	}).Upgrade(writer, request, nil)

	if err != nil {
		fmt.Print("出错了")
		return
	}
	rwlocker.Lock()
	//获得websocket链接conn
	node := Node{
	Conn:      conn,
	DataQueue: make(chan []byte, 1000),
	}
	NodeCache = append(NodeCache,node)
	rwlocker.Unlock()
	go sendproc(node)
}

//发送逻辑
func sendproc(node Node) {
	defer func() {
		if r := recover(); r != nil {
			fmt.Println("write stop")
		}
	}()
	defer func() {
		node.Conn.Close()
		// fmt.Println("Client发送数据 defer")
	}()
	for {
		select {
		case data := <-node.DataQueue:
			// fmt.Printf("发送消息")
			err := node.Conn.WriteMessage(websocket.TextMessage, data)
			if err != nil {
				// fmt.Printf("发送消息失败")
				// for i := 0; i < len(NodeCache); i++ {
				// 	// fmt.Println(NodeCache[i].Conn)
				// 	// fmt.Println(node.Conn)
				// 	if cmpare2(NodeCache[i].Conn , node.Conn)  {
				// 		NodeCache = append(NodeCache[:i], NodeCache[i+1:]...)
				// 		fmt.Printf("删除节点")
				// 	}
			 	// }
				return
			}
		}
	}
}