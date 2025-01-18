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

/**
 * Note is a type of FileNode with only the necessary properties  
 * include **required(type, nodeName, content)** and  
 * **optional(fullPath, relativePath)**
 */
export type Note = Pick<FileNode, "type" | "nodeName" | "content"> & Partial<Pick<FileNode, "fullPath" | "relativePath">>;