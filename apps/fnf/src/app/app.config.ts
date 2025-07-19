import {ApplicationConfig, ApplicationRef, provideZoneChangeDetection} from '@angular/core';
import {provideRouter} from '@angular/router';
import {provideAnimations} from '@angular/platform-browser/animations';
import {provideHttpClient} from '@angular/common/http';
import {Socket, SOCKET_CONFIG_TOKEN, SocketIoConfig} from 'ngx-socket-io';


import {routes} from './app.routes';


const config: SocketIoConfig = {
  url: "http://localhost:3334",
  options: {
    reconnection: true,
    autoConnect: true,
    reconnectionAttempts: Infinity,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    timeout: 20000
  }
};

// Factory function to create a Socket instance with the config and ApplicationRef
export function socketFactory(config: SocketIoConfig, appRef: ApplicationRef): Socket {
  return new Socket(config, appRef);
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({eventCoalescing: true}),
    provideRouter(routes/*, withDebugTracing()*/),
    provideAnimations(),
    provideHttpClient(),
    {provide: SOCKET_CONFIG_TOKEN, useValue: config},
    {provide: Socket, useFactory: socketFactory, deps: [SOCKET_CONFIG_TOKEN, ApplicationRef]},
  ]
};
