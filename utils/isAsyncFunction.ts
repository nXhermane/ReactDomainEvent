export default function (target: any,methodName: string): boolean {
  const desciptors = Object.getOwnPropertyDescriptor(target, methodName) || Object.getOwnPropertyDescriptor(Object.getPrototypeOf(target), methodName)
  console.log( desciptors?.value.constructor.name)
  const methode = target[methodName]
 // console.log(methode.constructeur.name)
console.log(methode)
  return methode.constructor.name === "AsyncFunction";
}
