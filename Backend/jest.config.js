const config = {
  testEnvironment: "node",
  transform: {},
  setupFiles: ["<rootDir>/tests/setup-env.cjs"],
  testMatch: ["<rootDir>/tests/**/*.test.js"],
  clearMocks: true,
  restoreMocks: true,
};

export default config;