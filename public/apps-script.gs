/*****************************************************************
 * Vuon Cua Mit - Webhook: don hang + tru ton + email
 *
 * - Ghi don vao tab DonHang (+ TrangThai)
 * - Cap nhat trang thai (action=updateStatus)
 * - Tru ton_kho, cap nhat con_hang
 * - Gui email don moi + canh bao ton kho
 *
 * Script properties (tuy chon): ALERT_EMAIL
 *****************************************************************/
var ALERT_EMAIL = "trixd2026@gmail.com";
var LOW_STOCK_THRESHOLD = 3;
var SHOP_NAME = "Vuon Cua Mit";

function findHeaderCol_(sheet, names) {
  var lastCol = Math.max(sheet.getLastColumn(), 1);
  var headers = sheet.getRange(1, 1, 1, lastCol).getValues()[0];
  for (var i = 0; i < headers.length; i++) {
    var h = String(headers[i] || "").toLowerCase().replace(/\s+/g, "");
    for (var j = 0; j < names.length; j++) {
      if (h === names[j]) return i;
    }
  }
  return -1;
}

function ensureOrderStatusColumn_(sheet) {
  var col = findHeaderCol_(sheet, ["trangthai", "status"]);
  if (col >= 0) return col;
  var lastCol = sheet.getLastColumn();
  if (lastCol < 1) {
    sheet.getRange(1, 1, 1, 10).setValues([[
      "ThoiGian", "MaDon", "Ten", "DienThoai", "DiaChi",
      "GhiChu", "TongTien", "ChiTiet", "Loai", "TrangThai"
    ]]);
    return 9;
  }
  sheet.getRange(1, lastCol + 1).setValue("TrangThai");
  return lastCol;
}

function updateOrderStatus_(sheet, orderId, status) {
  var statusCol = ensureOrderStatusColumn_(sheet);
  var idCol = findHeaderCol_(sheet, ["madon", "ma_don", "orderid", "order_id"]);
  if (idCol < 0) idCol = 1;
  var lastRow = sheet.getLastRow();
  if (lastRow < 2) return false;
  var ids = sheet.getRange(2, idCol + 1, lastRow, idCol + 1).getValues();
  var want = String(orderId || "").trim();
  for (var r = 0; r < ids.length; r++) {
    if (String(ids[r][0] || "").trim() === want) {
      sheet.getRange(r + 2, statusCol + 1).setValue(status);
      return true;
    }
  }
  return false;
}

