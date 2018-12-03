'use strict';
// グローバルのwindowオブジェクトやライブラリとの名前衝突を避けるため、名前空間を作成
const learnjs = {};

//source[learnjs/public/app.js] {
  learnjs.problems = [
    {
      description: 'What is truth?',
      code: 'function problem() { return __; }',
    },
    {
      description: 'Simple Math',
      code: 'function problem() { return 42 === 6 *  __; }',
    },
  ]
//}

learnjs.problemView = function (problemNumber) {
  const view = $('.templates .problem-view').clone();
  view.find('.title').text('Problem #' + problemNumber + ' Coming soon!');
  return view;
};

learnjs.showView = function (hash) {
  const routes = {
    '#problem': learnjs.problemView
  };
  const hashParts = hash.split('-');
  const viewFn = routes[hashParts[0]];
  if (viewFn) {
    $('.view-container').empty().append(viewFn(hashParts[1]));
  }
};

learnjs.appOnReady = function () {
  window.onhashchange = function () {
    learnjs.showView(window.location.hash);
  };
  learnjs.showView(window.location.hash);
};
