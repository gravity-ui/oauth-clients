module.exports = {
    verbose: true,
    testEnvironment: 'jsdom',
    moduleFileExtensions: ['js', 'json', 'ts', 'tsx'],
    rootDir: '.',
    roots: ['<rootDir>/src'],
    transform: {
        '^.+\\.tsx?$': 'ts-jest',
        'node_modules/nanoid': 'ts-jest',
    },
    transformIgnorePatterns: ['node_modules/(?!(@gravity-ui|nanoid)/)'],
    coverageDirectory: './coverage',
    collectCoverageFrom: ['src/**/*.{ts,tsx}'],
};
