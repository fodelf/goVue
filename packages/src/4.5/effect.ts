/*
 * @Description: 描述
 * @Author: 吴文周
 * @Github: https://github.com/fodelf
 * @Date: 2022-03-15 08:56:55
 * @LastEditors: 吴文周
 * @LastEditTime: 2022-03-15 21:47:48
 */

export let effectActiveFuList: Array<Function> = [];
// 正在执行的副作用函数
export let effectActiveFu: null | Function = null;

/**
 * @name: effect
 * @description: 副作用封装
 * @param {Function} fun
 */
export function effect(fun: Function) {
  effectActiveFuList.push(fun);
  fun();
}
