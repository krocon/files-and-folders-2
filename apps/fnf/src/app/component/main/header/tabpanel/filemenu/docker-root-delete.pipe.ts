import {Pipe, PipeTransform} from '@angular/core';

@Pipe({name: 'deleteDockerRoot'})
export class DockerRootDeletePipe implements PipeTransform {

  static dockerRoot = '';

  transform(s: string): string {
    if (s === null || s === undefined) {
      return '';
    }
    if (!DockerRootDeletePipe.dockerRoot) {
      return s;
    }
    if (DockerRootDeletePipe.dockerRoot === s) {
      return 'root';
    }
    return s.replace(DockerRootDeletePipe.dockerRoot, '');
  }
}
