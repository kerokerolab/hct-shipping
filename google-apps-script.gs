/**
 * 新竹物流數位託運單 - 公司多同仁集中報帳 & 每月自動對帳後端 (Google Apps Script)
 * (100% 相容 Google Apps Script V8 與舊版 Rhino 語法)
 */

var RECORD_SHEET_NAME = '託運報帳明細';

var RECORD_HEADERS = [
  '最後更新時間',
  '託運單號',
  '契約客代',
  '寄件類別',
  '貨件溫層',
  '商品種類',
  '件數',
  '品名(內容物)',
  '寄件人姓名/公司(同仁)',
  '寄件人電話',
  '寄件人分機',
  '寄件人完整地址',
  '收件人姓名/公司',
  '收件人電話',
  '收件人分機',
  '配送方式',
  '收件郵遞區號',
  '收件縣市',
  '收件鄉鎮市區',
  '收件路名',
  '收件門牌地址',
  '收件人完整地址',
  '代收貨款金額',
  '貨刷',
  '報值金額',
  '回單',
  '希望送達日',
  '備註',
  '新竹物流送出狀態',
  '原始QR網址',
  '送件者LINE_ID',
  '送件者LINE名稱',
  '對帳狀態',
  '請款書號碼',
  '物流發送日',
  '物流請款件數',
  '物流總重量KG',
  '物流請款金額'
];

function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('📊 新竹物流對帳')
    .addItem('📤 上傳每月對帳單 (.xlsx) 自動核對', 'openReconcileDialog')
    .addSeparator()
    .addItem('🔄 檢查/初始化「託運報帳明細」表頭', 'getOrInitRecordSheet')
    .addToUi();
}

function openReconcileDialog() {
  var html = HtmlService.createHtmlOutput(getReconcileModalHtml())
    .setWidth(520)
    .setHeight(380)
    .setTitle('📊 新竹物流每月對帳單 (.xlsx) 自動核對');
  SpreadsheetApp.getUi().showModalDialog(html, '📊 新竹物流每月對帳單 (.xlsx) 自動核對');
}

