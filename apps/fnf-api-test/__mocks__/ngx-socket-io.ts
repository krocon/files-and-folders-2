export class Socket {
  fromEvent() {
    return {
      pipe: () => ({
        subscribe: (callback) => {
        }
      })
    };
  }

  emit() {
    return {};
  }

  on() {
    return {};
  }

  once(event, callback) {
    if (callback) {
      setTimeout(() => callback(), 0);
    }
    return {};
  }

  connect() {
  }

  disconnect() {
  }
}

export interface SocketIoConfig {
  url: string;
  options?: any;
}