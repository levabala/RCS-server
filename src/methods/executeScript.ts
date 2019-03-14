import * as appRoot from 'app-root-path';
import { asyncExec } from 'async-shelljs';
import { readdir, stat } from 'fs';
import { Command } from 'src/command';
import { promisify } from 'util';

const scriptsDirPath = 'externalScripts';
const readdirAsync = promisify(readdir);
const statAsync = promisify(stat);

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

  const res = asyncExec(
    `${appRoot.path}/${scripts[scriptName]} ${commandArgs.join(' ')}`,
    {
      silent: true,
    },
  )
    .then(res => ({ output: ['\n' + res] }))
    .catch(e => ({ output: ['\n' + e.message] }));

  return res;
};

export default executeScript;
