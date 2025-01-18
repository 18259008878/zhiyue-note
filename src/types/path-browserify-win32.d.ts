declare module 'path-browserify-win32' {
    const CHAR_UPPERCASE_A: number;
    const CHAR_LOWERCASE_A: number;
    const CHAR_UPPERCASE_Z: number;
    const CHAR_LOWERCASE_Z: number;
    const CHAR_DOT: number;
    const CHAR_FORWARD_SLASH: number;
    const CHAR_BACKWARD_SLASH: number;
    const CHAR_COLON: number;
    const CHAR_QUESTION_MARK: number;

    function validateObject(obj: any, name: string): void;
    function validateString(value: string, name: string): void;
    function isPathSeparator(code: number): boolean;
    function isPosixPathSeparator(code: number): boolean;
    function isWindowsDeviceRoot(code: number): boolean;
    function normalizeString(path: string, allowAboveRoot: boolean, separator: string, isPathSeparator: (code: number) => boolean): string;
    function formatExt(ext: string): string;
    function _format(sep: string, pathObject: { dir?: string; root?: string; base?: string; name?: string; ext?: string; }): string;

    const win32: {
        resolve(...args: string[]): string;
        normalize(path: string): string;
        isAbsolute(path: string): boolean;
        join(...args: string[]): string;
        relative(from: string, to: string): string;
        toNamespacedPath(path: string): string;
        dirname(path: string): string;
        basename(path: string, suffix?: string): string;
        extname(path: string): string;
        format: typeof _format;
        parse(path: string): { dir: string; root: string; base: string; name: string; ext: string; };
        sep: string;
        delimiter: string;
        win32: typeof win32;
        posix: typeof posix;
    };

    const posix: typeof win32;

    export = posix;
}