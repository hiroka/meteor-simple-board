// コレクションを作る。
var Messages = new Meteor.Collection('messages');

// Clientサイド
if (Meteor.isClient) {
  var maxrec = 10;   // 最大件数。古いのは消されます。

  // 背景色を決める。(10個から選ぶ)
  var colors = [
    'Cornsilk','Aquamarine','LightPink','PaleGreen','Coral',
    'SpringGreen','Plum','LightSkyBlue','MistyRose','Turquoise'];
  var color = "background-color:"+colors[(+new Date()) % 10]+";";

  // チャットレコード表示
  Template.contents.messages = function () {
    var cursor = Messages.find({},{sort:{date:-1}});
    return cursor;
  };

  Template.contents.maxrec = maxrec;  // 件数表示
  Template.contents.color = color;    // 色表示

  // イベント処理
  Template.contents.events({
    'keydown input#postmes':function(ev){
      if(ev.keyCode == 13){ // 'enter' keyで確定
        var message = $("#postmes").val();
        if(message != ""){
          $("#postmes").val("");   // 入力Boxの文字消す。
          var setdata = createProperties(message); // データをつくる
          // DBへ新レコードを登録
          Messages.insert(setdata,function(err,_id){
            // 最大件数以上なら古いのを消す
            var len = Messages.find({}).fetch().length;
            if(len > maxrec){
              var doc = Messages.findOne({}); // 先頭レコード(つまり一番古いレコード)を取り出す
              Messages.remove({_id:doc._id}); // そして消す
            }
          });
        }
  	  }	
    }
  });

  // messageレコードのプロパティ生成
  function createProperties(message){
    var date = Date.parse(new Date());
    var datetime = toDateStr(date);
    var style = color;
    var name = $("#postname").val();
    if(name == ""){
      name = "guest";
    }
    return {date:date,datetime:datetime,message:message,name:name,style:style};
  }

  // 日付を文字列に変換
  function toDateStr(parseDate){
    var date = new Date(parseDate);
    var y = date.getFullYear();
    var m = date.getMonth()+1;
    var d = date.getDate();
    var h = date.getHours();
    var min = date.getMinutes();
    return y+"/"+m+"/"+d+" "+h+":"+min;
  }
}

// Serverサイド
if(Meteor.isServer) {
  Meteor.startup(function () {
    Messages.remove({});
  });
}
