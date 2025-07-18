import {ApplicationConfig, ApplicationRef, provideZoneChangeDetection} from '@angular/core';
import {provideRouter, withDebugTracing} from '@angular/router';
import {provideAnimations} from '@angular/platform-browser/animations';
import {provideHttpClient} from '@angular/common/http';
import {Socket, SOCKET_CONFIG_TOKEN, SocketIoConfig} from 'ngx-socket-io';
import {NGX_MONACO_EDITOR_CONFIG} from 'ngx-monaco-editor-v2';

import {routes} from './app.routes';


const monacoConfig = {
  baseUrl: 'assets/monaco/vs',  // Configure the base path for Monaco editor assets
  defaultOptions: {scrollBeyondLastLine: false}  // Default editor options
};

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
    provideRouter(routes, withDebugTracing()),
    provideAnimations(),
    provideHttpClient(),
    // provideSocketIo(config),
    // {
    //   provide: Socket,
    //   useFactory: socketFactory,
    //   deps: [SOCKET_CONFIG_TOKEN]
    // },
    {provide: SOCKET_CONFIG_TOKEN, useValue: config},
    {provide: Socket, useFactory: socketFactory, deps: [SOCKET_CONFIG_TOKEN, ApplicationRef]},
    {provide: NGX_MONACO_EDITOR_CONFIG, useValue: monacoConfig}
  ]
};
