const dts = require("dts-bundle");

const config = [
  {
    name: "domain-eventrix",
    main: "/home/hermane/Dev/node/open-source/ReactNativeDomainEvent/dist/src/type.d.ts",
    out: "/home/hermane/Dev/node/open-source/ReactNativeDomainEvent/dist/index.d.ts",
    baseDir: "/home/hermane/Dev/node/open-source/ReactNativeDomainEvent/dist",
    outputAsModuleFolder: true,
  },
  {
    name: "react",
    main: "/home/hermane/Dev/node/open-source/ReactNativeDomainEvent/dist/src/react/index.d.ts",
    out: "/home/hermane/Dev/node/open-source/ReactNativeDomainEvent/dist/react/index.d.ts",
  
  },
  {
    name: "ddd",
    main: "/home/hermane/Dev/node/open-source/ReactNativeDomainEvent/dist/src/ddd/index.d.ts",
    out: "/home/hermane/Dev/node/open-source/ReactNativeDomainEvent/dist/ddd/index.d.ts",

  },
];

config.forEach(bundle => dts.bundle(bundle))
