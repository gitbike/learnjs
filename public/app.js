'use strict';
// グローバルのwindowオブジェクトやライブラリとの名前衝突を避けるため、名前空間を作成
const learnjs = {};

learnjs.problemView = function () {
  return $('<div class="problem-view">').text('Coming soon!');
  
}

learnjs.showView = function (hash) {
  const routes = {
    '#problem-1': learnjs.problemView
  };
  const viewFn = routes[hash];
  if (viewFn) {
    $('.view-container').empty().append(viewFn());
  }
}
