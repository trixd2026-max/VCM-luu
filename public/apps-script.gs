/*****************************************************************
 * Vuon Cua Mit - Webhook: don + tru ton + email + Telegram
 *
 * Script properties (tuy chon):
 *   ALERT_EMAIL
 *   TELEGRAM_BOT_TOKEN
 *   TELEGRAM_CHAT_ID
 *   NOTIFY_WEBHOOK_URL  (Make.com / n8n / SMS gateway)
 *****************************************************************/
var ALERT_EMAIL = "trixd2026@gmail.com";
var LOW_STOCK_THRESHOLD = 3;
var SHOP_NAME = "Vuon Cua Mit";

function doPost(e) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var data = JSON.parse(e.postData.contents);

  var orders = ss.getSheetByName("DonHang");
  if (!orders) {
    orders = ss.insertSheet("DonHang");
    orders.appendRow([
      "ThoiGian", "MaDon", "Ten", "DienThoai", "DiaChi",
      "GhiChu", "TongTien", "ChiTiet", "Loai"
    ]);
  }
  orders.appendRow([
    new Date(),
    data.orderId,
    data.name,
    data.phone,
    data.address,
    data.note,
    data.total,
    data.items,
    data.type
  ]);

  var alerts = [];
  try {
    if (data.itemsJson) {
      var lines = JSON.parse(data.itemsJson);
      var productSheet = findProductSheet_(ss);
      if (productSheet) {
        alerts = decrementStock_(productSheet, lines) || [];
      }
    }
  } catch (err) {}

  try {
    sendOrderNotify_(data);
  } catch (errN) {
    Logger.log("notify error: " + errN);
  }

  try {
    if (alerts.length > 0) {
      sendStockAlertEmail_(alerts, data.orderId || "");
    }
  } catch (err2) {}

  return ContentService
    .createTextOutput(JSON.stringify({ ok: true, alerts: alerts.length }))
    .setMimeType(ContentService.MimeType.JSON);
}

function sendOrderNotify_(data) {
  var orderId = data.orderId || "";
  var name = data.name || "";
  var phone = data.phone || "";
  var address = data.address || "";
  var note = data.note || "";
  var total = data.total || "";
  var items = data.items || "";
  var when = new Date().toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" });

  var text =
    "[" + SHOP_NAME + "] DON MOI " + orderId + "\n" +
    "Luc: " + when + "\n" +
    "Ten: " + name + "\n" +
    "SDT: " + phone + "\n" +
    (address ? "Dia chi: " + address + "\n" : "") +
    (note ? "Ghi chu: " + note + "\n" : "") +
    "Mon: " + items + "\n" +
    "Tong: " + total + "\n" +
    "-> Lien he khach / mo Sheet DonHang";

  var to = getAlertEmail_();
  if (to) {
    MailApp.sendEmail({
      to: to,
      subject: "[" + SHOP_NAME + "] Don moi " + orderId + " — " + phone,
      body: text
    });
  }

  sendTelegram_(text);
  sendNotifyWebhook_(data, text);
}

function prop_(key) {
  try {
    return PropertiesService.getScriptProperties().getProperty(key) || "";
  } catch (e) {
    return "";
  }
}

function sendTelegram_(text) {
  var token = prop_("TELEGRAM_BOT_TOKEN");
  var chatId = prop_("TELEGRAM_CHAT_ID");
  if (!token || !chatId) return;
  var url = "https://api.telegram.org/bot" + token + "/sendMessage";
  UrlFetchApp.fetch(url, {
    method: "post",
    contentType: "application/json",
    payload: JSON.stringify({
      chat_id: chatId,
      text: text,
      disable_web_page_preview: true
    }),
    muteHttpExceptions: true
  });
}

function sendNotifyWebhook_(data, text) {
  var hook = prop_("NOTIFY_WEBHOOK_URL");
  if (!hook) return;
  UrlFetchApp.fetch(hook, {
    method: "post",
    contentType: "application/json",
    payload: JSON.stringify({
      type: "new_order",
      shop: SHOP_NAME,
      text: text,
      order: data
    }),
    muteHttpExceptions: true
  });
}

