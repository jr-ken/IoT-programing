// 最新のsignalidを取得
function getSignalIdList() {
  
  var token ="Bearer " + PropertiesService.getScriptProperties().getProperty('REMO_ACCESS_TOKEN');  
  var sheetid = PropertiesService.getScriptProperties().getProperty('SHEET_ID_SIGNALS');  
  
  // 機器情報を取得
  var options = {
    'method': 'get',
    'headers': {
       'Authorization': token
    }
  };
  var response = UrlFetchApp.fetch('https://api.nature.global/1/appliances', options);
  Logger.log(response)
  r = JSON.parse(response.getContentText())
  //Logger.log(r)
}