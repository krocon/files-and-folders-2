import {Routes} from '@angular/router';

export const routes: Routes = [


  {
    path: "files",
    loadComponent: () =>
      import("./component/main/file.component").then(m => m.FileComponent)
  },
  {
    path: "about",
    loadComponent: () =>
      import("./component/about/about.component").then(m => m.AboutComponent)
  },
  {
    path: "shell",
    loadComponent: () =>
      import("./component/shell/servershell.component").then(m => m.ServershellComponent)
  },
  {
    path: "**",
    redirectTo: "files"
  }

];
