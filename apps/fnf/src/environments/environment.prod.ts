export const environment = {
  production: true,
  version: '27.08.2022 15:45',
  commitHash: 'bb3ebdc',

  config: {
    getUrl: "/api/config"
  },
  sysinfo: {
    getDrivesUrl: "/api/drives",
    getSysinfoUrl: "/api/sysinfo",
    getAllinfoUrl: "/api/allinfo",
    getFirstStartFolderUrl: "/api/firststartfolder"
  },
  fileSystem: {
    checkPathUrl: "/api/checkpath",
    filterExistsUrl: "/api/filterexists",
    readDirUrl: "/api/readdir",
    defaultRoot: "/",
    fileWatcher: false
  },
  multiRename: {
    convertnamesUrl: "/api/ai/convertnames",
    groupfilesUrl: "/api/ai/groupfiles",
    hasOpenAiApiKeyUrl: "/api/ai/hasopenaiapikey"
  },
  checkGlob: {
    checkGlobUrl: "/api/checkglob"
  },
  clean: {
    cleanUrl: "/api/clean"
  },
  shell: {
    shellUrl: "/api/shell",
    spawnUrl: "/api/spawn",
    cancelSpawnUrl: "/api/cancelspawn",
  },
  walkdir: {
    walkdirSyncUrl: "/api/walkdirsync",
    syncMode: true
  },

  shellAutocomplete: {
    autocompleteUrl: "/api/shell-autocomplete"
  },
  lookAndFeel: {
    getLookAndFeelUrl: "assets/config/color/%theme%.json"
  },
  shortcut: {
    getShortcutActionMappingUrl: "assets/config/shortcut/"
  },
  filetypeExtensions: {
    getFiletypesUrl: "assets/config/filetype/filetype-extensions.json"
  },
  edit: {
    getFile: "api/file?name=",
    saveFile: "api/file?name="
  },
  fileAction: {
    url: "api/do",
    multiUrl: "api/do/multi",
  },
  gotoAnything: {
    findFoldersUrl: "api/findfolders"
  },
  tool: {
    shellUrl: "api/shell"
  }
};
