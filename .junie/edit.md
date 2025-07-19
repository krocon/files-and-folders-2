# When you are working on apps/fnf/src/edit.html

- Use plain html, js and css. No third party lib!

- Make smaller function.

- Don't write comments in the code.

- Try to use css variables as much as possible. No hardcoded values in css rules.

- Try use following css variables (they will be loaded dynamically):

```css

body {
    --vscode-actionBar-toggledBackground: rgba(0, 127, 212, 0.4);
    --vscode-badge-background: #4d4d4d;
    --vscode-badge-foreground: #ffffff;
    --vscode-breadcrumb-activeSelectionForeground: #e0e0e0;
    --vscode-breadcrumb-background: #1e1e1e;
    --vscode-breadcrumb-focusForeground: #e0e0e0;
    --vscode-breadcrumb-foreground: rgba(204, 204, 204, 0.8);
    --vscode-breadcrumbPicker-background: #252526;
    --vscode-button-background: #0e639c;
    --vscode-button-foreground: #ffffff;
    --vscode-button-hoverBackground: #1177bb;
    --vscode-button-secondaryBackground: #3a3d41;
    --vscode-button-secondaryForeground: #ffffff;
    --vscode-button-secondaryHoverBackground: #45494e;
    --vscode-button-separator: rgba(255, 255, 255, 0.4);
    --vscode-charts-blue: #3794ff;
    --vscode-charts-foreground: #cccccc;
    --vscode-charts-green: #89d185;
    --vscode-charts-lines: rgba(204, 204, 204, 0.5);
    --vscode-charts-orange: #d18616;
    --vscode-charts-purple: #b180d7;
    --vscode-charts-red: #f14c4c;
    --vscode-charts-yellow: #cca700;
    --vscode-checkbox-background: #3c3c3c;
    --vscode-checkbox-border: #3c3c3c;
    --vscode-checkbox-foreground: #f0f0f0;
    --vscode-checkbox-selectBackground: #252526;
    --vscode-checkbox-selectBorder: #c5c5c5;
    --vscode-descriptionForeground: rgba(204, 204, 204, 0.7);
    --vscode-diffEditor-diagonalFill: rgba(204, 204, 204, 0.2);
    --vscode-diffEditor-insertedLineBackground: rgba(155, 185, 85, 0.2);
    --vscode-diffEditor-insertedTextBackground: rgba(156, 204, 44, 0.2);
    --vscode-diffEditor-move-border: rgba(139, 139, 139, 0.61);
    --vscode-diffEditor-moveActive-border: #ffa500;
    --vscode-diffEditor-removedLineBackground: rgba(255, 0, 0, 0.2);
    --vscode-diffEditor-removedTextBackground: rgba(255, 0, 0, 0.2);
    --vscode-diffEditor-unchangedCodeBackground: rgba(116, 116, 116, 0.16);
    --vscode-diffEditor-unchangedRegionForeground: #cccccc;
    --vscode-diffEditor-unchangedRegionShadow: #000000;
    --vscode-disabledForeground: rgba(204, 204, 204, 0.5);
    --vscode-dropdown-background: #3c3c3c;
    --vscode-dropdown-border: #3c3c3c;
    --vscode-dropdown-foreground: #f0f0f0;
    --vscode-editor-background: #1e1e1e;
    --vscode-editor-findMatchBackground: #515c6a;
    --vscode-editor-findMatchHighlightBackground: rgba(234, 92, 0, 0.33);
    --vscode-editor-findRangeHighlightBackground: rgba(58, 61, 65, 0.4);
    --vscode-editor-foldBackground: rgba(38, 79, 120, 0.3);
    --vscode-editor-foldPlaceholderForeground: #808080;
    --vscode-editor-foreground: #d4d4d4;
    --vscode-editor-hoverHighlightBackground: rgba(38, 79, 120, 0.25);
    --vscode-editor-inactiveSelectionBackground: #3a3d41;
    --vscode-editor-lineHighlightBorder: #282828;
    --vscode-editor-linkedEditingBackground: rgba(255, 0, 0, 0.3);
    --vscode-editor-placeholder-foreground: rgba(255, 255, 255, 0.34);
    --vscode-editor-rangeHighlightBackground: rgba(255, 255, 255, 0.04);
    --vscode-editor-selectionBackground: #264f78;
    --vscode-editor-selectionHighlightBackground: rgba(173, 214, 255, 0.15);
    --vscode-editor-snippetFinalTabstopHighlightBorder: #525252;
    --vscode-editor-snippetTabstopHighlightBackground: rgba(124, 124, 124, 0.3);
    --vscode-editor-symbolHighlightBackground: rgba(234, 92, 0, 0.33);
    --vscode-editor-wordHighlightBackground: rgba(87, 87, 87, 0.72);
    --vscode-editor-wordHighlightStrongBackground: rgba(0, 73, 114, 0.72);
    --vscode-editor-wordHighlightTextBackground: rgba(87, 87, 87, 0.72);
    --vscode-editorActionList-background: #252526;
    --vscode-editorActionList-focusBackground: #04395e;
    --vscode-editorActionList-focusForeground: #ffffff;
    --vscode-editorActionList-foreground: #cccccc;
    --vscode-editorActiveLineNumber-foreground: #c6c6c6;
    --vscode-editorBracketHighlight-foreground1: #ffd700;
    --vscode-editorBracketHighlight-foreground2: #da70d6;
    --vscode-editorBracketHighlight-foreground3: #179fff;
    --vscode-editorBracketHighlight-foreground4: rgba(0, 0, 0, 0);
    --vscode-editorBracketHighlight-foreground5: rgba(0, 0, 0, 0);
    --vscode-editorBracketHighlight-foreground6: rgba(0, 0, 0, 0);
    --vscode-editorBracketHighlight-unexpectedBracket-foreground: rgba(255, 18, 18, 0.8);
    --vscode-editorBracketMatch-background: rgba(0, 100, 0, 0.1);
    --vscode-editorBracketMatch-border: #888888;
    --vscode-editorBracketPairGuide-activeBackground1: rgba(0, 0, 0, 0);
    --vscode-editorBracketPairGuide-activeBackground2: rgba(0, 0, 0, 0);
    --vscode-editorBracketPairGuide-activeBackground3: rgba(0, 0, 0, 0);
    --vscode-editorBracketPairGuide-activeBackground4: rgba(0, 0, 0, 0);
    --vscode-editorBracketPairGuide-activeBackground5: rgba(0, 0, 0, 0);
    --vscode-editorBracketPairGuide-activeBackground6: rgba(0, 0, 0, 0);
    --vscode-editorBracketPairGuide-background1: rgba(0, 0, 0, 0);
    --vscode-editorBracketPairGuide-background2: rgba(0, 0, 0, 0);
    --vscode-editorBracketPairGuide-background3: rgba(0, 0, 0, 0);
    --vscode-editorBracketPairGuide-background4: rgba(0, 0, 0, 0);
    --vscode-editorBracketPairGuide-background5: rgba(0, 0, 0, 0);
    --vscode-editorBracketPairGuide-background6: rgba(0, 0, 0, 0);
    --vscode-editorCodeLens-fontFeatureSettings: "liga" off, "calt" off;
    --vscode-editorCodeLens-fontSize: 10px;
    --vscode-editorCodeLens-foreground: #999999;
    --vscode-editorCodeLens-lineHeight: 15px;
    --vscode-editorCursor-foreground: #aeafad;
    --vscode-editorError-foreground: #f14c4c;
    --vscode-editorGhostText-foreground: rgba(255, 255, 255, 0.34);
    --vscode-editorGutter-background: #1e1e1e;
    --vscode-editorGutter-foldingControlForeground: #c5c5c5;
    --vscode-editorHint-foreground: rgba(238, 238, 238, 0.7);
    --vscode-editorHoverWidget-background: #252526;
    --vscode-editorHoverWidget-border: #454545;
    --vscode-editorHoverWidget-foreground: #cccccc;
    --vscode-editorHoverWidget-highlightForeground: #2aaaff;
    --vscode-editorHoverWidget-statusBarBackground: #2c2c2d;
    --vscode-editorIndentGuide-activeBackground1: #707070;
    --vscode-editorIndentGuide-activeBackground2: rgba(0, 0, 0, 0);
    --vscode-editorIndentGuide-activeBackground3: rgba(0, 0, 0, 0);
    --vscode-editorIndentGuide-activeBackground4: rgba(0, 0, 0, 0);
    --vscode-editorIndentGuide-activeBackground5: rgba(0, 0, 0, 0);
    --vscode-editorIndentGuide-activeBackground6: rgba(0, 0, 0, 0);
    --vscode-editorIndentGuide-activeBackground: rgba(227, 228, 226, 0.16);
    --vscode-editorIndentGuide-background1: #404040;
    --vscode-editorIndentGuide-background2: rgba(0, 0, 0, 0);
    --vscode-editorIndentGuide-background3: rgba(0, 0, 0, 0);
    --vscode-editorIndentGuide-background4: rgba(0, 0, 0, 0);
    --vscode-editorIndentGuide-background5: rgba(0, 0, 0, 0);
    --vscode-editorIndentGuide-background6: rgba(0, 0, 0, 0);
    --vscode-editorIndentGuide-background: rgba(227, 228, 226, 0.16);
    --vscode-editorInfo-foreground: #3794ff;
    --vscode-editorInlayHint-background: rgba(77, 77, 77, 0.1);
    --vscode-editorInlayHint-foreground: #969696;
    --vscode-editorInlayHint-parameterBackground: rgba(77, 77, 77, 0.1);
    --vscode-editorInlayHint-parameterForeground: #969696;
    --vscode-editorInlayHint-typeBackground: rgba(77, 77, 77, 0.1);
    --vscode-editorInlayHint-typeForeground: #969696;
    --vscode-editorLightBulb-foreground: #ffcc00;
    --vscode-editorLightBulbAi-foreground: #ffcc00;
    --vscode-editorLightBulbAutoFix-foreground: #75beff;
    --vscode-editorLineNumber-activeForeground: #c6c6c6;
    --vscode-editorLineNumber-foreground: #858585;
    --vscode-editorLink-activeForeground: #4e94ce;
    --vscode-editorMarkerNavigation-background: #1e1e1e;
    --vscode-editorMarkerNavigationError-background: #f14c4c;
    --vscode-editorMarkerNavigationError-headerBackground: rgba(241, 76, 76, 0.1);
    --vscode-editorMarkerNavigationInfo-background: #3794ff;
    --vscode-editorMarkerNavigationInfo-headerBackground: rgba(55, 148, 255, 0.1);
    --vscode-editorMarkerNavigationWarning-background: #cca700;
    --vscode-editorMarkerNavigationWarning-headerBackground: rgba(204, 167, 0, 0.1);
    --vscode-editorMultiCursor-primary-foreground: #aeafad;
    --vscode-editorMultiCursor-secondary-foreground: #aeafad;
    --vscode-editorOverviewRuler-border: rgba(127, 127, 127, 0.3);
    --vscode-editorOverviewRuler-bracketMatchForeground: #a0a0a0;
    --vscode-editorOverviewRuler-commonContentForeground: rgba(96, 96, 96, 0.4);
    --vscode-editorOverviewRuler-currentContentForeground: rgba(64, 200, 174, 0.5);
    --vscode-editorOverviewRuler-errorForeground: rgba(255, 18, 18, 0.7);
    --vscode-editorOverviewRuler-findMatchForeground: rgba(209, 134, 22, 0.49);
    --vscode-editorOverviewRuler-incomingContentForeground: rgba(64, 166, 255, 0.5);
    --vscode-editorOverviewRuler-infoForeground: #3794ff;
    --vscode-editorOverviewRuler-rangeHighlightForeground: rgba(0, 122, 204, 0.6);
    --vscode-editorOverviewRuler-selectionHighlightForeground: rgba(160, 160, 160, 0.8);
    --vscode-editorOverviewRuler-warningForeground: #cca700;
    --vscode-editorOverviewRuler-wordHighlightForeground: rgba(160, 160, 160, 0.8);
    --vscode-editorOverviewRuler-wordHighlightStrongForeground: rgba(192, 160, 192, 0.8);
    --vscode-editorOverviewRuler-wordHighlightTextForeground: rgba(160, 160, 160, 0.8);
    --vscode-editorRuler-foreground: #5a5a5a;
    --vscode-editorStickyScroll-background: #1e1e1e;
    --vscode-editorStickyScroll-shadow: #000000;
    --vscode-editorStickyScrollHover-background: #2a2d2e;
    --vscode-editorSuggestWidget-background: #252526;
    --vscode-editorSuggestWidget-border: #454545;
    --vscode-editorSuggestWidget-focusHighlightForeground: #2aaaff;
    --vscode-editorSuggestWidget-foreground: #d4d4d4;
    --vscode-editorSuggestWidget-highlightForeground: #2aaaff;
    --vscode-editorSuggestWidget-selectedBackground: #04395e;
    --vscode-editorSuggestWidget-selectedForeground: #ffffff;
    --vscode-editorSuggestWidgetStatus-foreground: rgba(212, 212, 212, 0.5);
    --vscode-editorUnicodeHighlight-border: #cca700;
    --vscode-editorUnnecessaryCode-opacity: rgba(0, 0, 0, 0.67);
    --vscode-editorWarning-foreground: #cca700;
    --vscode-editorWhitespace-foreground: rgba(227, 228, 226, 0.16);
    --vscode-editorWidget-background: #252526;
    --vscode-editorWidget-border: #454545;
    --vscode-editorWidget-foreground: #cccccc;
    --vscode-errorForeground: #f48771;
    --vscode-focusBorder: #007fd4;
    --vscode-foreground: #cccccc;
    --vscode-icon-account-content: '\eb99';
    --vscode-icon-account-font-family: 'codicon';
    --vscode-icon-activate-breakpoints-content: '\ea97';
    --vscode-icon-activate-breakpoints-font-family: 'codicon';
    --vscode-icon-add-content: '\ea60';
    --vscode-icon-add-font-family: 'codicon';
    --vscode-icon-alert-content: '\ea6c';
    --vscode-icon-alert-font-family: 'codicon';
    --vscode-icon-archive-content: '\ea98';
    --vscode-icon-archive-font-family: 'codicon';
    --vscode-icon-array-content: '\ea8a';
    --vscode-icon-array-font-family: 'codicon';
    --vscode-icon-arrow-both-content: '\ea99';
    --vscode-icon-arrow-both-font-family: 'codicon';
    --vscode-icon-arrow-circle-down-content: '\ebfc';
    --vscode-icon-arrow-circle-down-font-family: 'codicon';
    --vscode-icon-arrow-circle-left-content: '\ebfd';
    --vscode-icon-arrow-circle-left-font-family: 'codicon';
    --vscode-icon-arrow-circle-right-content: '\ebfe';
    --vscode-icon-arrow-circle-right-font-family: 'codicon';
    --vscode-icon-arrow-circle-up-content: '\ebff';
    --vscode-icon-arrow-circle-up-font-family: 'codicon';
    --vscode-icon-arrow-down-content: '\ea9a';
    --vscode-icon-arrow-down-font-family: 'codicon';
    --vscode-icon-arrow-left-content: '\ea9b';
    --vscode-icon-arrow-left-font-family: 'codicon';
    --vscode-icon-arrow-right-content: '\ea9c';
    --vscode-icon-arrow-right-font-family: 'codicon';
    --vscode-icon-arrow-small-down-content: '\ea9d';
    --vscode-icon-arrow-small-down-font-family: 'codicon';
    --vscode-icon-arrow-small-left-content: '\ea9e';
    --vscode-icon-arrow-small-left-font-family: 'codicon';
    --vscode-icon-arrow-small-right-content: '\ea9f';
    --vscode-icon-arrow-small-right-font-family: 'codicon';
    --vscode-icon-arrow-small-up-content: '\eaa0';
    --vscode-icon-arrow-small-up-font-family: 'codicon';
    --vscode-icon-arrow-swap-content: '\ebcb';
    --vscode-icon-arrow-swap-font-family: 'codicon';
    --vscode-icon-arrow-up-content: '\eaa1';
    --vscode-icon-arrow-up-font-family: 'codicon';
    --vscode-icon-attach-content: '\ec34';
    --vscode-icon-attach-font-family: 'codicon';
    --vscode-icon-azure-content: '\ebd8';
    --vscode-icon-azure-devops-content: '\ebe8';
    --vscode-icon-azure-devops-font-family: 'codicon';
    --vscode-icon-azure-font-family: 'codicon';
    --vscode-icon-beaker-content: '\ea79';
    --vscode-icon-beaker-font-family: 'codicon';
    --vscode-icon-beaker-stop-content: '\ebe1';
    --vscode-icon-beaker-stop-font-family: 'codicon';
    --vscode-icon-bell-content: '\eaa2';
    --vscode-icon-bell-dot-content: '\eb9a';
    --vscode-icon-bell-dot-font-family: 'codicon';
    --vscode-icon-bell-font-family: 'codicon';
    --vscode-icon-bell-slash-content: '\ec08';
    --vscode-icon-bell-slash-dot-content: '\ec09';
    --vscode-icon-bell-slash-dot-font-family: 'codicon';
    --vscode-icon-bell-slash-font-family: 'codicon';
    --vscode-icon-blank-content: '\ec03';
    --vscode-icon-blank-font-family: 'codicon';
    --vscode-icon-bold-content: '\eaa3';
    --vscode-icon-bold-font-family: 'codicon';
    --vscode-icon-book-content: '\eaa4';
    --vscode-icon-book-font-family: 'codicon';
    --vscode-icon-bookmark-content: '\eaa5';
    --vscode-icon-bookmark-font-family: 'codicon';
    --vscode-icon-bracket-content: '\eb0f';
    --vscode-icon-bracket-dot-content: '\ebe5';
    --vscode-icon-bracket-dot-font-family: 'codicon';
    --vscode-icon-bracket-error-content: '\ebe6';
    --vscode-icon-bracket-error-font-family: 'codicon';
    --vscode-icon-bracket-font-family: 'codicon';
    --vscode-icon-briefcase-content: '\eaac';
    --vscode-icon-briefcase-font-family: 'codicon';
    --vscode-icon-broadcast-content: '\eaad';
    --vscode-icon-broadcast-font-family: 'codicon';
    --vscode-icon-browser-content: '\eaae';
    --vscode-icon-browser-font-family: 'codicon';
    --vscode-icon-bug-content: '\eaaf';
    --vscode-icon-bug-font-family: 'codicon';
    --vscode-icon-calendar-content: '\eab0';
    --vscode-icon-calendar-font-family: 'codicon';
    --vscode-icon-call-incoming-content: '\eb92';
    --vscode-icon-call-incoming-font-family: 'codicon';
    --vscode-icon-call-outgoing-content: '\eb93';
    --vscode-icon-call-outgoing-font-family: 'codicon';
    --vscode-icon-case-sensitive-content: '\eab1';
    --vscode-icon-case-sensitive-font-family: 'codicon';
    --vscode-icon-check-all-content: '\ebb1';
    --vscode-icon-check-all-font-family: 'codicon';
    --vscode-icon-check-content: '\eab2';
    --vscode-icon-check-font-family: 'codicon';
    --vscode-icon-checklist-content: '\eab3';
    --vscode-icon-checklist-font-family: 'codicon';
    --vscode-icon-chevron-down-content: '\eab4';
    --vscode-icon-chevron-down-font-family: 'codicon';
    --vscode-icon-chevron-left-content: '\eab5';
    --vscode-icon-chevron-left-font-family: 'codicon';
    --vscode-icon-chevron-right-content: '\eab6';
    --vscode-icon-chevron-right-font-family: 'codicon';
    --vscode-icon-chevron-up-content: '\eab7';
    --vscode-icon-chevron-up-font-family: 'codicon';
    --vscode-icon-chip-content: '\ec19';
    --vscode-icon-chip-font-family: 'codicon';
    --vscode-icon-chrome-close-content: '\eab8';
    --vscode-icon-chrome-close-font-family: 'codicon';
    --vscode-icon-chrome-maximize-content: '\eab9';
    --vscode-icon-chrome-maximize-font-family: 'codicon';
    --vscode-icon-chrome-minimize-content: '\eaba';
    --vscode-icon-chrome-minimize-font-family: 'codicon';
    --vscode-icon-chrome-restore-content: '\eabb';
    --vscode-icon-chrome-restore-font-family: 'codicon';
    --vscode-icon-circle-content: '\eabc';
    --vscode-icon-circle-filled-content: '\ea71';
    --vscode-icon-circle-filled-font-family: 'codicon';
    --vscode-icon-circle-font-family: 'codicon';
    --vscode-icon-circle-large-content: '\ebb5';
    --vscode-icon-circle-large-filled-content: '\ebb4';
    --vscode-icon-circle-large-filled-font-family: 'codicon';
    --vscode-icon-circle-large-font-family: 'codicon';
    --vscode-icon-circle-large-outline-content: '\ebb5';
    --vscode-icon-circle-large-outline-font-family: 'codicon';
    --vscode-icon-circle-outline-content: '\eabc';
    --vscode-icon-circle-outline-font-family: 'codicon';
    --vscode-icon-circle-slash-content: '\eabd';
    --vscode-icon-circle-slash-font-family: 'codicon';
    --vscode-icon-circle-small-content: '\ec07';
    --vscode-icon-circle-small-filled-content: '\eb8a';
    --vscode-icon-circle-small-filled-font-family: 'codicon';
    --vscode-icon-circle-small-font-family: 'codicon';
    --vscode-icon-circuit-board-content: '\eabe';
    --vscode-icon-circuit-board-font-family: 'codicon';
    --vscode-icon-clear-all-content: '\eabf';
    --vscode-icon-clear-all-font-family: 'codicon';
    --vscode-icon-clippy-content: '\eac0';
    --vscode-icon-clippy-font-family: 'codicon';
    --vscode-icon-clock-content: '\ea82';
    --vscode-icon-clock-font-family: 'codicon';
    --vscode-icon-clone-content: '\ea78';
    --vscode-icon-clone-font-family: 'codicon';
    --vscode-icon-close-all-content: '\eac1';
    --vscode-icon-close-all-font-family: 'codicon';
    --vscode-icon-close-content: '\ea76';
    --vscode-icon-close-dirty-content: '\ea71';
    --vscode-icon-close-dirty-font-family: 'codicon';
    --vscode-icon-close-font-family: 'codicon';
    --vscode-icon-cloud-content: '\ebaa';
    --vscode-icon-cloud-download-content: '\eac2';
    --vscode-icon-cloud-download-font-family: 'codicon';
    --vscode-icon-cloud-font-family: 'codicon';
    --vscode-icon-cloud-upload-content: '\eac3';
    --vscode-icon-cloud-upload-font-family: 'codicon';
    --vscode-icon-code-content: '\eac4';
    --vscode-icon-code-font-family: 'codicon';
    --vscode-icon-code-oss-content: '\ec2b';
    --vscode-icon-code-oss-font-family: 'codicon';
    --vscode-icon-coffee-content: '\ec15';
    --vscode-icon-coffee-font-family: 'codicon';
    --vscode-icon-collapse-all-content: '\eac5';
    --vscode-icon-collapse-all-font-family: 'codicon';
    --vscode-icon-color-mode-content: '\eac6';
    --vscode-icon-color-mode-font-family: 'codicon';
    --vscode-icon-combine-content: '\ebb6';
    --vscode-icon-combine-font-family: 'codicon';
    --vscode-icon-comment-add-content: '\ea6b';
    --vscode-icon-comment-add-font-family: 'codicon';
    --vscode-icon-comment-content: '\ea6b';
    --vscode-icon-comment-discussion-content: '\eac7';
    --vscode-icon-comment-discussion-font-family: 'codicon';
    --vscode-icon-comment-draft-content: '\ec0e';
    --vscode-icon-comment-draft-font-family: 'codicon';
    --vscode-icon-comment-font-family: 'codicon';
    --vscode-icon-comment-unresolved-content: '\ec0a';
    --vscode-icon-comment-unresolved-font-family: 'codicon';
    --vscode-icon-compare-changes-content: '\eafd';
    --vscode-icon-compare-changes-font-family: 'codicon';
    --vscode-icon-compass-active-content: '\ebd7';
    --vscode-icon-compass-active-font-family: 'codicon';
    --vscode-icon-compass-content: '\ebd5';
    --vscode-icon-compass-dot-content: '\ebd6';
    --vscode-icon-compass-dot-font-family: 'codicon';
    --vscode-icon-compass-font-family: 'codicon';
    --vscode-icon-console-content: '\ea85';
    --vscode-icon-console-font-family: 'codicon';
    --vscode-icon-copilot-content: '\ec1e';
    --vscode-icon-copilot-font-family: 'codicon';
    --vscode-icon-copy-content: '\ebcc';
    --vscode-icon-copy-font-family: 'codicon';
    --vscode-icon-coverage-content: '\ec2e';
    --vscode-icon-coverage-font-family: 'codicon';
    --vscode-icon-credit-card-content: '\eac9';
    --vscode-icon-credit-card-font-family: 'codicon';
    --vscode-icon-dash-content: '\eacc';
    --vscode-icon-dash-font-family: 'codicon';
    --vscode-icon-dashboard-content: '\eacd';
    --vscode-icon-dashboard-font-family: 'codicon';
    --vscode-icon-database-content: '\eace';
    --vscode-icon-database-font-family: 'codicon';
    --vscode-icon-debug-all-content: '\ebdc';
    --vscode-icon-debug-all-font-family: 'codicon';
    --vscode-icon-debug-alt-content: '\eb91';
    --vscode-icon-debug-alt-font-family: 'codicon';
    --vscode-icon-debug-alt-small-content: '\eba8';
    --vscode-icon-debug-alt-small-font-family: 'codicon';
    --vscode-icon-debug-breakpoint-conditional-content: '\eaa7';
    --vscode-icon-debug-breakpoint-conditional-disabled-content: '\eaa7';
    --vscode-icon-debug-breakpoint-conditional-disabled-font-family: 'codicon';
    --vscode-icon-debug-breakpoint-conditional-font-family: 'codicon';
    --vscode-icon-debug-breakpoint-conditional-unverified-content: '\eaa6';
    --vscode-icon-debug-breakpoint-conditional-unverified-font-family: 'codicon';
    --vscode-icon-debug-breakpoint-content: '\ea71';
    --vscode-icon-debug-breakpoint-data-content: '\eaa9';
    --vscode-icon-debug-breakpoint-data-disabled-content: '\eaa9';
    --vscode-icon-debug-breakpoint-data-disabled-font-family: 'codicon';
    --vscode-icon-debug-breakpoint-data-font-family: 'codicon';
    --vscode-icon-debug-breakpoint-data-unverified-content: '\eaa8';
    --vscode-icon-debug-breakpoint-data-unverified-font-family: 'codicon';
    --vscode-icon-debug-breakpoint-disabled-content: '\ea71';
    --vscode-icon-debug-breakpoint-disabled-font-family: 'codicon';
    --vscode-icon-debug-breakpoint-font-family: 'codicon';
    --vscode-icon-debug-breakpoint-function-content: '\eb88';
    --vscode-icon-debug-breakpoint-function-disabled-content: '\eb88';
    --vscode-icon-debug-breakpoint-function-disabled-font-family: 'codicon';
    --vscode-icon-debug-breakpoint-function-font-family: 'codicon';
    --vscode-icon-debug-breakpoint-function-unverified-content: '\eb87';
    --vscode-icon-debug-breakpoint-function-unverified-font-family: 'codicon';
    --vscode-icon-debug-breakpoint-log-content: '\eaab';
    --vscode-icon-debug-breakpoint-log-disabled-content: '\eaab';
    --vscode-icon-debug-breakpoint-log-disabled-font-family: 'codicon';
    --vscode-icon-debug-breakpoint-log-font-family: 'codicon';
    --vscode-icon-debug-breakpoint-log-unverified-content: '\eaaa';
    --vscode-icon-debug-breakpoint-log-unverified-font-family: 'codicon';
    --vscode-icon-debug-breakpoint-pending-content: '\ebd9';
    --vscode-icon-debug-breakpoint-pending-font-family: 'codicon';
    --vscode-icon-debug-breakpoint-unsupported-content: '\eb8c';
    --vscode-icon-debug-breakpoint-unsupported-font-family: 'codicon';
    --vscode-icon-debug-breakpoint-unverified-content: '\eabc';
    --vscode-icon-debug-breakpoint-unverified-font-family: 'codicon';
    --vscode-icon-debug-console-content: '\eb9b';
    --vscode-icon-debug-console-font-family: 'codicon';
    --vscode-icon-debug-content: '\ead8';
    --vscode-icon-debug-continue-content: '\eacf';
    --vscode-icon-debug-continue-font-family: 'codicon';
    --vscode-icon-debug-continue-small-content: '\ebe0';
    --vscode-icon-debug-continue-small-font-family: 'codicon';
    --vscode-icon-debug-coverage-content: '\ebdd';
    --vscode-icon-debug-coverage-font-family: 'codicon';
    --vscode-icon-debug-disconnect-content: '\ead0';
    --vscode-icon-debug-disconnect-font-family: 'codicon';
    --vscode-icon-debug-font-family: 'codicon';
    --vscode-icon-debug-hint-content: '\ea71';
    --vscode-icon-debug-hint-font-family: 'codicon';
    --vscode-icon-debug-line-by-line-content: '\ebd0';
    --vscode-icon-debug-line-by-line-font-family: 'codicon';
    --vscode-icon-debug-pause-content: '\ead1';
    --vscode-icon-debug-pause-font-family: 'codicon';
    --vscode-icon-debug-rerun-content: '\ebc0';
    --vscode-icon-debug-rerun-font-family: 'codicon';
    --vscode-icon-debug-restart-content: '\ead2';
    --vscode-icon-debug-restart-font-family: 'codicon';
    --vscode-icon-debug-restart-frame-content: '\eb90';
    --vscode-icon-debug-restart-frame-font-family: 'codicon';
    --vscode-icon-debug-reverse-continue-content: '\eb8e';
    --vscode-icon-debug-reverse-continue-font-family: 'codicon';
    --vscode-icon-debug-stackframe-active-content: '\eb89';
    --vscode-icon-debug-stackframe-active-font-family: 'codicon';
    --vscode-icon-debug-stackframe-content: '\eb8b';
    --vscode-icon-debug-stackframe-dot-content: '\eb8a';
    --vscode-icon-debug-stackframe-dot-font-family: 'codicon';
    --vscode-icon-debug-stackframe-focused-content: '\eb8b';
    --vscode-icon-debug-stackframe-focused-font-family: 'codicon';
    --vscode-icon-debug-stackframe-font-family: 'codicon';
    --vscode-icon-debug-start-content: '\ead3';
    --vscode-icon-debug-start-font-family: 'codicon';
    --vscode-icon-debug-step-back-content: '\eb8f';
    --vscode-icon-debug-step-back-font-family: 'codicon';
    --vscode-icon-debug-step-into-content: '\ead4';
    --vscode-icon-debug-step-into-font-family: 'codicon';
    --vscode-icon-debug-step-out-content: '\ead5';
    --vscode-icon-debug-step-out-font-family: 'codicon';
    --vscode-icon-debug-step-over-content: '\ead6';
    --vscode-icon-debug-step-over-font-family: 'codicon';
    --vscode-icon-debug-stop-content: '\ead7';
    --vscode-icon-debug-stop-font-family: 'codicon';
    --vscode-icon-desktop-download-content: '\ea78';
    --vscode-icon-desktop-download-font-family: 'codicon';
    --vscode-icon-device-camera-content: '\eada';
    --vscode-icon-device-camera-font-family: 'codicon';
    --vscode-icon-device-camera-video-content: '\ead9';
    --vscode-icon-device-camera-video-font-family: 'codicon';
    --vscode-icon-device-desktop-content: '\ea7a';
    --vscode-icon-device-desktop-font-family: 'codicon';
    --vscode-icon-device-mobile-content: '\eadb';
    --vscode-icon-device-mobile-font-family: 'codicon';
    --vscode-icon-dialog-close-content: '\ea76';
    --vscode-icon-dialog-close-font-family: 'codicon';
    --vscode-icon-dialog-error-content: '\ea87';
    --vscode-icon-dialog-error-font-family: 'codicon';
    --vscode-icon-dialog-info-content: '\ea74';
    --vscode-icon-dialog-info-font-family: 'codicon';
    --vscode-icon-dialog-warning-content: '\ea6c';
    --vscode-icon-dialog-warning-font-family: 'codicon';
    --vscode-icon-diff-added-content: '\eadc';
    --vscode-icon-diff-added-font-family: 'codicon';
    --vscode-icon-diff-content: '\eae1';
    --vscode-icon-diff-font-family: 'codicon';
    --vscode-icon-diff-ignored-content: '\eadd';
    --vscode-icon-diff-ignored-font-family: 'codicon';
    --vscode-icon-diff-insert-content: '\ea60';
    --vscode-icon-diff-insert-font-family: 'codicon';
    --vscode-icon-diff-modified-content: '\eade';
    --vscode-icon-diff-modified-font-family: 'codicon';
    --vscode-icon-diff-multiple-content: '\ec23';
    --vscode-icon-diff-multiple-font-family: 'codicon';
    --vscode-icon-diff-remove-content: '\eb3b';
    --vscode-icon-diff-remove-font-family: 'codicon';
    --vscode-icon-diff-removed-content: '\eadf';
    --vscode-icon-diff-removed-font-family: 'codicon';
    --vscode-icon-diff-renamed-content: '\eae0';
    --vscode-icon-diff-renamed-font-family: 'codicon';
    --vscode-icon-diff-review-close-content: '\ea76';
    --vscode-icon-diff-review-close-font-family: 'codicon';
    --vscode-icon-diff-review-insert-content: '\ea60';
    --vscode-icon-diff-review-insert-font-family: 'codicon';
    --vscode-icon-diff-review-remove-content: '\eb3b';
    --vscode-icon-diff-review-remove-font-family: 'codicon';
    --vscode-icon-diff-sidebyside-content: '\eae1';
    --vscode-icon-diff-sidebyside-font-family: 'codicon';
    --vscode-icon-diff-single-content: '\ec22';
    --vscode-icon-diff-single-font-family: 'codicon';
    --vscode-icon-discard-content: '\eae2';
    --vscode-icon-discard-font-family: 'codicon';
    --vscode-icon-drop-down-button-content: '\eab4';
    --vscode-icon-drop-down-button-font-family: 'codicon';
    --vscode-icon-edit-content: '\ea73';
    --vscode-icon-edit-font-family: 'codicon';
    --vscode-icon-editor-layout-content: '\eae3';
    --vscode-icon-editor-layout-font-family: 'codicon';
    --vscode-icon-ellipsis-content: '\ea7c';
    --vscode-icon-ellipsis-font-family: 'codicon';
    --vscode-icon-empty-window-content: '\eae4';
    --vscode-icon-empty-window-font-family: 'codicon';
    --vscode-icon-error-content: '\ea87';
    --vscode-icon-error-font-family: 'codicon';
    --vscode-icon-error-small-content: '\ebfb';
    --vscode-icon-error-small-font-family: 'codicon';
    --vscode-icon-exclude-content: '\eae5';
    --vscode-icon-exclude-font-family: 'codicon';
    --vscode-icon-expand-all-content: '\eb95';
    --vscode-icon-expand-all-font-family: 'codicon';
    --vscode-icon-export-content: '\ebac';
    --vscode-icon-export-font-family: 'codicon';
    --vscode-icon-extensions-content: '\eae6';
    --vscode-icon-extensions-font-family: 'codicon';
    --vscode-icon-extensions-warning-message-content: '\ea6c';
    --vscode-icon-extensions-warning-message-font-family: 'codicon';
    --vscode-icon-eye-closed-content: '\eae7';
    --vscode-icon-eye-closed-font-family: 'codicon';
    --vscode-icon-eye-content: '\ea70';
    --vscode-icon-eye-font-family: 'codicon';
    --vscode-icon-eye-unwatch-content: '\ea70';
    --vscode-icon-eye-unwatch-font-family: 'codicon';
    --vscode-icon-eye-watch-content: '\ea70';
    --vscode-icon-eye-watch-font-family: 'codicon';
    --vscode-icon-feedback-content: '\eb96';
    --vscode-icon-feedback-font-family: 'codicon';
    --vscode-icon-file-add-content: '\ea7f';
    --vscode-icon-file-add-font-family: 'codicon';
    --vscode-icon-file-binary-content: '\eae8';
    --vscode-icon-file-binary-font-family: 'codicon';
    --vscode-icon-file-code-content: '\eae9';
    --vscode-icon-file-code-font-family: 'codicon';
    --vscode-icon-file-content: '\ea7b';
    --vscode-icon-file-directory-content: '\ea83';
    --vscode-icon-file-directory-create-content: '\ea80';
    --vscode-icon-file-directory-create-font-family: 'codicon';
    --vscode-icon-file-directory-font-family: 'codicon';
    --vscode-icon-file-font-family: 'codicon';
    --vscode-icon-file-media-content: '\eaea';
    --vscode-icon-file-media-font-family: 'codicon';
    --vscode-icon-file-pdf-content: '\eaeb';
    --vscode-icon-file-pdf-font-family: 'codicon';
    --vscode-icon-file-submodule-content: '\eaec';
    --vscode-icon-file-submodule-font-family: 'codicon';
    --vscode-icon-file-symlink-directory-content: '\eaed';
    --vscode-icon-file-symlink-directory-font-family: 'codicon';
    --vscode-icon-file-symlink-file-content: '\eaee';
    --vscode-icon-file-symlink-file-font-family: 'codicon';
    --vscode-icon-file-text-content: '\ea7b';
    --vscode-icon-file-text-font-family: 'codicon';
    --vscode-icon-file-zip-content: '\eaef';
    --vscode-icon-file-zip-font-family: 'codicon';
    --vscode-icon-files-content: '\eaf0';
    --vscode-icon-files-font-family: 'codicon';
    --vscode-icon-filter-content: '\eaf1';
    --vscode-icon-filter-filled-content: '\ebce';
    --vscode-icon-filter-filled-font-family: 'codicon';
    --vscode-icon-filter-font-family: 'codicon';
    --vscode-icon-find-collapsed-content: '\eab6';
    --vscode-icon-find-collapsed-font-family: 'codicon';
    --vscode-icon-find-expanded-content: '\eab4';
    --vscode-icon-find-expanded-font-family: 'codicon';
    --vscode-icon-find-next-match-content: '\ea9a';
    --vscode-icon-find-next-match-font-family: 'codicon';
    --vscode-icon-find-previous-match-content: '\eaa1';
    --vscode-icon-find-previous-match-font-family: 'codicon';
    --vscode-icon-find-replace-all-content: '\eb3c';
    --vscode-icon-find-replace-all-font-family: 'codicon';
    --vscode-icon-find-replace-content: '\eb3d';
    --vscode-icon-find-replace-font-family: 'codicon';
    --vscode-icon-find-selection-content: '\eb85';
    --vscode-icon-find-selection-font-family: 'codicon';
    --vscode-icon-flame-content: '\eaf2';
    --vscode-icon-flame-font-family: 'codicon';
    --vscode-icon-fold-content: '\eaf5';
    --vscode-icon-fold-down-content: '\eaf3';
    --vscode-icon-fold-down-font-family: 'codicon';
    --vscode-icon-fold-font-family: 'codicon';
    --vscode-icon-fold-horizontal-content: '\ec05';
    --vscode-icon-fold-horizontal-filled-content: '\ec06';
    --vscode-icon-fold-horizontal-filled-font-family: 'codicon';
    --vscode-icon-fold-horizontal-font-family: 'codicon';
    --vscode-icon-fold-up-content: '\eaf4';
    --vscode-icon-fold-up-font-family: 'codicon';
    --vscode-icon-fold-vertical-content: '\ec30';
    --vscode-icon-fold-vertical-filled-content: '\ec31';
    --vscode-icon-fold-vertical-filled-font-family: 'codicon';
    --vscode-icon-fold-vertical-font-family: 'codicon';
    --vscode-icon-folder-active-content: '\eaf6';
    --vscode-icon-folder-active-font-family: 'codicon';
    --vscode-icon-folder-content: '\ea83';
    --vscode-icon-folder-font-family: 'codicon';
    --vscode-icon-folder-library-content: '\ebdf';
    --vscode-icon-folder-library-font-family: 'codicon';
    --vscode-icon-folder-opened-content: '\eaf7';
    --vscode-icon-folder-opened-font-family: 'codicon';
    --vscode-icon-folding-collapsed-content: '\eab6';
    --vscode-icon-folding-collapsed-font-family: 'codicon';
    --vscode-icon-folding-expanded-content: '\eab4';
    --vscode-icon-folding-expanded-font-family: 'codicon';
    --vscode-icon-folding-manual-collapsed-content: '\eab6';
    --vscode-icon-folding-manual-collapsed-font-family: 'codicon';
    --vscode-icon-folding-manual-expanded-content: '\eab4';
    --vscode-icon-folding-manual-expanded-font-family: 'codicon';
    --vscode-icon-foreground: #c5c5c5;
    --vscode-icon-game-content: '\ec17';
    --vscode-icon-game-font-family: 'codicon';
    --vscode-icon-gather-content: '\ebb6';
    --vscode-icon-gather-font-family: 'codicon';
    --vscode-icon-gear-content: '\eaf8';
    --vscode-icon-gear-font-family: 'codicon';
    --vscode-icon-gift-content: '\eaf9';
    --vscode-icon-gift-font-family: 'codicon';
    --vscode-icon-gist-content: '\eafb';
    --vscode-icon-gist-font-family: 'codicon';
    --vscode-icon-gist-fork-content: '\ea63';
    --vscode-icon-gist-fork-font-family: 'codicon';
    --vscode-icon-gist-new-content: '\ea60';
    --vscode-icon-gist-new-font-family: 'codicon';
    --vscode-icon-gist-private-content: '\ea75';
    --vscode-icon-gist-private-font-family: 'codicon';
    --vscode-icon-gist-secret-content: '\eafa';
    --vscode-icon-gist-secret-font-family: 'codicon';
    --vscode-icon-git-branch-content: '\ea68';
    --vscode-icon-git-branch-create-content: '\ea68';
    --vscode-icon-git-branch-create-font-family: 'codicon';
    --vscode-icon-git-branch-delete-content: '\ea68';
    --vscode-icon-git-branch-delete-font-family: 'codicon';
    --vscode-icon-git-branch-font-family: 'codicon';
    --vscode-icon-git-commit-content: '\eafc';
    --vscode-icon-git-commit-font-family: 'codicon';
    --vscode-icon-git-compare-content: '\eafd';
    --vscode-icon-git-compare-font-family: 'codicon';
    --vscode-icon-git-fetch-content: '\ec1d';
    --vscode-icon-git-fetch-font-family: 'codicon';
    --vscode-icon-git-fork-private-content: '\ea75';
    --vscode-icon-git-fork-private-font-family: 'codicon';
    --vscode-icon-git-merge-content: '\eafe';
    --vscode-icon-git-merge-font-family: 'codicon';
    --vscode-icon-git-pull-request-abandoned-content: '\ea64';
    --vscode-icon-git-pull-request-abandoned-font-family: 'codicon';
    --vscode-icon-git-pull-request-assignee-content: '\eb99';
    --vscode-icon-git-pull-request-assignee-font-family: 'codicon';
    --vscode-icon-git-pull-request-closed-content: '\ebda';
    --vscode-icon-git-pull-request-closed-font-family: 'codicon';
    --vscode-icon-git-pull-request-content: '\ea64';
    --vscode-icon-git-pull-request-create-content: '\ebbc';
    --vscode-icon-git-pull-request-create-font-family: 'codicon';
    --vscode-icon-git-pull-request-draft-content: '\ebdb';
    --vscode-icon-git-pull-request-draft-font-family: 'codicon';
    --vscode-icon-git-pull-request-font-family: 'codicon';
    --vscode-icon-git-pull-request-go-to-changes-content: '\ec0b';
    --vscode-icon-git-pull-request-go-to-changes-font-family: 'codicon';
    --vscode-icon-git-pull-request-label-content: '\ea66';
    --vscode-icon-git-pull-request-label-font-family: 'codicon';
    --vscode-icon-git-pull-request-milestone-content: '\eb20';
    --vscode-icon-git-pull-request-milestone-font-family: 'codicon';
    --vscode-icon-git-pull-request-new-changes-content: '\ec0c';
    --vscode-icon-git-pull-request-new-changes-font-family: 'codicon';
    --vscode-icon-git-pull-request-reviewer-content: '\eb96';
    --vscode-icon-git-pull-request-reviewer-font-family: 'codicon';
    --vscode-icon-git-stash-apply-content: '\ec27';
    --vscode-icon-git-stash-apply-font-family: 'codicon';
    --vscode-icon-git-stash-content: '\ec26';
    --vscode-icon-git-stash-font-family: 'codicon';
    --vscode-icon-git-stash-pop-content: '\ec28';
    --vscode-icon-git-stash-pop-font-family: 'codicon';
    --vscode-icon-github-action-content: '\eaff';
    --vscode-icon-github-action-font-family: 'codicon';
    --vscode-icon-github-alt-content: '\eb00';
    --vscode-icon-github-alt-font-family: 'codicon';
    --vscode-icon-github-content: '\ea84';
    --vscode-icon-github-font-family: 'codicon';
    --vscode-icon-github-inverted-content: '\eba1';
    --vscode-icon-github-inverted-font-family: 'codicon';
    --vscode-icon-github-project-content: '\ec2f';
    --vscode-icon-github-project-font-family: 'codicon';
    --vscode-icon-globe-content: '\eb01';
    --vscode-icon-globe-font-family: 'codicon';
    --vscode-icon-go-to-file-content: '\ea94';
    --vscode-icon-go-to-file-font-family: 'codicon';
    --vscode-icon-go-to-search-content: '\ec32';
    --vscode-icon-go-to-search-font-family: 'codicon';
    --vscode-icon-goto-next-location-content: '\ea9a';
    --vscode-icon-goto-next-location-font-family: 'codicon';
    --vscode-icon-goto-previous-location-content: '\eaa1';
    --vscode-icon-goto-previous-location-font-family: 'codicon';
    --vscode-icon-grabber-content: '\eb02';
    --vscode-icon-grabber-font-family: 'codicon';
    --vscode-icon-graph-content: '\eb03';
    --vscode-icon-graph-font-family: 'codicon';
    --vscode-icon-graph-left-content: '\ebad';
    --vscode-icon-graph-left-font-family: 'codicon';
    --vscode-icon-graph-line-content: '\ebe2';
    --vscode-icon-graph-line-font-family: 'codicon';
    --vscode-icon-graph-scatter-content: '\ebe3';
    --vscode-icon-graph-scatter-font-family: 'codicon';
    --vscode-icon-gripper-content: '\eb04';
    --vscode-icon-gripper-font-family: 'codicon';
    --vscode-icon-group-by-ref-type-content: '\eb97';
    --vscode-icon-group-by-ref-type-font-family: 'codicon';
    --vscode-icon-gutter-lightbulb-aifix-auto-fix-content: '\ec1f';
    --vscode-icon-gutter-lightbulb-aifix-auto-fix-font-family: 'codicon';
    --vscode-icon-gutter-lightbulb-auto-fix-content: '\eb13';
    --vscode-icon-gutter-lightbulb-auto-fix-font-family: 'codicon';
    --vscode-icon-gutter-lightbulb-content: '\ea61';
    --vscode-icon-gutter-lightbulb-font-family: 'codicon';
    --vscode-icon-gutter-lightbulb-sparkle-content: '\ec1f';
    --vscode-icon-gutter-lightbulb-sparkle-filled-content: '\ec21';
    --vscode-icon-gutter-lightbulb-sparkle-filled-font-family: 'codicon';
    --vscode-icon-gutter-lightbulb-sparkle-font-family: 'codicon';
    --vscode-icon-heart-content: '\eb05';
    --vscode-icon-heart-filled-content: '\ec04';
    --vscode-icon-heart-filled-font-family: 'codicon';
    --vscode-icon-heart-font-family: 'codicon';
    --vscode-icon-history-content: '\ea82';
    --vscode-icon-history-font-family: 'codicon';
    --vscode-icon-home-content: '\eb06';
    --vscode-icon-home-font-family: 'codicon';
    --vscode-icon-horizontal-rule-content: '\eb07';
    --vscode-icon-horizontal-rule-font-family: 'codicon';
    --vscode-icon-hover-decrease-verbosity-content: '\eb3b';
    --vscode-icon-hover-decrease-verbosity-font-family: 'codicon';
    --vscode-icon-hover-increase-verbosity-content: '\ea60';
    --vscode-icon-hover-increase-verbosity-font-family: 'codicon';
    --vscode-icon-hubot-content: '\eb08';
    --vscode-icon-hubot-font-family: 'codicon';
    --vscode-icon-inbox-content: '\eb09';
    --vscode-icon-inbox-font-family: 'codicon';
    --vscode-icon-indent-content: '\ebf9';
    --vscode-icon-indent-font-family: 'codicon';
    --vscode-icon-info-content: '\ea74';
    --vscode-icon-info-font-family: 'codicon';
    --vscode-icon-inline-suggestion-hints-next-content: '\eab6';
    --vscode-icon-inline-suggestion-hints-next-font-family: 'codicon';
    --vscode-icon-inline-suggestion-hints-previous-content: '\eab5';
    --vscode-icon-inline-suggestion-hints-previous-font-family: 'codicon';
    --vscode-icon-insert-content: '\ec11';
    --vscode-icon-insert-font-family: 'codicon';
    --vscode-icon-inspect-content: '\ebd1';
    --vscode-icon-inspect-font-family: 'codicon';
    --vscode-icon-issue-closed-content: '\eba4';
    --vscode-icon-issue-closed-font-family: 'codicon';
    --vscode-icon-issue-draft-content: '\ebd9';
    --vscode-icon-issue-draft-font-family: 'codicon';
    --vscode-icon-issue-opened-content: '\ea74';
    --vscode-icon-issue-opened-font-family: 'codicon';
    --vscode-icon-issue-reopened-content: '\eb0b';
    --vscode-icon-issue-reopened-font-family: 'codicon';
    --vscode-icon-issues-content: '\eb0c';
    --vscode-icon-issues-font-family: 'codicon';
    --vscode-icon-italic-content: '\eb0d';
    --vscode-icon-italic-font-family: 'codicon';
    --vscode-icon-jersey-content: '\eb0e';
    --vscode-icon-jersey-font-family: 'codicon';
    --vscode-icon-json-content: '\eb0f';
    --vscode-icon-json-font-family: 'codicon';
    --vscode-icon-kebab-horizontal-content: '\ea7c';
    --vscode-icon-kebab-horizontal-font-family: 'codicon';
    --vscode-icon-kebab-vertical-content: '\eb10';
    --vscode-icon-kebab-vertical-font-family: 'codicon';
    --vscode-icon-key-content: '\eb11';
    --vscode-icon-key-font-family: 'codicon';
    --vscode-icon-keyboard-content: '\ea65';
    --vscode-icon-keyboard-font-family: 'codicon';
    --vscode-icon-law-content: '\eb12';
    --vscode-icon-law-font-family: 'codicon';
    --vscode-icon-layers-active-content: '\ebd4';
    --vscode-icon-layers-active-font-family: 'codicon';
    --vscode-icon-layers-content: '\ebd2';
    --vscode-icon-layers-dot-content: '\ebd3';
    --vscode-icon-layers-dot-font-family: 'codicon';
    --vscode-icon-layers-font-family: 'codicon';
    --vscode-icon-layout-activitybar-left-content: '\ebec';
    --vscode-icon-layout-activitybar-left-font-family: 'codicon';
    --vscode-icon-layout-activitybar-right-content: '\ebed';
    --vscode-icon-layout-activitybar-right-font-family: 'codicon';
    --vscode-icon-layout-centered-content: '\ebf7';
    --vscode-icon-layout-centered-font-family: 'codicon';
    --vscode-icon-layout-content: '\ebeb';
    --vscode-icon-layout-font-family: 'codicon';
    --vscode-icon-layout-menubar-content: '\ebf6';
    --vscode-icon-layout-menubar-font-family: 'codicon';
    --vscode-icon-layout-panel-center-content: '\ebef';
    --vscode-icon-layout-panel-center-font-family: 'codicon';
    --vscode-icon-layout-panel-content: '\ebf2';
    --vscode-icon-layout-panel-font-family: 'codicon';
    --vscode-icon-layout-panel-justify-content: '\ebf0';
    --vscode-icon-layout-panel-justify-font-family: 'codicon';
    --vscode-icon-layout-panel-left-content: '\ebee';
    --vscode-icon-layout-panel-left-font-family: 'codicon';
    --vscode-icon-layout-panel-off-content: '\ec01';
    --vscode-icon-layout-panel-off-font-family: 'codicon';
    --vscode-icon-layout-panel-right-content: '\ebf1';
    --vscode-icon-layout-panel-right-font-family: 'codicon';
    --vscode-icon-layout-sidebar-left-content: '\ebf3';
    --vscode-icon-layout-sidebar-left-font-family: 'codicon';
    --vscode-icon-layout-sidebar-left-off-content: '\ec02';
    --vscode-icon-layout-sidebar-left-off-font-family: 'codicon';
    --vscode-icon-layout-sidebar-right-content: '\ebf4';
    --vscode-icon-layout-sidebar-right-font-family: 'codicon';
    --vscode-icon-layout-sidebar-right-off-content: '\ec00';
    --vscode-icon-layout-sidebar-right-off-font-family: 'codicon';
    --vscode-icon-layout-statusbar-content: '\ebf5';
    --vscode-icon-layout-statusbar-font-family: 'codicon';
    --vscode-icon-library-content: '\eb9c';
    --vscode-icon-library-font-family: 'codicon';
    --vscode-icon-light-bulb-content: '\ea61';
    --vscode-icon-light-bulb-font-family: 'codicon';
    --vscode-icon-lightbulb-autofix-content: '\eb13';
    --vscode-icon-lightbulb-autofix-font-family: 'codicon';
    --vscode-icon-lightbulb-content: '\ea61';
    --vscode-icon-lightbulb-font-family: 'codicon';
    --vscode-icon-lightbulb-sparkle-autofix-content: '\ec1f';
    --vscode-icon-lightbulb-sparkle-autofix-font-family: 'codicon';
    --vscode-icon-lightbulb-sparkle-content: '\ec1f';
    --vscode-icon-lightbulb-sparkle-font-family: 'codicon';
    --vscode-icon-link-content: '\eb15';
    --vscode-icon-link-external-content: '\eb14';
    --vscode-icon-link-external-font-family: 'codicon';
    --vscode-icon-link-font-family: 'codicon';
    --vscode-icon-list-filter-content: '\eb83';
    --vscode-icon-list-filter-font-family: 'codicon';
    --vscode-icon-list-flat-content: '\eb84';
    --vscode-icon-list-flat-font-family: 'codicon';
    --vscode-icon-list-ordered-content: '\eb16';
    --vscode-icon-list-ordered-font-family: 'codicon';
    --vscode-icon-list-selection-content: '\eb85';
    --vscode-icon-list-selection-font-family: 'codicon';
    --vscode-icon-list-tree-content: '\eb86';
    --vscode-icon-list-tree-font-family: 'codicon';
    --vscode-icon-list-unordered-content: '\eb17';
    --vscode-icon-list-unordered-font-family: 'codicon';
    --vscode-icon-live-share-content: '\eb18';
    --vscode-icon-live-share-font-family: 'codicon';
    --vscode-icon-loading-content: '\eb19';
    --vscode-icon-loading-font-family: 'codicon';
    --vscode-icon-location-content: '\eb1a';
    --vscode-icon-location-font-family: 'codicon';
    --vscode-icon-lock-content: '\ea75';
    --vscode-icon-lock-font-family: 'codicon';
    --vscode-icon-lock-small-content: '\ebe7';
    --vscode-icon-lock-small-font-family: 'codicon';
    --vscode-icon-log-in-content: '\ea6f';
    --vscode-icon-log-in-font-family: 'codicon';
    --vscode-icon-log-out-content: '\ea6e';
    --vscode-icon-log-out-font-family: 'codicon';
    --vscode-icon-logo-github-content: '\ea84';
    --vscode-icon-logo-github-font-family: 'codicon';
    --vscode-icon-magnet-content: '\ebae';
    --vscode-icon-magnet-font-family: 'codicon';
    --vscode-icon-mail-content: '\eb1c';
    --vscode-icon-mail-font-family: 'codicon';
    --vscode-icon-mail-read-content: '\eb1b';
    --vscode-icon-mail-read-font-family: 'codicon';
    --vscode-icon-mail-reply-content: '\ea7d';
    --vscode-icon-mail-reply-font-family: 'codicon';
    --vscode-icon-map-content: '\ec05';
    --vscode-icon-map-filled-content: '\ec06';
    --vscode-icon-map-filled-font-family: 'codicon';
    --vscode-icon-map-font-family: 'codicon';
    --vscode-icon-map-horizontal-content: '\ec05';
    --vscode-icon-map-horizontal-filled-content: '\ec06';
    --vscode-icon-map-horizontal-filled-font-family: 'codicon';
    --vscode-icon-map-horizontal-font-family: 'codicon';
    --vscode-icon-map-vertical-content: '\ec30';
    --vscode-icon-map-vertical-filled-content: '\ec31';
    --vscode-icon-map-vertical-filled-font-family: 'codicon';
    --vscode-icon-map-vertical-font-family: 'codicon';
    --vscode-icon-mark-github-content: '\ea84';
    --vscode-icon-mark-github-font-family: 'codicon';
    --vscode-icon-markdown-content: '\eb1d';
    --vscode-icon-markdown-font-family: 'codicon';
    --vscode-icon-marker-navigation-next-content: '\ea9a';
    --vscode-icon-marker-navigation-next-font-family: 'codicon';
    --vscode-icon-marker-navigation-previous-content: '\eaa1';
    --vscode-icon-marker-navigation-previous-font-family: 'codicon';
    --vscode-icon-megaphone-content: '\eb1e';
    --vscode-icon-megaphone-font-family: 'codicon';
    --vscode-icon-mention-content: '\eb1f';
    --vscode-icon-mention-font-family: 'codicon';
    --vscode-icon-menu-content: '\eb94';
    --vscode-icon-menu-font-family: 'codicon';
    --vscode-icon-menu-selection-content: '\eab2';
    --vscode-icon-menu-selection-font-family: 'codicon';
    --vscode-icon-menu-submenu-content: '\eab6';
    --vscode-icon-menu-submenu-font-family: 'codicon';
    --vscode-icon-menubar-more-content: '\ea7c';
    --vscode-icon-menubar-more-font-family: 'codicon';
    --vscode-icon-merge-content: '\ebab';
    --vscode-icon-merge-font-family: 'codicon';
    --vscode-icon-mic-content: '\ec12';
    --vscode-icon-mic-filled-content: '\ec1c';
    --vscode-icon-mic-filled-font-family: 'codicon';
    --vscode-icon-mic-font-family: 'codicon';
    --vscode-icon-microscope-content: '\ea79';
    --vscode-icon-microscope-font-family: 'codicon';
    --vscode-icon-milestone-content: '\eb20';
    --vscode-icon-milestone-font-family: 'codicon';
    --vscode-icon-mirror-content: '\ea69';
    --vscode-icon-mirror-font-family: 'codicon';
    --vscode-icon-mirror-private-content: '\ea75';
    --vscode-icon-mirror-private-font-family: 'codicon';
    --vscode-icon-mirror-public-content: '\ea69';
    --vscode-icon-mirror-public-font-family: 'codicon';
    --vscode-icon-more-content: '\ea7c';
    --vscode-icon-more-font-family: 'codicon';
    --vscode-icon-mortar-board-content: '\eb21';
    --vscode-icon-mortar-board-font-family: 'codicon';
    --vscode-icon-move-content: '\eb22';
    --vscode-icon-move-font-family: 'codicon';
    --vscode-icon-multiple-windows-content: '\eb23';
    --vscode-icon-multiple-windows-font-family: 'codicon';
    --vscode-icon-music-content: '\ec1b';
    --vscode-icon-music-font-family: 'codicon';
    --vscode-icon-mute-content: '\eb24';
    --vscode-icon-mute-font-family: 'codicon';
    --vscode-icon-new-file-content: '\ea7f';
    --vscode-icon-new-file-font-family: 'codicon';
    --vscode-icon-new-folder-content: '\ea80';
    --vscode-icon-new-folder-font-family: 'codicon';
    --vscode-icon-newline-content: '\ebea';
    --vscode-icon-newline-font-family: 'codicon';
    --vscode-icon-no-newline-content: '\eb25';
    --vscode-icon-no-newline-font-family: 'codicon';
    --vscode-icon-note-content: '\eb26';
    --vscode-icon-note-font-family: 'codicon';
    --vscode-icon-notebook-content: '\ebaf';
    --vscode-icon-notebook-font-family: 'codicon';
    --vscode-icon-notebook-template-content: '\ebbf';
    --vscode-icon-notebook-template-font-family: 'codicon';
    --vscode-icon-octoface-content: '\eb27';
    --vscode-icon-octoface-font-family: 'codicon';
    --vscode-icon-open-preview-content: '\eb28';
    --vscode-icon-open-preview-font-family: 'codicon';
    --vscode-icon-organization-content: '\ea7e';
    --vscode-icon-organization-filled-content: '\ea7e';
    --vscode-icon-organization-filled-font-family: 'codicon';
    --vscode-icon-organization-font-family: 'codicon';
    --vscode-icon-organization-outline-content: '\ea7e';
    --vscode-icon-organization-outline-font-family: 'codicon';
    --vscode-icon-output-content: '\eb9d';
    --vscode-icon-output-font-family: 'codicon';
    --vscode-icon-package-content: '\eb29';
    --vscode-icon-package-font-family: 'codicon';
    --vscode-icon-paintcan-content: '\eb2a';
    --vscode-icon-paintcan-font-family: 'codicon';
    --vscode-icon-parameter-hints-next-content: '\eab4';
    --vscode-icon-parameter-hints-next-font-family: 'codicon';
    --vscode-icon-parameter-hints-previous-content: '\eab7';
    --vscode-icon-parameter-hints-previous-font-family: 'codicon';
    --vscode-icon-pass-content: '\eba4';
    --vscode-icon-pass-filled-content: '\ebb3';
    --vscode-icon-pass-filled-font-family: 'codicon';
    --vscode-icon-pass-font-family: 'codicon';
    --vscode-icon-pencil-content: '\ea73';
    --vscode-icon-pencil-font-family: 'codicon';
    --vscode-icon-percentage-content: '\ec33';
    --vscode-icon-percentage-font-family: 'codicon';
    --vscode-icon-person-add-content: '\ebcd';
    --vscode-icon-person-add-font-family: 'codicon';
    --vscode-icon-person-content: '\ea67';
    --vscode-icon-person-filled-content: '\ea67';
    --vscode-icon-person-filled-font-family: 'codicon';
    --vscode-icon-person-follow-content: '\ea67';
    --vscode-icon-person-follow-font-family: 'codicon';
    --vscode-icon-person-font-family: 'codicon';
    --vscode-icon-person-outline-content: '\ea67';
    --vscode-icon-person-outline-font-family: 'codicon';
    --vscode-icon-piano-content: '\ec1a';
    --vscode-icon-piano-font-family: 'codicon';
    --vscode-icon-pie-chart-content: '\ebe4';
    --vscode-icon-pie-chart-font-family: 'codicon';
    --vscode-icon-pin-content: '\eb2b';
    --vscode-icon-pin-font-family: 'codicon';
    --vscode-icon-pinned-content: '\eba0';
    --vscode-icon-pinned-dirty-content: '\ebb2';
    --vscode-icon-pinned-dirty-font-family: 'codicon';
    --vscode-icon-pinned-font-family: 'codicon';
    --vscode-icon-play-circle-content: '\eba6';
    --vscode-icon-play-circle-font-family: 'codicon';
    --vscode-icon-play-content: '\eb2c';
    --vscode-icon-play-font-family: 'codicon';
    --vscode-icon-plug-content: '\eb2d';
    --vscode-icon-plug-font-family: 'codicon';
    --vscode-icon-plus-content: '\ea60';
    --vscode-icon-plus-font-family: 'codicon';
    --vscode-icon-preserve-case-content: '\eb2e';
    --vscode-icon-preserve-case-font-family: 'codicon';
    --vscode-icon-preview-content: '\eb2f';
    --vscode-icon-preview-font-family: 'codicon';
    --vscode-icon-primitive-dot-content: '\ea71';
    --vscode-icon-primitive-dot-font-family: 'codicon';
    --vscode-icon-primitive-square-content: '\ea72';
    --vscode-icon-primitive-square-font-family: 'codicon';
    --vscode-icon-project-content: '\eb30';
    --vscode-icon-project-font-family: 'codicon';
    --vscode-icon-pulse-content: '\eb31';
    --vscode-icon-pulse-font-family: 'codicon';
    --vscode-icon-question-content: '\eb32';
    --vscode-icon-question-font-family: 'codicon';
    --vscode-icon-quick-input-back-content: '\ea9b';
    --vscode-icon-quick-input-back-font-family: 'codicon';
    --vscode-icon-quote-content: '\eb33';
    --vscode-icon-quote-font-family: 'codicon';
    --vscode-icon-radio-tower-content: '\eb34';
    --vscode-icon-radio-tower-font-family: 'codicon';
    --vscode-icon-reactions-content: '\eb35';
    --vscode-icon-reactions-font-family: 'codicon';
    --vscode-icon-record-content: '\eba7';
    --vscode-icon-record-font-family: 'codicon';
    --vscode-icon-record-keys-content: '\ea65';
    --vscode-icon-record-keys-font-family: 'codicon';
    --vscode-icon-record-small-content: '\ebfa';
    --vscode-icon-record-small-font-family: 'codicon';
    --vscode-icon-redo-content: '\ebb0';
    --vscode-icon-redo-font-family: 'codicon';
    --vscode-icon-references-content: '\eb36';
    --vscode-icon-references-font-family: 'codicon';
    --vscode-icon-refresh-content: '\eb37';
    --vscode-icon-refresh-font-family: 'codicon';
    --vscode-icon-regex-content: '\eb38';
    --vscode-icon-regex-font-family: 'codicon';
    --vscode-icon-remote-content: '\eb3a';
    --vscode-icon-remote-explorer-content: '\eb39';
    --vscode-icon-remote-explorer-font-family: 'codicon';
    --vscode-icon-remote-font-family: 'codicon';
    --vscode-icon-remove-close-content: '\ea76';
    --vscode-icon-remove-close-font-family: 'codicon';
    --vscode-icon-remove-content: '\eb3b';
    --vscode-icon-remove-font-family: 'codicon';
    --vscode-icon-repl-content: '\ea85';
    --vscode-icon-repl-font-family: 'codicon';
    --vscode-icon-replace-all-content: '\eb3c';
    --vscode-icon-replace-all-font-family: 'codicon';
    --vscode-icon-replace-content: '\eb3d';
    --vscode-icon-replace-font-family: 'codicon';
    --vscode-icon-reply-content: '\ea7d';
    --vscode-icon-reply-font-family: 'codicon';
    --vscode-icon-repo-clone-content: '\eb3e';
    --vscode-icon-repo-clone-font-family: 'codicon';
    --vscode-icon-repo-content: '\ea62';
    --vscode-icon-repo-create-content: '\ea60';
    --vscode-icon-repo-create-font-family: 'codicon';
    --vscode-icon-repo-delete-content: '\ea62';
    --vscode-icon-repo-delete-font-family: 'codicon';
    --vscode-icon-repo-fetch-content: '\ec1d';
    --vscode-icon-repo-fetch-font-family: 'codicon';
    --vscode-icon-repo-font-family: 'codicon';
    --vscode-icon-repo-force-push-content: '\eb3f';
    --vscode-icon-repo-force-push-font-family: 'codicon';
    --vscode-icon-repo-forked-content: '\ea63';
    --vscode-icon-repo-forked-font-family: 'codicon';
    --vscode-icon-repo-pull-content: '\eb40';
    --vscode-icon-repo-pull-font-family: 'codicon';
    --vscode-icon-repo-push-content: '\eb41';
    --vscode-icon-repo-push-font-family: 'codicon';
    --vscode-icon-repo-sync-content: '\ea77';
    --vscode-icon-repo-sync-font-family: 'codicon';
    --vscode-icon-report-content: '\eb42';
    --vscode-icon-report-font-family: 'codicon';
    --vscode-icon-request-changes-content: '\eb43';
    --vscode-icon-request-changes-font-family: 'codicon';
    --vscode-icon-robot-content: '\ec20';
    --vscode-icon-robot-font-family: 'codicon';
    --vscode-icon-rocket-content: '\eb44';
    --vscode-icon-rocket-font-family: 'codicon';
    --vscode-icon-root-folder-content: '\eb46';
    --vscode-icon-root-folder-font-family: 'codicon';
    --vscode-icon-root-folder-opened-content: '\eb45';
    --vscode-icon-root-folder-opened-font-family: 'codicon';
    --vscode-icon-rss-content: '\eb47';
    --vscode-icon-rss-font-family: 'codicon';
    --vscode-icon-ruby-content: '\eb48';
    --vscode-icon-ruby-font-family: 'codicon';
    --vscode-icon-run-above-content: '\ebbd';
    --vscode-icon-run-above-font-family: 'codicon';
    --vscode-icon-run-all-content: '\eb9e';
    --vscode-icon-run-all-coverage-content: '\ec2d';
    --vscode-icon-run-all-coverage-font-family: 'codicon';
    --vscode-icon-run-all-font-family: 'codicon';
    --vscode-icon-run-below-content: '\ebbe';
    --vscode-icon-run-below-font-family: 'codicon';
    --vscode-icon-run-content: '\eb2c';
    --vscode-icon-run-coverage-content: '\ec2c';
    --vscode-icon-run-coverage-font-family: 'codicon';
    --vscode-icon-run-errors-content: '\ebde';
    --vscode-icon-run-errors-font-family: 'codicon';
    --vscode-icon-run-font-family: 'codicon';
    --vscode-icon-save-all-content: '\eb49';
    --vscode-icon-save-all-font-family: 'codicon';
    --vscode-icon-save-as-content: '\eb4a';
    --vscode-icon-save-as-font-family: 'codicon';
    --vscode-icon-save-content: '\eb4b';
    --vscode-icon-save-font-family: 'codicon';
    --vscode-icon-screen-full-content: '\eb4c';
    --vscode-icon-screen-full-font-family: 'codicon';
    --vscode-icon-screen-normal-content: '\eb4d';
    --vscode-icon-screen-normal-font-family: 'codicon';
    --vscode-icon-scrollbar-button-down-content: '\eb6e';
    --vscode-icon-scrollbar-button-down-font-family: 'codicon';
    --vscode-icon-scrollbar-button-left-content: '\eb6f';
    --vscode-icon-scrollbar-button-left-font-family: 'codicon';
    --vscode-icon-scrollbar-button-right-content: '\eb70';
    --vscode-icon-scrollbar-button-right-font-family: 'codicon';
    --vscode-icon-scrollbar-button-up-content: '\eb71';
    --vscode-icon-scrollbar-button-up-font-family: 'codicon';
    --vscode-icon-search-content: '\ea6d';
    --vscode-icon-search-font-family: 'codicon';
    --vscode-icon-search-fuzzy-content: '\ec0d';
    --vscode-icon-search-fuzzy-font-family: 'codicon';
    --vscode-icon-search-save-content: '\ea6d';
    --vscode-icon-search-save-font-family: 'codicon';
    --vscode-icon-search-stop-content: '\eb4e';
    --vscode-icon-search-stop-font-family: 'codicon';
    --vscode-icon-selection-content: '\eb85';
    --vscode-icon-selection-font-family: 'codicon';
    --vscode-icon-send-content: '\ec0f';
    --vscode-icon-send-font-family: 'codicon';
    --vscode-icon-server-content: '\eb50';
    --vscode-icon-server-environment-content: '\eba3';
    --vscode-icon-server-environment-font-family: 'codicon';
    --vscode-icon-server-font-family: 'codicon';
    --vscode-icon-server-process-content: '\eba2';
    --vscode-icon-server-process-font-family: 'codicon';
    --vscode-icon-settings-content: '\eb52';
    --vscode-icon-settings-font-family: 'codicon';
    --vscode-icon-settings-gear-content: '\eb51';
    --vscode-icon-settings-gear-font-family: 'codicon';
    --vscode-icon-share-content: '\ec25';
    --vscode-icon-share-font-family: 'codicon';
    --vscode-icon-shield-content: '\eb53';
    --vscode-icon-shield-font-family: 'codicon';
    --vscode-icon-sign-in-content: '\ea6f';
    --vscode-icon-sign-in-font-family: 'codicon';
    --vscode-icon-sign-out-content: '\ea6e';
    --vscode-icon-sign-out-font-family: 'codicon';
    --vscode-icon-smiley-content: '\eb54';
    --vscode-icon-smiley-font-family: 'codicon';
    --vscode-icon-snake-content: '\ec16';
    --vscode-icon-snake-font-family: 'codicon';
    --vscode-icon-sort-percentage-content: '\ec33';
    --vscode-icon-sort-percentage-font-family: 'codicon';
    --vscode-icon-sort-precedence-content: '\eb55';
    --vscode-icon-sort-precedence-font-family: 'codicon';
    --vscode-icon-source-control-content: '\ea68';
    --vscode-icon-source-control-font-family: 'codicon';
    --vscode-icon-sparkle-content: '\ec10';
    --vscode-icon-sparkle-filled-content: '\ec21';
    --vscode-icon-sparkle-filled-font-family: 'codicon';
    --vscode-icon-sparkle-font-family: 'codicon';
    --vscode-icon-split-horizontal-content: '\eb56';
    --vscode-icon-split-horizontal-font-family: 'codicon';
    --vscode-icon-split-vertical-content: '\eb57';
    --vscode-icon-split-vertical-font-family: 'codicon';
    --vscode-icon-squirrel-content: '\eb58';
    --vscode-icon-squirrel-font-family: 'codicon';
    --vscode-icon-star-add-content: '\ea6a';
    --vscode-icon-star-add-font-family: 'codicon';
    --vscode-icon-star-content: '\ea6a';
    --vscode-icon-star-delete-content: '\ea6a';
    --vscode-icon-star-delete-font-family: 'codicon';
    --vscode-icon-star-empty-content: '\ea6a';
    --vscode-icon-star-empty-font-family: 'codicon';
    --vscode-icon-star-font-family: 'codicon';
    --vscode-icon-star-full-content: '\eb59';
    --vscode-icon-star-full-font-family: 'codicon';
    --vscode-icon-star-half-content: '\eb5a';
    --vscode-icon-star-half-font-family: 'codicon';
    --vscode-icon-stop-circle-content: '\eba5';
    --vscode-icon-stop-circle-font-family: 'codicon';
    --vscode-icon-stop-content: '\ea87';
    --vscode-icon-stop-font-family: 'codicon';
    --vscode-icon-suggest-more-info-content: '\eab6';
    --vscode-icon-suggest-more-info-font-family: 'codicon';
    --vscode-icon-surround-with-content: '\ec24';
    --vscode-icon-surround-with-font-family: 'codicon';
    --vscode-icon-symbol-array-content: '\ea8a';
    --vscode-icon-symbol-array-font-family: 'codicon';
    --vscode-icon-symbol-boolean-content: '\ea8f';
    --vscode-icon-symbol-boolean-font-family: 'codicon';
    --vscode-icon-symbol-class-content: '\eb5b';
    --vscode-icon-symbol-class-font-family: 'codicon';
    --vscode-icon-symbol-color-content: '\eb5c';
    --vscode-icon-symbol-color-font-family: 'codicon';
    --vscode-icon-symbol-constant-content: '\eb5d';
    --vscode-icon-symbol-constant-font-family: 'codicon';
    --vscode-icon-symbol-constructor-content: '\ea8c';
    --vscode-icon-symbol-constructor-font-family: 'codicon';
    --vscode-icon-symbol-customcolor-content: '\eb5c';
    --vscode-icon-symbol-customcolor-font-family: 'codicon';
    --vscode-icon-symbol-enum-content: '\ea95';
    --vscode-icon-symbol-enum-font-family: 'codicon';
    --vscode-icon-symbol-enum-member-content: '\eb5e';
    --vscode-icon-symbol-enum-member-font-family: 'codicon';
    --vscode-icon-symbol-event-content: '\ea86';
    --vscode-icon-symbol-event-font-family: 'codicon';
    --vscode-icon-symbol-field-content: '\eb5f';
    --vscode-icon-symbol-field-font-family: 'codicon';
    --vscode-icon-symbol-file-content: '\eb60';
    --vscode-icon-symbol-file-font-family: 'codicon';
    --vscode-icon-symbol-folder-content: '\ea83';
    --vscode-icon-symbol-folder-font-family: 'codicon';
    --vscode-icon-symbol-function-content: '\ea8c';
    --vscode-icon-symbol-function-font-family: 'codicon';
    --vscode-icon-symbol-interface-content: '\eb61';
    --vscode-icon-symbol-interface-font-family: 'codicon';
    --vscode-icon-symbol-key-content: '\ea93';
    --vscode-icon-symbol-key-font-family: 'codicon';
    --vscode-icon-symbol-keyword-content: '\eb62';
    --vscode-icon-symbol-keyword-font-family: 'codicon';
    --vscode-icon-symbol-method-content: '\ea8c';
    --vscode-icon-symbol-method-font-family: 'codicon';
    --vscode-icon-symbol-misc-content: '\eb63';
    --vscode-icon-symbol-misc-font-family: 'codicon';
    --vscode-icon-symbol-module-content: '\ea8b';
    --vscode-icon-symbol-module-font-family: 'codicon';
    --vscode-icon-symbol-namespace-content: '\ea8b';
    --vscode-icon-symbol-namespace-font-family: 'codicon';
    --vscode-icon-symbol-null-content: '\ea8f';
    --vscode-icon-symbol-null-font-family: 'codicon';
    --vscode-icon-symbol-number-content: '\ea90';
    --vscode-icon-symbol-number-font-family: 'codicon';
    --vscode-icon-symbol-numeric-content: '\ea90';
    --vscode-icon-symbol-numeric-font-family: 'codicon';
    --vscode-icon-symbol-object-content: '\ea8b';
    --vscode-icon-symbol-object-font-family: 'codicon';
    --vscode-icon-symbol-operator-content: '\eb64';
    --vscode-icon-symbol-operator-font-family: 'codicon';
    --vscode-icon-symbol-package-content: '\ea8b';
    --vscode-icon-symbol-package-font-family: 'codicon';
    --vscode-icon-symbol-parameter-content: '\ea92';
    --vscode-icon-symbol-parameter-font-family: 'codicon';
    --vscode-icon-symbol-property-content: '\eb65';
    --vscode-icon-symbol-property-font-family: 'codicon';
    --vscode-icon-symbol-reference-content: '\ea94';
    --vscode-icon-symbol-reference-font-family: 'codicon';
    --vscode-icon-symbol-ruler-content: '\ea96';
    --vscode-icon-symbol-ruler-font-family: 'codicon';
    --vscode-icon-symbol-snippet-content: '\eb66';
    --vscode-icon-symbol-snippet-font-family: 'codicon';
    --vscode-icon-symbol-string-content: '\eb8d';
    --vscode-icon-symbol-string-font-family: 'codicon';
    --vscode-icon-symbol-struct-content: '\ea91';
    --vscode-icon-symbol-struct-font-family: 'codicon';
    --vscode-icon-symbol-structure-content: '\ea91';
    --vscode-icon-symbol-structure-font-family: 'codicon';
    --vscode-icon-symbol-text-content: '\ea93';
    --vscode-icon-symbol-text-font-family: 'codicon';
    --vscode-icon-symbol-type-parameter-content: '\ea92';
    --vscode-icon-symbol-type-parameter-font-family: 'codicon';
    --vscode-icon-symbol-unit-content: '\ea96';
    --vscode-icon-symbol-unit-font-family: 'codicon';
    --vscode-icon-symbol-value-content: '\ea95';
    --vscode-icon-symbol-value-font-family: 'codicon';
    --vscode-icon-symbol-variable-content: '\ea88';
    --vscode-icon-symbol-variable-font-family: 'codicon';
    --vscode-icon-sync-content: '\ea77';
    --vscode-icon-sync-font-family: 'codicon';
    --vscode-icon-sync-ignored-content: '\eb9f';
    --vscode-icon-sync-ignored-font-family: 'codicon';
    --vscode-icon-table-content: '\ebb7';
    --vscode-icon-table-font-family: 'codicon';
    --vscode-icon-tag-add-content: '\ea66';
    --vscode-icon-tag-add-font-family: 'codicon';
    --vscode-icon-tag-content: '\ea66';
    --vscode-icon-tag-font-family: 'codicon';
    --vscode-icon-tag-remove-content: '\ea66';
    --vscode-icon-tag-remove-font-family: 'codicon';
    --vscode-icon-target-content: '\ebf8';
    --vscode-icon-target-font-family: 'codicon';
    --vscode-icon-tasklist-content: '\eb67';
    --vscode-icon-tasklist-font-family: 'codicon';
    --vscode-icon-telescope-content: '\eb68';
    --vscode-icon-telescope-font-family: 'codicon';
    --vscode-icon-terminal-bash-content: '\ebca';
    --vscode-icon-terminal-bash-font-family: 'codicon';
    --vscode-icon-terminal-cmd-content: '\ebc4';
    --vscode-icon-terminal-cmd-font-family: 'codicon';
    --vscode-icon-terminal-content: '\ea85';
    --vscode-icon-terminal-debian-content: '\ebc5';
    --vscode-icon-terminal-debian-font-family: 'codicon';
    --vscode-icon-terminal-decoration-error-content: '\ebfb';
    --vscode-icon-terminal-decoration-error-font-family: 'codicon';
    --vscode-icon-terminal-decoration-incomplete-content: '\eabc';
    --vscode-icon-terminal-decoration-incomplete-font-family: 'codicon';
    --vscode-icon-terminal-decoration-mark-content: '\eb8a';
    --vscode-icon-terminal-decoration-mark-font-family: 'codicon';
    --vscode-icon-terminal-decoration-success-content: '\ea71';
    --vscode-icon-terminal-decoration-success-font-family: 'codicon';
    --vscode-icon-terminal-font-family: 'codicon';
    --vscode-icon-terminal-linux-content: '\ebc6';
    --vscode-icon-terminal-linux-font-family: 'codicon';
    --vscode-icon-terminal-powershell-content: '\ebc7';
    --vscode-icon-terminal-powershell-font-family: 'codicon';
    --vscode-icon-terminal-tmux-content: '\ebc8';
    --vscode-icon-terminal-tmux-font-family: 'codicon';
    --vscode-icon-terminal-ubuntu-content: '\ebc9';
    --vscode-icon-terminal-ubuntu-font-family: 'codicon';
    --vscode-icon-text-size-content: '\eb69';
    --vscode-icon-text-size-font-family: 'codicon';
    --vscode-icon-three-bars-content: '\eb6a';
    --vscode-icon-three-bars-font-family: 'codicon';
    --vscode-icon-thumbsdown-content: '\eb6b';
    --vscode-icon-thumbsdown-filled-content: '\ec13';
    --vscode-icon-thumbsdown-filled-font-family: 'codicon';
    --vscode-icon-thumbsdown-font-family: 'codicon';
    --vscode-icon-thumbsup-content: '\eb6c';
    --vscode-icon-thumbsup-filled-content: '\ec14';
    --vscode-icon-thumbsup-filled-font-family: 'codicon';
    --vscode-icon-thumbsup-font-family: 'codicon';
    --vscode-icon-toolbar-more-content: '\ea7c';
    --vscode-icon-toolbar-more-font-family: 'codicon';
    --vscode-icon-tools-content: '\eb6d';
    --vscode-icon-tools-font-family: 'codicon';
    --vscode-icon-trash-content: '\ea81';
    --vscode-icon-trash-font-family: 'codicon';
    --vscode-icon-trashcan-content: '\ea81';
    --vscode-icon-trashcan-font-family: 'codicon';
    --vscode-icon-tree-filter-clear-content: '\ea76';
    --vscode-icon-tree-filter-clear-font-family: 'codicon';
    --vscode-icon-tree-filter-on-type-off-content: '\eb85';
    --vscode-icon-tree-filter-on-type-off-font-family: 'codicon';
    --vscode-icon-tree-filter-on-type-on-content: '\eb83';
    --vscode-icon-tree-filter-on-type-on-font-family: 'codicon';
    --vscode-icon-tree-item-expanded-content: '\eab4';
    --vscode-icon-tree-item-expanded-font-family: 'codicon';
    --vscode-icon-tree-item-loading-content: '\eb19';
    --vscode-icon-tree-item-loading-font-family: 'codicon';
    --vscode-icon-triangle-down-content: '\eb6e';
    --vscode-icon-triangle-down-font-family: 'codicon';
    --vscode-icon-triangle-left-content: '\eb6f';
    --vscode-icon-triangle-left-font-family: 'codicon';
    --vscode-icon-triangle-right-content: '\eb70';
    --vscode-icon-triangle-right-font-family: 'codicon';
    --vscode-icon-triangle-up-content: '\eb71';
    --vscode-icon-triangle-up-font-family: 'codicon';
    --vscode-icon-twitter-content: '\eb72';
    --vscode-icon-twitter-font-family: 'codicon';
    --vscode-icon-type-hierarchy-content: '\ebb9';
    --vscode-icon-type-hierarchy-font-family: 'codicon';
    --vscode-icon-type-hierarchy-sub-content: '\ebba';
    --vscode-icon-type-hierarchy-sub-font-family: 'codicon';
    --vscode-icon-type-hierarchy-super-content: '\ebbb';
    --vscode-icon-type-hierarchy-super-font-family: 'codicon';
    --vscode-icon-unfold-content: '\eb73';
    --vscode-icon-unfold-font-family: 'codicon';
    --vscode-icon-ungroup-by-ref-type-content: '\eb98';
    --vscode-icon-ungroup-by-ref-type-font-family: 'codicon';
    --vscode-icon-unlock-content: '\eb74';
    --vscode-icon-unlock-font-family: 'codicon';
    --vscode-icon-unmute-content: '\eb75';
    --vscode-icon-unmute-font-family: 'codicon';
    --vscode-icon-unverified-content: '\eb76';
    --vscode-icon-unverified-font-family: 'codicon';
    --vscode-icon-variable-content: '\ea88';
    --vscode-icon-variable-font-family: 'codicon';
    --vscode-icon-variable-group-content: '\ebb8';
    --vscode-icon-variable-group-font-family: 'codicon';
    --vscode-icon-verified-content: '\eb77';
    --vscode-icon-verified-filled-content: '\ebe9';
    --vscode-icon-verified-filled-font-family: 'codicon';
    --vscode-icon-verified-font-family: 'codicon';
    --vscode-icon-versions-content: '\eb78';
    --vscode-icon-versions-font-family: 'codicon';
    --vscode-icon-vm-active-content: '\eb79';
    --vscode-icon-vm-active-font-family: 'codicon';
    --vscode-icon-vm-connect-content: '\eba9';
    --vscode-icon-vm-connect-font-family: 'codicon';
    --vscode-icon-vm-content: '\ea7a';
    --vscode-icon-vm-font-family: 'codicon';
    --vscode-icon-vm-outline-content: '\eb7a';
    --vscode-icon-vm-outline-font-family: 'codicon';
    --vscode-icon-vm-running-content: '\eb7b';
    --vscode-icon-vm-running-font-family: 'codicon';
    --vscode-icon-vr-content: '\ec18';
    --vscode-icon-vr-font-family: 'codicon';
    --vscode-icon-vscode-content: '\ec29';
    --vscode-icon-vscode-font-family: 'codicon';
    --vscode-icon-vscode-insiders-content: '\ec2a';
    --vscode-icon-vscode-insiders-font-family: 'codicon';
    --vscode-icon-wand-content: '\ebcf';
    --vscode-icon-wand-font-family: 'codicon';
    --vscode-icon-warning-content: '\ea6c';
    --vscode-icon-warning-font-family: 'codicon';
    --vscode-icon-watch-content: '\eb7c';
    --vscode-icon-watch-font-family: 'codicon';
    --vscode-icon-whitespace-content: '\eb7d';
    --vscode-icon-whitespace-font-family: 'codicon';
    --vscode-icon-whole-word-content: '\eb7e';
    --vscode-icon-whole-word-font-family: 'codicon';
    --vscode-icon-widget-close-content: '\ea76';
    --vscode-icon-widget-close-font-family: 'codicon';
    --vscode-icon-window-content: '\eb7f';
    --vscode-icon-window-font-family: 'codicon';
    --vscode-icon-word-wrap-content: '\eb80';
    --vscode-icon-word-wrap-font-family: 'codicon';
    --vscode-icon-workspace-trusted-content: '\ebc1';
    --vscode-icon-workspace-trusted-font-family: 'codicon';
    --vscode-icon-workspace-unknown-content: '\ebc3';
    --vscode-icon-workspace-unknown-font-family: 'codicon';
    --vscode-icon-workspace-unspecified-content: '\ebc3';
    --vscode-icon-workspace-unspecified-font-family: 'codicon';
    --vscode-icon-workspace-untrusted-content: '\ebc2';
    --vscode-icon-workspace-untrusted-font-family: 'codicon';
    --vscode-icon-wrench-content: '\eb65';
    --vscode-icon-wrench-font-family: 'codicon';
    --vscode-icon-wrench-subaction-content: '\eb65';
    --vscode-icon-wrench-subaction-font-family: 'codicon';
    --vscode-icon-x-content: '\ea76';
    --vscode-icon-x-font-family: 'codicon';
    --vscode-icon-zap-content: '\ea86';
    --vscode-icon-zap-font-family: 'codicon';
    --vscode-icon-zoom-in-content: '\eb81';
    --vscode-icon-zoom-in-font-family: 'codicon';
    --vscode-icon-zoom-out-content: '\eb82';
    --vscode-icon-zoom-out-font-family: 'codicon';
    --vscode-input-background: #3c3c3c;
    --vscode-input-foreground: #cccccc;
    --vscode-input-placeholderForeground: rgba(204, 204, 204, 0.5);
    --vscode-inputOption-activeBackground: rgba(0, 127, 212, 0.4);
    --vscode-inputOption-activeBorder: #007acc;
    --vscode-inputOption-activeForeground: #ffffff;
    --vscode-inputOption-hoverBackground: rgba(90, 93, 94, 0.5);
    --vscode-inputValidation-errorBackground: #5a1d1d;
    --vscode-inputValidation-errorBorder: #be1100;
    --vscode-inputValidation-infoBackground: #063b49;
    --vscode-inputValidation-infoBorder: #007acc;
    --vscode-inputValidation-warningBackground: #352a05;
    --vscode-inputValidation-warningBorder: #b89500;
    --vscode-keybindingLabel-background: rgba(128, 128, 128, 0.17);
    --vscode-keybindingLabel-border: rgba(51, 51, 51, 0.6);
    --vscode-keybindingLabel-bottomBorder: rgba(68, 68, 68, 0.6);
    --vscode-keybindingLabel-foreground: #cccccc;
    --vscode-list-activeSelectionBackground: #04395e;
    --vscode-list-activeSelectionForeground: #ffffff;
    --vscode-list-deemphasizedForeground: #8c8c8c;
    --vscode-list-dropBackground: #062f4a;
    --vscode-list-dropBetweenBackground: #c5c5c5;
    --vscode-list-errorForeground: #f88070;
    --vscode-list-filterMatchBackground: rgba(234, 92, 0, 0.33);
    --vscode-list-focusHighlightForeground: #2aaaff;
    --vscode-list-focusOutline: #007fd4;
    --vscode-list-highlightForeground: #2aaaff;
    --vscode-list-hoverBackground: #2a2d2e;
    --vscode-list-inactiveSelectionBackground: #37373d;
    --vscode-list-invalidItemForeground: #b89500;
    --vscode-list-warningForeground: #cca700;
    --vscode-listFilterWidget-background: #252526;
    --vscode-listFilterWidget-noMatchesOutline: #be1100;
    --vscode-listFilterWidget-outline: rgba(0, 0, 0, 0);
    --vscode-listFilterWidget-shadow: rgba(0, 0, 0, 0.36);
    --vscode-menu-background: #3c3c3c;
    --vscode-menu-foreground: #f0f0f0;
    --vscode-menu-selectionBackground: #04395e;
    --vscode-menu-selectionForeground: #ffffff;
    --vscode-menu-separatorBackground: #606060;
    --vscode-merge-commonContentBackground: rgba(96, 96, 96, 0.16);
    --vscode-merge-commonHeaderBackground: rgba(96, 96, 96, 0.4);
    --vscode-merge-currentContentBackground: rgba(64, 200, 174, 0.2);
    --vscode-merge-currentHeaderBackground: rgba(64, 200, 174, 0.5);
    --vscode-merge-incomingContentBackground: rgba(64, 166, 255, 0.2);
    --vscode-merge-incomingHeaderBackground: rgba(64, 166, 255, 0.5);
    --vscode-minimap-errorHighlight: rgba(255, 18, 18, 0.7);
    --vscode-minimap-findMatchHighlight: #d18616;
    --vscode-minimap-foregroundOpacity: #000000;
    --vscode-minimap-infoHighlight: #3794ff;
    --vscode-minimap-selectionHighlight: #264f78;
    --vscode-minimap-selectionOccurrenceHighlight: #676767;
    --vscode-minimap-warningHighlight: #cca700;
    --vscode-minimapSlider-activeBackground: rgba(191, 191, 191, 0.2);
    --vscode-minimapSlider-background: rgba(121, 121, 121, 0.2);
    --vscode-minimapSlider-hoverBackground: rgba(100, 100, 100, 0.35);
    --vscode-multiDiffEditor-background: #1e1e1e;
    --vscode-multiDiffEditor-headerBackground: #262626;
    --vscode-peekView-border: #3794ff;
    --vscode-peekViewEditor-background: #001f33;
    --vscode-peekViewEditor-matchHighlightBackground: rgba(255, 143, 0, 0.6);
    --vscode-peekViewEditorGutter-background: #001f33;
    --vscode-peekViewEditorStickyScroll-background: #001f33;
    --vscode-peekViewResult-background: #252526;
    --vscode-peekViewResult-fileForeground: #ffffff;
    --vscode-peekViewResult-lineForeground: #bbbbbb;
    --vscode-peekViewResult-matchHighlightBackground: rgba(234, 92, 0, 0.3);
    --vscode-peekViewResult-selectionBackground: rgba(51, 153, 255, 0.2);
    --vscode-peekViewResult-selectionForeground: #ffffff;
    --vscode-peekViewTitle-background: #252526;
    --vscode-peekViewTitleDescription-foreground: rgba(204, 204, 204, 0.7);
    --vscode-peekViewTitleLabel-foreground: #ffffff;
    --vscode-pickerGroup-border: #3f3f46;
    --vscode-pickerGroup-foreground: #3794ff;
    --vscode-problemsErrorIcon-foreground: #f14c4c;
    --vscode-problemsInfoIcon-foreground: #3794ff;
    --vscode-problemsWarningIcon-foreground: #cca700;
    --vscode-progressBar-background: #0e70c0;
    --vscode-quickInput-background: #252526;
    --vscode-quickInput-foreground: #cccccc;
    --vscode-quickInputList-focusBackground: #04395e;
    --vscode-quickInputList-focusForeground: #ffffff;
    --vscode-quickInputTitle-background: rgba(255, 255, 255, 0.1);
    --vscode-radio-activeBackground: rgba(0, 127, 212, 0.4);
    --vscode-radio-activeBorder: #007acc;
    --vscode-radio-activeForeground: #ffffff;
    --vscode-radio-inactiveBorder: rgba(255, 255, 255, 0.2);
    --vscode-radio-inactiveHoverBackground: rgba(90, 93, 94, 0.5);
    --vscode-sash-hover-size: 4px;
    --vscode-sash-hoverBorder: #007fd4;
    --vscode-sash-size: 4px;
    --vscode-scrollbar-shadow: #000000;
    --vscode-scrollbarSlider-activeBackground: rgba(191, 191, 191, 0.4);
    --vscode-scrollbarSlider-background: rgba(121, 121, 121, 0.4);
    --vscode-scrollbarSlider-hoverBackground: rgba(100, 100, 100, 0.7);
    --vscode-search-resultsInfoForeground: rgba(204, 204, 204, 0.65);
    --vscode-searchEditor-findMatchBackground: rgba(234, 92, 0, 0.22);
    --vscode-symbolIcon-arrayForeground: #cccccc;
    --vscode-symbolIcon-booleanForeground: #cccccc;
    --vscode-symbolIcon-classForeground: #ee9d28;
    --vscode-symbolIcon-colorForeground: #cccccc;
    --vscode-symbolIcon-constantForeground: #cccccc;
    --vscode-symbolIcon-constructorForeground: #b180d7;
    --vscode-symbolIcon-enumeratorForeground: #ee9d28;
    --vscode-symbolIcon-enumeratorMemberForeground: #75beff;
    --vscode-symbolIcon-eventForeground: #ee9d28;
    --vscode-symbolIcon-fieldForeground: #75beff;
    --vscode-symbolIcon-fileForeground: #cccccc;
    --vscode-symbolIcon-folderForeground: #cccccc;
    --vscode-symbolIcon-functionForeground: #b180d7;
    --vscode-symbolIcon-interfaceForeground: #75beff;
    --vscode-symbolIcon-keyForeground: #cccccc;
    --vscode-symbolIcon-keywordForeground: #cccccc;
    --vscode-symbolIcon-methodForeground: #b180d7;
    --vscode-symbolIcon-moduleForeground: #cccccc;
    --vscode-symbolIcon-namespaceForeground: #cccccc;
    --vscode-symbolIcon-nullForeground: #cccccc;
    --vscode-symbolIcon-numberForeground: #cccccc;
    --vscode-symbolIcon-objectForeground: #cccccc;
    --vscode-symbolIcon-operatorForeground: #cccccc;
    --vscode-symbolIcon-packageForeground: #cccccc;
    --vscode-symbolIcon-propertyForeground: #cccccc;
    --vscode-symbolIcon-referenceForeground: #cccccc;
    --vscode-symbolIcon-snippetForeground: #cccccc;
    --vscode-symbolIcon-stringForeground: #cccccc;
    --vscode-symbolIcon-structForeground: #cccccc;
    --vscode-symbolIcon-textForeground: #cccccc;
    --vscode-symbolIcon-typeParameterForeground: #cccccc;
    --vscode-symbolIcon-unitForeground: #cccccc;
    --vscode-symbolIcon-variableForeground: #75beff;
    --vscode-textBlockQuote-background: #222222;
    --vscode-textBlockQuote-border: rgba(0, 122, 204, 0.5);
    --vscode-textCodeBlock-background: rgba(10, 10, 10, 0.4);
    --vscode-textLink-activeForeground: #3794ff;
    --vscode-textLink-foreground: #3794ff;
    --vscode-textPreformat-background: rgba(255, 255, 255, 0.1);
    --vscode-textPreformat-foreground: #d7ba7d;
    --vscode-textSeparator-foreground: rgba(255, 255, 255, 0.18);
    --vscode-toolbar-activeBackground: rgba(99, 102, 103, 0.31);
    --vscode-toolbar-hoverBackground: rgba(90, 93, 94, 0.31);
    --vscode-tree-inactiveIndentGuidesStroke: rgba(88, 88, 88, 0.4);
    --vscode-tree-indentGuidesStroke: #585858;
    --vscode-tree-tableColumnsBorder: rgba(204, 204, 204, 0.13);
    --vscode-tree-tableOddRowsBackground: rgba(204, 204, 204, 0.04);
    --vscode-widget-shadow: rgba(0, 0, 0, 0.36);

}
```

