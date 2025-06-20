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
    getFirstStartFolderUrl: "/api/firststartfolder"
  },
  fileSystem: {
    checkPathUrl: "/api/checkpath",
    readDirUrl: "/api/readdir"
  },
  lookAndFeel: {
    getLookAndFeelUrl: "assets/config/color/%theme%.json"
  },
  shortcut: {
    getShortcutActionMappingUrl: "assets/config/shortcut/windows.json"
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