function getReconcileModalHtml() {
  var lines = [
    '<!DOCTYPE html>',
    '<html>',
    '<head>',
    '<meta charset="utf-8">',
    '<script src="https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js"><\/script>',
    '<style>',
    'body { font-family: -apple-system, BlinkMacSystemFont, "Microsoft JhengHei", sans-serif; padding: 16px; color: #0f172a; margin: 0; }',
    '.drop-zone { border: 2px dashed #0284c7; background: #f0f9ff; border-radius: 12px; padding: 28px 16px; text-align: center; cursor: pointer; }',
    '.drop-zone:hover { background: #e0f2fe; }',
    '.btn { background: #0284c7; color: #fff; border: none; padding: 10px 18px; border-radius: 8px; font-size: 14px; font-weight: 600; cursor: pointer; margin-top: 12px; width: 100%; }',
    '.btn:disabled { opacity: 0.5; cursor: not-allowed; }',
    '#status { margin-top: 14px; font-size: 13px; line-height: 1.5; padding: 10px; border-radius: 8px; display: none; }',
    '.ok { background: #dcfce7; color: #166534; display: block !important; }',
    '.err { background: #fee2e2; color: #b91c1c; display: block !important; }',
    '.info { background: #f1f5f9; color: #334155; display: block !important; }',
    '</style>',
    '</head>',
    '<body>',
    '<div class="drop-zone" onclick="document.getElementById(\'fileInput\').click()">',
    '  <div style="font-size: 32px; margin-bottom: 8px;">📗</div>',
    '  <div style="font-weight: 700; font-size: 15px;" id="fileLabel">點擊選擇新竹物流每月對帳 Excel 檔 (.xlsx)</div>',
    '  <div style="font-size: 12px; color: #64748b; margin-top: 4px;">例如：6109812077 1174.xlsx</div>',
    '  <input type="file" id="fileInput" accept=".xlsx,.xls,.csv" style="display:none" onchange="onFileSelected(event)" />',
    '</div>',
    '<button class="btn" id="runBtn" onclick="startReconcile()" disabled>🚀 開始自動對帳並產出報表分頁</button>',
    '<div id="status"></div>',
    '<script>',
    'var parsedRows = [];',
    'function onFileSelected(e) {',
    '  var file = e.target.files[0];',
    '  if (!file) return;',
    '  document.getElementById("fileLabel").textContent = "已選擇：" + file.name;',
    '  var st = document.getElementById("status");',
    '  st.className = "info";',
    '  st.textContent = "正在讀取 Excel 檔案內容...";',
    '  var reader = new FileReader();',
    '  reader.onload = function(evt) {',
    '    try {',
    '      var data = new Uint8Array(evt.target.result);',
    '      var wb = XLSX.read(data, { type: "array" });',
    '      var firstSheet = wb.Sheets[wb.SheetNames[0]];',
    '      parsedRows = XLSX.utils.sheet_to_json(firstSheet, { defval: "" });',
    '      st.className = "info";',
    '      st.textContent = "✅ 成功讀取 " + parsedRows.length + " 筆物流請款明細，請點擊下方按鈕開始對帳！";',
    '      document.getElementById("runBtn").disabled = false;',
    '    } catch (err) {',
    '      st.className = "err";',
    '      st.textContent = "讀取 Excel 失敗：" + err.message;',
    '    }',
    '  };',
    '  reader.readAsArrayBuffer(file);',
    '}',
    'function startReconcile() {',
    '  if (!parsedRows.length) return;',
    '  var btn = document.getElementById("runBtn");',
    '  var st = document.getElementById("status");',
    '  btn.disabled = true;',
    '  st.className = "info";',
    '  st.textContent = "⏳ 正在比對「託運報帳明細」並建立對帳工作表，請稍候...";',
    '  google.script.run',
    '    .withSuccessHandler(function(res) {',
    '      if (res && res.ok) {',
    '        st.className = "ok";',
    '        st.innerHTML = "🎉 <strong>對帳完成！</strong>已自動建立分頁「<strong>" + res.sheetName + "</strong>」並回填主表：<br/>" +',
    '          "・請款總筆數：" + res.summary.totalCount + " 筆（共 NT$ " + res.summary.totalAmount.toLocaleString() + "）<br/>" +',
    '          "・✅ 已核對相符：" + res.summary.matchedCount + " 筆｜⚠️ 件數差異：" + res.summary.diffCount + " 筆<br/>" +',
    '          "・❓ 未登錄(到付件)：" + res.summary.unrecordedCodCount + " 筆｜❌ 未登錄(元付件)：" + res.summary.unrecordedPrepaidCount + " 筆";',
    '      } else {',
    '        st.className = "err";',
    '        st.textContent = "對帳失敗：" + (res && res.error ? res.error : "未知錯誤");',
    '        btn.disabled = false;',
    '      }',
    '    })',
    '    .withFailureHandler(function(err) {',
    '      st.className = "err";',
    '      st.textContent = "執行錯誤：" + err.message;',
    '      btn.disabled = false;',
    '    })',
    '    .reconcileMonthlyBill(parsedRows);',
    '}',
    '<\/script>',
    '</body>',
    '</html>'
  ];
  return lines.join('\n');
}

function jsonResponse(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(
    ContentService.MimeType.JSON
  );
}

function getOrInitRecordSheet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(RECORD_SHEET_NAME);
  if (!sheet) {
    var firstSheet = ss.getSheets()[0];
    if (firstSheet && firstSheet.getLastRow() === 0) {
      firstSheet.setName(RECORD_SHEET_NAME);
      sheet = firstSheet;
    } else {
      sheet = ss.insertSheet(RECORD_SHEET_NAME);
    }
  }
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(RECORD_HEADERS);
    sheet.setFrozenRows(1);
    sheet.getRange(1, 1, 1, RECORD_HEADERS.length).setFontWeight('bold').setBackground('#e0f2fe');
  } else {
    var currentLastCol = sheet.getLastColumn();
    if (currentLastCol < RECORD_HEADERS.length) {
      sheet.getRange(1, 1, 1, RECORD_HEADERS.length).setValues([RECORD_HEADERS]);
      sheet.getRange(1, 1, 1, RECORD_HEADERS.length).setFontWeight('bold').setBackground('#e0f2fe');
    }
  }
  return sheet;
}

function doGet() {
  var sheet = getOrInitRecordSheet();
  return jsonResponse({
    ok: true,
    message: '新竹物流託運單集中報帳暨對帳 GAS 後端運作正常',
    sheetName: sheet.getName()
  });
}

