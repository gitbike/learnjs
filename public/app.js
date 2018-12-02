'use strict';
// グローバルのwindowオブジェクトやライブラリとの名前衝突を避けるため、名前空間を作成
const learnjs = {};

learnjs.problemView = function (problemNumber) {
  const title = 'Problem #' + problemNumber + ' Coming soon!';
  return $('<div class="problem-view">').text(title);
}

learnjs.showView = function (hash) {
  const routes = {
    '#problem': learnjs.problemView
  };
  const hashParts = hash.split('-');
  const viewFn = routes[hashParts[0]];
  if (viewFn) {
    $('.view-container').empty().append(viewFn(hashParts[1]));
  }
}

learnjs.appOnReady = function () {
  learnjs.showView(window.location.hash);
};
