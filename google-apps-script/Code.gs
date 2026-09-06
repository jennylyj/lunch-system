/**
 * ============================================================================
 * 訂餐系統 (Lunch Ordering System) - Google Apps Script (GAS) 後端腳本 v2.0
 * 
 * 新增功能：
 * 1. 【累積儲值】工作表：記錄儲值時間、姓名、金額與收款狀態（已收款/未收款）。
 * 2. 【飲食規劃】工作表：依日期安排不同餐廳，前端可切換日期並自動連動餐廳與菜單！
 * 3. 動態計算金庫【現在餘額】= 累積儲值（僅採計已收款）- 累積消費。
 * ============================================================================
 */

// GET 請求處理
function doGet(e) {
  var action = e.parameter.action || "getInitData";
  var reqDate = e.parameter.date || Utilities.formatDate(new Date(), "GMT+8", "yyyy-MM-dd");
  var ss = SpreadsheetApp.getActiveSpreadsheet();

  if (action === "getInitData") {
    // 1. 取得飲食規劃列表與當前日期安排的餐廳
    var scheduleData = getScheduleData(ss);
    var matchedRestaurant = getRestaurantForDate(scheduleData, reqDate);

    // 2. 根據安排的餐廳讀取菜單
    var menuData = getMenuData(ss, matchedRestaurant);

    // 3. 讀取所有日期的完整訂單紀錄 (以正確計算跨日累積消費與金庫餘額)
    var ordersData = getAllOrders(ss);

    // 4. 讀取儲值紀錄與重新計算金庫餘額
    var topUpsData = getTopUpsData(ss);
    var treasuryData = calculateTreasury(ss, topUpsData);

    var result = {
      status: "success",
      selectedDate: reqDate,
      restaurantName: matchedRestaurant,
      schedule: scheduleData,
      menu: menuData,
      orders: ordersData,
      treasury: treasuryData,
      topUps: topUpsData
    };

    return ContentService
      .createTextOutput(JSON.stringify(result))
      .setMimeType(ContentService.MimeType.JSON);
  }

  return ContentService
    .createTextOutput(JSON.stringify({ status: "error", message: "Unknown action" }))
    .setMimeType(ContentService.MimeType.JSON);
}

