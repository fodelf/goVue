/*
 * @Description: 描述
 * @Author: 吴文周
 * @Github: https://github.com/fodelf
 * @Date: 2022-03-09 21:02:16
 * @LastEditors: 吴文周
 * @LastEditTime: 2022-03-13 10:18:11
 */
// function h() {}
// const dom = {
//   methods: {
//     handleCilck: () => {
//       alert("Hello Word");
//     },
//   },
//   render() {
//     h("div", { onClick: handleCilck }, "点我");
//   },
// };

// // 节点定义
// type VNode = {
//   tag: (() => VNode) | string;
//   props: Record<string, Function | EventListenerOrEventListenerObject>;
//   children: VNode[] | String;
// };
// // 虚拟dom
// const vnode = {
//   tag: "div",
//   props: {
//     onClick: () => {
//       console.log("hello word");
//     },
//   },
//   children: [
//     {
//       tag: "span",
//       props: {
//         onClick: (e: MouseEvent) => {
//           console.log("hello child");
//         },
//       },
//       children: "d'xx",
//     },
//   ],
// };
// /**
//  * @name: render
//  * @description: 渲染方法
//  * @param {VNode} vnode
//  * @param {HTMLElement} root
//  */
// function render(vnode: VNode, root: HTMLElement) {
//   // 判断tag类型
//   if (typeof vnode.tag == "string") {
//     //创建html元素
//     const el = document.createElement(vnode.tag);
//     // 绑定事件
//     const props = vnode.props;
//     for (let key in vnode.props) {
//       const eventName = key.substring(2).toLowerCase();
//       el.addEventListener(
//         eventName as keyof HTMLElementEventMap,
//         props[key] as EventListenerOrEventListenerObject
//       );
//     }
//     // 如果是文本直接渲染，如果是数组需要递归渲染逻辑
//     if (typeof vnode.children === "string") {
//       el.innerHTML = vnode.children;
//     } else {
//       const children = vnode.children as VNode[];
//       children.forEach((child) => {
//         render(child, el);
//       });
//     }
//     //添加到容器中
//     root.appendChild(el);
//   } else {
//     render(vnode.tag(), root);
//   }
// }
// render(vnode, document.getElementById("container")!);

// 数组特性 是不支持的
const data = [1, 2, 3];
try {
  Object.defineProperty(data, "length", {
    get: () => {
      console.log("get 触发");
    },
    set: () => {
      console.log("set 触发");
    },
  });
  data.push(4);
} catch (error) {
  console.warn(error);
}
//-----------------------我是分割线-----------------------
const data1: any = {};
Object.defineProperty(data1, "key", {
  get: () => {
    console.log("defineProperty get 触发");
  },
  set: () => {
    console.log("defineProperty set 触发");
  },
});
console.log(data1.key);
data1.key = 1;

//-----------------------我是分割线-----------------------
const data2 = [1, 2, 3];
const dataProxy = new Proxy(data2, {
  get: (target: any, key: string, receiver: any) => {
    if (key == "length") {
      console.log("Proxy get 数组长度变化");
    }
    return Reflect.get(target, key, receiver);
  },
  set: <T>(target: any, key: string, value: T, receiver: any) => {
    if (key == "length") {
      console.log("Proxy set 数组长度变化");
    }
    Reflect.set(target, key, value, receiver);
    return true;
  },
});
dataProxy.push(4);
//-----------------------我是分割线-----------------------
const animal: any = {
  _name: "animal",
  get name() {
    return this._name;
  },
  get eat() {
    console.log(this._name + " eat something");
    return null;
  },
};
const animalProxy = new Proxy(animal, {
  get: (target: any, key: string) => {
    return target[key];
  },
});
const dog = {
  _name: "dog",
  get name() {
    return this._name;
  },
  __proto__: animalProxy,
} as Record<string, any>;
dog.eat;

const animalProxy1 = new Proxy(animal, {
  get: (target: any, key: string, receiver) => {
    return Reflect.get(target, key, receiver);
  },
});
const dog1 = {
  _name: "dog",
  get name() {
    return this._name;
  },
  __proto__: animalProxy1,
} as Record<string, any>;

dog1.eat;
