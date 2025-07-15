import {SysinfoIf} from './sysinfo.if';


export class Sysinfo implements SysinfoIf {

  public type = '';
  public platform = '';
  public arch = '';
  public linux = false;
  public osx = false;
  public windows = false;
  public smartMachine = false;
  public docker = false;

  public hostname = '';
  public username = '';
  public homedir = '';
  public tmpdir = '';

}
