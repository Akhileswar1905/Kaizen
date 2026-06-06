import { app, BrowserWindow } from "electron"
import path from "path"

app.on("ready", () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    autoHideMenuBar: true,
  })

  if (!app.isPackaged) {
    win.loadURL("http://localhost:5173")
  } else {
    win.loadFile(path.join(app.getAppPath(), "dist-react", "index.html"))
  }
})