function doPost(e) {
  try {
    var sheet = getOrInitRecordSheet();
    var body = JSON.parse(e.postData.contents || '{}');
    var action = body.action || '';

    if (action === 'ping' || action === 'init-sync') {
      return jsonResponse({ ok: true, message: '連線成功，已準備好寫入「託運報帳明細」工作表' });
    }

    if (action === 'cust-data') {
      var cleanId = String(body.custId || '').replace(/\D/g, '');
      if (cleanId.length !== 11) {
        return jsonResponse({ ok: false, error: '契約客代必須為 11 碼數字' });
      }
      var custRes = hctPostForm('/BookingNote/HCTCloud/GetCustData', { custId: cleanId });
      if (custRes && custRes.cloudflareBlocked) {
        return jsonResponse({
          ok: true,
          cloudflareBlocked: true,
          data: { Result: 'Success', Cust_Available: 'Y' }
        });
      }
      return jsonResponse({ ok: true, data: custRes });
    }

    if (action === 'inspect-qr') {
      return jsonResponse(handleInspectQr(body.qrText || ''));
    }

    if (action === 'roads') {
      var roads = hctPostForm('/BookingNote/HCTCloud/Get_Road_strJson', {
        country: body.country || '',
        city: body.city || ''
      });
      var zip = hctPostForm('/BookingNote/HCTCloud/Get_Zip_strJson', {
        country: body.country || '',
        city: body.city || ''
      });
      return jsonResponse({
        ok: true,
        roads: Array.isArray(roads) ? roads : [],
        zip: typeof zip === 'string' ? zip : ''
      });
    }

    if (action === 'product-types') {
      var pTypes = hctPostForm('/BookingNote/HCTCloud/Get_InvoiceKind_strJson', {
        colGroup: body.goodsType || '001'
      });
      return jsonResponse({ ok: true, data: Array.isArray(pTypes) ? pTypes : [] });
    }

    if (action === 'to-stno') {
      var stnos = hctPostForm('/BookingNote/HCTCloud/Get_ToStno_strJson', {
        country: body.country || '',
        goodsType: body.goodsType || '001'
      });
      return jsonResponse({ ok: true, data: Array.isArray(stnos) ? stnos : [] });
    }

    if (action === 'rely-fee') {
      var rFee = hctPostForm('/BookingNote/HCTCloud/GetRelyFee', { address: body.address || '' });
      return jsonResponse({ ok: true, data: rFee });
    }

    if (action === 'reconcile') {
      var result = reconcileMonthlyBill(body.billRows || []);
      return jsonResponse(result);
    }

    if (action === 'append' || action === 'test') {
      var r = body.record || {};
      var mode = upsertRecordRow(sheet, r);
      return jsonResponse({
        ok: true,
        status: 'Success',
        savedToSheet: true,
        upsertMode: mode,
        record: r
      });
    }

    if (action === 'submit') {
      if (body.record && !body.form) {
        var modeRec = upsertRecordRow(sheet, body.record);
        return jsonResponse({
          ok: true,
          status: 'Success',
          savedToSheet: true,
          upsertMode: modeRec,
          record: body.record
        });
      }
      return jsonResponse(handleDirectSubmitFromStaticPage(sheet, body));
    }

    return jsonResponse({ ok: false, error: '未知的 action: ' + action });
  } catch (err) {
    return jsonResponse({ ok: false, error: err.toString() });
  }
}

