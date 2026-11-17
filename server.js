const http = require('http');
const fs = require('fs');
const path = require('path');
const { URL, URLSearchParams } = require('url');

const PORT = process.env.PORT || 3088;
const PUBLIC_DIR = path.join(__dirname, 'public');
const DATA_DIR = path.join(__dirname, 'data');
const RECORDS_FILE = path.join(DATA_DIR, 'records.json');
const CSV_FILE = path.join(DATA_DIR, 'records.csv');
const CONFIG_FILE = path.join(DATA_DIR, 'config.json');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}
if (!fs.existsSync(RECORDS_FILE)) {
  fs.writeFileSync(RECORDS_FILE, JSON.stringify([], null, 2), 'utf8');
}
if (!fs.existsSync(CONFIG_FILE)) {
  fs.writeFileSync(
    CONFIG_FILE,
    JSON.stringify(
      {
        liffId: process.env.LIFF_ID || '',
        gsheetUrl: process.env.GAS_URL || '',
        defaultCustId: process.env.DEFAULT_CUST_ID || '',
        defaultCompanyName: ''
      },
      null,
      2
    ),
    'utf8'
  );
}

function readServerConfig() {
  try {
    return JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf8'));
  } catch {
    return { liffId: '', gsheetUrl: '', defaultCustId: '', defaultCompanyName: '' };
  }
}

function saveServerConfig(partial) {
  const next = { ...readServerConfig(), ...partial };
  fs.writeFileSync(CONFIG_FILE, JSON.stringify(next, null, 2), 'utf8');
  return next;
}

const HCT_BASE = 'https://ebill.hct.com.tw';
const USER_AGENT =
  'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1';

const invoiceCookieStore = new Map();

function readRecords() {
  try {
    return JSON.parse(fs.readFileSync(RECORDS_FILE, 'utf8'));
  } catch {
    return [];
  }
}

function saveRecords(records) {
  fs.writeFileSync(RECORDS_FILE, JSON.stringify(records, null, 2), 'utf8');
  writeCsvFile(records);
}

const CSV_HEADERS = [
  { key: 'createdAt', label: '最後更新時間' },
  { key: 'Invoice', label: '託運單號' },
  { key: 'CustID_Value', label: '契約客代' },
  { key: 'Send_Type_Text', label: '寄件類別' },
  { key: 'Goods_Type_Text', label: '貨件溫層' },
  { key: 'ProductType_Text', label: '商品種類' },
  { key: 'Count', label: '件數' },
  { key: 'Content', label: '品名(內容物)' },
  { key: 'Recipient_Name', label: '收件人姓名/公司' },
  { key: 'Recipient_Phone', label: '收件人電話' },
  { key: 'Recipient_Ext', label: '收件人分機' },
  { key: 'DeliveryType_Text', label: '配送方式' },
  { key: 'Recipient_zip', label: '收件郵遞區號' },
  { key: 'Recipient_Country', label: '收件縣市' },
  { key: 'Recipient_City', label: '收件鄉鎮市區' },
  { key: 'Recipient_Road', label: '收件路名' },
  { key: 'Recipient_Address', label: '收件門牌地址' },
  { key: 'Recipient_FullAddress', label: '收件人完整地址' },
  { key: 'Sender_Name', label: '寄件人姓名/公司' },
  { key: 'Sender_Phone', label: '寄件人電話' },
  { key: 'Sender_Ext', label: '寄件人分機' },
  { key: 'Sender_FullAddress', label: '寄件人完整地址' },
  { key: 'Money', label: '代收貨款金額' },
  { key: 'CreditCard_Text', label: '貨刷' },
  { key: 'ValueDeclared', label: '報值金額' },
  { key: 'Replay_Text', label: '回單' },
  { key: 'Date', label: '希望送達日' },
  { key: 'Remark', label: '備註' },
  { key: 'hctStatus', label: '新竹物流送出狀態' },
  { key: 'gsheetStatus', label: 'Google試算表同步狀態' },
  { key: 'qrUrl', label: '原始QR網址' }
];