function doPost(e) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var data = JSON.parse(e.postData.contents);

  if (data.action === "updateStatus") {
    var ordersUp = ss.getSheetByName("DonHang");
    if (!ordersUp) {
      return ContentService
        .createTextOutput(JSON.stringify({ ok: false, error: "Khong co tab DonHang" }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    var okUp = updateOrderStatus_(ordersUp, data.orderId, data.status || "Moi");
    return ContentService
      .createTextOutput(JSON.stringify({ ok: okUp }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  var orders = ss.getSheetByName("DonHang");
  if (!orders) {
    orders = ss.insertSheet("DonHang");
    orders.appendRow([
      "ThoiGian", "MaDon", "Ten", "DienThoai", "DiaChi",
      "GhiChu", "TongTien", "ChiTiet", "Loai", "TrangThai"
    ]);
  } else {
    ensureOrderStatusColumn_(orders);
  }

  var lastCol = Math.max(orders.getLastColumn(), 10);
  var headers = orders.getRange(1, 1, 1, lastCol).getValues()[0];
  var row = [];
  for (var c = 0; c < headers.length; c++) {
    var h = String(headers[c] || "").toLowerCase().replace(/\s+/g, "");
    if (h === "thoigian" || h === "thoi_gian" || h === "time") row.push(new Date());
    else if (h === "madon" || h === "ma_don" || h === "orderid" || h === "order_id") row.push(data.orderId || "");
    else if (h === "ten" || h === "name") row.push(data.name || "");
    else if (h === "dienthoai" || h === "dien_thoai" || h === "phone" || h === "sdt") row.push(data.phone || "");
    else if (h === "diachi" || h === "dia_chi" || h === "address") row.push(data.address || "");
    else if (h === "ghichu" || h === "ghi_chu" || h === "note") row.push(data.note || "");
    else if (h === "tongtien" || h === "tong_tien" || h === "total") row.push(data.total || "");
    else if (h === "chitiet" || h === "chi_tiet" || h === "items") row.push(data.items || "");
    else if (h === "loai" || h === "type") row.push(data.type || "");
    else if (h === "trangthai" || h === "status") row.push(data.status || "Moi");
    else row.push("");
  }
  if (row.length === 0) {
    orders.appendRow([
      new Date(), data.orderId, data.name, data.phone, data.address,
      data.note, data.total, data.items, data.type, data.status || "Moi"
    ]);
  } else {
    orders.appendRow(row);
  }

  var alerts = [];
  try {
    if (data.itemsJson) {
      var lines = JSON.parse(data.itemsJson);
      var productSheet = findProductSheet_(ss);
      if (productSheet) {
        alerts = decrementStock_(productSheet, lines) || [];
      }
    }
  } catch (err) {
    Logger.log("stock error: " + err);
  }

  try {
    sendOrderEmail_(data);
  } catch (errN) {
    Logger.log("order email error: " + errN);
  }

  try {
    if (alerts.length > 0) {
      sendStockAlertEmail_(alerts, data.orderId || "");
    }
  } catch (err2) {
    Logger.log("stock email error: " + err2);
  }

  return ContentService
    .createTextOutput(JSON.stringify({ ok: true, alerts: alerts.length }))
    .setMimeType(ContentService.MimeType.JSON);
}

function sendOrderEmail_(data) {
  var to = getAlertEmail_();
  if (!to) return;
  var orderId = data.orderId || "";
  var name = data.name || "";
  var phone = data.phone || "";
  var address = data.address || "";
  var note = data.note || "";
  var total = data.total || "";
  var items = data.items || "";
  var when = new Date().toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" });
  var body =
    "[" + SHOP_NAME + "] DON MOI " + orderId + "\n" +
    "Luc: " + when + "\n" +
    "Ten: " + name + "\n" +
    "SDT: " + phone + "\n" +
    (address ? "Dia chi: " + address + "\n" : "") +
    (note ? "Ghi chu: " + note + "\n" : "") +
    "Mon: " + items + "\n" +
    "Tong: " + total + "\n" +
    "Trang thai: Moi\n" +
    "-> Lien he khach / mo Sheet tab DonHang";
  MailApp.sendEmail({
    to: to,
    subject: "[" + SHOP_NAME + "] Don moi " + orderId + " — " + phone,
    body: body
  });
}

function checkLowStockDaily() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = findProductSheet_(ss);
  if (!sheet) return;
  var alerts = scanLowStock_(sheet);
  if (alerts.length > 0) sendStockAlertEmail_(alerts, "kiem tra dinh ky");
}

function testSendAlertEmail() {
  var to = getAlertEmail_();
  if (!to) throw new Error("Chua cau hinh ALERT_EMAIL");
  MailApp.sendEmail({
    to: to,
    subject: "[" + SHOP_NAME + "] Test email — OK",
    body: "Test Apps Script.\nEmail: " + to + "\nQuota: " + MailApp.getRemainingDailyQuota()
  });
}

function getAlertEmail_() {
  try {
    var prop = PropertiesService.getScriptProperties().getProperty("ALERT_EMAIL");
    if (prop && String(prop).indexOf("@") > 0) return String(prop).trim();
  } catch (e) {}
  if (ALERT_EMAIL && ALERT_EMAIL.indexOf("@") > 0) return ALERT_EMAIL.trim();
  try {
    return Session.getActiveUser().getEmail() || Session.getEffectiveUser().getEmail() || "";
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
    var lastCol = sheets[j].getLastColumn();
    if (lastCol < 1) continue;
    var h = sheets[j].getRange(1, 1, 1, lastCol).getValues()[0];
    var lower = h.map(function (x) { return String(x).toLowerCase().trim(); });
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
    if (next <= 0 && inStockCol >= 0) sheet.getRange(idx + 2, inStockCol + 1).setValue(0);
    var pname = nameCol >= 0 ? String(data[idx][nameCol] || pid) : pid;
    if (next <= 0 && cur > 0) alerts.push({ id: pid, name: pname, stock: 0, kind: "het", before: cur });
    else if (next > 0 && next <= threshold && cur > threshold) alerts.push({ id: pid, name: pname, stock: next, kind: "sap_het", before: cur });
    else if (next > 0 && next <= threshold && cur <= threshold && next < cur) alerts.push({ id: pid, name: pname, stock: next, kind: "sap_het", before: cur });
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
    if (cur <= 0) alerts.push({ id: pid, name: pname, stock: 0, kind: "het", before: cur });
    else if (cur <= threshold) alerts.push({ id: pid, name: pname, stock: cur, kind: "sap_het", before: cur });
  }
  return alerts;
}

function sendStockAlertEmail_(alerts, context) {
  var to = getAlertEmail_();
  if (!to) return;
  var het = [], sap = [];
  for (var i = 0; i < alerts.length; i++) {
    if (alerts[i].kind === "het") het.push(alerts[i]);
    else sap.push(alerts[i]);
  }
  var subjectParts = [];
  if (het.length) subjectParts.push(het.length + " het hang");
  if (sap.length) subjectParts.push(sap.length + " sap het");
  var subject = "[" + SHOP_NAME + "] Canh bao ton kho: " + subjectParts.join(", ");
  var bodyLines = ["Canh bao ton kho tu " + SHOP_NAME + "."];
  if (context) bodyLines.push("Ngu canh: " + context);
  bodyLines.push("Thoi gian: " + new Date().toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" }));
  bodyLines.push("");
  if (het.length) {
    bodyLines.push("=== HET HANG ===");
    for (var h = 0; h < het.length; h++) {
      bodyLines.push("- [" + het[h].id + "] " + het[h].name + " -> 0 (truoc: " + het[h].before + ")");
    }
    bodyLines.push("");
  }
  if (sap.length) {
    bodyLines.push("=== SAP HET (<= " + LOW_STOCK_THRESHOLD + ") ===");
    for (var s = 0; s < sap.length; s++) {
      bodyLines.push("- [" + sap[s].id + "] " + sap[s].name + " -> " + sap[s].stock + " (truoc: " + sap[s].before + ")");
    }
  }
  MailApp.sendEmail({ to: to, subject: subject, body: bodyLines.join("\n") });
}
