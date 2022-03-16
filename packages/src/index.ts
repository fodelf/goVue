/*
 * @Description: 嵌套
 * @Author: 吴文周
 * @Github: https://github.com/fodelf
 * @Date: 2022-03-13 18:05:07
 * @LastEditors: 吴文周
 * @LastEditTime: 2022-03-16 09:00:21
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
// effect(() => {
//   // objProxy.count++;
//   console.log("执行了");
//   document.body.innerHTML = objProxy.isShow ? objProxy.text : "我是帅哥";
// });
effect(() => {
  objProxy.count++;
  console.log(objProxy.count);
});
//改变响应式值;
// setTimeout(() => {
//   objProxy.isShow = false;
// }, 500);
//改变响应式值;
// setTimeout(() => {
//   objProxy.text = "吴文周大帅哥";
// }, 600);
setTimeout(() => {
  objProxy.count = 20;
}, 700);
// obj 触发text 副作用的收集依赖
// effect(() => {
//   console.log("f1 执行了");
//   effect(() => {
//     console.log("f2 执行了");
//     document.body.innerHTML = objProxy.text;
//   });
//   document.body.innerHTML = objProxy.name;
// });
// effect(() => {
//   console.log(objProxy.text);
// });
// effect(() => {
//   console.log(objProxy.name);
// });
// setTimeout(() => {
//   objProxy.text = "大帅哥 text";
// }, 500);
// setTimeout(() => {
//   objProxy.name = "大帅哥 name";
// }, 500);