// POST 請求處理 (新增訂單 / 新增儲值紀錄)
function doPost(e) {
  try {
    var contents = JSON.parse(e.postData.contents);
    var action = contents.action;
    var ss = SpreadsheetApp.getActiveSpreadsheet();

    if (action === "submitOrder") {
      var username = contents.username;
      var totalPrice = contents.totalPrice || 0;
      var itemDetails = contents.itemDetails || "";
      var orderDate = contents.orderDate || Utilities.formatDate(new Date(), "GMT+8", "yyyy-MM-dd");
      var now = new Date();

      // 寫入 raw紀錄
      var rawSheet = ss.getSheetByName("raw紀錄") || ss.insertSheet("raw紀錄");
      rawSheet.appendRow([
        now,
        username,
        totalPrice,
        itemDetails,
        orderDate,
        "已確認"
      ]);

      return ContentService
        .createTextOutput(JSON.stringify({ status: "success", message: "Order logged successfully" }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    if (action === "addTopUp") {
      var username = contents.username;
      var amount = Number(contents.amount) || 0;
      var note = contents.note || "線上申請儲值";
      var status = contents.status || "未收款"; // 預設未收款，待管理員確認
      var now = new Date();

      var topUpSheet = ss.getSheetByName("累積儲值") || ss.insertSheet("累積儲值");
      topUpSheet.appendRow([
        now,
        username,
        amount,
        status,
        note
      ]);

      return ContentService
        .createTextOutput(JSON.stringify({ status: "success", message: "Top-up logged successfully" }))
        .setMimeType(ContentService.MimeType.JSON);
    }

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: "error", message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// --- 輔助函式區域 ---

// 1. 取得飲食規劃
function getScheduleData(ss) {
  var sheet = ss.getSheetByName("飲食規劃");
  if (!sheet) return [];

  var range = sheet.getDataRange();
  var data = range.getValues();
  if (data.length <= 1) return [];

  var richText = null;
  var formulas = null;
  try {
    richText = range.getRichTextValues();
    formulas = range.getFormulas();
  } catch (e) {
    // 降級防護
  }

  var schedule = [];
  for (var i = 1; i < data.length; i++) {
    var row = data[i];
    var rawDate = row[0];
    var restaurantName = row[1];
    var status = row[2] || "開放點餐";
    var note = row[3] || "";

    var formattedDate = "";
    if (rawDate instanceof Date) {
      formattedDate = Utilities.formatDate(rawDate, "GMT+8", "yyyy-MM-dd");
    } else if (rawDate) {
      var dateStr = String(rawDate).trim().replace(/\//g, '-');
      var parts = dateStr.split('-');
      if (parts.length === 3) {
        var y = parts[0];
        var m = String(parts[1]).padStart(2, '0');
        var d = String(parts[2]).padStart(2, '0');
        formattedDate = y + '-' + m + '-' + d;
      } else {
        formattedDate = dateStr;
      }
    }

    var groupOrderUrl = "";
    // 遍歷該列所有欄位 (支援純文字、Hyperlink公式、RichText超連結)
    for (var col = 0; col < row.length; col++) {
      // 1. 純文字與正則匹配
      var cellVal = String(row[col] || "").trim();
      var urlMatch = cellVal.match(/(https?:\/\/[^\s"'<>]+)/);
      if (urlMatch) {
        groupOrderUrl = urlMatch[0];
        break;
      }

      // 2. 檢查 RichText 內嵌超連結 (例如使用 Ctrl+K 設定的超連結)
      if (richText && richText[i] && richText[i][col]) {
        var link = richText[i][col].getLinkUrl();
        if (link && (link.indexOf("http://") === 0 || link.indexOf("https://") === 0)) {
          groupOrderUrl = link;
          break;
        }
      }

      // 3. 檢查 =HYPERLINK("...", "...") 公式
      if (formulas && formulas[i] && formulas[i][col]) {
        var formula = String(formulas[i][col]);
        var formulaMatch = formula.match(/HYPERLINK\s*\(\s*["'](https?:\/\/[^"']+)["']/i);
        if (formulaMatch) {
          groupOrderUrl = formulaMatch[1];
          break;
        }
      }
    }

    if (formattedDate && restaurantName) {
      schedule.push({
        date: formattedDate,
        restaurantName: String(restaurantName),
        status: String(status),
        note: String(note),
        groupOrderUrl: groupOrderUrl
      });
    }
  }
  return schedule;
}

// 根據日期比對飲食規劃中的餐廳
function getRestaurantForDate(schedule, reqDate) {
  var found = schedule.find(s => s.date === reqDate);
  if (found && found.restaurantName) {
    return found.restaurantName;
  }
  return "台大醫學院 - 杏園"; // 預設餐廳
}

// 2. 取得菜單資料 (根據餐廳名稱篩選)
function getMenuData(ss, targetRestaurant) {
  var sheet = ss.getSheetByName("餐廳清單");
  if (!sheet) return [];

  var data = sheet.getDataRange().getValues();
  if (data.length <= 1) return [];

  var menuList = [];
  for (var i = 1; i < data.length; i++) {
    var row = data[i];
    var restName = String(row[0]);
    var itemName = String(row[1]);
    var price = Number(row[2]) || 0;
    var category = String(row[3] || "飯類");
    var status = String(row[4] || "ON");

    // 若未指定餐廳或餐廳名稱相符，且狀態為 ON
    var matchesRest = (!targetRestaurant || restName.indexOf(targetRestaurant) !== -1 || targetRestaurant.indexOf(restName) !== -1);
    var isAvailable = (status === "ON" || status === "供應中" || status === "true" || status === "");

    if (matchesRest && itemName && isAvailable) {
      menuList.push({
        restaurantName: restName,
        name: itemName,
        price: price,
        category: category
      });
    }
  }

  // 若篩選後無品項，傳回所有供應中的品項
  if (menuList.length === 0) {
    for (var i = 1; i < data.length; i++) {
      var row = data[i];
      if (row[1] && (row[4] === "ON" || row[4] === "")) {
        menuList.push({
          restaurantName: String(row[0]),
          name: String(row[1]),
          price: Number(row[2]) || 0,
          category: String(row[3] || "飯類")
        });
      }
    }
  }

  return menuList;
}

// 3. 取得所有歷史訂單紀錄 (包含日期欄位)
function getAllOrders(ss) {
  var sheet = ss.getSheetByName("raw紀錄");
  if (!sheet) return [];

  var data = sheet.getDataRange().getValues();
  if (data.length <= 1) return [];

  var orders = [];
  for (var i = data.length - 1; i >= 1; i--) {
    var row = data[i];
    var rawTime = row[0];
    var username = row[1];
    var totalPrice = Number(row[2]) || 0;
    var itemDetails = String(row[3] || "");
    var dateCol = row[4];

    var formattedDate = "";
    if (dateCol) {
      if (dateCol instanceof Date) {
        formattedDate = Utilities.formatDate(dateCol, "GMT+8", "yyyy-MM-dd");
      } else {
        var dateStr = String(dateCol).trim().replace(/\//g, '-');
        var parts = dateStr.split('-');
        if (parts.length === 3) {
          formattedDate = parts[0] + '-' + String(parts[1]).padStart(2, '0') + '-' + String(parts[2]).padStart(2, '0');
        } else {
          formattedDate = dateStr;
        }
      }
    } else if (rawTime instanceof Date) {
      formattedDate = Utilities.formatDate(rawTime, "GMT+8", "yyyy-MM-dd");
    }

    if (username) {
      var parsedItems = parseDetailsToItems(itemDetails);
      var timeStr = rawTime instanceof Date ? Utilities.formatDate(rawTime, "GMT+8", "HH:mm") : "12:00";

      orders.push({
        id: "gas-" + i,
        timestamp: timeStr,
        date: formattedDate,
        username: String(username),
        totalPrice: totalPrice,
        items: parsedItems
      });
    }
  }
  return orders;
}

function getOrdersForDate(ss, reqDate) {
  var all = getAllOrders(ss);
  return all.filter(function(o) { return o.date === reqDate; });
}

function parseDetailsToItems(detailsStr) {
  var items = [];
  if (!detailsStr) return items;

  var parts = detailsStr.split(",");
  for (var i = 0; i < parts.length; i++) {
    var p = parts[i].trim();
    var match = p.match(/(.+) x(\d+)/);
    if (match) {
      items.push({
        name: match[1].trim(),
        qty: parseInt(match[2]),
        price: 0
      });
    } else {
      items.push({ name: p, qty: 1, price: 0 });
    }
  }
  return items;
}

// 4. 取得累積儲值紀錄
function getTopUpsData(ss) {
  var sheet = ss.getSheetByName("累積儲值");
  if (!sheet) return [];

  var data = sheet.getDataRange().getValues();
  if (data.length <= 1) return [];

  var topUps = [];
  for (var i = data.length - 1; i >= 1; i--) {
    var row = data[i];
    var rawTime = row[0];
    var username = row[1];
    var amount = Number(row[2]) || 0;
    var status = String(row[3] || "未收款");
    var note = String(row[4] || "");

    var timeStr = rawTime instanceof Date ? Utilities.formatDate(rawTime, "GMT+8", "yyyy-MM-dd HH:mm") : String(rawTime);

    if (username) {
      topUps.push({
        timestamp: timeStr,
        username: String(username),
        amount: amount,
        status: status,
        note: note
      });
    }
  }
  return topUps;
}

// 5. 動態計算金庫 (金庫現在餘額 = 累積儲值[已收款] - 累積消費)
function calculateTreasury(ss, topUpsData) {
  var treasuryMap = {}; // { username: { totalDeposit: 0, totalSpent: 0 } }

  // 計算已收款儲值
  topUpsData.forEach(function(t) {
    if (!treasuryMap[t.username]) {
      treasuryMap[t.username] = { totalDeposit: 0, totalSpent: 0 };
    }
    if (t.status === "已收款") {
      treasuryMap[t.username].totalDeposit += t.amount;
    }
  });

  // 計算累積消費 (從 raw紀錄)
  var rawSheet = ss.getSheetByName("raw紀錄");
  if (rawSheet) {
    var rawData = rawSheet.getDataRange().getValues();
    for (var i = 1; i < rawData.length; i++) {
      var uName = String(rawData[i][1]);
      var spent = Number(rawData[i][2]) || 0;
      if (uName) {
        if (!treasuryMap[uName]) {
          treasuryMap[uName] = { totalDeposit: 0, totalSpent: 0 };
        }
        treasuryMap[uName].totalSpent += spent;
      }
    }
  }

  // 整理成陣列並更新/同步試算表中的【金庫】頁面
  var treasuryList = [];
  var treasurySheet = ss.getSheetByName("金庫") || ss.insertSheet("金庫");
  
  // 保留原有 Header
  treasurySheet.clear();
  treasurySheet.appendRow(["姓名", "現在餘額", "累積儲值錢", "累積消費", "最後更新時間"]);

  var nowStr = Utilities.formatDate(new Date(), "GMT+8", "yyyy-MM-dd HH:mm:ss");
  
  Object.keys(treasuryMap).forEach(function(uName) {
    var dep = treasuryMap[uName].totalDeposit;
    var spe = treasuryMap[uName].totalSpent;
    var bal = dep - spe;

    treasuryList.push({
      username: uName,
      balance: bal,
      totalDeposit: dep,
      totalSpent: spe
    });

    treasurySheet.appendRow([uName, bal, dep, spe, nowStr]);
  });

  return treasuryList;
}

/**
 * 一鍵初始化 5 個工作表與範例資料 (請選取本函式並點選【執行】)
 */
function setupSheets() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();

  // 1. 初始化【餐廳清單】
  var rSheet = ss.getSheetByName("餐廳清單") || ss.insertSheet("餐廳清單");
  rSheet.clear();
  rSheet.appendRow(["餐廳名稱", "品項名稱", "單價", "分類", "供應狀態"]);
  
  var xingYuanItems = [
    ["台大醫學院 - 杏園", "菜飯", 60, "飯類", "ON"],
    ["台大醫學院 - 杏園", "酢醬飯", 65, "飯類", "ON"],
    ["台大醫學院 - 杏園", "咖哩飯", 90, "飯類", "ON"],
    ["台大醫學院 - 杏園", "燒肉飯", 90, "飯類", "ON"],
    ["台大醫學院 - 杏園", "照燒飯", 90, "飯類", "ON"],
    ["台大醫學院 - 杏園", "打拋豬飯", 90, "飯類", "ON"],
    ["台大醫學院 - 杏園", "宮保雞丁飯", 90, "飯類", "ON"],
    ["台大醫學院 - 杏園", "蒜泥白肉飯", 90, "飯類", "ON"],
    ["台大醫學院 - 杏園", "德式豬腳飯", 90, "飯類", "ON"],
    ["台大醫學院 - 杏園", "雙味飯 (任選兩種)", 90, "飯類", "ON"],
    ["台大醫學院 - 杏園", "泡菜豬肉飯", 95, "飯類", "ON"],
    ["台大醫學院 - 杏園", "雞肉飯", 100, "飯類", "ON"],
    ["台大醫學院 - 杏園", "東坡肉飯", 100, "飯類", "ON"],
    ["台大醫學院 - 杏園", "牛腩飯", 100, "飯類", "ON"],
    ["台大醫學院 - 杏園", "蒜香里肌飯", 100, "飯類", "ON"],
    ["台大醫學院 - 杏園", "油雞腿飯", 110, "飯類", "ON"],
    ["台大醫學院 - 杏園", "鹽烤雞腿飯", 110, "飯類", "ON"],
    ["台大醫學院 - 杏園", "壽喜牛肉飯", 110, "飯類", "ON"],
    ["台大醫學院 - 杏園", "椒麻雞腿飯", 130, "飯類", "ON"],

    ["台大醫學院 - 杏園", "乾麵 / 米粉", 45, "麵類", "ON"],
    ["台大醫學院 - 杏園", "擔擔麵 / 米粉 (乾/湯)", 55, "麵類", "ON"],
    ["台大醫學院 - 杏園", "牛肉湯麵 / 米粉", 55, "麵類", "ON"],
    ["台大醫學院 - 杏園", "酢醬麵 / 米粉", 60, "麵類", "ON"],
    ["台大醫學院 - 杏園", "肉羹麵 / 米粉", 60, "麵類", "ON"],
    ["台大醫學院 - 杏園", "大滷麵 / 米粉", 80, "麵類", "ON"],
    ["台大醫學院 - 杏園", "瘦皮麵 / 米粉 (乾/湯)", 80, "麵類", "ON"],
    ["台大醫學院 - 杏園", "牛肉麵 / 米粉", 100, "麵類", "ON"],
    ["台大醫學院 - 杏園", "三丸麵 / 米粉", 100, "麵類", "ON"],
    ["台大醫學院 - 杏園", "鮮貝丸麵", 100, "麵類", "ON"],
    ["台大醫學院 - 杏園", "西魯麵", 100, "麵類", "ON"],
    ["台大醫學院 - 杏園", "義式香菇花枝丸麵", 100, "麵類", "ON"],
    ["台大醫學院 - 杏園", "麻辣麵 / 米粉", 100, "麵類", "ON"],
    ["台大醫學院 - 杏園", "鮮蝦麵", 130, "麵類", "ON"],

    ["台大醫學院 - 杏園", "蘿蔔貢丸湯", 45, "湯類", "ON"],
    ["台大醫學院 - 杏園", "大滷湯", 50, "湯類", "ON"],

    // 示範其他日期的預約餐廳菜單
    ["公館特色便當", "招牌排骨便當", 95, "飯類", "ON"],
    ["公館特色便當", "酥炸雞腿便當", 105, "飯類", "ON"],
    ["公館特色便當", "紅燒牛腩便當", 110, "飯類", "ON"],

    ["二活精緻餐盒", "蒲燒鰻魚特餐", 160, "高級餐盒", "ON"],
    ["二活精緻餐盒", "鹽烤鮭魚排餐", 140, "高級餐盒", "ON"],
    ["二活精緻餐盒", "健康舒肥雞胸", 120, "健身餐", "ON"]
  ];

  rSheet.getRange(2, 1, xingYuanItems.length, 5).setValues(xingYuanItems);

  // 2. 初始化【飲食規劃】
  var todayStr = Utilities.formatDate(new Date(), "GMT+8", "yyyy-MM-dd");
  var d1 = new Date(); d1.setDate(d1.getDate() + 1);
  var tomorrowStr = Utilities.formatDate(d1, "GMT+8", "yyyy-MM-dd");
  var d2 = new Date(); d2.setDate(d2.getDate() + 2);
  var nextDayStr = Utilities.formatDate(d2, "GMT+8", "yyyy-MM-dd");

  var schedSheet = ss.getSheetByName("飲食規劃") || ss.insertSheet("飲食規劃");
  schedSheet.clear();
  schedSheet.appendRow(["日期", "餐廳名稱", "開放狀態", "備註", "團購連結"]);
  schedSheet.appendRow([todayStr, "台大醫學院 - 杏園", "開放點餐", "今日預設", ""]);
  schedSheet.appendRow([tomorrowStr, "Uber Eats 麥當勞團購", "開放點餐", "麥當勞團購專案", "https://www.ubereats.com"]);
  schedSheet.appendRow([nextDayStr, "二活精緻餐盒", "開放點餐", "後天預約", ""]);

  // 3. 初始化【累積儲值】
  var topUpSheet = ss.getSheetByName("累積儲值") || ss.insertSheet("累積儲值");
  topUpSheet.clear();
  topUpSheet.appendRow(["儲值時間", "姓名", "儲值金額", "收款狀態", "備註"]);
  topUpSheet.appendRow([todayStr + " 09:00", "小明", 1000, "已收款", "現金儲值"]);
  topUpSheet.appendRow([todayStr + " 09:15", "小華", 500, "已收款", "LINE Pay"]);
  topUpSheet.appendRow([todayStr + " 09:30", "老張", 1500, "已收款", "銀行轉帳"]);
  topUpSheet.appendRow([todayStr + " 10:00", "陳捷翐", 1000, "已收款", "現金儲值"]);
  topUpSheet.appendRow([todayStr + " 10:15", "小明", 500, "未收款", "待主管確認"]);

  // 4. 初始化【raw紀錄】
  var rawSheet = ss.getSheetByName("raw紀錄") || ss.insertSheet("raw紀錄");
  if (rawSheet.getLastRow() === 0) {
    rawSheet.appendRow(["送出時間", "姓名", "總金額", "點餐明細", "日期", "狀態"]);
    rawSheet.appendRow([todayStr + " 10:20", "小明", 175, "椒麻雞腿飯 x1, 蘿蔔貢丸湯 x1", todayStr, "已確認"]);
    rawSheet.appendRow([todayStr + " 10:30", "小華", 195, "椒麻雞腿飯 x1, 酢醬飯 x1", todayStr, "已確認"]);
    rawSheet.appendRow([todayStr + " 10:45", "老張", 100, "牛肉麵 / 米粉 x1", todayStr, "已確認"]);
  }

  // 5. 初始化【金庫】
  var tSheet = ss.getSheetByName("金庫") || ss.insertSheet("金庫");
  tSheet.clear();
  tSheet.appendRow(["姓名", "現在餘額", "累積儲值錢", "累積消費", "最後更新時間"]);

  Logger.log("✅ 已成功初始化 5 個工作表（餐廳清單、飲食規劃、累積儲值、raw紀錄、金庫）！");
}
