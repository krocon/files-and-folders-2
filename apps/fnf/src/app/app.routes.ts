import {Routes} from '@angular/router';

export const routes: Routes = [


  {
    path: "files",
    loadComponent: () =>
      import("./component/main/file.component").then(m => m.FileComponent)
  },
  {
    path: "edit",
    loadComponent: () =>
      import("./component/edit/edit.component").then(m => m.EditComponent)
  },

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
