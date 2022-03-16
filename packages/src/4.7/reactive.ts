/*
 * @Description: 描述
 * @Author: 吴文周
 * @Github: https://github.com/fodelf
 * @Date: 2022-03-14 23:37:19
 * @LastEditors: 吴文周
 * @LastEditTime: 2022-03-16 11:12:10
 */
import { Target, track, trigger } from "./effect";
/**
 * @name: createReactiveObject
 * @description: 创建响应式对象
 * @param {type} {*}
 * @return {type} {*}
 * @param {Target} target
 */
export function createReactiveObject(target: Target) {
  return new Proxy(target, {
    get(target: Target, key: string, receiver: unknown) {
      // 创建收集
      track(target, key);
      return Reflect.get(target, key, receiver);
    },
    set(target: Target, key: string, value: string, receiver: unknown) {
      // 先设值在执行回调
      Reflect.set(target, key, value, receiver);
      trigger(target, key);
      return true;
    },
  });
}
/**
 * @name: reactive
 * @description: 响应式对象
 * @param {Target} target
 */
export function reactive(target: Target) {
  return createReactiveObject(target);
}
