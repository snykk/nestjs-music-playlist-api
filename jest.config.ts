import { Config } from 'jest';

const config: Config = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: '.', // Root direktori proyek
  testRegex: '.spec.ts$|.e2e-spec.ts$', // Untuk unit test dan e2e test
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest', // Gunakan ts-jest untuk Typescript
  },
  moduleNameMapper: {
    '^src/(.*)$': '<rootDir>/src/$1', // Resolusi modul
  },
  collectCoverage: true, // Aktifkan coverage
  coverageDirectory: './coverage', // Lokasi folder hasil coverage
  testEnvironment: 'node', // Lingkungan pengujian
  collectCoverageFrom: [
    'src/**/*.ts', // Hanya file dalam folder src
    '!src/main.ts', // Abaikan file bootstrap utama
    '!src/**/*.module.ts', // Abaikan file module
    '!src/**/*.dto.ts', // Abaikan file DTO
    '!src/prisma/**/*.ts', // Abaikan file Prisma
  ],
};

export default config;
