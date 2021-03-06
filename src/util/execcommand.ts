import { execFile, ExecOptions } from "child_process";

import { ErrorHandler } from "./errorhandler";

export function execute(
    command: string,
    args: string[],
    options: ExecOptions = {},
): Promise<string> {
    return new Promise((resolve, reject) => {
        ErrorHandler.logCommand(`${command} ${args.join(" ")}`);
        execFile(
            command,
            args,
            options,
            execFileCallback(command, resolve, reject),
        );
    });
}

function execFileCallback(
    command: string,
    resolve: (result: string) => void,
    reject: (err: Error) => void,
): (
    error: NodeJS.ErrnoException | null,
    stdout: string,
    stderr: string,
) => void {
    return (
        error: NodeJS.ErrnoException | null,
        stdout: string,
        stderr: string,
    ): void => {
        if (!error) {
            resolve(stdout);
            return;
        }

        if (error.code === "ENOENT") {
            const message = `${command}: No such file or directory. (ENOENT)`;
            ErrorHandler.logCritical(error, message);
            resolve("");
            return;
        }

        ErrorHandler.logError(new Error(stderr));
        resolve("");
        return;
    };
}
