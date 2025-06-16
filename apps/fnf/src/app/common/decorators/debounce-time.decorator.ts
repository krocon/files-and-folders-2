export function DebounceTime(wait: number = 300) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;
    const debounceTimeoutKey = Symbol(`${propertyKey}DebounceTimeout`);

    descriptor.value = function (...args: any[]) {
      // Clear the existing timeout (if any)
      const existingTimeout = (this as any)[debounceTimeoutKey];
      if (existingTimeout) {
        clearTimeout(existingTimeout);
      }

      // Set a new timeout
      (this as any)[debounceTimeoutKey] = setTimeout(() => {
        originalMethod.apply(this, args);
        (this as any)[debounceTimeoutKey] = null;
      }, wait);
    };

    return descriptor;
  };
}