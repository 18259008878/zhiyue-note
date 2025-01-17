export interface FileNode {
    /**
     * file or directory
     */
    type: 'file' | 'directory';
    /**
     * file name or directory name
     */
    nodeName: string;
    /**
     * if type is file, category is the name of dirname of the file  
     * else undefined
     */
    relativePath?: string;
    /**
     * file path or directory path
     * example: C:\Users\user\Documents\test.md
     */
    fullPath: string;
    /**
     * if type is file, content is the content of the file  
     * else undefined
     */
    content?: string;
    /**
     * if type is directory, children is the children of the directory  
     * else undefined
     */
    children?: FileNode[];
}