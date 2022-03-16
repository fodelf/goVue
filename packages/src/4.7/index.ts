/*
 * @Description: 嵌套
 * @Author: 吴文周
 * @Github: https://github.com/fodelf
 * @Date: 2022-03-13 18:05:07
 * @LastEditors: 吴文周
 * @LastEditTime: 2022-03-16 21:28:19
 */
import { reactive } from "./reactive";
import { effect } from "./effect";
export { reactive, effect };
// 原始数据
const obj = {
  count: 0,
};
// // 将原数据转换为代理数据使它具有响应式的特性
let objProxy = reactive(obj);
// // obj 触发count 副作用的收集依赖
effect(
  () => {
    document.body.innerHTML = objProxy.count;
  },
  { scheduler: true }
);
setTimeout(() => {
  // 连续赋值
  objProxy.count = 7;
  objProxy.count = 10;
  objProxy.count = 20;
  objProxy.count = 30;
  objProxy.count = 40;
  objProxy.count = 50;
  objProxy.count = 60;
  objProxy.count = 70;
}, 500);
