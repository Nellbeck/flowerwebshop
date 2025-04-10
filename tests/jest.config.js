export default {
  testEnvironment: "jest-environment-jsdom",
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1"
  },
  transform: {
    "^.+\\.(js|jsx|ts|tsx)$": "babel-jest"
  }
};



  
  
  