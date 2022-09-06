class JitError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "JitError";
    }
}

export function assert(condition: boolean, message: string): void;
export function assert(condition: () => boolean, message: string): void;
export function assert(condition: (err: (message: string) => void) => void): void;
export function assert(
    condition: boolean | (() => boolean) | ((err: (message: string) => void) => void),
    message?: string
): void {
    if (message !== undefined) {
        if (typeof condition === "function") {
            condition = (condition as () => boolean)();
        }
        if (!condition && typeof message === "string") {
            throw new JitError(message);
        }
    } else {
        if (typeof condition === "function") {
            condition((message: string) => {
                throw new JitError(message);
            });
        }
    }
}

export const errmsgs: { [key: string]: (...args: string[]) => string } = {
    notStr: (name: string) => `"${name}" is not of type string.`,
    notStrs: (name: string) => `"${name}" are not all of type string.`,
    notDefined: (name: string) => `"${name}" is not defined.`,
    notAbsolute: (path: string) => `"${path}" is not an absolute path.`,
    notExist: (path: string) => `"${path}" does not exist.`,
    outsideOfRoot: (path: string) => `"${path}" is outside of the current repository's root.`,
};
