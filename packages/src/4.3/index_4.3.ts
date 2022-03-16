/*
 * @Description: 描述
 * @Author: 吴文周
 * @Github: https://github.com/fodelf
 * @Date: 2022-03-13 18:05:07
 * @LastEditors: 吴文周
 * @LastEditTime: 2022-03-15 08:58:04
 */
import { createReactiveObject, effect } from "./reactive_4.3";
const obj = {
  text: "hello world",
  text1: "hello world tex1",
};
const obj1 = {
  text: "obj1 hello world",
  text1: "obj1 hello world tex1",
};
// 将原数据转换为代理数据使它具有响应式的特性
let objProxy = createReactiveObject(obj);
let objProxy1 = createReactiveObject(obj1);
/**
 * @name: effectAction
 * @description: 副作用函数的行为改变dom
 * @param {type} {*}
 * @return {type} {*}
 */
function effectAction() {
  document.body.innerHTML = objProxy.text;
}
/**
 * @name: effectAction1
 * @description: 修改响应对象objProxy的text的key
 * @param {type} {*}
 * @return {type} {*}
 */
function effectAction1() {
  console.log(objProxy.text);
}
/**
 * @name: effectAction2
 * @description: 修改响应对象objProxy的text1的key
 * @param {type} {*}
 * @return {type} {*}
 */
function effectAction2() {
  console.log(objProxy.text1);
}
// obj 触发text 两个场景副作用的收集依赖
effect(effectAction);
effect(effectAction1);
// obj 触发text2的收集
effect(effectAction2);
/**
 * @name: otherEffectAction
 * @description: 修改响应对象objProxy1的text的key
 * @param {type} {*}
 * @return {type} {*}
 */
function otherEffectAction() {
  console.log(objProxy1.text);
}
// obj1 对象的收集
effect(otherEffectAction);
setTimeout(() => {
  // 改变数据 objProxy text
  objProxy.text = "hello 吴文周 大帅哥";
  // 改变数据 objProxy1 text
  objProxy1.text = "hello objProxy1 吴文周 大帅哥";
}, 500);
setTimeout(() => {
  // 改变数据 objProxy text
  objProxy.text1 = "hello text1 吴文周 大帅哥";
}, 600);
