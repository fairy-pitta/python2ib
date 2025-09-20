// Type definitions for browser e2e tests

declare global {
  interface Window {
    Python2IB: {
      PythonToIBConverter: any;
    };
  }
}

export {};