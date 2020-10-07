var access_token = PropertiesService.getScriptProperties().getProperty("REMO_ACCESS_TOKEN")//←トークンを入れる
var spreadsheetId = PropertiesService.getScriptProperties().getProperty("SPREADSHEET_ID")//←スプレッドシートのIDを入れる
function remo() {
  var data = getNatureRemoData();　　　　//data取得
  var lastData = getLastData();　　　　　//最終date取得
  setLaremoData(
  {
    te:data[0].newest_events.te.val,　　//温度
    hu:data[0].newest_events.hu.val,　　//湿度
    il:data[0].newest_events.il.val,　　//照度
  },
  lastData.row + 1//最終data追加作業
  );
}

function getNatureRemoData() {　　　　　　//Remoのapiをお借りします
  var url = "https://api.nature.global/1/devices";
  var headers = {
    "Content-Type" : "application/json;",
    'Authorization': 'Bearer ' + access_token,
  };

  var postData = {

  };

  var options = {
    "method" : "get",
    "headers" : headers,
  };

  var data = JSON.parse(UrlFetchApp.fetch(url, options));
  Logger.log(data[0].newest_events)
  Logger.log(data[0].newest_events.te.val)
  Logger.log(data[0].newest_events.hu.val)
  Logger.log(data[0].newest_events.il.val)

  return data;

}

function getLastData() {
  var datas = SpreadsheetApp.openById(spreadsheetId).getSheetByName('log').getDataRange().getValues()　　//logシートをゲットする
  var data = datas[datas.length - 1]

  return {
    totalpoint:data[1],
    coupon:data[2],
    row:datas.length,
  }
}

function setLaremoData(data, row) {
  SpreadsheetApp.openById(spreadsheetId).getSheetByName('log').getRange(row, 1).setValue(new Date())//A2にゲットした日時ほりこむ
  SpreadsheetApp.openById(spreadsheetId).getSheetByName('log').getRange(row, 2).setValue(data.te)　　//B2に温度追加
  SpreadsheetApp.openById(spreadsheetId).getSheetByName('log').getRange(row, 3).setValue(data.hu)　　//C2湿度追加(幅があるけど気にしない)
  SpreadsheetApp.openById(spreadsheetId).getSheetByName('log').getRange(row, 4).setValue(data.il)　　//D2照度追加
}

function Light_ON() {
  var sheet = SpreadsheetApp.openById(spreadsheetId).getSheetByName('log');
  var row_num = sheet.getDataRange().getValues().length;
  var il_now = sheet.getRange(row_num, 4).getValue();
  //Logger.log(il_now)
  // 部屋の照度が低いならON
  if (il_now < 50) {
    var ifttt_url = "https://maker.ifttt.com/trigger/" 
    + PropertiesService.getScriptProperties().getProperty("EVENT_NAME") 
    + "/with/key/"
    + PropertiesService.getScriptProperties().getProperty("YOUR_KEY");
    Logger.log(ifttt_url)
    
    var params = {
      "method": "post",
    };
    UrlFetchApp.fetch(ifttt_url, params);
  }
}
