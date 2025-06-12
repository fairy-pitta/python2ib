import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    // Test files pattern
    include: ['tests/**/*.test.ts'],
    
    // Test environment
    environment: 'node',
    
    // Global test setup
    globals: true,
    
    // Coverage configuration
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'tests/',
        'debug/',
        'docs/',
        '*.config.*'
      ]
    },
    
    // Test timeout
    testTimeout: 10000,
    
    // Reporter configuration
    reporters: ['verbose']
  },
  
  // TypeScript configuration
  esbuild: {
    target: 'node18'
  }
});