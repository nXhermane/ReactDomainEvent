export default function (func: Function): boolean {
  return func.constructor.name === "AsyncFunction";
}
