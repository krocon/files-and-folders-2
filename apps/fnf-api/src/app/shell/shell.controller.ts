import {Controller, Post} from "@nestjs/common";
import {ShellCmdIf} from "@fnf/fnf-data";
import {MessageBody} from "@nestjs/websockets";
import {exec} from "child_process";
import * as path from "node:path";
import {promisify} from "util";


@Controller("shell")
export class ShellController {


  @Post("")
  async shell(
    @MessageBody() cmds: ShellCmdIf[]
  ): Promise<void> {

    const clidir = path.join(__dirname, '../../../cli');
    const execPromise = promisify(exec);

    for (const cmd of cmds) {
      let para = cmd.para.trim();
      if (para.includes(' ')) para = `"${para}"`;
      const c = (cmd.cmd + ' ' + para)
        .replace(/\$__dirname/g, __dirname)
        .replace(/\$clidir/g, clidir);

      console.info('shell cmd...:', cmd); // TODO del
      try {
        const {stdout, stderr} = await execPromise(c);
        if (stdout) console.info('stdout', stdout); // TODO del
        if (stderr) console.error('stderr', stderr);
      } catch (error) {
        console.error('error', error);
      }
    }
  }

}
