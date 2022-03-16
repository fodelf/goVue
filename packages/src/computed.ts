import { effect, ReactiveEffect } from "./effect";

/*
 * @Description: 计算属性
 * @Author: 吴文周
 * @Github: https://github.com/fodelf
 * @Date: 2022-03-15 08:56:55
 * @LastEditors: 吴文周
 * @LastEditTime: 2022-03-16 22:35:34
 */
interface ComputedObject {
  value: any;
}
export function computed(getter: () => void): ComputedObject {
  effect(getter, { lazy: true });
  const effectFu = effect(getter, { lazy: true });
  let obj = {
    get value() {
      const effectObject = new ReactiveEffect(getter);
      return effectFu(effectObject);
    },
  };
  return obj;
}
