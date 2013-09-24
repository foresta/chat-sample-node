var ws = new WebSocket('ws://127.0.0.1:8888/');

//when error
ws.onerror = function(e){
    $('#chat-area').empty().addClass('alert alert-error')
    .append('<button type="button" class="close" data-dismiss="alert">×</button>',$('<i/>').addClass('icon-warning-sign'),'サーバーに接続できませんでした');

}

//???[?U?[??????_???¶?￢
var userName = 'ゲスト' + Math.floor(Math.random() * 100);

//?`???b?g?{?b?N?X??O????[?U???d?\?|
$('#user-name').append(userName);

//WebSocket?T?[?o?[??±?C?x???g
ws.onopen = function() {
    $('#textbox').focus();
    //?u?o?i?n? ??n???・?μ????M
    ws.send(JSON,stringify({
	type: 'join',
	user: userName
    }));
};

//???b?Z?[?W?o?M?C?x???g???
ws.onmessage = function(event){
    //?o?M?μ?????b?Z?[?W???3
    var data = JSON.parse(event.data);
    var item = $('<li/>').append(
	$('<div/>').append(
	    $('<i/>').addClass('icon-user'),
	    $('<small/>').addClass('meta chat-time').append(data.time))
    );

    //push?3?????b?Z?[?W?d?d??μ?A?v?f? ￢?・?e
     if (data.type === 'join') {
    item.addClass('alert alert-info')
    .prepend('<button type="button" class="close" data-dismiss="alert">×</button>')
    .children('div').children('i').after(data.user + '入室しました');
  } else if (data.type === 'chat') {
    item.addClass('well well-small')
    .append($('<div/>').text(data.text))
    .children('div').children('i').after(data.user);
  } else if (data.type === 'defect') {
    item.addClass('alert')
    .prepend('<button type="button" class="close" data-dismiss="alert">×</button>')
    .children('div').children('i').after(data.user + '退室しました');
  } else {
    item.addClass('alert alert-error')
    .children('div').children('i').removeClass('icon-user').addClass('icon-warning-sign')
      .after('不正なメッセージを受信しました');
  }
  $('#chat-history').prepend(item).hide().fadeIn(500);
};


// ?-???C?x???g
textbox.onkeydown = function(event) {
  // ?G???^?[?L?[??μ????≪
  if (event.keyCode === 13 && textbox.value.length > 0) {
    ws.send(JSON.stringify({
      type: 'chat',
      user: userName,
      text: textbox.value
    }));
    textbox.value = '';
  }
};

// ?u???E?U?I?1?C?x???g
window.onbeforeunload = function () {
  ws.send(JSON.stringify({
    type: 'defect',
    user: userName,
  }));
};
