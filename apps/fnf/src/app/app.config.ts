import {ApplicationConfig, provideZoneChangeDetection} from '@angular/core';
import {provideRouter} from '@angular/router';
import {provideAnimations} from '@angular/platform-browser/animations';
import {provideHttpClient} from '@angular/common/http';
import {provideSocketIo, Socket, SOCKET_CONFIG_TOKEN, SocketIoConfig} from 'ngx-socket-io';

import {routes} from './app.routes';


const config: SocketIoConfig = {
  url: "http://localhost:3334",
  options: {
    reconnection: true,
    autoConnect: true
  }
};

// Factory function to create a Socket instance with the config
export function socketFactory(config: SocketIoConfig): Socket {
  return new Socket(config);
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({eventCoalescing: true}),
    provideRouter(routes),
    provideAnimations(),
    provideHttpClient(),
    provideSocketIo(config),
    {
      provide: Socket,
      useFactory: socketFactory,
      deps: [SOCKET_CONFIG_TOKEN]
    }
  ]
};
