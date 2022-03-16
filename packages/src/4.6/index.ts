/*
 * @Description: 嵌套
 * @Author: 吴文周
 * @Github: https://github.com/fodelf
 * @Date: 2022-03-13 18:05:07
 * @LastEditors: 吴文周
 * @LastEditTime: 2022-03-16 08:15:24
 */
import { createReactiveObject } from "./reactive";
import { effect } from "./effect";
const obj = {
  count: 0,
  text: "hello world",
  name: "吴文周",
};
// 将原数据转换为代理数据使它具有响应式的特性
let objProxy = createReactiveObject(obj);
// obj 触发text 副作用的收集依赖
effect(() => {
  objProxy.count++;
  console.log(objProxy.count);
});
//改变响应式值;
setTimeout(() => {
  objProxy.count = 10;
}, 500);
// setTimeout(() => {
//   objProxy.count = 20;
// }, 700);
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
