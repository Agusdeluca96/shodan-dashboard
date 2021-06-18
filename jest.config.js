module.exports = {
  preset: "@vue/cli-plugin-unit-jest",
  // roots: ["<rootDir>/__tests__"],
  testMatch: ["**/__tests__/**/*.spec.js?(x)"],
  moduleNameMapper: {
    "^@/app(.*)$": "<rootDir>$1",
    "^@/components(.*)$": "<rootDir>/src/components$1",
    "^@/factories(.*)$": "<rootDir>/src/factories$1",
    "^@/helpers(.*)$": "<rootDir>/src/helpers$1",
    "^@/mocks(.*)$": "<rootDir>/src/tests/__mocks__$1",
    "^@/store(.*)$": "<rootDir>/src/store$1",
    "^@/tests(.*)$": "<rootDir>/src/tests$1"
  },
  moduleFileExtensions: ["js", "json", "vue"],
  transform: {
    ".*\\.(js)$": "babel-jest",
    ".*\\.(vue)$": "vue-jest"
  },
  setupFiles: ["./jest.setup.js"]
};
