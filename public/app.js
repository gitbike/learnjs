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

learnjs.problemView = function (data) {
  const problemNumber = parseInt(data, 10);
  const view = $('.templates .problem-view').clone();
  const problemData = learnjs.problems[problemNumber - 1];
  const resultFlash = view.find('.result');

  function checkAnswer() {
    const answer = view.find('.answer').val();
    const test = problemData.code.replace('__', answer) + '; problem();';
    return eval(test);
  }

  function checkAnswerClick() {
    if (checkAnswer()) {
      const correctFlash = learnjs.template('correct-flash');
      correctFlash.find('a').attr('href', '#problem-' + (problemNumber + 1));
      learnjs.flashElement(resultFlash, correctFlash);
    } else {
      learnjs.flashElement(resultFlash, 'Incorrect!');
    }
    // フォームの送信を防ぐため、click()にfalseを返す
    return false;
  }

  view.find('.check-btn').click(checkAnswerClick);
  view.find('.title').text('Problem #' + problemNumber);
  learnjs.applyObject(problemData, view);
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

learnjs.applyObject = function (obj, elem) {
  for (var key in obj) {
    elem.find('[data-name="' + key + '"]').text(obj[key]);
  }
};

learnjs.flashElement = function (elem, content) {
  elem.fadeOut('fast', function () {
    elem.html(content);
    elem.fadeIn();
  });
};

learnjs.template = function (name) {
  return $('.templates .' + name).clone();
}