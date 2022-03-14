/*
 * @Description: 描述
 * @Author: 吴文周
 * @Github: https://github.com/fodelf
 * @Date: 2022-03-13 17:19:49
 * @LastEditors: 吴文周
 * @LastEditTime: 2022-03-13 21:25:37
 */

// 原始数据
// const obj = {
//   text: "hello world",
// };
// // 正在执行的副作用函数
// let effectActiveFu: null | Function = null;
// // 副作用函数的缓存池子，现在就定义了一个
// let effectCacheFu: null | Function = null;

// // 将原数据转换为代理数据使它具有响应式的特性
// let objProxy = new Proxy(obj, {
//   get(target: any, key: string, receiver: any) {
//     // 将正在执行的副作用函数放入缓存
//     effectCacheFu = effectActiveFu;
//     return Reflect.get(target, key, receiver);
//   },
//   set(target: any, key: string, value: string, receiver: any) {
// 先设值在执行回调
//     Reflect.set(target, key, value, receiver);
//     // 设值你的操作触发副作用函数
//     if (effectCacheFu) {
//       effectCacheFu();
//     }
//     return true;
//   },
// });
// /**
//  * @name: effectAction
//  * @description: 副作用函数的行为
//  * @param {type} {*}
//  * @return {type} {*}
//  */
// function effectAction() {
//   document.body.innerHTML = objProxy.text;
// }
// /**
//  * @name: effect
//  * @description: 副作用封装
//  * @param {Function} fun
//  */
// export function effect(fun: Function) {
//   // 当前活跃的副作用函数就是此函数
//   effectActiveFu = fun;
//   fun();
// }
// // 触发副作用的收集依赖
// effect(effectAction);
// setTimeout(() => {
//   // 改变数据
//   objProxy.text = "hello 吴文周 大帅哥";
// }, 500);