function reconcileMonthlyBill(billRows) {
  if (!billRows || !billRows.length) {
    return { ok: false, error: '對帳單內容為空或格式不正確' };
  }

  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var recSheet = getOrInitRecordSheet();
  var recLastRow = recSheet.getLastRow();

  var systemMap = {};
  if (recLastRow >= 2) {
    var recValues = recSheet.getRange(2, 1, recLastRow - 1, RECORD_HEADERS.length).getDisplayValues();
    for (var i = 0; i < recValues.length; i++) {
      var row = recValues[i];
      var inv = String(row[1] || '').replace(/\D/g, '');
      if (inv) {
        systemMap[inv] = {
          sheetRowIndex: i + 2,
          invoice: inv,
          count: parseInt(String(row[6] || '1').replace(/\D/g, ''), 10) || 1,
          content: row[7],
          senderName: row[8],
          senderPhone: row[9],
          senderExt: row[10],
          recipientName: row[12],
          recipientPhone: row[13],
          recipientFullAddr: row[21],
          remark: row[27]
        };
      }
    }
  }

  var billingNo = '';
  var reconciledItems = [];
  var colleagueStats = {};

  var matchedCount = 0;
  var matchedAmount = 0;
  var diffCount = 0;
  var diffAmount = 0;
  var unrecordedCodCount = 0;
  var unrecordedCodAmount = 0;
  var unrecordedPrepaidCount = 0;
  var unrecordedPrepaidAmount = 0;
  var totalAmount = 0;

  for (var j = 0; j < billRows.length; j++) {
    var b = billRows[j];
    var billInvoice = String(b['明細表號'] || '').replace(/\D/g, '');
    if (!billInvoice) continue;

    var shipDate = String(b['發送日'] || '').trim();
    var billType = String(b['明細表種類'] || '').trim();
    var fromStation = String(b['發送站'] || '').trim();
    var toStation = String(b['到著站'] || '').trim();
    var billSender = String(b['出貨人'] || '').trim();
    var billRecipient = String(b['收貨人'] || '').trim();
    var billBoxes = parseInt(String(b['總件數'] || '0').replace(/\D/g, ''), 10) || 0;
    var billWeight = parseFloat(String(b['總重量KG'] || '0')) || 0;
    var baseFee = parseFloat(String(b['本款'] || '0')) || 0;
    var specialFee = parseFloat(String(b['特服費'] || '0')) || 0;
    var relyFee = parseFloat(String(b['聯運費'] || '0')) || 0;
    var extraFee = parseFloat(String(b['附加費用'] || '0')) || 0;
    var billAmount = parseFloat(String(b['請款金額'] || '0')) || 0;
    var currBillingNo = String(b['請款書號碼'] || '').trim();
    var lengthSpec = String(b['總長規格'] || '').trim();

    if (currBillingNo && !billingNo) {
      billingNo = currBillingNo;
    }

    totalAmount += billAmount;
    var sys = systemMap[billInvoice];

    var statusText = '';
    var statusType = '';
    var colleagueKey = '';

    if (sys) {
      if (sys.count === billBoxes) {
        statusText = '✅ 已核對相符';
        statusType = 'matched';
        matchedCount++;
        matchedAmount += billAmount;
      } else {
        statusText = '⚠️ 件數差異(申報' + sys.count + '/請款' + billBoxes + ')';
        statusType = 'diff';
        diffCount++;
        diffAmount += billAmount;
      }
      colleagueKey = sys.senderName || '未填名同仁';

      recSheet
        .getRange(sys.sheetRowIndex, 33, 1, 6)
        .setValues([[statusText, "'" + currBillingNo, shipDate, billBoxes, billWeight, billAmount]]);

      var statusCell = recSheet.getRange(sys.sheetRowIndex, 33);
      if (statusType === 'matched') {
        statusCell.setBackground('#dcfce7').setFontColor('#166534').setFontWeight('bold');
      } else {
        statusCell.setBackground('#fef3c7').setFontColor('#92400e').setFontWeight('bold');
      }
    } else {
      if (billType.indexOf('到付') !== -1 || String(b['明細表傳票種類']) === '21') {
        statusText = '❓ 未登錄(到付件)';
        statusType = 'cod';
        unrecordedCodCount++;
        unrecordedCodAmount += billAmount;
        colleagueKey = '[未登錄] 到付件(外站/廠商寄回)';
      } else {
        statusText = '❌ 未登錄(元付件)';
        statusType = 'unrecorded';
        unrecordedPrepaidCount++;
        unrecordedPrepaidAmount += billAmount;
        colleagueKey = '[未登錄] 元付件(手寫單/漏登)';
      }
    }

    if (!colleagueStats[colleagueKey]) {
      colleagueStats[colleagueKey] = { count: 0, boxes: 0, amount: 0 };
    }
    colleagueStats[colleagueKey].count += 1;
    colleagueStats[colleagueKey].boxes += billBoxes;
    colleagueStats[colleagueKey].amount += billAmount;

    reconciledItems.push({
      statusText: statusText,
      statusType: statusType,
      shipDate: shipDate,
      billInvoice: billInvoice,
      billType: billType,
      billAmount: billAmount,
      sysSender: sys ? sys.senderName : '',
      sysSenderExt: sys ? (sys.senderExt ? sys.senderPhone + '#' + sys.senderExt : sys.senderPhone) : '',
      sysContent: sys ? sys.content : '',
      sysRemark: sys ? sys.remark : '',
      sysCount: sys ? sys.count : '',
      billBoxes: billBoxes,
      billWeight: billWeight,
      lengthSpec: lengthSpec,
      stationRoute: fromStation + ' ➔ ' + toStation,
      billSender: billSender,
      billRecipient: billRecipient,
      sysRecipientName: sys ? sys.recipientName : '',
      sysRecipientPhone: sys ? sys.recipientPhone : '',
      sysRecipientAddr: sys ? sys.recipientFullAddr : '',
      baseFee: baseFee,
      specialFee: specialFee,
      relyFee: relyFee,
      extraFee: extraFee,
      billingNo: currBillingNo
    });
  }

  var reportSheetName = '對帳_' + (billingNo || Utilities.formatDate(new Date(), 'Asia/Taipei', 'yyyyMM'));
  var repSheet = ss.getSheetByName(reportSheetName);
  if (!repSheet) {
    repSheet = ss.insertSheet(reportSheetName);
  } else {
    repSheet.clear();
  }

  var summaryRows = [
    ['📊 新竹物流每月對帳總覽', '請款書號碼：' + (billingNo || '未提供'), '對帳時間：' + Utilities.formatDate(new Date(), 'Asia/Taipei', 'yyyy/MM/dd HH:mm'), ''],
    ['核對分類項目', '筆數', '請款金額小計 (NT$)', '說明'],
    ['✅ 已核對相符', matchedCount, matchedAmount, '系統有紀錄且件數完全相符'],
    ['⚠️ 件數差異', diffCount, diffAmount, '系統有紀錄但申報件數與帳單不同'],
    ['❓ 未登錄 (到付件)', unrecordedCodCount, unrecordedCodAmount, '外站或廠商寄回公司由公司付費之到付件'],
    ['❌ 未登錄 (元付件)', unrecordedPrepaidCount, unrecordedPrepaidAmount, '傳統紙本四聯單或同仁漏掃碼登錄之寄件'],
    ['💰 本期帳單總計', reconciledItems.length, totalAmount, '與新竹物流請款書總額勾稽']
  ];
  repSheet.getRange(1, 1, summaryRows.length, 4).setValues(summaryRows);
  repSheet.getRange(1, 1, 1, 4).setFontWeight('bold').setBackground('#0284c7').setFontColor('#ffffff');
  repSheet.getRange(2, 1, 1, 4).setFontWeight('bold').setBackground('#e0f2fe');
  repSheet.getRange(7, 1, 1, 4).setFontWeight('bold').setBackground('#f1f5f9');

  var colleagueKeys = Object.keys(colleagueStats);
  var colleagueEntries = [];
  for (var k = 0; k < colleagueKeys.length; k++) {
    var keyName = colleagueKeys[k];
    colleagueEntries.push([
      keyName,
      colleagueStats[keyName].count,
      colleagueStats[keyName].boxes,
      colleagueStats[keyName].amount
    ]);
  }
  var colleagueTable = [
    ['👥 依寄件人(同仁)運費分攤小計', '', '', ''],
    ['寄件人姓名/公司(同仁) 或 分類', '寄件筆數', '總件數', '運費小計 (NT$)']
  ].concat(colleagueEntries);

  repSheet.getRange(1, 6, colleagueTable.length, 4).setValues(colleagueTable);
  repSheet.getRange(1, 6, 1, 4).setFontWeight('bold').setBackground('#0369a1').setFontColor('#ffffff');
  repSheet.getRange(2, 6, 1, 4).setFontWeight('bold').setBackground('#e0f2fe');

  var detailStartRow = Math.max(summaryRows.length, colleagueTable.length) + 3;
  var detailHeaders = [
    '核對狀態',
    '發送日',
    '明細表號(託運單號)',
    '帳單種類',
    '請款金額(NT$)',
    '系統-寄件人(同仁)',
    '系統-寄件電話/分機',
    '系統-品名(內容物)',
    '系統-備註(報帳用途)',
    '系統申報件數',
    '帳單請款件數',
    '帳單重量(KG)',
    '總長規格',
    '站所路線',
    '帳單出貨人(截斷)',
    '帳單收貨人(截斷)',
    '系統-完整收件人',
    '系統-收件電話',
    '系統-完整收件地址',
    '本款',
    '特服費',
    '聯運費',
    '附加費',
    '請款書號碼'
  ];

  repSheet.getRange(detailStartRow, 1, 1, detailHeaders.length).setValues([detailHeaders]);
  repSheet
    .getRange(detailStartRow, 1, 1, detailHeaders.length)
    .setFontWeight('bold')
    .setBackground('#1e293b')
    .setFontColor('#ffffff');

  if (reconciledItems.length > 0) {
    var detailRows = [];
    var bgColors = [];
    var fontColors = [];

    for (var m = 0; m < reconciledItems.length; m++) {
      var item = reconciledItems[m];
      detailRows.push([
        item.statusText,
        item.shipDate,
        "'" + item.billInvoice,
        item.billType,
        item.billAmount,
        item.sysSender,
        "'" + item.sysSenderExt,
        item.sysContent,
        item.sysRemark,
        item.sysCount,
        item.billBoxes,
        item.billWeight,
        item.lengthSpec,
        item.stationRoute,
        item.billSender,
        item.billRecipient,
        item.sysRecipientName,
        "'" + item.sysRecipientPhone,
        item.sysRecipientAddr,
        item.baseFee,
        item.specialFee,
        item.relyFee,
        item.extraFee,
        "'" + item.billingNo
      ]);

      if (item.statusType === 'matched') {
        bgColors.push(['#dcfce7']);
        fontColors.push(['#166534']);
      } else if (item.statusType === 'diff') {
        bgColors.push(['#fef3c7']);
        fontColors.push(['#9a3412']);
      } else if (item.statusType === 'cod') {
        bgColors.push(['#ffedd5']);
        fontColors.push(['#9a3412']);
      } else {
        bgColors.push(['#fee2e2']);
        fontColors.push(['#b91c1c']);
      }
    }

    repSheet
      .getRange(detailStartRow + 1, 1, detailRows.length, detailHeaders.length)
      .setValues(detailRows);

    var statusRange = repSheet.getRange(detailStartRow + 1, 1, detailRows.length, 1);
    statusRange.setBackgrounds(bgColors).setFontColors(fontColors).setFontWeight('bold');
  }

  repSheet.setFrozenRows(detailStartRow);
  ss.setActiveSheet(repSheet);

  return {
    ok: true,
    sheetName: reportSheetName,
    summary: {
      billingNo: billingNo,
      totalCount: reconciledItems.length,
      totalAmount: totalAmount,
      matchedCount: matchedCount,
      matchedAmount: matchedAmount,
      diffCount: diffCount,
      diffAmount: diffAmount,
      unrecordedCodCount: unrecordedCodCount,
      unrecordedCodAmount: unrecordedCodAmount,
      unrecordedPrepaidCount: unrecordedPrepaidCount,
      unrecordedPrepaidAmount: unrecordedPrepaidAmount
    }
  };
}

