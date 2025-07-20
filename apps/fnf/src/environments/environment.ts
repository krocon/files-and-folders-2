// This file-content can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file-content replacements can be found in `angular.json`.

const prefix = 'http://localhost:3333';

export const environment = {
  production: false,
  version: '{BUILD_VERSION}',
  commitHash: '{COMMIT_HASH}',

  config: {
    getUrl: prefix + "/api/config"
  },
  sysinfo: {
    getDrivesUrl: prefix + "/api/drives",
    getSysinfoUrl: prefix + "/api/sysinfo",
    getAllinfoUrl: prefix + "/api/allinfo",
    getFirstStartFolderUrl: prefix + "/api/firststartfolder"
  },
  fileSystem: {
    checkPathUrl: prefix + "/api/checkpath",
    filterExistsUrl: prefix + "/api/filterexists",
    readDirUrl: prefix + "/api/readdir",
    defaultRoot: "/",
    fileWatcher: false
  },
  multiRename: {
    convertnamesUrl: prefix + "/api/ai/convertnames",
    groupfilesUrl: prefix + "/api/ai/groupfiles",
    hasOpenAiApiKeyUrl: prefix + "/api/ai/hasopenaiapikey"
  },
  checkGlob: {
    checkGlobUrl: prefix + "/api/checkglob"
  },
  clean: {
    cleanUrl: prefix + "/api/clean"
  },
  shell: {
    shellUrl: prefix + "/api/shell",
    spawnUrl: prefix + "/api/spawn",
    cancelSpawnUrl: prefix + "/api/cancelspawn",
  },
  walkdir: {
    walkdirSyncUrl: prefix + "/api/walkdirsync",
    syncMode: true
  },
  shellAutocomplete: {
    autocompleteUrl: prefix + "/api/shell-autocomplete"
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
    getFile: prefix + "/api/file?name=",
    saveFile: prefix + "/api/file?name="
  },
  fileAction: {
    url: prefix + "/api/do",
    multiUrl: prefix + "/api/do/multi",
  },
  gotoAnything: {
    findFoldersUrl: prefix + "/api/findfolders"
  },
  tool: {
    shellUrl: prefix + "/api/shell"
  }
};

/*
 * For easier debugging in development mode, you can import the following file-content
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
