describe('LearnJS', function () {
  it('can show a problem view', function () {
    learnjs.showView('#problem-1');
    expect($('.view-container .problem-view').length).toEqual(1);
  });

  // ヌルケース（デフォルトケース）,空の文字列・空の配列・空のオブジェクト・数値0の場合などをテストする
  // 以下はハッシュが空文字の場合のrouteのテスト
  it('shows the landing page view when there is no hash', function () {
    learnjs.showView('');
    expect($('.view-container .landing-view').length).toEqual(1);
  });
});
