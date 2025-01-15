import { app, BrowserWindow, ipcMain } from "electron";
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import path  from "path";
import fs from "fs";

// get __dirname because origin __dirname is undefined in ES6 modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const userDataPath = app.getPath('userData');

const notesDir = path.join(userDataPath, 'notes');
const recycleDir = path.join(userDataPath, 'notes/$recycle');
const isDev = !app.isPackaged;

// if (!fs.existsSync(notesDir)) {
//     fs.mkdirSync(notesDir, { recursive: true });
// }

if (!fs.existsSync(recycleDir)) {
    fs.mkdirSync(recycleDir, { recursive: true });
}

function createWindow() {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        icon: path.join(__dirname, "public/favicon.ico"),
        webPreferences: {
            nodeIntegration: true,
            preload: path.join(__dirname, "preload.mjs"),
            webSecurity: false,
        },
    });

    if (isDev) {
        win.webContents.openDevTools();
        win.loadURL("http://localhost:5173");
    } else {
        win.loadFile(path.join(__dirname, "dist/index.html"));
    }
}

/**
 *
 * for api
 */
ipcMain.on("write-note", (_, args) => {
    const { title, content } = args;
    fs.writeFileSync(path.join(notesDir, `${title}.md`), content, 'utf8');
});

ipcMain.handle("get-notes", () => {
    return fs.readdirSync(notesDir).filter((file) => {
        const filePath = path.join(notesDir, file);
        return fs.statSync(filePath).isFile() && path.extname(filePath) === '.md';
    }).map((file) => {
        const filePath = path.join(notesDir, file)
        const content = fs.readFileSync(filePath, 'utf8');
        const stat = fs.statSync(filePath);
        const creationTime = stat.ctime.getTime().toString();
        // TODO: how to deal with id??
        return { id: creationTime, title: file.replace('.md', ''), content };
    });
});

ipcMain.on("move-to-recycle", (_, args) => {
    const { title, content } = args;
    fs.renameSync(path.join(notesDir, `${title}.md`), path.join(recycleDir, `${title}.md`));
})

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