function escapeCsvCell(val) {
  const s = val == null ? '' : String(val);
  if (s.includes(',') || s.includes('"') || s.includes('\n') || s.includes('\r')) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

function generateCsvContent(records) {
  const headerLine = CSV_HEADERS.map((h) => escapeCsvCell(h.label)).join(',');
  const rows = records.map((rec) =>
    CSV_HEADERS.map((h) => escapeCsvCell(rec[h.key])).join(',')
  );
  return '\uFEFF' + [headerLine, ...rows].join('\r\n');
}

function writeCsvFile(records) {
  try {
    fs.writeFileSync(CSV_FILE, generateCsvContent(records), 'utf8');
  } catch (err) {
    console.error('Failed to write CSV:', err.message);
  }
}

function decodeHtmlEntities(str) {
  if (!str) return '';
  return str
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#x([0-9A-Fa-f]+);/g, (_, hex) => String.fromCharCode(parseInt(hex, 16)))
    .replace(/&#(\d+);/g, (_, dec) => String.fromCharCode(parseInt(dec, 10)));
}

function parseHctHtml(html) {
  const getInputVal = (name) => {
    const regex1 = new RegExp(`<input[^>]*\\bname=["']${name}["'][^>]*\\bvalue=["']([^"']*)["']`, 'i');
    const regex2 = new RegExp(`<input[^>]*\\bvalue=["']([^"']*)["'][^>]*\\bname=["']${name}["']`, 'i');
    const m = html.match(regex1) || html.match(regex2);
    return m ? decodeHtmlEntities(m[1]) : '';
  };

  const getCheckedRadioVal = (name) => {
    const inputTags = html.match(new RegExp(`<input[^>]*\\bname=["']${name}["'][^>]*>`, 'gi')) || [];
    for (const tag of inputTags) {
      if (/\bchecked\b/i.test(tag)) {
        const vm = tag.match(/\bvalue=["']([^"']*)["']/i);
        if (vm) return decodeHtmlEntities(vm[1]);
      }
    }
    return '';
  };

  const getSelectedOptionVal = (selectId) => {
    const selectRegex = new RegExp(`<select[^>]*\\bid=["']${selectId}["'][^>]*>([\\s\\S]*?)<\\/select>`, 'i');
    const sm = html.match(selectRegex);
    if (!sm) return '';
    const options = sm[1].match(/<option[^>]*>/gi) || [];
    for (const opt of options) {
      if (/\bselected\b/i.test(opt)) {
        const vm = opt.match(/\bvalue=["']([^"']*)["']/i);
        if (vm) return decodeHtmlEntities(vm[1]);
      }
    }
    return '';
  };

  const getJsAssignedVal = (selectorId) => {
    const regex = new RegExp(`\\$\\(['"]#${selectorId}['"]\\)\\.val\\(['"]([^'"]*)['"]\\)`, 'g');
    let match;
    let lastVal = '';
    while ((match = regex.exec(html)) !== null) {
      lastVal = decodeHtmlEntities(match[1]);
    }
    return lastVal;
  };

  const data = {
    Invoice: getInputVal('Invoice'),
    Version: getInputVal('Version') || '20250821',
    ChkCustID: getInputVal('ChkCustID') || 'False',
    CustID_Value: getInputVal('CustID_Value'),
    CustNo1: getInputVal('CustNo1'),
    CustNo2: getInputVal('CustNo2'),
    CustNo3: getInputVal('CustNo3'),
    Send_Type: getCheckedRadioVal('Send_Type'),
    Money: getInputVal('Money'),
    Goods_Type: getCheckedRadioVal('Goods_Type'),
    Sender_Name: getInputVal('Sender_Name'),
    Sender_Phone: getInputVal('Sender_Phone'),
    Sender_Ext: getInputVal('Sender_Ext'),
    Sender_Country: getSelectedOptionVal('Sender_Country'),
    Sender_City: getJsAssignedVal('Sender_City'),
    Sender_Road: getJsAssignedVal('Sender_Road'),
    Sender_Address: getInputVal('Sender_Address'),
    Recipient_Name: getInputVal('Recipient_Name'),
    Recipient_Phone: getInputVal('Recipient_Phone'),
    Recipient_Ext: getInputVal('Recipient_Ext'),
    DeliveryType: getCheckedRadioVal('DeliveryType') || '2',
    ToCountry: getSelectedOptionVal('ToCountry'),
    ToStno: getJsAssignedVal('ToStno'),
    Recipient_Country: getSelectedOptionVal('Recipient_Country'),
    Recipient_City: getJsAssignedVal('Recipient_City'),
    Recipient_Road: getJsAssignedVal('Recipient_Road'),
    Recipient_Address: getInputVal('Recipient_Address'),
    ProductType: getJsAssignedVal('ProductType') || '001',
    ValueDeclared: getInputVal('ValueDeclared'),
    Count: getInputVal('Count'),
    Date: getInputVal('Date'),
    Content: getInputVal('Content'),
    Remark: getInputVal('Remark'),
    Sign: getInputVal('Sign')
  };

  const isExistingData = Boolean(data.Recipient_Name || data.Recipient_Phone || data.Recipient_Address);
  return { data, isExistingData };
}

async function hctPostForm(endpoint, paramsObj, cookieHeader = '', referer = `${HCT_BASE}/BookingNote/`) {
  const body = new URLSearchParams();
  for (const [k, v] of Object.entries(paramsObj)) {
    if (v !== undefined && v !== null) {
      body.append(k, String(v));
    }
  }
  const headers = {
    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
    'User-Agent': USER_AGENT,
    'X-Requested-With': 'XMLHttpRequest',
    Origin: HCT_BASE,
    Referer: referer
  };
  if (cookieHeader) {
    headers.Cookie = cookieHeader;
  }

  const res = await fetch(`${HCT_BASE}${endpoint}`, {
    method: 'POST',
    headers,
    body: body.toString()
  });

  const text = await res.text();
  try {
    return JSON.parse(text);
  } catch {
    return { raw: text, status: res.status };
  }
}

const HCT_COUNTRIES = [
  '基隆市', '臺北市', '新北市', '桃園市', '新竹市', '新竹縣', '苗栗縣',
  '臺中市', '彰化縣', '南投縣', '雲林縣', '嘉義市', '嘉義縣', '臺南市',
  '高雄市', '屏東縣', '臺東縣', '花蓮縣', '宜蘭縣', '澎湖縣', '金門縣', '連江縣'
];

// 支援整段收件人文字（含姓名＋電話＋分機＋地址）或純地址一鍵拆解
async function parseRecipientTextAndAddress(rawInput) {
  let text = String(rawInput || '').trim();
  if (!text) return null;

  let extractedPhone = '';
  let extractedExt = '';
  let extractedName = '';

  const phoneRegex = /(?:[(（]?0[2-9][)）]?[-\s]?\d{3,4}[-\s]?\d{3,4}|09\d{2}[-\s]?\d{3}[-\s]?\d{3})(?:\s*(?:#|分機|ext\.?|轉)\s*(\d{1,8}))?/i;
  const pm = text.match(phoneRegex);
  if (pm) {
    extractedPhone = pm[0].split(/#|分機|ext|轉/i)[0].replace(/\D/g, '');
    if (pm[1]) extractedExt = pm[1].replace(/\D/g, '');
    text = text.replace(pm[0], ' ').trim();
  }

  text = text
    .replace(/(收件人|姓名|公司|電話|手機|地址|住址)\s*[:：]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  let addrPart = text;
  const normText = text.replace(/台(北|中|南|東)/g, '臺$1');

  let countryIdx = -1;
  let matchedCountry = '';
  for (const c of HCT_COUNTRIES) {
    const idx = normText.indexOf(c);
    if (idx !== -1 && (countryIdx === -1 || idx < countryIdx)) {
      countryIdx = idx;
      matchedCountry = c;
    }
  }

  if (countryIdx !== -1) {
    const beforeAddr = text.slice(0, countryIdx).replace(/^\d{3,6}\s*/, '').trim();
    const afterAddr = normText.slice(countryIdx).trim();
    addrPart = afterAddr;
    if (beforeAddr) {
      extractedName = beforeAddr.replace(/[,，、;；]/g, '').trim();
    }
  } else {
    addrPart = normText.replace(/^\d{3,6}\s*/, '').trim();
  }

  if (!matchedCountry) {
    return {
      name: extractedName,
      phone: extractedPhone,
      ext: extractedExt,
      country: '',
      city: '',
      road: '',
      zip: '',
      address: addrPart
    };
  }

  const restAfterCountry = addrPart.slice(matchedCountry.length).trim();
  let matchedCity = '';
  let restAfterCity = restAfterCountry;
  let cities = [];

  try {
    const cityList = await hctPostForm('/BookingNote/HCTCloud/Get_Cmb_strJson', { ID: matchedCountry });
    if (Array.isArray(cityList)) {
      cities = cityList;
      for (const item of cityList) {
        const area = item.AREA || item.ID;
        const normRest = restAfterCountry.replace(/^台/, '臺');
        if (restAfterCountry.startsWith(area) || normRest.startsWith(area)) {
          matchedCity = item.ID;
          restAfterCity = restAfterCountry.slice(area.length).trim();
          break;
        }
      }
    }
  } catch (e) {
    console.error('Get_Cmb_strJson error:', e.message);
  }

  let matchedRoad = '';
  let restAfterRoad = restAfterCity;
  let roads = [];
  let zip = '';

  if (matchedCity) {
    try {
      const [roadList, zipRes] = await Promise.all([
        hctPostForm('/BookingNote/HCTCloud/Get_Road_strJson', {
          country: matchedCountry,
          city: matchedCity
        }),
        hctPostForm('/BookingNote/HCTCloud/Get_Zip_strJson', {
          country: matchedCountry,
          city: matchedCity
        })
      ]);

      if (typeof zipRes === 'string') {
        zip = zipRes;
      }

      if (Array.isArray(roadList)) {
        roads = roadList;
        const fullWidthMap = {
          一: '１', 二: '２', 三: '３', 四: '４', 五: '５',
          六: '６', 七: '７', 八: '８', 九: '９',
          '1': '１', '2': '２', '3': '３', '4': '４', '5': '５',
          '6': '６', '7': '７', '8': '８', '9': '９'
        };
        const toHctRoadVariants = (s) => {
          const v1 = s;
          const v2 = s.replace(/([一二三四五六七八九1-9])段/g, (_, d) => `${fullWidthMap[d] || d}段`);
          return [v1, v2, v1.replace(/台/g, '臺'), v2.replace(/台/g, '臺')];
        };

        const variants = toHctRoadVariants(restAfterCity);
        const sortedRoads = [...roadList]
          .filter((r) => r.ID && r.Road && r.Road !== '---------')
          .sort((a, b) => b.Road.length - a.Road.length);

        for (const r of sortedRoads) {
          const roadName = r.Road.trim();
          const matchedVariant = variants.find((v) => v.startsWith(roadName));
          if (matchedVariant) {
            matchedRoad = r.ID;
            restAfterRoad = matchedVariant.slice(roadName.length).trim();
            break;
          }
        }
      }
    } catch (e) {
      console.error('Road/Zip lookup error:', e.message);
    }
  }

  return {
    name: extractedName,
    phone: extractedPhone,
    ext: extractedExt,
    country: matchedCountry,
    city: matchedCity,
    road: matchedRoad,
    zip,
    address: restAfterRoad,
    cities,
    roads
  };
}

function readJsonBody(req) {
  return new Promise((resolve, reject) => {
    let data = '';
    req.on('data', (chunk) => {
      data += chunk;
      if (data.length > 5 * 1024 * 1024) {
        reject(new Error('Payload too large'));
      }
    });
    req.on('end', () => {
      if (!data) return resolve({});
      try {
        resolve(JSON.parse(data));
      } catch (e) {
        reject(e);
      }
    });
    req.on('error', reject);
  });
}

function sendJson(res, status, obj) {
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store'
  });
  res.end(JSON.stringify(obj));
}

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

const SEND_TYPE_LABELS = {
  '11': '寄件人付款(月結)',
  '31': '寄件人付款(現收)',
  '21': '收件人付款',
  '41': '代收貨款'
};

const GOODS_TYPE_LABELS = {
  '001': '常溫',
  '008': '冷藏',
  '003': '冷凍',
  '100': 'GDP'
};

const PRODUCT_TYPE_LABELS = {
  '001': '一般',
  '004': '蔬果',
  '011': '學生行李',
  '006': '來回件',
  '009': '糕餅',
  '041': '文旦'
};

const server = http.createServer(async (req, res) => {
  const parsedUrl = new URL(req.url, `http://${req.headers.host}`);
  const pathname = parsedUrl.pathname;

  try {
    if (req.method === 'POST' && pathname === '/api/hct/inspect-qr') {
      const { qrText } = await readJsonBody(req);
      if (!qrText) {
        return sendJson(res, 400, { ok: false, error: '請提供 QR Code 內容或單號' });
      }

      let invoice = '';
      let targetUrl = '';

      if (qrText.startsWith('http://') || qrText.startsWith('https://')) {
        targetUrl = qrText.trim();
        try {
          const u = new URL(targetUrl);
          invoice = u.searchParams.get('i') || '';
        } catch {}
      } else {
        const digits = qrText.replace(/\D/g, '');
        if (digits.length === 10) invoice = digits;
      }

      if (targetUrl && targetUrl.includes('ebill.hct.com.tw')) {
        const hctRes = await fetch(targetUrl, {
          method: 'GET',
          headers: { 'User-Agent': USER_AGENT }
        });
        const setCookies = hctRes.headers.getSetCookie ? hctRes.headers.getSetCookie() : [];
        const cookieHeader = setCookies.map((c) => c.split(';')[0]).join('; ');
        const html = await hctRes.text();
        const { data, isExistingData } = parseHctHtml(html);

        const resolvedInvoice = data.Invoice || invoice;
        if (resolvedInvoice && cookieHeader) {
          invoiceCookieStore.set(resolvedInvoice, {
            cookieHeader,
            targetUrl,
            updatedAt: Date.now()
          });
        }

        return sendJson(res, 200, {
          ok: true,
          invoice: resolvedInvoice,
          qrUrl: targetUrl,
          isExistingData,
          data
        });
      }

      if (invoice) {
        return sendJson(res, 200, {
          ok: true,
          invoice,
          qrUrl: '',
          isExistingData: false,
          data: { Invoice: invoice, Version: '20250821' }
        });
      }

      return sendJson(res, 400, {
        ok: false,
        error: '無法從掃描內容辨識新竹物流網址或 10 碼託運單號'
      });
    }

    if (req.method === 'POST' && pathname === '/api/hct/cust-data') {
      const { custId } = await readJsonBody(req);
      const cleanId = String(custId || '').replace(/\D/g, '');
      if (cleanId.length !== 11) {
        return sendJson(res, 400, { ok: false, error: '契約客代必須為 11 碼數字' });
      }
      const data = await hctPostForm('/BookingNote/HCTCloud/GetCustData', { custId: cleanId });
      return sendJson(res, 200, { ok: true, data });
    }

    if (req.method === 'POST' && pathname === '/api/hct/cities') {
      const { country } = await readJsonBody(req);
      const data = await hctPostForm('/BookingNote/HCTCloud/Get_Cmb_strJson', { ID: country || '' });
      return sendJson(res, 200, { ok: true, data: Array.isArray(data) ? data : [] });
    }

    if (req.method === 'POST' && pathname === '/api/hct/roads') {
      const { country, city } = await readJsonBody(req);
      const [roads, zip] = await Promise.all([
        hctPostForm('/BookingNote/HCTCloud/Get_Road_strJson', { country: country || '', city: city || '' }),
        hctPostForm('/BookingNote/HCTCloud/Get_Zip_strJson', { country: country || '', city: city || '' })
      ]);
      return sendJson(res, 200, {
        ok: true,
        roads: Array.isArray(roads) ? roads : [],
        zip: typeof zip === 'string' ? zip : ''
      });
    }

    if (req.method === 'POST' && pathname === '/api/hct/product-types') {
      const { goodsType } = await readJsonBody(req);
      const data = await hctPostForm('/BookingNote/HCTCloud/Get_InvoiceKind_strJson', {
        colGroup: goodsType || '001'
      });
      return sendJson(res, 200, { ok: true, data: Array.isArray(data) ? data : [] });
    }

    if (req.method === 'POST' && pathname === '/api/hct/to-stno') {
      const { country, goodsType } = await readJsonBody(req);
      const data = await hctPostForm('/BookingNote/HCTCloud/Get_ToStno_strJson', {
        country: country || '',
        goodsType: goodsType || '001'
      });
      return sendJson(res, 200, { ok: true, data: Array.isArray(data) ? data : [] });
    }

    if (req.method === 'POST' && pathname === '/api/hct/rely-fee') {
      const { address } = await readJsonBody(req);
      const data = await hctPostForm('/BookingNote/HCTCloud/GetRelyFee', { address: address || '' });
      return sendJson(res, 200, { ok: true, data });
    }

    if (req.method === 'POST' && (pathname === '/api/parse-address' || pathname === '/api/parse-recipient')) {
      const body = await readJsonBody(req);
      const parsed = await parseRecipientTextAndAddress(body.text || body.address || '');
      return sendJson(res, 200, { ok: true, parsed });
    }

    if (req.method === 'POST' && pathname === '/api/test-gsheet') {
      const { webhookUrl } = await readJsonBody(req);
      if (!webhookUrl) {
        return sendJson(res, 400, { ok: false, error: '請先填入 Google Apps Script 網址' });
      }
      const gRes = await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({ action: 'init-sync' }),
        redirect: 'follow'
      });
      const gText = await gRes.text();
      return sendJson(res, 200, { ok: gRes.ok, status: gRes.status, response: gText });
    }

    if (req.method === 'POST' && pathname === '/api/submit') {
      const payload = await readJsonBody(req);
      const { form, meta = {} } = payload;

      if (!form || !form.Invoice) {
        return sendJson(res, 400, { ok: false, error: '缺少託運單號 (Invoice)' });
      }

      const submitToHct = meta.submitToHct !== false;
      const qrUrl = (meta.qrUrl || '').trim();
      const custNo = String(form.CustID_Value || '').replace(/\D/g, '');

      const hctFormParams = {
        Invoice: String(form.Invoice).replace(/\D/g, ''),
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

      let hctSuccess = false;
      let hctErrorMsg = '';
      let hctResult = null;
      let hctStatus = '僅留底(未送新竹物流)';

      if (submitToHct) {
        try {
          const specialTelRes = await hctPostForm('/BookingNote/HCTCloud/Get_SpecialTelMsg', {
            Phone: hctFormParams.Recipient_Phone,
            Ext: hctFormParams.Recipient_Ext
          });
          if (specialTelRes && specialTelRes.msg) {
            hctErrorMsg = `收件電話驗證失敗：${specialTelRes.msg}`;
            hctStatus = `❌ 物流未送出(${hctErrorMsg})`;
          } else {
            let storedSession = invoiceCookieStore.get(hctFormParams.Invoice);
            if (!storedSession && qrUrl && qrUrl.includes('ebill.hct.com.tw')) {
              try {
                const initRes = await fetch(qrUrl, { headers: { 'User-Agent': USER_AGENT } });
                const setCookies = initRes.headers.getSetCookie ? initRes.headers.getSetCookie() : [];
                const cookieHeader = setCookies.map((c) => c.split(';')[0]).join('; ');
                storedSession = { cookieHeader, targetUrl: qrUrl };
                invoiceCookieStore.set(hctFormParams.Invoice, storedSession);
              } catch {}
            }

            hctResult = await hctPostForm(
              '/BookingNote/HCTCloud/Post_Data',
              hctFormParams,
              storedSession ? storedSession.cookieHeader : '',
              qrUrl || `${HCT_BASE}/BookingNote/`
            );

            if (hctResult && hctResult.status === 'Success') {
              hctSuccess = true;
              hctStatus = '✅ 已成功送出至新竹物流';
            } else {
              hctErrorMsg = (hctResult && hctResult.content) || '新竹物流伺服器回傳失敗';
              hctStatus = `❌ 物流未送出(${hctErrorMsg})`;
            }
          }
        } catch (err) {
          hctErrorMsg = err.message;
          hctStatus = `❌ 物流連線異常(${hctErrorMsg})`;
        }
      }

      const senderFullAddress = [
        meta.Sender_zip || '',
        hctFormParams.Sender_Country,
        hctFormParams.Sender_City,
        hctFormParams.Sender_Road,
        hctFormParams.Sender_Address
      ]
        .filter(Boolean)
        .join('');

      const recipientFullAddress =
        hctFormParams.DeliveryType === '1'
          ? `[營業所自領] ${hctFormParams.ToCountry} ${hctFormParams.Recipient_Address}`
          : [
              meta.Recipient_zip ? `${meta.Recipient_zip} ` : '',
              hctFormParams.Recipient_Country,
              hctFormParams.Recipient_City,
              hctFormParams.Recipient_Road,
              hctFormParams.Recipient_Address
            ]
              .filter(Boolean)
              .join('');

      const formBackup = { ...form, Sign: '' };

      const record = {
        id: hctFormParams.Invoice,
        createdAt: new Date().toLocaleString('zh-TW', {
          timeZone: 'Asia/Taipei',
          hour12: false
        }),
        Invoice: hctFormParams.Invoice,
        CustID_Value: hctFormParams.CustID_Value,
        Send_Type: hctFormParams.Send_Type,
        Send_Type_Text: SEND_TYPE_LABELS[hctFormParams.Send_Type] || hctFormParams.Send_Type,
        Goods_Type: hctFormParams.Goods_Type,
        Goods_Type_Text: GOODS_TYPE_LABELS[hctFormParams.Goods_Type] || hctFormParams.Goods_Type,
        ProductType: hctFormParams.ProductType,
        ProductType_Text:
          meta.ProductType_Text ||
          PRODUCT_TYPE_LABELS[hctFormParams.ProductType] ||
          hctFormParams.ProductType,
        Count: hctFormParams.Count,
        Content: hctFormParams.Content,
        Sender_Name: hctFormParams.Sender_Name,
        Sender_Phone: hctFormParams.Sender_Phone,
        Sender_Ext: hctFormParams.Sender_Ext,
        Sender_Country: hctFormParams.Sender_Country,
        Sender_City: hctFormParams.Sender_City,
        Sender_Road: hctFormParams.Sender_Road,
        Sender_Address: hctFormParams.Sender_Address,
        Sender_FullAddress: senderFullAddress,
        Recipient_Name: hctFormParams.Recipient_Name,
        Recipient_Phone: hctFormParams.Recipient_Phone,
        Recipient_Ext: hctFormParams.Recipient_Ext,
        DeliveryType: hctFormParams.DeliveryType,
        DeliveryType_Text: hctFormParams.DeliveryType === '1' ? '營業所自領' : '宅配',
        ToCountry: hctFormParams.ToCountry,
        ToStno: hctFormParams.ToStno,
        Recipient_zip: meta.Recipient_zip || '',
        Recipient_Country: hctFormParams.Recipient_Country,
        Recipient_City: hctFormParams.Recipient_City,
        Recipient_Road: hctFormParams.Recipient_Road,
        Recipient_Address: hctFormParams.Recipient_Address,
        Recipient_FullAddress: recipientFullAddress,
        Money: hctFormParams.Money,
        CreditCard: hctFormParams.CreditCard === 'true',
        CreditCard_Text: hctFormParams.CreditCard === 'true' ? '是' : '否',
        ValueDeclared: hctFormParams.ValueDeclared,
        Replay: hctFormParams.Replay === 'true',
        Replay_Text: hctFormParams.Replay === 'true' ? '是' : '否',
        Date: hctFormParams.Date,
        Remark: hctFormParams.Remark,
        hctStatus,
        gsheetStatus: '本機CSV留底',
        qrUrl,
        formBackup
      };

      const srvCfg = readServerConfig();
      const webhookUrl = (meta.gsheetWebhookUrl || srvCfg.gsheetUrl || '').trim();
      if (webhookUrl && webhookUrl.startsWith('https://script.google.com/')) {
        try {
          const gRes = await fetch(webhookUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'text/plain;charset=utf-8' },
            body: JSON.stringify({ action: 'append', record, form: formBackup }),
            redirect: 'follow'
          });
          if (gRes.ok) {
            record.gsheetStatus = '已寫入Google試算表';
          } else {
            record.gsheetStatus = `Google試算表HTTP ${gRes.status}`;
          }
        } catch (err) {
          record.gsheetStatus = `Google試算表失敗: ${err.message}`;
        }
      }

      // Upsert by Invoice (同單號自動覆蓋更新同一筆)
      const records = readRecords();
      const existingIdx = records.findIndex((r) => r.Invoice === record.Invoice);
      let upsertMode = 'inserted';
      if (existingIdx !== -1) {
        records[existingIdx] = record;
        upsertMode = 'updated';
      } else {
        records.unshift(record);
      }
      saveRecords(records);

      return sendJson(res, 200, {
        ok: !submitToHct || hctSuccess,
        savedToSheet: true,
        upsertMode,
        error: hctErrorMsg || null,
        record,
        hctResult
      });
    }

    if (req.method === 'GET' && pathname === '/api/config') {
      return sendJson(res, 200, { ok: true, config: readServerConfig() });
    }

    if (req.method === 'POST' && pathname === '/api/config') {
      const body = await readJsonBody(req);
      const saved = saveServerConfig(body);
      return sendJson(res, 200, { ok: true, config: saved });
    }

    if (req.method === 'GET' && pathname === '/api/records') {
      return sendJson(res, 200, { ok: true, records: readRecords() });
    }

    if (req.method === 'DELETE' && pathname.startsWith('/api/records/')) {
      const id = decodeURIComponent(pathname.replace('/api/records/', ''));
      const records = readRecords().filter((r) => r.id !== id && r.Invoice !== id);
      saveRecords(records);
      return sendJson(res, 200, { ok: true });
    }

    if (req.method === 'GET' && pathname === '/api/records/csv') {
      const records = readRecords();
      const csv = generateCsvContent(records);
      const dateStr = new Date().toISOString().slice(0, 10);
      res.writeHead(200, {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="HCT_Shipping_Records_${dateStr}.csv"`
      });
      return res.end(csv);
    }

    if (req.method === 'GET' && pathname === '/sample-label.jpg') {
      const samplePath = path.join(__dirname, '1498769.jpg');
      if (fs.existsSync(samplePath)) {
        res.writeHead(200, { 'Content-Type': 'image/jpeg' });
        return fs.createReadStream(samplePath).pipe(res);
      }
    }

    let filePath = pathname === '/' ? '/index.html' : pathname;
    const safePath = path.normalize(filePath).replace(/^(\.\.[/\\])+/, '');
    const fullPath = path.join(PUBLIC_DIR, safePath);

    if (fs.existsSync(fullPath) && fs.statSync(fullPath).isFile()) {
      const ext = path.extname(fullPath).toLowerCase();
      res.writeHead(200, {
        'Content-Type': MIME_TYPES[ext] || 'application/octet-stream',
        'Cache-Control': 'no-cache'
      });
      return fs.createReadStream(fullPath).pipe(res);
    }

    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Not Found');
  } catch (err) {
    console.error('Server error:', err);
    sendJson(res, 500, { ok: false, error: err.message || 'Internal Server Error' });
  }
});

server.listen(PORT, () => {
  console.log(`🚀 新竹物流極速託運暨報帳 PWA 系統已啟動: http://localhost:${PORT}`);
});
