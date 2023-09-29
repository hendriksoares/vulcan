export default {
  transform: {
    // '^.+\\.(t|j)s?$': 'babel-jest',
    '^.+\\.(t|j)s?$': '@swc/jest',
  },
  testPathIgnorePatterns: [
    '/node_modules/(?!(escape-string-regexp)/)',
    '/examples/',
  ],
  testEnvironment: 'node',
};
