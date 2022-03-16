/*
 * @Description: 描述
 * @Author: 吴文周
 * @Github: https://github.com/fodelf
 * @Date: 2022-03-15 08:56:55
 * @LastEditors: 吴文周
 * @LastEditTime: 2022-03-15 20:23:25
 */
// 正在执行的副作用函数
export let effectActiveFu: null | Function = null;
/**
 * @name: effect
 * @description: 副作用封装
 * @param {Function} fun
 */

export function effect(fun: Function) {
  // 当前活跃的副作用函数就是此函数
  effectActiveFu = fun;
  // 触发收集
  fun();
  effectActiveFu = null;
}
