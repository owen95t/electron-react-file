import {useState, useMemo} from "react";
import {FilesViewer} from "./FilesViewerComponent";

const fs = window.require('fs')
const pathModule = window.require('path')

const {app} = window.require('@electron/remote')

const formatSize = size => {
  let i = Math.floor(Math.log(size) / Math.log(1024))
  return (
      (size / Math.pow(1024, i).toFixed(2) * 1 + ' - ' + ['B', 'kB', 'MB', 'GB', 'TB'][i])
  )
}

function App() {
  const [path, setPath] = useState(app.getAppPath());

  const files = useMemo(() =>
      fs
      .readdirSync(path)
      .map(file => {
        const stats = fs.statSync(pathModule.join(path, file))
        return {
          name: file,
          size: stats.isFile? formatSize(stats.size ?? 0) : null,
          directory: stats.isDirectory()
        }
      })
      .sort((a,b) => {
        if(a.directory === b.directory){
          return a.name.localeCompare(b.name);
        }
        return a.directory ? -1 : 1
      }),

      [path]
  )

  const onBack = () => setPath(pathModule.dirname(path));
  const onOpen = folder => setPath((pathModule.join(path, folder)))

  const [search, setSearch] = useState('')
  const filteredFiles = files.filter(s => s.name.startsWith(search))
  return (
    <div className="App">
      <h3>{path}</h3>
      <div>
        <input
          value = {search}
          onChange = {event => setSearch(event.target.value)}
          className={'form-control form-control-sm'}
          placeholder="File Search"
        />
      </div>
        <FilesViewer file={filteredFiles} onBack={onBack} onOpen={onOpen}/>
    </div>
  );
}

export default App;
