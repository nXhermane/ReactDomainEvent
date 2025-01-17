import { dts } from "rollup-plugin-dts";

const config = [
  {
    input: "./dist/src/ddd/index.d.ts",
    output: [{file:"dist/ddd/index.d.ts",format:"es"}],
    plugins:[dts()]
  },
  {
    input:"./dist/src/index.d.ts",
    output: [{file:"dist/index.d.ts",format:"es"}],
    plugins:[dts()]
  },
  {
    input: "./dist/src/react/index.d.ts",
    output: [{file:"dist/react/index.d.ts",format:"es"}],
    plugins:[dts()]
  },
];
export default config