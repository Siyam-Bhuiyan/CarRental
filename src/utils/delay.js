// Simulates network latency in the mock services.
export const delay = (ms = 500) => new Promise((resolve) => setTimeout(resolve, ms));
