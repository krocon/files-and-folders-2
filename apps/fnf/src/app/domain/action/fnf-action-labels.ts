export class FnfActionLabels {

  public static readonly actionIdLabelMap = {

    COPY_2_CLIPBOARD_FULLNAMES: "Copy full names to clipboard",
    COPY_2_CLIPBOARD_NAMES: "Copy names to clipboard",
    COPY_2_CLIPBOARD_FULLNAMES_AS_JSON: "Copy full names to clipboard as JSON",
    COPY_2_CLIPBOARD_NAMES_AS_JSON: "Copy names to clipboard as JSON",
    OPEN_COPY_DLG: "Copy",
    OPEN_MOVE_DLG: "Move",
    OPEN_MKDIR_DLG: "Create Dir",
    OPEN_DELETE_DLG: "Delete",
    OPEN_EDIT_DLG: "Edit",
    OPEN_VIEW_DLG: "View",
    SELECT_LEFT_PANEL: "Left Panel",
    SELECT_RIGHT_PANEL: "Right Panel",
    TOGGLE_PANEL: "Toggle Panels",
    ADD_NEW_TAB: "Add Tab",
    REMOVE_TAB: "Remove Tab",
    NEXT_TAB: "Toggle Tabs",
    TOGGLE_FILTER: "Toggle Filter Input",
    TOGGLE_HIDDEN_FILES: "Toggle Hidden Files",
    TOGGLE_SHELL: "Toggle Shell",

    OPEN_SETUP_DLG: "Setup...",
    OPEN_ABOUT_DLG: "About...",
    OPEN_SHELL_DLG: "Server Shell...",
    OPEN_JOB_QUEUE_DLG: "Open Action Queue Dialog",
    OPEN_GOTO_ANYTHING_DLG: "Go to anything...",
    SAVE_CONFIG: "Save Config",
    OPEN_GROUPFILES_DLG: "Group Files...",
    OPEN_CHDIR_DLG: "Change Dir...",
    OPEN_FIND_DUBLICATES_DLG: "Find Dublicates...",
    OPEN_MULTIRENAME_DLG: "Multi Rename...",
    OPEN_MULTIMKDIR_DLG: "Multi MkDir...",
    OPEN_RENAME_DLG: "Rename...",
    OPEN_DELETE_EMPTY_FOLDERS_DLG: "Clean Folders...",
    OPEN_FIND_DLG: "Find...",
    RELOAD_DIR: "Reload...",

    OPEN_SELECT_DLG: "Enhance Selection...",

    SELECT_ALL: "Select All",
    DESELECT_ALL: "Deselect All",
    ENHANCE_SELECTION: "Enhance Selection",
    DESELECT: "Deselect All",
    REDUCE_SELECTION: "Reduce Selection",
    OPEN_DESELECT_DLG: "Reduce Selection...",


    TOGGLE_SELECTION: "Toggle Selection",
    TOGGLE_SELECTION_CURRENT_ROW:'Toggle Selection Current Row',
    NAVIGATE_LEVEL_DOWN: "Parent Dir",
    NAVIGATE_BACK: "History Back",
    //ENTER_PRESSED:'Run or navigate',
    OPEN_COLORCONFIG_DLG: "Color Config...",




    ENTER_PRESSED	: "Execute File",
    HOME_PRESSED		: "Jump to begin",
    SPACE_PRESSED		: "Toggle selection on focussed row",
    END_PRESSED		: "Jump to end",
    PAGEUP_PRESSED	: "Jump to top",
    PAGEDOWN_PRESSED		: "Jump to bottom",
    ARROW_UP	: "Change Focus",
    ARROW_DOWN	: "Change Focus",

  } as { [key: string]: string };

  static getLabel(key: string): string {
    return FnfActionLabels.actionIdLabelMap[key];
  }

}