Possible values for the monaco editor options are:

```js

editor.updateOptions({
  acceptSuggestionOnCommitCharacter: true,
  acceptSuggestionOnEnter: "on",
  accessibilitySupport: "auto",
  ariaLabel: "Editor content",
  autoClosingBrackets: "always",
  autoClosingDelete: "auto",
  autoClosingOvertype: "auto",
  autoClosingQuotes: "always",
  autoIndent: "advanced",
  automaticLayout: true,
  autoSurround: "languageDefined",
  bracketPairColorization: {enabled: true},
  codeLens: true,
  colorDecorators: true,
  columnSelection: false,
  comments: {
    insertSpace: true,
    ignoreEmptyLines: true
  },
  contextmenu: true,
  copyWithSyntaxHighlighting: true,
  cursorBlinking: "blink",        // or "smooth", "phase", "expand", "solid"
  cursorSmoothCaretAnimation: "on",
  cursorStyle: "line",            // or "block", "underline", etc.
  cursorSurroundingLines: 3,
  cursorSurroundingLinesStyle: "default",
  cursorWidth: 2,
  disableLayerHinting: false,
  disableMonospaceOptimizations: false,
  domReadOnly: false,
  dragAndDrop: true,
  dropIntoEditor: {
    enabled: true
  },
  emptySelectionClipboard: true,
  fastScrollSensitivity: 5,
  find: {
    addExtraSpaceOnTop: true,
    autoFindInSelection: "never",
    seedSearchStringFromSelection: true
  },
  fixedOverflowWidgets: false,
  folding: true,
  foldingHighlight: true,
  foldingStrategy: "auto",
  fontFamily: "Fira Code",
  fontLigatures: true,
  fontSize: 14,
  fontWeight: "normal",
  formatOnPaste: false,
  formatOnType: false,
  glyphMargin: true,
  guides: {
    indentation: true,
    bracketPairs: "active"
  },
  hideCursorInOverviewRuler: false,
  highlightActiveIndentGuide: true,
  hover: {
    enabled: true,
    delay: 300,
    sticky: true
  },
  inlineHints: {
    enabled: "on"
  },
  inlayHints: {
    enabled: "on"
  },
  letterSpacing: 0,
  lightbulb: {
    enabled: true
  },
  lineDecorationsWidth: "10",
  lineHeight: 22,
  lineNumbers: "on",              // or "off", "relative", "interval", fn
  lineNumbersMinChars: 3,
  linkedEditing: true,
  links: true,
  matchBrackets: "always",        // or "never", "near"
  minimap: {
    enabled: true,
    side: "right",
    size: "proportional",
    showSlider: "mouseover"
  },
  mouseStyle: "text",
  mouseWheelScrollSensitivity: 1,
  mouseWheelZoom: false,
  multiCursorMergeOverlapping: true,
  multiCursorModifier: "alt",     // or "ctrlCmd"
  occurrencesHighlight: true,
  overviewRulerBorder: true,
  overviewRulerLanes: 2,
  padding: {
    top: 4,
    bottom: 4
  },
  parameterHints: {
    enabled: true
  },
  peekWidgetDefaultFocus: "tree",
  quickSuggestions: true,
  quickSuggestionsDelay: 100,
  readOnly: false,
  renderControlCharacters: false,
  renderFinalNewline: true,
  renderLineHighlight: "line",    // or "gutter", "all", "none"
  renderWhitespace: "none",       // or "boundary", "all", "selection"
  revealHorizontalRightPadding: 30,
  roundedSelection: true,
  rulers: [80, 120],
  scrollBeyondLastColumn: 5,
  scrollBeyondLastLine: true,
  scrollPredominantAxis: true,
  scrollbar: {
    vertical: "auto",
    horizontal: "auto"
  },
  selectOnLineNumbers: true,
  selectionClipboard: true,
  selectionHighlight: true,
  semanticHighlighting: true,
  showDeprecated: true,
  showFoldingControls: "mouseover", // or "always"
  showUnused: true,
  smoothScrolling: true,
  snippetSuggestions: "inline",
  stickyScroll: {
    enabled: true
  },
  suggest: {
    preview: true,
    showIcons: true
  },
  suggestFontSize: null,
  suggestLineHeight: null,
  suggestOnTriggerCharacters: true,
  suggestSelection: "recentlyUsed",
  tabCompletion: "on",
  tabIndex: 0,
  tabSize: 4,
  theme: "vs-dark",              // set via monaco.editor.setTheme()
  unicodeHighlight: {
    ambiguousCharacters: true,
    invisibleCharacters: true
  },
  useTabStops: true,
  value: "// code here",
  wordBasedSuggestions: true,
  wordWrap: "off",               // or "on", "wordWrapColumn", "bounded"
  wordWrapColumn: 80,
  wrappingIndent: "none"         // or "same", "indent", "deepIndent"
});

```



