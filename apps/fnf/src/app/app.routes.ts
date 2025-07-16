import {Routes} from '@angular/router';

export const routes: Routes = [


  {
    path: "files",
    loadComponent: () =>
      import("./component/main/file.component").then(m => m.FileComponent)
  },
  // {
  //   path: "init",
  //   loadComponent: () =>
  //     import("./component/init/init.component").then(m => m.InitComponent)
  // },

  {
    path: "about",
    loadComponent: () =>
      import("./component/about/about.component").then(m => m.AboutComponent)
  },

  {
    path: "**",
    redirectTo: "files"
  }

];