function checkLowStockDaily() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = findProductSheet_(ss);
  if (!sheet) return;
  var alerts = scanLowStock_(sheet);
  if (alerts.length > 0) {
    sendStockAlertEmail_(alerts, "kiem tra dinh ky");
  }
}

function testSendAlertEmail() {
  var to = getAlertEmail_();
  Logger.log("ALERT_EMAIL = " + to);
  if (!to) throw new Error("Chua cau hinh ALERT_EMAIL");
  MailApp.sendEmail({
    to: to,
    subject: "[" + SHOP_NAME + "] Test canh bao — OK",
    body: "Test email OK.\nEmail: " + to + "\nQuota: " + MailApp.getRemainingDailyQuota()
  });
  Logger.log("Da gui test toi " + to);
}

function testTelegram() {
  sendTelegram_("[" + SHOP_NAME + "] Test Telegram — OK luc " + new Date().toLocaleString("vi-VN"));
  Logger.log("Da gui test Telegram");
}

function getAlertEmail_() {
  var prop = prop_("ALERT_EMAIL");
  if (prop && prop.indexOf("@") > 0) return prop.trim();
  if (ALERT_EMAIL && ALERT_EMAIL.indexOf("@") > 0) return ALERT_EMAIL.trim();
  try {
    return Session.getActiveUser().getEmail() || Session.getEffectiveUser().getEmail();
  } catch (e2) {
    return "";
  }
}

function findProductSheet_(ss) {
  var names = ["san-pham-vuon-cua-mit", "SanPham", "San pham", "sanpham"];
  for (var i = 0; i < names.length; i++) {
    var sh = ss.getSheetByName(names[i]);
    if (sh) return sh;
  }
  var sheets = ss.getSheets();
  for (var j = 0; j < sheets.length; j++) {
    var h = sheets[j].getRange(1, 1, 1, sheets[j].getLastColumn()).getValues()[0];
    var lower = h.map(function (x) {
      return String(x).toLowerCase().trim();
    });
    if (lower.indexOf("id") >= 0 && (lower.indexOf("ton_kho") >= 0 || lower.indexOf("con_hang") >= 0)) {
      return sheets[j];
    }
  }
  return null;
}

function normalizeHeader_(h) {
  return String(h).toLowerCase().trim().replace(/\s+/g, "_");
}

function decrementStock_(sheet, lines) {
  var lastCol = sheet.getLastColumn();
  var lastRow = sheet.getLastRow();
  if (lastRow < 2) return [];
  var headers = sheet.getRange(1, 1, 1, lastCol).getValues()[0].map(normalizeHeader_);
  var idCol = headers.indexOf("id");
  if (idCol < 0) idCol = headers.indexOf("ma");
  var nameCol = headers.indexOf("ten");
  if (nameCol < 0) nameCol = headers.indexOf("name");
  var stockCol = headers.indexOf("ton_kho");
  if (stockCol < 0) stockCol = headers.indexOf("tonkho");
  var inStockCol = headers.indexOf("con_hang");
  if (idCol < 0 || stockCol < 0) return [];

  var data = sheet.getRange(2, 1, lastRow - 1, lastCol).getValues();
  var idToRow = {};
  for (var r = 0; r < data.length; r++) {
    idToRow[String(data[r][idCol]).trim()] = r;
  }

  var alerts = [];
  var threshold = LOW_STOCK_THRESHOLD;

  for (var i = 0; i < lines.length; i++) {
    var line = lines[i];
    var pid = String(line.productId || "").trim();
    var qty = Number(line.qty) || 0;
    if (!pid || qty <= 0) continue;
    var idx = idToRow[pid];
    if (idx === undefined) continue;

    var cell = data[idx][stockCol];
    if (cell === "" || cell === null) continue;
    var cur = Number(cell);
    if (!isFinite(cur)) continue;
    var next = Math.max(0, cur - qty);
    data[idx][stockCol] = next;
    sheet.getRange(idx + 2, stockCol + 1).setValue(next);
    if (next <= 0 && inStockCol >= 0) {
      sheet.getRange(idx + 2, inStockCol + 1).setValue(0);
    }

    var pname = nameCol >= 0 ? String(data[idx][nameCol] || pid) : pid;
    if (next <= 0 && cur > 0) {
      alerts.push({ id: pid, name: pname, stock: 0, kind: "het", before: cur });
    } else if (next > 0 && next <= threshold && cur > threshold) {
      alerts.push({ id: pid, name: pname, stock: next, kind: "sap_het", before: cur });
    } else if (next > 0 && next <= threshold && cur <= threshold && next < cur) {
      alerts.push({ id: pid, name: pname, stock: next, kind: "sap_het", before: cur });
    }
  }
  return alerts;
}

