const siteUrl = 'https://finance.yahoo.com/chart/<SYMBOL>';
const symbolLists = {
  list1: ['AAPL', 'GOOG', 'FB', 'AMZN', 'NFLX', 'MSFT', 'TSLA'],
  list2: ['REGN', 'MRNA', 'GILD', 'INO'],
  list3: ['BA', 'COST', 'WMT', 'SHOP'],
  list4: ['DOCU', 'BIDU', 'BABA', 'MELI', 'NTES'],
  list5: ['ANTM', 'UNH', 'HUM', 'SDGR'],
  list6: ['CSCO','ZM']
};

const windowFeatures = "menubar=0,location=0,toolbar=0,resizable=yes,scrollbars=yes,status=0,titlebar=0";
const height = 700;
const width = 750;

const openedWindows = [];
var ltop = 0;
var left = 0;
var overlapdelta = 10;

const closeAll = function() {
  while (openedWindows.length > 0) {
    const awin = openedWindows.pop();
    awin.close(); 
  };
  ltop = 0;
  left = 0;
};

const launchWin = function(sym) {
  const screenX = 0; // window.screenX;
  if (left === 0) {
    left = screenX;
  }
  const screenWidth = window.screen.availWidth; // + screenX;
  const screenHeight = window.screen.availHeight; 
  console.log(`screenWidth: ${screenWidth} screenHeight: ${screenHeight} screenX: ${screenX}`);

  const windowName = `stock_${sym}`;
  const url = siteUrl.replace('<SYMBOL>', sym);
  const feat = `top=${ltop},left=${left},height=${height},width=${width},${windowFeatures}`;
  console.log(`launching ${sym} - ${url} ${feat}`);
  const win = window.open(url, windowName, feat);
  openedWindows.push(win);
  left += width;
  if (left+width > screenWidth) {
    left = 0;
    ltop += height;
  }
  if (ltop+height > screenHeight) {
    ltop = overlapdelta;
    overlapdelta += overlapdelta;
  }
};

$(document).ready(function() {
  console.log('started');

  window.unload = closeAll;
  window.onbeforeunload = closeAll;
  $('#closeAll').click(function () {
    closeAll();
  });

  Object.keys(symbolLists).forEach(listName => {
    const list = symbolLists[listName];
    console.log(`listName: ${listName} - ${list}`);
    $('#symbols-content .lists').append(`<div id="symlist-${listName}" class="launch-button button">${list}</div>`);
    list.forEach(sym => {
      $('#symbols-content .individual').append(`<div id="sym-${sym}" class="launch-button button">${sym}</div>`);
      $(`#symbols-content .individual #sym-${sym}`).click(function() {
        launchWin(sym);
      });
    });
    $(`#symbols-content .lists #symlist-${listName}`).click(function() {
      list.forEach(sym => {
        launchWin(sym);
      });
    });
  });

});