function upsertRecordRow(sheet, r) {
  var rowValues = [
    r.createdAt || Utilities.formatDate(new Date(), 'Asia/Taipei', 'yyyy/MM/dd HH:mm:ss'),
    "'" + (r.Invoice || ''),
    "'" + (r.CustID_Value || ''),
    r.Send_Type_Text || '',
    r.Goods_Type_Text || '',
    r.ProductType_Text || '',
    r.Count || '1',
    r.Content || '',
    r.Sender_Name || '',
    "'" + (r.Sender_Phone || ''),
    "'" + (r.Sender_Ext || ''),
    r.Sender_FullAddress || '',
    r.Recipient_Name || '',
    "'" + (r.Recipient_Phone || ''),
    "'" + (r.Recipient_Ext || ''),
    r.DeliveryType_Text || '',
    "'" + (r.Recipient_zip || ''),
    r.Recipient_Country || '',
    r.Recipient_City || '',
    r.Recipient_Road || '',
    r.Recipient_Address || '',
    r.Recipient_FullAddress || '',
    r.Money || '',
    r.CreditCard_Text || '否',
    r.ValueDeclared || '',
    r.Replay_Text || '否',
    r.Date || '',
    r.Remark || '',
    r.hctStatus || '',
    r.qrUrl || '',
    r.Line_UserId || '',
    r.Line_DisplayName || ''
  ];

  var lastRow = sheet.getLastRow();
  var targetRowIndex = -1;

  if (lastRow >= 2 && r.Invoice) {
    var invoiceCol = sheet.getRange(2, 2, lastRow - 1, 1).getDisplayValues();
    var cleanTarget = String(r.Invoice).replace(/\D/g, '');
    for (var i = 0; i < invoiceCol.length; i++) {
      var cellInvoice = String(invoiceCol[i][0] || '').replace(/\D/g, '');
      if (cellInvoice && cellInvoice === cleanTarget) {
        targetRowIndex = i + 2;
        break;
      }
    }
  }

  var mode = 'inserted';
  if (targetRowIndex !== -1) {
    sheet.getRange(targetRowIndex, 1, 1, rowValues.length).setValues([rowValues]);
    mode = 'updated';
  } else {
    sheet.appendRow(rowValues);
    targetRowIndex = sheet.getLastRow();
  }

  var statusCell = sheet.getRange(targetRowIndex, 29);
  if (String(r.hctStatus).indexOf('❌') !== -1) {
    statusCell.setBackground('#fee2e2').setFontColor('#b91c1c').setFontWeight('bold');
  } else if (String(r.hctStatus).indexOf('✅') !== -1) {
    statusCell.setBackground('#dcfce7').setFontColor('#166534').setFontWeight('bold');
  } else {
    statusCell.setBackground('#fef3c7').setFontColor('#92400e').setFontWeight('normal');
  }

  return mode;
}

