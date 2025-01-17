import { app, BrowserWindow, ipcMain } from "electron";
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';
import path from "node:path";
import fs from "fs";
import type { FileNode } from "../src/types";

// get __dirname because origin __dirname is undefined in ES6 modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const userDataPath = app.getPath('userData');

process.env.APP_ROOT = path.join(__dirname, '..')

// 🚧 Use ['ENV_NAME'] avoid vite:define plugin - Vite@2.x
export const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL'];
export const MAIN_DIST = path.join(process.env.APP_ROOT, 'dist-electron');
export const RENDERER_DIST = path.join(process.env.APP_ROOT, 'dist');

process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL ? path.join(process.env.APP_ROOT, 'public') : RENDERER_DIST;

const notesDir = path.join(userDataPath, 'notes');
const recycleDir = path.join(userDataPath, 'notes/$recycle');
// const isDev = !app.isPackaged;

if (!fs.existsSync(notesDir)) {
    fs.mkdirSync(notesDir, { recursive: true });
}

if (!fs.existsSync(recycleDir)) {
    fs.mkdirSync(recycleDir, { recursive: true });
}

function createWindow() {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        icon: path.join(process.env.VITE_PUBLIC!, 'favicon.ico'),
        webPreferences: {
            nodeIntegration: true,
            preload: path.join(__dirname, "./preload.mjs"),
            webSecurity: false,
        },
    });

    if (VITE_DEV_SERVER_URL) {
        win.webContents.openDevTools();
        win.loadURL(VITE_DEV_SERVER_URL);
    } else {
        // win.loadFile('dist/index.html')
        win.loadFile(path.join(RENDERER_DIST, 'index.html'));
    }
}

/**
 *
 * for api
 */

ipcMain.handle("get-notes", () => getNotes(notesDir));

ipcMain.on("write-note", (_, fileNodeJson: string) => {
    const fileNode = JSON.parse(fileNodeJson) as FileNode;
    console.log(fileNode.fullPath);
    const filePath = fileNode.fullPath ?? path.join(notesDir, `${fileNode.nodeName}.md`);
    fs.writeFileSync(filePath, fileNode.content!, 'utf8');
});

ipcMain.on("move-to-recycle", (_, fileNodeJson: string) => {
    const fileNode = JSON.parse(fileNodeJson) as FileNode;
    const fileNodeMeta: Pick<FileNode, "nodeName" | "fullPath"> = {
        nodeName: fileNode.nodeName,
        fullPath: fileNode.fullPath,
    };
    fs.writeFileSync(path.join(recycleDir, `$recycle-meta-${fileNode.nodeName}.json`), JSON.stringify(fileNodeMeta), 'utf8');
    fs.renameSync(fileNode.fullPath, path.join(recycleDir, `${fileNode.nodeName}.md`));
});

ipcMain.on("recycle-note", (_, fileNodeJson: string) => {
    const fileNode = JSON.parse(fileNodeJson) as FileNode;
    const fileNodeMeta: Pick<FileNode, "nodeName" | "fullPath"> = JSON.parse(fs.readFileSync(path.join(recycleDir, `$recycle-meta-${fileNode.nodeName}.json`), 'utf8'));
    fs.renameSync(fileNode.fullPath, fileNodeMeta.fullPath);
    fs.rmSync(path.join(recycleDir, `$recycle-meta-${fileNode.nodeName}.json`));
});

ipcMain.on("delete-note", (_, fileNodeJson: string) => {
    const fileNode = JSON.parse(fileNodeJson) as FileNode;
    fs.rmSync(fileNode.fullPath);
    fs.rmSync(path.join(recycleDir, `$recycle-meta-${fileNode.nodeName}.json`));
})

function getNotes(dir: string): FileNode[] {
    const items = fs.readdirSync(dir, { withFileTypes: true });
    items.sort((a, b) => {
        if (a.isDirectory() && !b.isDirectory()) return -1;
        if (!a.isDirectory() && b.isDirectory()) return 1;
        return a.name.localeCompare(b.name);
    });
    let result: FileNode[] = items.map(item => {
        const fullPath = path.join(dir, item.name);
        if (item.isFile() && path.extname(fullPath) === '.md') {
            let relativePath = path.dirname(fullPath).replace(notesDir, '') .replace(/\\/g, '/').replace(/^\//, '');
            relativePath = relativePath === "$recycle" ? "回收站" : relativePath;
            return {
                type: 'file',
                nodeName: item.name.replace('.md', ''),
                relativePath: relativePath,
                fullPath: fullPath,
                content: fs.readFileSync(fullPath, 'utf8'),
            }
        } else if (item.isDirectory()) {
            const name = item.name == "$recycle" ? "回收站" : item.name;
            return {
                type: 'directory',
                nodeName: name,
                fullPath: fullPath,
                children: getNotes(fullPath),
            }
        } else {
            return {
                type: 'file',
                nodeName: "unknown",
                fullPath: fullPath,
            }
        }
    });
    result = result.filter(item => item.nodeName !== "unknown");
    return result;
}

app.whenReady().then(() => {
    createWindow();

    app.on("activate", () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit();
    }
});