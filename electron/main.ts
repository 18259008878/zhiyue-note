import { app, BrowserWindow, ipcMain } from "electron";
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';
import path from "node:path";
import fs from "fs";
import type { NoteListNode, Note } from "../src/types";

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

ipcMain.on("write-note", (_, args) => {
    const { title, content } = args;
    fs.writeFileSync(path.join(notesDir, `${title}.md`), content, 'utf8');
});

ipcMain.on("move-to-recycle", (_, noteListNodeJson: string) => {
    const noteListNode = JSON.parse(noteListNodeJson) as NoteListNode;
    fs.renameSync(path.join(notesDir, `${noteListNode.content!.categoryName}`, `${noteListNode.content!.title}.md`), path.join(recycleDir, `${noteListNode.content!.title}.md`));
});

ipcMain.on("delete-note", (_, noteJson: string) => {
    const note = JSON.parse(noteJson) as Note;
    fs.rmSync(path.join(recycleDir, `${note.title}.md`));
});

function getNotes(dir: string): NoteListNode[] {
    const items = fs.readdirSync(dir, { withFileTypes: true });
    items.sort((a, b) => {
        if (a.isDirectory() && !b.isDirectory()) return -1;
        if (!a.isDirectory() && b.isDirectory()) return 1;
        return a.name.localeCompare(b.name);
    });
    return items.map(item => {
        const fullPath = path.join(dir, item.name);
        if (item.isFile() && path.extname(fullPath) === '.md') {
            let categoryName = path.dirname(fullPath).replace(notesDir, '') .replace(/\\/g, '/').replace(/^\//, '');
            categoryName = categoryName === "$recycle" ? "回收站" : categoryName;
            return {
                type: 'file',
                name: item.name.replace('.md', ''),
                content: {
                    title: item.name.replace('.md', ''),
                    content: fs.readFileSync(fullPath, 'utf8'),
                    categoryName: categoryName,
                },
            }
        } else {
            const name = item.name == "$recycle" ? "回收站" : item.name;
            return {
                type: 'directory',
                name: name,
                children: getNotes(fullPath),
            }
        }
    });
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