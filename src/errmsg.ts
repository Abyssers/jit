interface ErrMsgGenerator {
    (...args: any[]): string;
}

export const NOT_STRING: ErrMsgGenerator = (name: string) => `"${name}" is not of type string.`;
export const NOT_STRINGS: ErrMsgGenerator = (name: string) => `"${name}" are not all of type string.`;
export const NOT_DEFINED: ErrMsgGenerator = (name: string) => `"${name}" is not defined.`;
export const NOT_ABSOLUTE: ErrMsgGenerator = (path: string) => `"${path}" is not an absolute path.`;
export const NOT_EXIST: ErrMsgGenerator = (path: string) => `"${path}" does not exist.`;