function handleDirectSubmitFromStaticPage(sheet, payload) {
  var form = payload.form || {};
  var meta = payload.meta || {};
  var custNo = String(form.CustID_Value || '').replace(/\D/g, '');
  var submitToHct = meta.submitToHct !== false;
  var qrUrl = String(meta.qrUrl || '').trim();

  var sendTypeMap = {
    '11': '寄件人付款(月結)',
    '31': '寄件人付款(現收)',
    '21': '收件人付款',
    '41': '代收貨款'
  };
  var goodsTypeMap = {
    '001': '常溫',
    '008': '冷藏',
    '003': '冷凍',
    '100': 'GDP'
  };

  var hctFormParams = {
    Invoice: String(form.Invoice || '').replace(/\D/g, ''),
    ChkCustID: custNo.length === 11 ? 'true' : 'False',
    CustID_Value: custNo,
    CustNo1: custNo.slice(0, 7),
    CustNo2: custNo.slice(7, 10),
    CustNo3: custNo.slice(10, 11),
    Send_Type: form.Send_Type || '11',
    Money: form.Send_Type === '41' ? String(form.Money || '') : '',
    CreditCard: form.CreditCard ? 'true' : 'false',
    Goods_Type: form.Goods_Type || '001',
    Sender_Name: form.Sender_Name || '',
    Sender_Phone: String(form.Sender_Phone || '').replace(/\D/g, ''),
    Sender_Ext: String(form.Sender_Ext || '').replace(/\D/g, ''),
    Sender_Country: form.Sender_Country || '',
    Sender_City: form.Sender_City || '',
    Sender_Road: form.Sender_Road || '',
    Sender_Address: form.Sender_Address || '',
    Save_Sender: 'true',
    Recipient_Name: form.Recipient_Name || '',
    Recipient_Phone: String(form.Recipient_Phone || '').replace(/\D/g, ''),
    Recipient_Ext: String(form.Recipient_Ext || '').replace(/\D/g, ''),
    DeliveryType: form.DeliveryType || '2',
    ToCountry: form.DeliveryType === '1' ? form.ToCountry || '' : '',
    ToStno: form.DeliveryType === '1' ? form.ToStno || '' : '',
    Recipient_Country: form.DeliveryType === '2' ? form.Recipient_Country || '' : '',
    Recipient_City: form.DeliveryType === '2' ? form.Recipient_City || '' : '',
    Recipient_Road: form.DeliveryType === '2' ? form.Recipient_Road || '' : '',
    Recipient_Address: form.Recipient_Address || '',
    RelyFee1: form.RelyFee1 || '',
    RelyFee2: form.RelyFee2 || '',
    ProductType: form.ProductType || '001',
    Replay: form.Replay ? 'true' : 'false',
    ValueDeclared: String(form.ValueDeclared || '').replace(/\D/g, ''),
    Count: String(form.Count || '1').replace(/\D/g, ''),
    Weight: '',
    Date: form.Date || '',
    Content: form.Content || '',
    Remark: form.Remark || '',
    Version: form.Version || '20250821',
    Sign: form.Sign || ''
  };

  var hctSuccess = false;
  var hctStatus = '僅留底(未送新竹物流)';
  var hctErrorMsg = '';

  if (submitToHct) {
    try {
      var payloadParts = [];
      for (var k in hctFormParams) {
        if (hctFormParams[k] !== undefined && hctFormParams[k] !== null) {
          payloadParts.push(encodeURIComponent(k) + '=' + encodeURIComponent(String(hctFormParams[k])));
        }
      }
      var res = UrlFetchApp.fetch('https://ebill.hct.com.tw/BookingNote/HCTCloud/Post_Data', {
        method: 'post',
        contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
        headers: {
          'X-Requested-With': 'XMLHttpRequest',
          Origin: 'https://ebill.hct.com.tw',
          Referer: qrUrl || 'https://ebill.hct.com.tw/BookingNote/'
        },
        payload: payloadParts.join('&'),
        muteHttpExceptions: true
      });
      var parsed = JSON.parse(res.getContentText('UTF-8'));
      if (parsed && parsed.status === 'Success') {
        hctSuccess = true;
        hctStatus = '✅ 已成功送出至新竹物流';
      } else {
        hctErrorMsg = (parsed && parsed.content) || '新竹物流回傳失敗';
        hctStatus = '❌ 物流未送出(' + hctErrorMsg + ')';
      }
    } catch (err) {
      hctErrorMsg = '已寫入試算表(物流端需台灣IP連線)';
      hctStatus = '⚠️ 已寫入試算表';
      hctSuccess = true;
    }
  }

  var senderFullAddress = [
    meta.Sender_zip ? meta.Sender_zip + ' ' : '',
    hctFormParams.Sender_Country,
    hctFormParams.Sender_City,
    hctFormParams.Sender_Road,
    hctFormParams.Sender_Address
  ].filter(Boolean).join('');

  var recipientFullAddress =
    hctFormParams.DeliveryType === '1'
      ? '[營業所自領] ' + hctFormParams.ToCountry + ' ' + hctFormParams.Recipient_Address
      : [
          meta.Recipient_zip ? meta.Recipient_zip + ' ' : '',
          hctFormParams.Recipient_Country,
          hctFormParams.Recipient_City,
          hctFormParams.Recipient_Road,
          hctFormParams.Recipient_Address
        ].filter(Boolean).join('');

  var record = {
    createdAt: Utilities.formatDate(new Date(), 'Asia/Taipei', 'yyyy/MM/dd HH:mm:ss'),
    Invoice: hctFormParams.Invoice,
    CustID_Value: hctFormParams.CustID_Value,
    Send_Type_Text: sendTypeMap[hctFormParams.Send_Type] || hctFormParams.Send_Type,
    Goods_Type_Text: goodsTypeMap[hctFormParams.Goods_Type] || hctFormParams.Goods_Type,
    ProductType_Text: meta.ProductType_Text || '一般',
    Count: hctFormParams.Count,
    Content: hctFormParams.Content,
    Sender_Name: hctFormParams.Sender_Name,
    Sender_Phone: hctFormParams.Sender_Phone,
    Sender_Ext: hctFormParams.Sender_Ext,
    Sender_FullAddress: senderFullAddress,
    Recipient_Name: hctFormParams.Recipient_Name,
    Recipient_Phone: hctFormParams.Recipient_Phone,
    Recipient_Ext: hctFormParams.Recipient_Ext,
    DeliveryType_Text: hctFormParams.DeliveryType === '1' ? '營業所自領' : '宅配',
    Recipient_zip: meta.Recipient_zip || '',
    Recipient_Country: hctFormParams.Recipient_Country,
    Recipient_City: hctFormParams.Recipient_City,
    Recipient_Road: hctFormParams.Recipient_Road,
    Recipient_Address: hctFormParams.Recipient_Address,
    Recipient_FullAddress: recipientFullAddress,
    Money: hctFormParams.Money,
    CreditCard_Text: hctFormParams.CreditCard === 'true' ? '是' : '否',
    ValueDeclared: hctFormParams.ValueDeclared,
    Replay_Text: hctFormParams.Replay === 'true' ? '是' : '否',
    Date: hctFormParams.Date,
    Remark: hctFormParams.Remark,
    hctStatus: hctStatus,
    gsheetStatus: '已集中寫入Google試算表',
    qrUrl: qrUrl,
    Line_UserId: meta.Line_UserId || ( payload.record && payload.record.Line_UserId ) || '',
    Line_DisplayName: meta.Line_DisplayName || ( payload.record && payload.record.Line_DisplayName ) || ''
  };

  var mode = upsertRecordRow(sheet, record);
  return {
    ok: !submitToHct || hctSuccess,
    savedToSheet: true,
    upsertMode: mode,
    error: hctErrorMsg || null,
    record: record
  };
}

