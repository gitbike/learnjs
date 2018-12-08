'use strict';
// グローバルのwindowオブジェクトやライブラリとの名前衝突を避けるため、名前空間を作成
const learnjs = {
  poolId: 'us-east-1:32afbf50-276f-4f06-aa40-4d8eef024633'
};

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
];
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

   if (problemNumber < learnjs.problems.length) {
     const buttonItem = learnjs.template('skip-btn');
     buttonItem.find('a').attr('href', '#problem-' + (problemNumber + 1));
     $('.nav-list').append(buttonItem);
     view.bind('removingView', function () {
       buttonItem.remove();
     });
   }

  view.find('.check-btn').click(checkAnswerClick);
  view.find('.title').text('Problem #' + problemNumber);
  learnjs.applyObject(problemData, view);
  return view;
};

learnjs.showView = function (hash) {
  const routes = {
    '#problem': learnjs.problemView,
    '#': learnjs.landingView,
    '': learnjs.landingView,
  };
  const hashParts = hash.split('-');
  const viewFn = routes[hashParts[0]];
  if (viewFn) {
    learnjs.triggerEvent('removingView', []);
    // 置き換えられたイベントハンドラをメモリから解放させるためempty関数を使っている
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

// アクションに応じてhtml要素を挿入するためのテンプレート関数
learnjs.template = function (name) {
  return $('.templates .' + name).clone();
};

// ランディングページをroutesに追加するためのビュー関数 アプリロード時のフラッシュが消え、戻るボタンが機能するようになる
learnjs.landingView = function () {
  return learnjs.template('landing-view');
};

// テストしやすくするため、checkAnswerボタンクリックハンドから抽出
learnjs.buildCorrectFlash = function (problemNum) {
  const correctFlash = learnjs.template('correct-flash');
  const link = correctFlash.find('a');
  if (problemNum < learnjs.problems.length) {
    link.attr('href', '#problem-' + (problemNum + 1));
  } else {
    link.attr('href', '');
    link.text("You're Finished!");
  }
  return correctFlash;
};

// ユーザーのアクションをイベントでビューに知らせるため、カスタムイベントの作成
learnjs.triggerEvent = function (name, args) {
  $('.view-container > *').trigger(name, args);
};

function googleSignIn(googleUser) {
  const id_token = googleUser.getAuthResponse().id_token;
  AWS.config.Update({
    region: 'us-east-1',
    credentials: new AWS.CognitoIdentityCredentials({
      IdentityPoolId: learnjs.poolId,
      Logins: {
        'accounts.google.com': id_token
      }
    })
  });
}

function refresh() {
  return gapi.auth2.getAuthInstance().signIn({
    prompt: 'login'
  }).then(function (UserUpdate) {
    const creds = AWS.config.credentials;
    const newToken = userUpdate.getAuthResponse().id_token;
    creds.params.Logins['accounts.google.com'] = newToken;
    return learnjs.awsRefresh();
  });
}

learnjs.awsRefresh = function () {
  const deferred = new $.Deferred();
  AWS.config.credentials.refresh(function (err) {
    if (err) {
      deferred.reject(err);
    } else {
      deferred.resolve(AWS.config.credentials.identityId);
    }
  });
  return defferred.promise();
}