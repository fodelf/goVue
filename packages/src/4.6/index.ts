/*
 * @Description: 嵌套
 * @Author: 吴文周
 * @Github: https://github.com/fodelf
 * @Date: 2022-03-13 18:05:07
 * @LastEditors: 吴文周
 * @LastEditTime: 2022-03-16 09:51:27
 */
import { createReactiveObject } from "./reactive";
import { effect } from "./effect";
const obj = {
  count: 0,
  isShow: true,
  text: "hello world",
  name: "吴文周",
};
// 将原数据转换为代理数据使它具有响应式的特性
let objProxy = createReactiveObject(obj);
// obj 触发count 副作用的收集依赖
effect(() => {
  objProxy.count++;
  console.log(objProxy.count);
});
setTimeout(() => {
  objProxy.count = 20;
}, 700);