function hctPostForm(endpoint, paramsObj) {
  try {
    var payloadParts = [];
    for (var k in paramsObj) {
      if (paramsObj[k] !== undefined && paramsObj[k] !== null) {
        payloadParts.push(encodeURIComponent(k) + '=' + encodeURIComponent(String(paramsObj[k])));
      }
    }
    var res = UrlFetchApp.fetch('https://ebill.hct.com.tw' + endpoint, {
      method: 'post',
      contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
      headers: {
        'X-Requested-With': 'XMLHttpRequest',
        Origin: 'https://ebill.hct.com.tw',
        Referer: 'https://ebill.hct.com.tw/BookingNote/'
      },
      payload: payloadParts.join('&'),
      muteHttpExceptions: true
    });
    var code = res.getResponseCode();
    var text = res.getContentText('UTF-8');
    if (code === 403 || text.indexOf('Just a moment') !== -1 || text.indexOf('cloudflare') !== -1) {
      return { cloudflareBlocked: true, status: code };
    }
    return JSON.parse(text);
  } catch (e) {
    return { cloudflareBlocked: true, error: e.toString() };
  }
}

function handleInspectQr(qrText) {
  var cleanText = String(qrText || '').trim();
  var invoice = '';
  var targetUrl = '';
  if (cleanText.indexOf('http') === 0) {
    targetUrl = cleanText;
    var m = cleanText.match(/[?&]i=(\d{10})/);
    if (m) invoice = m[1];
  } else {
    var digits = cleanText.replace(/\D/g, '');
    if (digits.length === 10) invoice = digits;
  }
  return {
    ok: Boolean(invoice),
    invoice: invoice,
    qrUrl: targetUrl,
    isExistingData: false,
    data: { Invoice: invoice, Version: '20250821' },
    error: invoice ? null : '無法辨識 10 碼託運單號'
  };
}
