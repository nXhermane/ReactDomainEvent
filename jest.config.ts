export default {
   preset: "ts-jest", 
   testEnvironment: 'node', 
   moduleFileExtensions: ['ts', 'js'],
   transform: {
     '^.+\\.ts$': 'ts-jest',
   },
   testMatch: ['**/__tests__/**/*.test.ts'],
   testPathIgnorePatterns: ['/node_modules/']
}