import * as appRoot from 'app-root-path';
import { asyncExec } from 'async-shelljs';
import { execFile } from 'child_process';
import { readdir, stat } from 'fs';
import { Command } from 'src/command';
import { promisify } from 'util';

const scriptsDirPath = 'externalScripts';
const readdirAsync = promisify(readdir);
const statAsync = promisify(stat);
const execFileAsync = promisify(execFile);

async function fetchScrips(): Promise<{ [name: string]: string }> {
  return readdirAsync(scriptsDirPath).then(async files => {
    return Promise.all(
      files.map(async f => {
        const path = scriptsDirPath + '/' + f;
        const stat = await statAsync(path);
        if (stat.isDirectory()) return null;

        console.log(f, path);

        return [f, path];
      }),
    ).then(entries =>
      entries.reduce((acc, [name, p]) => {
        acc[name] = p;
        return acc;
      }, {}),
    );
  });
}

export type ExecuteScriptRequest = any[];
export type ExecuteScriptResponse = { output: string[] };

const executeScript: Command<
  ExecuteScriptRequest,
  ExecuteScriptResponse
> = async args => {
  let scriptName;
  try {
    [scriptName] = args;
  } catch (e) {
    throw new Error('invalid args');
  }

  args.shift();
  const commandArgs = args;

  const scripts = await fetchScrips().catch(err => {
    console.log(err);
    throw err;
  });

  if (!(scriptName in scripts)) throw new Error('no such script');

  const script = scripts[scriptName];
  const elems = script.split('.');
  const extension = elems[elems.length - 1];
  const executorsMap = {
    sh: (path: string) => asyncExec(path, { silent: true }),
    exe: execFileAsync,
    bat: execFileAsync,
  };
  const executor = executorsMap[extension];

  const path = `${appRoot.path}/${script} ${commandArgs.join(' ')}`;
  const res = executor(path)
    .then((res: any) => ({ output: ['\n' + res] }))
    .catch((e: any) => ({ output: ['\n' + e.message] }));

  return res;
};

export default executeScript;