function scanLowStock_(sheet) {
  var lastCol = sheet.getLastColumn();
  var lastRow = sheet.getLastRow();
  if (lastRow < 2) return [];
  var headers = sheet.getRange(1, 1, 1, lastCol).getValues()[0].map(normalizeHeader_);
  var idCol = headers.indexOf("id");
  if (idCol < 0) idCol = headers.indexOf("ma");
  var nameCol = headers.indexOf("ten");
  if (nameCol < 0) nameCol = headers.indexOf("name");
  var stockCol = headers.indexOf("ton_kho");
  if (stockCol < 0) stockCol = headers.indexOf("tonkho");
  if (idCol < 0 || stockCol < 0) return [];

  var data = sheet.getRange(2, 1, lastRow - 1, lastCol).getValues();
  var alerts = [];
  var threshold = LOW_STOCK_THRESHOLD;
  for (var r = 0; r < data.length; r++) {
    var cell = data[r][stockCol];
    if (cell === "" || cell === null) continue;
    var cur = Number(cell);
    if (!isFinite(cur)) continue;
    var pid = String(data[r][idCol]).trim();
    var pname = nameCol >= 0 ? String(data[r][nameCol] || pid) : pid;
    if (cur <= 0) {
      alerts.push({ id: pid, name: pname, stock: 0, kind: "het", before: cur });
    } else if (cur <= threshold) {
      alerts.push({ id: pid, name: pname, stock: cur, kind: "sap_het", before: cur });
    }
  }
  return alerts;
}

function sendStockAlertEmail_(alerts, context) {
  var to = getAlertEmail_();
  if (!to) return;

  var het = [];
  var sap = [];
  for (var i = 0; i < alerts.length; i++) {
    if (alerts[i].kind === "het") het.push(alerts[i]);
    else sap.push(alerts[i]);
  }

  var subjectParts = [];
  if (het.length) subjectParts.push(het.length + " het hang");
  if (sap.length) subjectParts.push(sap.length + " sap het");
  var subject = "[" + SHOP_NAME + "] Canh bao ton kho: " + subjectParts.join(", ");

  var bodyLines = [];
  bodyLines.push("Canh bao ton kho tu " + SHOP_NAME + ".");
  if (context) bodyLines.push("Ngu canh: " + context);
  bodyLines.push(
    "Thoi gian: " + new Date().toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" })
  );
  bodyLines.push("");
  if (het.length) {
    bodyLines.push("=== HET HANG ===");
    for (var h = 0; h < het.length; h++) {
      bodyLines.push(
        "- [" + het[h].id + "] " + het[h].name + " -> 0 (truoc: " + het[h].before + ")"
      );
    }
    bodyLines.push("");
  }
  if (sap.length) {
    bodyLines.push("=== SAP HET (<= " + LOW_STOCK_THRESHOLD + ") ===");
    for (var s = 0; s < sap.length; s++) {
      bodyLines.push(
        "- [" + sap[s].id + "] " + sap[s].name + " -> " + sap[s].stock + " (truoc: " + sap[s].before + ")"
      );
    }
  }

  var body = bodyLines.join("\n");
  MailApp.sendEmail({ to: to, subject: subject, body: body });
  try {
    sendTelegram_(subject + "\n\n" + body);
  } catch (e) {}
}
