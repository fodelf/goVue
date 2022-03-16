/*
 * @Description: 描述
 * @Author: 吴文周
 * @Github: https://github.com/fodelf
 * @Date: 2022-03-13 18:05:07
 * @LastEditors: 吴文周
 * @LastEditTime: 2022-03-15 12:28:28
 */
import { createReactiveObject } from "./reactive";
import { effect } from "./effect";
const obj = {
  text: "hello world",
  isShow: false,
};
// 将原数据转换为代理数据使它具有响应式的特性
let objProxy = createReactiveObject(obj);
/**
 * @name: effectAction
 * @description: 副作用函数的行为改变dom
 * @param {type} {*}
 * @return {type} {*}
 */
function effectAction() {
  console.log("执行了");
  document.body.innerHTML = objProxy.isShow ? objProxy.text : "我不显示";
  // console.log(objProxy.text);
}
// obj 触发text 副作用的收集依赖
effect(effectAction);
setTimeout(() => {
  objProxy.isShow = true;
}, 500);
