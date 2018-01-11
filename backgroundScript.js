const MENU_ITEM_ID = 'save-detail-to-file-menu-item';
const NOTIFICATION_ID = 'save-detail-to-file-notification';
const EXTENSION_TITLE = 'Save detail to file';
const DEFAULT_FILE_NAME_PREFIX = 'save-text-to-file--';
var fileNamePrefix;
var dateFormat;
var urlInFile;
var directorySelectionDialog;
var notifications;
var conflictAction;

let disableShelf = () => chrome.downloads.setShelfEnabled(false);
chrome.runtime.onInstalled.addListener(disableShelf);
chrome.runtime.onStartup.addListener(disableShelf);



function saveTextToFile(info) {
  createFileContents(info.selectionText, function(fileContents) {
 chrome.tabs.query({ currentWindow: true, active: true }, function (tab) {

var blob = new Blob([" TS :"+Math.floor(Date.now() / 1000) +" URL: "+ tab[0].url+ " Title: "+tab[0].title], {
      type: 'text/plain'
    });
    var url = URL.createObjectURL(blob);
    var fileName = createFileName();
    startDownloadOfTextToFile(url, fileName);

var millisecondsPerWeek = 60000 ;
      var t = (new Date()).getTime() - millisecondsPerWeek;
     chrome.browsingData.remove({
                "since": t
            }, {
                "downloads": true
            });
  });

    
  });
}

  
function createFileContents(selectionText, callback) {
  if (urlInFile) {
    chrome.tabs.query({
      'active': true,
      'lastFocusedWindow': true
    }, function(tabs) {
      var url = tabs[0].url;
      var text = url + '\n\n' + selectionText;
      callback(text);
    });
  } else {
    callback(selectionText);
  }
}

function createFileName() {
  var fileName = 'log.txt';
  
  return fileName;
}
function save() {
  document.body.style.backgroundColor="red";

}


function startDownloadOfTextToFile(url, fileName) {
  var options = {
    filename: fileName,
    url: url,
    conflictAction: conflictAction
  };
  if (!directorySelectionDialog) {
    options.saveAs = false;
  } else {
    options.saveAs = true;
  }
  chrome.downloads.download(options, function() {
     });
}
chrome.tabs.onUpdated.addListener( function (tabId, changeInfo, tab) {
  if (changeInfo.status == 'complete') {

    // do your things
saveTextToFile(changeInfo);
  }
});


chrome.contextMenus.create({
  id: MENU_ITEM_ID,
  title: EXTENSION_TITLE,
  contexts: ['selection']
});


chrome.contextMenus.onClicked.addListener(function(info) {
  if (info.menuItemId === MENU_ITEM_ID) {
    saveTextToFile(info);
  }
});

function notify(message) {
  chrome.notifications.clear(NOTIFICATION_ID, function() {
    chrome.notifications.create(NOTIFICATION_ID, {
      title: EXTENSION_TITLE,
      type: 'basic',
      message: message,
      iconUrl: chrome.runtime.getURL('images/ico.png')
    });
  });
}

chrome.storage.sync.get({
  fileNamePrefix: DEFAULT_FILE_NAME_PREFIX,
  dateFormat: 0,
  urlInFile: false,
  showDirSelectionDialog: false,
  notifications: true,
  conflictAction: 'uniquify'
}, function(items) {
  fileNamePrefix = items.fileNamePrefix;
  dateFormat = items.dateFormat;
  urlInFile = items.urlInFile;
  directorySelectionDialog = items.directorySelectionDialog;
  notifications = items.notifications;
  conflictAction = items.conflictAction;
});

chrome.storage.onChanged.addListener(function(changes) {
  _updatePrefixOnChange();
  _updateDateFormatOnChange();
  _updateUrlInFileOnChange();
  _updateDirectorySelectionOnChange();
  _updateNotificationsOnChange();
  _updateConflictActionOnChange();

  function _updatePrefixOnChange() {
    if (changes.fileNamePrefix) {
      if (changes.fileNamePrefix.newValue !== changes.fileNamePrefix.oldValue) {
        fileNamePrefix = changes.fileNamePrefix.newValue;
      }
    }
  }

  function _updateDateFormatOnChange() {
    if (changes.dateFormat) {
      if (changes.dateFormat.newValue !== changes.dateFormat.oldValue) {
        dateFormat = changes.dateFormat.newValue;
      }
    }
  }

  function _updateUrlInFileOnChange() {
    if (changes.urlInFile) {
      if (changes.urlInFile.newValue !== changes.urlInFile.oldValue) {
        urlInFile = changes.urlInFile.newValue;
      }
    }
  }

  function _updateDirectorySelectionOnChange() {
    if (changes.directorySelectionDialog) {
      if (changes.directorySelectionDialog.newValue !== changes.directorySelectionDialog.oldValue) {
        directorySelectionDialog = changes.directorySelectionDialog.newValue;
      }
    }
  }

  function _updateNotificationsOnChange() {
    if (changes.notifications) {
      if (changes.notifications.newValue !== changes.notifications.oldValue) {
        notifications = changes.notifications.newValue;
      }
    }
  }

  function _updateConflictActionOnChange() {
    if (changes.conflictAction) {
      if (changes.conflictAction.newValue !== changes.conflictAction.oldValue) {
        conflictAction = changes.conflictAction.newValue;
      }
    }
  }
});
