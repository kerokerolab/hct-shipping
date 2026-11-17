const HCT_COUNTRIES = [
  '基隆市', '臺北市', '新北市', '桃園市', '新竹市', '新竹縣', '苗栗縣',
  '臺中市', '彰化縣', '南投縣', '雲林縣', '嘉義市', '嘉義縣', '臺南市',
  '高雄市', '屏東縣', '臺東縣', '花蓮縣', '宜蘭縣', '澎湖縣', '金門縣', '連江縣'
];

// 內建全台 22 縣市與 368 鄉鎮市區＋郵遞區號對照表（0 延遲秒開下拉選單）
const TW_DISTRICTS = {
  基隆市: { 仁愛區: '200', 信義區: '201', 中正區: '202', 中山區: '203', 安樂區: '204', 暖暖區: '205', 七堵區: '206' },
  臺北市: { 中正區: '100', 大同區: '103', 中山區: '104', 松山區: '105', 大安區: '106', 萬華區: '108', 信義區: '110', 士林區: '111', 北投區: '112', 內湖區: '114', 南港區: '115', 文山區: '116' },
  新北市: { 萬里區: '207', 金山區: '208', 板橋區: '220', 汐止區: '221', 深坑區: '222', 石碇區: '223', 瑞芳區: '224', 平溪區: '226', 雙溪區: '227', 貢寮區: '228', 新店區: '231', 坪林區: '232', 烏來區: '233', 永和區: '234', 中和區: '235', 土城區: '236', 三峽區: '237', 樹林區: '238', 鶯歌區: '239', 三重區: '241', 新莊區: '242', 泰山區: '243', 林口區: '244', 蘆洲區: '247', 五股區: '248', 八里區: '249', 淡水區: '251', 三芝區: '252', 石門區: '253' },
  桃園市: { 中壢區: '320', 平鎮區: '324', 龍潭區: '325', 楊梅區: '326', 新屋區: '327', 觀音區: '328', 桃園區: '330', 龜山區: '333', 八德區: '334', 大溪區: '335', 復興區: '336', 大園區: '337', 蘆竹區: '338' },
  新竹市: { 東區: '300', 北區: '300', 香山區: '300' },
  新竹縣: { 竹北市: '302', 湖口鄉: '303', 新豐鄉: '304', 新埔鎮: '305', 關西鎮: '306', 芎林鄉: '307', 寶山鄉: '308', 竹東鎮: '310', 五峰鄉: '311', 橫山鄉: '312', 尖石鄉: '313', 北埔鄉: '314', 峨眉鄉: '315' },
  苗栗縣: { 竹南鎮: '350', 頭份市: '351', 三灣鄉: '352', 南庄鄉: '353', 獅潭鄉: '354', 後龍鎮: '356', 通霄鎮: '357', 苑裡鎮: '358', 苗栗市: '360', 造橋鄉: '361', 頭屋鄉: '362', 公館鄉: '363', 大湖鄉: '364', 泰安鄉: '365', 銅鑼鄉: '366', 三義鄉: '367', 西湖鄉: '368', 卓蘭鎮: '369' },
  臺中市: { 中區: '400', 東區: '401', 南區: '402', 西區: '403', 北區: '404', 北屯區: '406', 西屯區: '407', 南屯區: '408', 太平區: '411', 大里區: '412', 霧峰區: '413', 烏日區: '414', 豐原區: '420', 后里區: '421', 石岡區: '422', 東勢區: '423', 和平區: '424', 新社區: '426', 潭子區: '427', 大雅區: '428', 神岡區: '429', 大肚區: '432', 沙鹿區: '433', 龍井區: '434', 梧棲區: '435', 清水區: '436', 大甲區: '437', 外埔區: '438', 大安區: '439' },
  彰化縣: { 彰化市: '500', 芬園鄉: '502', 花壇鄉: '503', 秀水鄉: '504', 鹿港鎮: '505', 福興鄉: '506', 線西鄉: '507', 和美鎮: '508', 伸港鄉: '509', 員林市: '510', 社頭鄉: '511', 永靖鄉: '512', 埔心鄉: '513', 溪湖鎮: '514', 大村鄉: '515', 埔鹽鄉: '516', 田中鎮: '520', 北斗鎮: '521', 田尾鄉: '522', 埤頭鄉: '523', 溪州鄉: '524', 竹塘鄉: '525', 二林鎮: '526', 大城鄉: '527', 芳苑鄉: '528', 二水鄉: '530' },
  南投縣: { 南投市: '540', 中寮鄉: '541', 草屯鎮: '542', 國姓鄉: '544', 埔里鎮: '545', 仁愛鄉: '546', 名間鄉: '551', 集集鎮: '552', 水里鄉: '553', 魚池鄉: '555', 信義鄉: '556', 竹山鎮: '557', 鹿谷鄉: '558' },
  雲林縣: { 斗南鎮: '630', 大埤鄉: '631', 虎尾鎮: '632', 土庫鎮: '633', 褒忠鄉: '634', 東勢鄉: '635', 臺西鄉: '636', 崙背鄉: '637', 麥寮鄉: '638', 斗六市: '640', 林內鄉: '643', 古坑鄉: '646', 莿桐鄉: '647', 西螺鎮: '648', 二崙鄉: '649', 北港鎮: '651', 水林鄉: '652', 口湖鄉: '653', 四湖鄉: '654', 元長鄉: '655' },
  嘉義市: { 東區: '600', 西區: '600' },
  嘉義縣: { 番路鄉: '602', 梅山鄉: '603', 竹崎鄉: '604', 阿里山鄉: '605', 中埔鄉: '606', 大埔鄉: '607', 水上鄉: '608', 鹿草鄉: '611', 太保市: '612', 朴子市: '613', 東石鄉: '614', 六腳鄉: '615', 新港鄉: '616', 民雄鄉: '621', 大林鎮: '622', 溪口鄉: '623', 義竹鄉: '624', 布袋鎮: '625' },
  臺南市: { 中西區: '700', 東區: '701', 南區: '702', 北區: '704', 安平區: '708', 安南區: '709', 永康區: '710', 歸仁區: '711', 新化區: '712', 左鎮區: '713', 玉井區: '714', 楠西區: '715', 南化區: '716', 仁德區: '717', 關廟區: '718', 龍崎區: '719', 官田區: '720', 麻豆區: '721', 佳里區: '722', 西港區: '723', 七股區: '724', 將軍區: '725', 學甲區: '726', 北門區: '727', 新營區: '730', 後壁區: '731', 白河區: '732', 東山區: '733', 六甲區: '734', 下營區: '735', 柳營區: '736', 鹽水區: '737', 善化區: '741', 大內區: '742', 山上區: '743', 新市區: '744', 安定區: '745' },
  高雄市: { 新興區: '800', 前金區: '801', 苓雅區: '802', 鹽埕區: '803', 鼓山區: '804', 旗津區: '805', 前鎮區: '806', 三民區: '807', 楠梓區: '811', 小港區: '812', 左營區: '813', 仁武區: '814', 大社區: '815', 岡山區: '820', 路竹區: '821', 阿蓮區: '822', 田寮區: '823', 燕巢區: '824', 橋頭區: '825', 梓官區: '826', 彌陀區: '827', 永安區: '828', 湖內區: '829', 鳳山區: '830', 大寮區: '831', 林園區: '832', 鳥松區: '833', 大樹區: '840', 旗山區: '842', 美濃區: '843', 六龜區: '844', 內門區: '845', 杉林區: '846', 甲仙區: '847', 桃源區: '848', 那瑪夏區: '849', 茂林區: '851', 茄萣區: '852' },
  屏東縣: { 屏東市: '900', 三地門鄉: '901', 霧臺鄉: '902', 瑪家鄉: '903', 九如鄉: '904', 里港鄉: '905', 高樹鄉: '906', 鹽埔鄉: '907', 長治鄉: '908', 麟洛鄉: '909', 竹田鄉: '911', 內埔鄉: '912', 萬丹鄉: '913', 潮州鎮: '920', 泰武鄉: '921', 來義鄉: '922', 萬巒鄉: '923', 崁頂鄉: '924', 新埤鄉: '925', 南州鄉: '926', 林邊鄉: '927', 東港鎮: '928', 琉球鄉: '929', 佳冬鄉: '931', 新園鄉: '932', 枋寮鄉: '940', 枋山鄉: '941', 春日鄉: '942', 獅子鄉: '943', 車城鄉: '944', 牡丹鄉: '945', 恆春鎮: '946', 滿州鄉: '947' },
  臺東縣: { 臺東市: '950', 綠島鄉: '951', 蘭嶼鄉: '952', 延平鄉: '953', 卑南鄉: '954', 鹿野鄉: '955', 關山鎮: '956', 海端鄉: '957', 池上鄉: '958', 東河鄉: '959', 成功鎮: '961', 長濱鄉: '962', 太麻里鄉: '963', 金峰鄉: '964', 大武鄉: '965', 達仁鄉: '966' },
  花蓮縣: { 花蓮市: '970', 新城鄉: '971', 秀林鄉: '972', 吉安鄉: '973', 壽豐鄉: '974', 鳳林鎮: '975', 光復鄉: '976', 豐濱鄉: '977', 瑞穗鄉: '978', 萬榮鄉: '979', 玉里鎮: '981', 卓溪鄉: '982', 富里鄉: '983' },
  宜蘭縣: { 宜蘭市: '260', 頭城鎮: '261', 礁溪鄉: '262', 壯圍鄉: '263', 員山鄉: '264', 羅東鎮: '265', 三星鄉: '266', 大同鄉: '267', 五結鄉: '268', 冬山鄉: '269', 蘇澳鎮: '270', 南澳鄉: '272' },
  澎湖縣: { 馬公市: '880', 西嶼鄉: '881', 望安鄉: '882', 七美鄉: '883', 白沙鄉: '884', 湖西鄉: '885' },
  金門縣: { 金沙鎮: '890', 金湖鎮: '891', 金寧鄉: '892', 金城鎮: '893', 烈嶼鄉: '894', 烏坵鄉: '896' },
  連江縣: { 南竿鄉: '209', 北竿鄉: '210', 莒光鄉: '211', 東引鄉: '212' }
};

const STORAGE_LOCAL_CONFIG_KEY = 'hct_pwa_local_config_v3';
const STORAGE_FAV_RECIPIENTS_KEY = 'hct_pwa_fav_recipients_v3';
const STORAGE_LOCAL_RECORDS_KEY = 'hct_pwa_local_records_v3';

let html5QrScanner = null;
let isCameraScanning = false;
let currentInvoice = '';
let currentQrUrl = '';
let currentVersion = '20250821';

// LINE LIFF 狀態
let isLiffReady = false;
let isInLineClient = false;
let liffProfile = null; // { userId, displayName, pictureUrl }
let lastSuccessSummaryText = '';

// 手寫簽名畫布狀態
let sigCanvas = null;
let sigCtx = null;
let isDrawingSig = false;
let hasSignatureContent = false;
let strokeCount = 0;

function showToast(msg, duration = 3000) {
  const el = document.getElementById('toast');
  el.textContent = msg;
  el.style.display = 'block';
  clearTimeout(el._timer);
  el._timer = setTimeout(() => {
    el.style.display = 'none';
  }, duration);
}

function formatInvoiceDisplay(num) {
  const s = String(num || '').replace(/\D/g, '');
  if (s.length === 10) {
    return `${s.slice(0, 3)}-${s.slice(3, 6)}-${s.slice(6)}`;
  }
  return s || '尚未掃描';
}

function getLocalConfig() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_LOCAL_CONFIG_KEY)) || {};
  } catch {
    return {};
  }
}

function saveLocalConfig(partial) {
  const prev = getLocalConfig();
  const next = { ...prev, ...partial };
  localStorage.setItem(STORAGE_LOCAL_CONFIG_KEY, JSON.stringify(next));
  updateHeaderStatus();
  return next;
}

function getGasUrl() {
  const cfg = getLocalConfig();
  return (cfg.gsheetUrl || document.getElementById('set-gsheet-url')?.value || '').trim();
}

function getLiffId() {
  const cfg = getLocalConfig();
  return (cfg.liffId || document.getElementById('set-liff-id')?.value || '').trim();
}

function updateHeaderStatus() {
  const sub = document.getElementById('header-mode-sub');
  const gasUrl = getGasUrl();
  const userPrefix = liffProfile ? `👤 ${liffProfile.displayName}｜` : '';
  if (gasUrl && gasUrl.startsWith('https://script.google.com/')) {
    sub.textContent = `${userPrefix}☁️ 已連線公司 Google Sheet 集中報帳`;
  } else {
    sub.textContent = `${userPrefix}⚠️ 請點右上角「⚙️ 設定」貼上公司 Google Sheet 網址`;
  }
}

// ==================== LINE LIFF 初始化與自動抓取同仁名稱 ====================
async function initLiffIfConfigured() {
  const liffId = getLiffId();
  if (!liffId || typeof window.liff === 'undefined') {
    return;
  }

  try {
    await window.liff.init({ liffId });
    isLiffReady = true;
    isInLineClient = window.liff.isInClient();

    if (window.liff.isLoggedIn()) {
      liffProfile = await window.liff.getProfile();
      const cfg = getLocalConfig();
      const senderInput = document.getElementById('Sender_Name');
      if (!cfg.senderName && !senderInput.value.trim()) {
        senderInput.value = liffProfile.displayName;
      }
      updateHeaderStatus();
    } else if (isInLineClient) {
      window.liff.login();
    }
  } catch (err) {
    console.warn('LIFF init warning:', err.message);
  }
}

/**
 * 統一呼叫後端：
 * 1. 新竹物流 API (查單號、查客代、查路名、送出託運單) 優先走 server.js (/api/...) 避開 Cloudflare 封鎖
 * 2. 若為 init-sync 或無 server.js，則直接呼叫 Google Apps Script (gasUrl)
 */
async function callBackend(action, payload = {}) {
  const gasUrl = getGasUrl();

  const localMap = {
    'inspect-qr': { url: '/api/hct/inspect-qr', method: 'POST' },
    'cust-data': { url: '/api/hct/cust-data', method: 'POST' },
    cities: { url: '/api/hct/cities', method: 'POST' },
    roads: { url: '/api/hct/roads', method: 'POST' },
    'product-types': { url: '/api/hct/product-types', method: 'POST' },
    'to-stno': { url: '/api/hct/to-stno', method: 'POST' },
    'rely-fee': { url: '/api/hct/rely-fee', method: 'POST' },
    submit: { url: '/api/submit', method: 'POST' }
  };

  if (action === 'init-sync' && gasUrl) {
    const res = await fetch(gasUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({ action, ...payload }),
      redirect: 'follow'
    });
    return await res.json();
  }

  const route = localMap[action];
  if (route) {
    try {
      const res = await fetch(route.url, {
        method: route.method,
        headers: route.method === 'POST' ? { 'Content-Type': 'application/json' } : undefined,
        body: route.method === 'POST' ? JSON.stringify(payload) : undefined
      });
      if (res.ok || res.status === 400) {
        return await res.json();
      }
    } catch {}
  }

  if (gasUrl && gasUrl.startsWith('https://script.google.com/')) {
    const res = await fetch(gasUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({ action, ...payload }),
      redirect: 'follow'
    });
    return await res.json();
  }

  return { ok: false, error: '無法連線至後端伺服器' };
}

function initCountrySelects() {
  const selects = ['Sender_Country', 'Recipient_Country', 'ToCountry'];
  selects.forEach((id) => {
    const sel = document.getElementById(id);
    if (!sel) return;
    sel.innerHTML =
      `<option value="">請選擇縣市</option>` +
      HCT_COUNTRIES.map((c) => `<option value="${c}">${c}</option>`).join('');
  });
}

// ==================== 手寫簽名板 (Canvas) 初始化與儲存 ====================
function initSignaturePad() {
  sigCanvas = document.getElementById('sig-canvas');
  const wrap = document.getElementById('sig-canvas-wrap');
  if (!sigCanvas || !wrap) return;

  const rect = wrap.getBoundingClientRect();
  sigCanvas.width = Math.max(rect.width || 340, 300);
  sigCanvas.height = Math.max(rect.height || 170, 160);

  sigCtx = sigCanvas.getContext('2d');
  sigCtx.fillStyle = '#ffffff';
  sigCtx.fillRect(0, 0, sigCanvas.width, sigCanvas.height);
  sigCtx.lineCap = 'round';
  sigCtx.lineJoin = 'round';
  sigCtx.lineWidth = 4;
  sigCtx.strokeStyle = '#0f172a';

  const getPos = (e) => {
    const r = sigCanvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return {
      x: ((clientX - r.left) * sigCanvas.width) / r.width,
      y: ((clientY - r.top) * sigCanvas.height) / r.height
    };
  };

  const startDraw = (e) => {
    e.preventDefault();
    isDrawingSig = true;
    const pos = getPos(e);
    sigCtx.beginPath();
    sigCtx.moveTo(pos.x, pos.y);
    document.getElementById('sig-placeholder').style.display = 'none';
  };

  const moveDraw = (e) => {
    if (!isDrawingSig) return;
    e.preventDefault();
    const pos = getPos(e);
    sigCtx.lineTo(pos.x, pos.y);
    sigCtx.stroke();
    strokeCount++;
    if (strokeCount > 5) {
      hasSignatureContent = true;
    }
  };

  const endDraw = () => {
    isDrawingSig = false;
  };

  sigCanvas.addEventListener('mousedown', startDraw);
  sigCanvas.addEventListener('mousemove', moveDraw);
  window.addEventListener('mouseup', endDraw);

  sigCanvas.addEventListener('touchstart', startDraw, { passive: false });
  sigCanvas.addEventListener('touchmove', moveDraw, { passive: false });
  window.addEventListener('touchend', endDraw);
}

function clearSignatureCanvas() {
  if (!sigCanvas || !sigCtx) return;
  sigCtx.fillStyle = '#ffffff';
  sigCtx.fillRect(0, 0, sigCanvas.width, sigCanvas.height);
  hasSignatureContent = false;
  strokeCount = 0;
  document.getElementById('sig-placeholder').style.display = 'flex';
  showToast('🧹 已清除簽名，請重新手寫簽名');
}

function loadSavedSignatureToCanvas(dataUrl) {
  if (!dataUrl || !sigCanvas || !sigCtx) return;
  const img = new Image();
  img.onload = () => {
    sigCtx.fillStyle = '#ffffff';
    sigCtx.fillRect(0, 0, sigCanvas.width, sigCanvas.height);
    sigCtx.drawImage(img, 0, 0, sigCanvas.width, sigCanvas.height);
    hasSignatureContent = true;
    strokeCount = 30;
    document.getElementById('sig-placeholder').style.display = 'none';
  };
  img.src = dataUrl;
}

// ==================== 載入本機記憶的客代、寄件人與簽名 ====================
async function syncServerDefaultConfig() {
  // 公開版零機密設計：設定僅存於使用者設備本機 (localStorage)
}

async function applyLocalConfigToForm() {
  const cfg = getLocalConfig();

  document.getElementById('set-liff-id').value = cfg.liffId || '';
  document.getElementById('set-gsheet-url').value = cfg.gsheetUrl || '';
  document.getElementById('set-default-cust-id').value = cfg.custId || '';

  document.getElementById('CustID_Value').value = cfg.custId || '';
  if (cfg.sendType) selectSeg('Send_Type', cfg.sendType);
  if (cfg.goodsType) selectSeg('Goods_Type', cfg.goodsType);

  if (cfg.senderName) document.getElementById('Sender_Name').value = cfg.senderName;
  if (cfg.senderPhone) document.getElementById('Sender_Phone').value = cfg.senderPhone;
  if (cfg.senderExt) document.getElementById('Sender_Ext').value = cfg.senderExt;

  if (cfg.senderCountry) {
    document.getElementById('Sender_Country').value = cfg.senderCountry;
    await onCountryChange('Sender', cfg.senderCity || '', cfg.senderRoad || '');
  }
  if (cfg.senderZip) document.getElementById('Sender_zip').value = cfg.senderZip;
  if (cfg.senderAddress) document.getElementById('Sender_Address').value = cfg.senderAddress;

  if (cfg.signature) {
    loadSavedSignatureToCanvas(cfg.signature);
  }

  updateHeaderStatus();
}

function selectSeg(fieldId, val) {
  document.getElementById(fieldId).value = val;
  const groupMap = {
    Send_Type: 'seg-send-type',
    Goods_Type: 'seg-goods-type',
    DeliveryType: 'seg-delivery-type'
  };
  const groupId = groupMap[fieldId];
  if (groupId) {
    document.querySelectorAll(`#${groupId} .seg-btn`).forEach((btn) => {
      btn.classList.toggle('active', btn.dataset.val === val);
    });
  }

  if (fieldId === 'Send_Type') {
    document.getElementById('cod-box').style.display = val === '41' ? 'block' : 'none';
  } else if (fieldId === 'Goods_Type') {
    loadProductTypes(val);
  } else if (fieldId === 'DeliveryType') {
    document.getElementById('stno-box').style.display = val === '1' ? 'block' : 'none';
    document.getElementById('recipient-addr-box').style.display = val === '2' ? 'block' : 'none';
  }
}

function onProductTypeChange() {
  const val = document.getElementById('ProductType').value;
  const isStudentLuggage = val === '011';
  if (isStudentLuggage) {
    document.getElementById('Replay').checked = false;
    document.getElementById('ValueDeclared').value = '';
    document.getElementById('ValueDeclared').disabled = true;
    document.getElementById('Content').value = '';
    document.getElementById('Content').disabled = true;
  } else {
    document.getElementById('ValueDeclared').disabled = false;
    document.getElementById('Content').disabled = false;
  }
}

async function loadProductTypes(goodsType) {
  try {
    const json = await callBackend('product-types', { goodsType });
    if (json.ok && Array.isArray(json.data) && json.data.length > 0) {
      const sel = document.getElementById('ProductType');
      const prev = sel.value;
      sel.innerHTML = json.data
        .map((item) => `<option value="${item.ColValue}">${item.ColValueRemark}</option>`)
        .join('');
      if ([...sel.options].some((o) => o.value === prev)) {
        sel.value = prev;
      }
    }
  } catch {}
}

// ==================== 縣市 -> 鄉鎮市區 -> 郵遞區號 & 路名聯動 ====================
async function onCountryChange(prefix, targetCity = '', targetRoad = '') {
  const country = document.getElementById(`${prefix}_Country`).value;
  const citySel = document.getElementById(`${prefix}_City`);
  const roadSel = document.getElementById(`${prefix}_Road`);
  const zipInput = document.getElementById(`${prefix}_zip`);

  citySel.innerHTML = `<option value="">請選擇鄉鎮市區</option>`;
  roadSel.innerHTML = `<option value="">---------</option>`;
  if (zipInput) zipInput.value = '';

  if (!country) return;

  const districtMap = TW_DISTRICTS[country];
  if (districtMap) {
    const districts = Object.keys(districtMap);
    citySel.innerHTML =
      `<option value="">請選擇鄉鎮市區</option>` +
      districts.map((d) => `<option value="${d}">${d}</option>`).join('');
    if (targetCity) {
      citySel.value = targetCity;
      await onCityChange(prefix, targetRoad);
    }
    return;
  }
}

async function onCityChange(prefix, targetRoad = '') {
  const country = document.getElementById(`${prefix}_Country`).value;
  const city = document.getElementById(`${prefix}_City`).value;
  const roadSel = document.getElementById(`${prefix}_Road`);
  const zipInput = document.getElementById(`${prefix}_zip`);

  roadSel.innerHTML = `<option value="">---------</option>`;
  if (!country || !city) return;

  if (zipInput && TW_DISTRICTS[country] && TW_DISTRICTS[country][city]) {
    zipInput.value = TW_DISTRICTS[country][city];
  }

  try {
    const json = await callBackend('roads', { country, city });
    if (json && json.ok) {
      if (zipInput && json.zip) zipInput.value = json.zip;
      if (Array.isArray(json.roads) && json.roads.length > 0) {
        roadSel.innerHTML = json.roads
          .map((r) => `<option value="${r.ID}">${r.Road}</option>`)
          .join('');
        if (targetRoad) {
          roadSel.value = targetRoad;
        }
      }
    }
    if (prefix === 'Recipient') {
      checkRelyFee();
    }
  } catch {}
}

async function onToCountryChange() {
  const country = document.getElementById('ToCountry').value;
  const goodsType = document.getElementById('Goods_Type').value;
  const stnoSel = document.getElementById('ToStno');
  stnoSel.innerHTML = `<option value="">---------</option>`;
  if (!country) return;

  try {
    const json = await callBackend('to-stno', { country, goodsType });
    if (json.ok && Array.isArray(json.data)) {
      stnoSel.innerHTML = json.data
        .map((s) => `<option value="${s.Stno}">${s.StnoName}</option>`)
        .join('');
    }
  } catch {}
}

function onToStnoChange() {
  const stnoSel = document.getElementById('ToStno');
  const selectedText = stnoSel.options[stnoSel.selectedIndex]?.text || '';
  if (stnoSel.value && selectedText) {
    document.getElementById('Recipient_Address').value = selectedText.trim();
  }
}

async function checkRelyFee() {
  const addr =
    (document.getElementById('Recipient_Country').value || '') +
    (document.getElementById('Recipient_City').value || '') +
    (document.getElementById('Recipient_Road').value || '') +
    (document.getElementById('Recipient_Address').value || '').trim();
  if (!addr) return;

  try {
    const json = await callBackend('rely-fee', { address: addr });
    if (json.ok && json.data) {
      document.getElementById('RelyFee1').value = json.data.RelyFee1 || '';
      document.getElementById('RelyFee2').value = json.data.RelyFee2 || '';
      document.getElementById('rely-fee-alert').style.display = json.data.RelyFee1 ? 'block' : 'none';
    }
  } catch {}
}

// ==================== 驗證 11 碼客代 ====================
async function fetchCustDataFromHct() {
  const custId = document.getElementById('CustID_Value').value.replace(/\D/g, '');
  if (custId.length !== 11) {
    showToast('⚠️ 契約客戶代號必須為 11 碼數字');
    return;
  }

  showToast('正在向新竹物流驗證客代...');
  try {
    const json = await callBackend('cust-data', { custId });
    if (!json.ok || !json.data || json.data.Result !== 'Success') {
      showToast('❌ 客代輸入錯誤或查無此契約客代');
      return;
    }

    const d = json.data;
    if (d.Cust_Available !== 'Y') {
      showToast('⚠️ 此客代不得使用數位託運單出貨');
      return;
    }

    if (d.Cust_ValuationMethod === '4') {
      document.getElementById('Count').value = '1';
    }

    if (!document.getElementById('Sender_Name').value.trim() && d.Sender_Name) {
      document.getElementById('Sender_Name').value = liffProfile
        ? `${d.Sender_Name}-${liffProfile.displayName}`
        : d.Sender_Name;
    }
    if (!document.getElementById('Sender_Phone').value.trim() && d.Sender_Phone) {
      document.getElementById('Sender_Phone').value = d.Sender_Phone;
    }
    if (!document.getElementById('Sender_Country').value && d.Sender_Country) {
      document.getElementById('Sender_Country').value = d.Sender_Country;
      await onCountryChange('Sender', d.Sender_City || '', d.Sender_Road || '');
    }
    if (!document.getElementById('Sender_Address').value.trim() && d.Sender_Address) {
      document.getElementById('Sender_Address').value = d.Sender_Address;
    }

    saveLocalConfig({ custId });
    showToast(`✅ 客代驗證成功 (${d.Sender_Name || custId})`);
  } catch (e) {
    showToast('驗證客代失敗：' + e.message);
  }
}

// ==================== QR Code 掃描（優先使用 LINE 原生 liff.scanCodeV2，備援網頁相機） ====================
async function triggerQrScan() {
  if (isLiffReady && isInLineClient && window.liff && typeof window.liff.scanCodeV2 === 'function') {
    try {
      const result = await window.liff.scanCodeV2();
      if (result && result.value) {
        await inspectQrInput(result.value);
      }
      return;
    } catch (err) {
      console.warn('liff.scanCodeV2 fallback to web camera:', err);
    }
  }
  await toggleCameraScan();
}

async function toggleCameraScan() {
  const readerEl = document.getElementById('qr-reader');
  const btn = document.getElementById('btn-camera-scan');

  if (isCameraScanning && html5QrScanner) {
    await html5QrScanner.stop();
    readerEl.style.display = 'none';
    isCameraScanning = false;
    btn.textContent = '📷 掃描物流貼紙QRCode';
    return;
  }

  readerEl.style.display = 'block';
  btn.textContent = '⏹️ 停止掃描';
  if (!html5QrScanner) {
    html5QrScanner = new Html5Qrcode('qr-reader');
  }

  try {
    isCameraScanning = true;
    await html5QrScanner.start(
      { facingMode: 'environment' },
      { fps: 10, qrbox: { width: 240, height: 240 } },
      async (decodedText) => {
        await html5QrScanner.stop();
        readerEl.style.display = 'none';
        isCameraScanning = false;
        btn.textContent = '📷 掃描物流貼紙QRCode';
        await inspectQrInput(decodedText);
      },
      () => {}
    );
  } catch {
    isCameraScanning = false;
    readerEl.style.display = 'none';
    btn.textContent = '📷 掃描物流貼紙QRCode';
    showToast('無法啟動相機（需 HTTPS 或在 LINE 內開啟），亦可直接手動輸入 10 碼單號');
  }
}

async function inspectQrInput(overrideText) {
  const qrText = (overrideText || document.getElementById('qr-raw-input').value || '').trim();
  if (!qrText) {
    showToast('請先掃描 QR Code 或輸入 10 碼單號');
    return;
  }

  if (qrText.startsWith('http')) {
    try {
      const u = new URL(qrText);
      const iParam = u.searchParams.get('i');
      if (iParam && /^\d{10}$/.test(iParam)) {
        currentInvoice = iParam;
        currentQrUrl = qrText;
        document.getElementById('qr-raw-input').value = currentInvoice;
        document.getElementById('invoice-banner').style.display = 'flex';
        document.getElementById('display-invoice').textContent = formatInvoiceDisplay(currentInvoice);
      }
    } catch {}
  } else {
    const digits = qrText.replace(/\D/g, '');
    if (digits.length === 10) {
      currentInvoice = digits;
      document.getElementById('qr-raw-input').value = currentInvoice;
      document.getElementById('invoice-banner').style.display = 'flex';
      document.getElementById('display-invoice').textContent = formatInvoiceDisplay(currentInvoice);
    }
  }

  showToast('正在讀取託運單號...');
  try {
    const json = await callBackend('inspect-qr', { qrText });
    if (!json.ok) {
      if (currentInvoice) {
        document.getElementById('qr-raw-input').value = currentInvoice;
        showToast(`✅ 已綁定單號：${formatInvoiceDisplay(currentInvoice)}`);
        return;
      }
      showToast('❌ ' + (json.error || '讀取單號失敗'));
      return;
    }

    currentInvoice = json.invoice;
    currentQrUrl = json.qrUrl || '';
    currentVersion = json.data?.Version || '20250821';

    document.getElementById('qr-raw-input').value = currentInvoice;
    document.getElementById('invoice-banner').style.display = 'flex';
    document.getElementById('display-invoice').textContent = formatInvoiceDisplay(currentInvoice);

    const stateTag = document.getElementById('invoice-state-tag');
    if (json.isExistingData && json.data) {
      stateTag.textContent = '已填過資料(已載入)';
      stateTag.className = 'status-tag warn';
      await populateExistingHctData(json.data);
      showToast(`✅ 單號 ${formatInvoiceDisplay(currentInvoice)} 已有資料，已自動載入表單！`);
    } else {
      stateTag.textContent = '新託運單';
      stateTag.className = 'status-tag ok';
      showToast(`✅ 已綁定託運單號：${formatInvoiceDisplay(currentInvoice)}`);
    }
  } catch {
    if (currentInvoice) {
      showToast(`✅ 已綁定單號：${formatInvoiceDisplay(currentInvoice)}`);
    }
  }
}

async function populateExistingHctData(d) {
  if (d.CustID_Value) document.getElementById('CustID_Value').value = d.CustID_Value;
  if (d.Send_Type) selectSeg('Send_Type', d.Send_Type);
  if (d.Goods_Type) selectSeg('Goods_Type', d.Goods_Type);
  if (d.Sender_Name) document.getElementById('Sender_Name').value = d.Sender_Name;
  if (d.Sender_Phone) document.getElementById('Sender_Phone').value = d.Sender_Phone;
  if (d.Sender_Ext) document.getElementById('Sender_Ext').value = d.Sender_Ext;
  if (d.Sender_Country) {
    document.getElementById('Sender_Country').value = d.Sender_Country;
    await onCountryChange('Sender', d.Sender_City, d.Sender_Road);
  }
  if (d.Sender_Address) document.getElementById('Sender_Address').value = d.Sender_Address;

  if (d.Recipient_Name) document.getElementById('Recipient_Name').value = d.Recipient_Name;
  if (d.Recipient_Phone) document.getElementById('Recipient_Phone').value = d.Recipient_Phone;
  if (d.Recipient_Ext) document.getElementById('Recipient_Ext').value = d.Recipient_Ext;
  if (d.DeliveryType) selectSeg('DeliveryType', d.DeliveryType);
  if (d.Recipient_Country) {
    document.getElementById('Recipient_Country').value = d.Recipient_Country;
    await onCountryChange('Recipient', d.Recipient_City, d.Recipient_Road);
  }
  if (d.Recipient_Address) document.getElementById('Recipient_Address').value = d.Recipient_Address;
  if (d.Count) document.getElementById('Count').value = d.Count;
  if (d.Content) document.getElementById('Content').value = d.Content;
  if (d.Remark) document.getElementById('Remark').value = d.Remark;
  if (d.Date) document.getElementById('Date').value = d.Date;
  if (d.ValueDeclared) document.getElementById('ValueDeclared').value = d.ValueDeclared;
}

// ==================== 新竹物流電話格式驗證 ====================
function checkHctPhoneNumber(phone) {
  const p = String(phone || '').replace(/\D/g, '');
  if (p.startsWith('02') || p.startsWith('09')) return p.length === 10;
  if (p.startsWith('072') || p.startsWith('073')) return p.length >= 9 && p.length <= 10;
  if (p.startsWith('03') || p.startsWith('05') || p.startsWith('06') || p.startsWith('07') || p.startsWith('08')) {
    if (p.length === 9) return true;
    if (p.startsWith('080') && p.length >= 8 && p.length <= 10) return true;
  }
  if (p.startsWith('04') && !p.startsWith('049')) return p.length >= 9 && p.length <= 10;
  if (p.startsWith('049')) return p.length === 10;
  return false;
}

// ==================== 完成送出 (新竹物流 + Google Sheet 集中儲存 + LIFF 彈窗) ====================
async function submitWaybill(submitToHct = true) {
  if (!currentInvoice) {
    const rawVal = document.getElementById('qr-raw-input').value.trim();
    if (rawVal) {
      await inspectQrInput(rawVal);
    }
    if (!currentInvoice) {
      showToast('⚠️ 請先掃描物流貼紙 QR Code 或輸入 10 碼託運單號');
      return;
    }
  }

  const custId = document.getElementById('CustID_Value').value.replace(/\D/g, '');
  const sendType = document.getElementById('Send_Type').value;
  const goodsType = document.getElementById('Goods_Type').value;
  const senderNameRaw = document.getElementById('Sender_Name').value.trim();
  const senderPhone = document.getElementById('Sender_Phone').value.replace(/\D/g, '');
  const senderExt = document.getElementById('Sender_Ext').value.replace(/\D/g, '');
  const senderCountry = document.getElementById('Sender_Country').value;
  const senderCity = document.getElementById('Sender_City').value;
  const senderRoad = document.getElementById('Sender_Road').value;
  const senderAddress = document.getElementById('Sender_Address').value.trim();

  const recipientName = document.getElementById('Recipient_Name').value.trim();
  const recipientPhone = document.getElementById('Recipient_Phone').value.replace(/\D/g, '');
  const recipientExt = document.getElementById('Recipient_Ext').value.replace(/\D/g, '');
  const deliveryType = document.getElementById('DeliveryType').value;
  const recipientCountry = document.getElementById('Recipient_Country').value;
  const recipientCity = document.getElementById('Recipient_City').value;
  const recipientRoad = document.getElementById('Recipient_Road').value;
  const recipientAddress = document.getElementById('Recipient_Address').value.trim();
  const countVal = document.getElementById('Count').value.replace(/\D/g, '');

  if ((sendType === '11' || sendType === '41') && custId.length !== 11) {
    showToast('⚠️ 月結或代收貨款必須填寫 11 碼契約客戶客代');
    return;
  }
  if (!senderNameRaw) {
    showToast('⚠️ 步驟 2：寄件人姓名/公司名不可空白');
    return;
  }
  if (!checkHctPhoneNumber(senderPhone)) {
    showToast('⚠️ 步驟 2：寄件人電話格式有誤（手機 09 開頭 10 碼，市話如 02 為 10 碼、03 為 9 碼）');
    return;
  }
  if (!senderAddress || (!senderCountry && custId.length !== 11)) {
    showToast('⚠️ 步驟 2：寄件地址欄位不可空白');
    return;
  }
  if (!recipientName) {
    showToast('⚠️ 步驟 3：收件人姓名/公司名不可空白');
    return;
  }
  if (!checkHctPhoneNumber(recipientPhone)) {
    showToast('⚠️ 步驟 3：收件人電話格式有誤（手機 09 開頭 10 碼，市話如 02 為 10 碼、03 為 9 碼）');
    return;
  }
  if (deliveryType === '1' && !document.getElementById('ToStno').value) {
    showToast('⚠️ 步驟 3：請選擇自領營業所');
    return;
  }
  if (deliveryType === '2' && (!recipientCountry || !recipientCity || !recipientAddress)) {
    showToast('⚠️ 步驟 3：收件人縣市、鄉鎮市區與地址不可空白');
    return;
  }
  if (!countVal || parseInt(countVal, 10) <= 0) {
    showToast('⚠️ 步驟 4：件數欄位不可空白且須大於 0');
    return;
  }
  if (!hasSignatureContent) {
    showToast('⚠️ 步驟 5：請在簽名欄內手寫簽名');
    document.getElementById('sig-canvas-wrap').scrollIntoView({ behavior: 'smooth', block: 'center' });
    return;
  }

  const signDataUrl = sigCanvas.toDataURL('image/png');

  if (document.getElementById('Save_Sender').checked) {
    saveLocalConfig({
      custId,
      sendType,
      goodsType,
      senderName: senderNameRaw,
      senderPhone,
      senderExt,
      senderZip: document.getElementById('Sender_zip').value,
      senderCountry,
      senderCity,
      senderRoad,
      senderAddress,
      signature: signDataUrl
    });
  } else {
    saveLocalConfig({ signature: signDataUrl });
  }

  // 雙重保障：若有 LIFF 登入且寄件人名稱尚未包含該 LINE 名稱，在寫入 Google Sheet 時自動附註 LINE 名稱
  const senderNameWithLine =
    liffProfile && !senderNameRaw.includes(liffProfile.displayName)
      ? `${senderNameRaw} (LINE:${liffProfile.displayName})`
      : senderNameRaw;

  const productSel = document.getElementById('ProductType');
  const productText = productSel.options[productSel.selectedIndex]?.text || '一般';
  const contentText = document.getElementById('Content').value.trim();
  const remarkText = document.getElementById('Remark').value.trim();

  const formPayload = {
    Invoice: currentInvoice,
    Version: currentVersion,
    CustID_Value: custId,
    Send_Type: sendType,
    Money: document.getElementById('Money').value,
    CreditCard: document.getElementById('CreditCard').checked,
    Goods_Type: goodsType,
    Sender_Name: senderNameWithLine,
    Sender_Phone: senderPhone,
    Sender_Ext: senderExt,
    Sender_Country: senderCountry,
    Sender_City: senderCity,
    Sender_Road: senderRoad,
    Sender_Address: senderAddress,
    Recipient_Name: recipientName,
    Recipient_Phone: recipientPhone,
    Recipient_Ext: recipientExt,
    DeliveryType: deliveryType,
    ToCountry: document.getElementById('ToCountry').value,
    ToStno: document.getElementById('ToStno').value,
    Recipient_Country: recipientCountry,
    Recipient_City: recipientCity,
    Recipient_Road: recipientRoad,
    Recipient_Address: recipientAddress,
    RelyFee1: document.getElementById('RelyFee1').value,
    RelyFee2: document.getElementById('RelyFee2').value,
    ProductType: productSel.value || '001',
    Replay: document.getElementById('Replay').checked,
    ValueDeclared: document.getElementById('ValueDeclared').value,
    Count: countVal,
    Date: document.getElementById('Date').value,
    Content: contentText,
    Remark: remarkText,
    Sign: signDataUrl
  };

  const btn = document.getElementById('btn-submit-both');
  btn.disabled = true;
  showToast(submitToHct ? '🚀 正在送出至新竹物流並寫入公司 Google Sheet...' : '💾 正在寫入公司 Google Sheet...');

  try {
    const json = await callBackend('submit', {
      form: formPayload,
      meta: {
        submitToHct,
        qrUrl: currentQrUrl,
        gsheetWebhookUrl: getGasUrl(),
        Sender_zip: document.getElementById('Sender_zip').value,
        Recipient_zip: document.getElementById('Recipient_zip').value,
        ProductType_Text: productText
      }
    });

    if (json.record) {
      upsertLocalRecord({
        ...json.record,
        formBackup: { ...formPayload, Sign: '' }
      });
    }

    if (deliveryType === '2') {
      saveRecipientToLocalFav({
        name: recipientName,
        phone: recipientPhone,
        ext: recipientExt,
        zip: document.getElementById('Recipient_zip').value,
        country: recipientCountry,
        city: recipientCity,
        road: recipientRoad,
        address: recipientAddress
      });
    }

    if (!json.ok && json.savedToSheet) {
      showToast(
        `⚠️ 新竹物流未送出（${json.error}），但已先留底至試算表！可點右上角「📋 本機紀錄」補送`,
        5000
      );
      return;
    }

    if (!json.ok) {
      showToast('❌ ' + (json.error || '送出失敗'), 4500);
      return;
    }

    const formattedInv = formatInvoiceDisplay(currentInvoice);
    lastSuccessSummaryText =
      `📦 [新竹物流託運單已登錄]\n` +
      `・單號：${formattedInv}\n` +
      `・寄件人：${senderNameWithLine}\n` +
      `・收件人：${recipientName} (${recipientPhone})\n` +
      `・件數：${countVal} 件｜品名：${contentText || '未填'}` +
      (remarkText ? `\n・備註：${remarkText}` : '');

    openSuccessModal({
      title: submitToHct ? '託運單已成功送出！' : '已寫入 Google Sheet 報帳留底！',
      invoice: formattedInv,
      sender: senderNameWithLine,
      recipient: `${recipientName} (${recipientPhone})`,
      count: countVal,
      content: contentText || '未填',
      remark: remarkText
    });

    resetRecipientAndStickerFields();
  } catch (e) {
    showToast('發生錯誤：' + e.message, 4000);
  } finally {
    btn.disabled = false;
  }
}

function openSuccessModal(info) {
  document.getElementById('success-modal-title').textContent = info.title;
  document.getElementById('success-modal-summary').innerHTML = `
    <div><strong>託運單號：</strong><span style="color:#0369a1; font-family:monospace; font-size:1.05rem;">${info.invoice}</span></div>
    <div><strong>寄件同仁：</strong>${info.sender}</div>
    <div><strong>收件對象：</strong>${info.recipient}</div>
    <div><strong>包裹明細：</strong>${info.count} 件｜品名：${info.content}</div>
    ${info.remark ? `<div><strong>備註說明：</strong>${info.remark}</div>` : ''}
  `;
  document.getElementById('modal-success').classList.add('open');
}

function closeSuccessModalAndContinue() {
  document.getElementById('modal-success').classList.remove('open');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

async function sendSummaryToLineChat() {
  if (!lastSuccessSummaryText) return;
  if (isLiffReady && isInLineClient && window.liff) {
    try {
      await window.liff.sendMessages([
        {
          type: 'text',
          text: lastSuccessSummaryText
        }
      ]);
      showToast('💬 已發送寄件摘要至 LINE 聊天室！');
      return;
    } catch (err) {
      console.warn('liff.sendMessages fallback to clipboard:', err);
    }
  }
  try {
    await navigator.clipboard.writeText(lastSuccessSummaryText);
    showToast('📋 已複製寄件摘要文字（可直接貼至 LINE 聊天室）！');
  } catch {
    showToast('已準備好寄件摘要');
  }
}

function closeLiffOrModal() {
  document.getElementById('modal-success').classList.remove('open');
  if (isLiffReady && isInLineClient && window.liff) {
    window.liff.closeWindow();
  }
}

function resetRecipientAndStickerFields() {
  currentInvoice = '';
  currentQrUrl = '';
  document.getElementById('qr-raw-input').value = '';
  document.getElementById('invoice-banner').style.display = 'none';
  document.getElementById('Recipient_Name').value = '';
  document.getElementById('Recipient_Phone').value = '';
  document.getElementById('Recipient_Ext').value = '';
  document.getElementById('Recipient_zip').value = '';
  document.getElementById('Recipient_Country').value = '';
  document.getElementById('Recipient_City').innerHTML = `<option value="">---------</option>`;
  document.getElementById('Recipient_Road').innerHTML = `<option value="">---------</option>`;
  document.getElementById('Recipient_Address').value = '';
  document.getElementById('Content').value = '';
  document.getElementById('Remark').value = '';
  document.getElementById('Date').value = '';
  document.getElementById('ValueDeclared').value = '';
  document.getElementById('Replay').checked = false;
  document.getElementById('rely-fee-alert').style.display = 'none';
}

// ==================== 本機常用收件人彈窗 ====================
function getFavRecipients() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_FAV_RECIPIENTS_KEY)) || [];
  } catch {
    return [];
  }
}

function saveRecipientToLocalFav(item) {
  if (!item.name || !item.phone) return;
  const list = getFavRecipients().filter((r) => r.phone !== item.phone);
  list.unshift(item);
  localStorage.setItem(STORAGE_FAV_RECIPIENTS_KEY, JSON.stringify(list.slice(0, 100)));
}

function openFavRecipientModal() {
  const list = getFavRecipients();
  const container = document.getElementById('fav-modal-list');
  if (!list.length) {
    container.innerHTML = `<div style="text-align:center; padding:24px; color:#94a3b8;">目前尚無常用收件人紀錄（完成送出後系統會自動記憶於本機）</div>`;
  } else {
    container.innerHTML = list
      .map(
        (r, idx) => `
      <div class="record-item" style="display:flex; justify-content:space-between; align-items:center; gap:8px;">
        <div style="font-size:0.88rem; cursor:pointer; flex:1;" onclick="applyFavRecipient(${idx})">
          <div style="font-weight:700; color:#0369a1;">${r.name}（${r.phone}${r.ext ? '#' + r.ext : ''}）</div>
          <div style="color:#475569; font-size:0.8rem;">${r.zip || ''} ${r.country || ''}${r.city || ''}${r.road || ''}${r.address || ''}</div>
        </div>
        <div style="display:flex; gap:6px;">
          <button type="button" class="btn btn-primary btn-sm" onclick="applyFavRecipient(${idx})">帶入</button>
          <button type="button" class="btn btn-danger btn-sm" onclick="deleteFavRecipient(${idx})">刪除</button>
        </div>
      </div>`
      )
      .join('');
  }
  document.getElementById('modal-fav').classList.add('open');
}

function closeFavRecipientModal() {
  document.getElementById('modal-fav').classList.remove('open');
}

async function applyFavRecipient(idx) {
  const r = getFavRecipients()[idx];
  if (!r) return;
  closeFavRecipientModal();
  selectSeg('DeliveryType', '2');
  document.getElementById('Recipient_Name').value = r.name || '';
  document.getElementById('Recipient_Phone').value = r.phone || '';
  document.getElementById('Recipient_Ext').value = r.ext || '';
  if (r.country) {
    document.getElementById('Recipient_Country').value = r.country;
    await onCountryChange('Recipient', r.city || '', r.road || '');
  }
  if (r.zip) document.getElementById('Recipient_zip').value = r.zip;
  document.getElementById('Recipient_Address').value = r.address || '';
  await checkRelyFee();
  showToast(`已帶入常用收件人：${r.name}`);
}

function deleteFavRecipient(idx) {
  const list = getFavRecipients();
  list.splice(idx, 1);
  localStorage.setItem(STORAGE_FAV_RECIPIENTS_KEY, JSON.stringify(list));
  openFavRecipientModal();
}

// ==================== 本機寄件紀錄彈窗 ====================
function getLocalRecords() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_LOCAL_RECORDS_KEY)) || [];
  } catch {
    return [];
  }
}

function upsertLocalRecord(rec) {
  const list = getLocalRecords();
  const cleanInv = String(rec.Invoice || '').replace(/\D/g, '');
  const idx = list.findIndex((r) => String(r.Invoice || '').replace(/\D/g, '') === cleanInv);
  if (idx !== -1) {
    list[idx] = rec;
  } else {
    list.unshift(rec);
  }
  localStorage.setItem(STORAGE_LOCAL_RECORDS_KEY, JSON.stringify(list.slice(0, 150)));
}

function openRecordsModal() {
  const list = getLocalRecords();
  const container = document.getElementById('records-list');
  if (!list.length) {
    container.innerHTML = `<div style="text-align:center; padding:24px; color:#94a3b8;">本機尚無寄件紀錄</div>`;
  } else {
    container.innerHTML = list
      .map((r, idx) => {
        const isSuccess = String(r.hctStatus || '').includes('成功');
        const isFailed = String(r.hctStatus || '').includes('❌');
        return `
        <div class="record-item" style="${isFailed ? 'border-color:#fca5a5; background:#fffafa;' : ''}">
          <div class="record-head">
            <span class="record-invoice">單號：${formatInvoiceDisplay(r.Invoice)}</span>
            <span class="status-tag ${isSuccess ? 'ok' : 'warn'}">${r.hctStatus || '已留底'}</span>
          </div>
          <div style="font-size:0.84rem; line-height:1.5; color:#334155;">
            <div><strong>收件人：</strong>${r.Recipient_Name}（${r.Recipient_Phone}）</div>
            <div><strong>收件地址：</strong>${r.Recipient_FullAddress}</div>
            <div><strong>包裹：</strong>${r.Goods_Type_Text}｜${r.Count}件｜品名：${r.Content || '未填'}</div>
            <div style="display:flex; justify-content:space-between; align-items:center; margin-top:6px; font-size:0.75rem; color:#64748b;">
              <span>🕒 ${r.createdAt}｜📊 ${r.gsheetStatus || ''}</span>
              <button type="button" class="btn btn-primary btn-sm" onclick="reloadRecordToForm(${idx})">
                ${!isSuccess ? '🔄 載入補送' : '✏️ 載入修改'}
              </button>
            </div>
          </div>
        </div>`;
      })
      .join('');
  }
  document.getElementById('modal-records').classList.add('open');
}

function closeRecordsModal() {
  document.getElementById('modal-records').classList.remove('open');
}

async function reloadRecordToForm(idx) {
  const r = getLocalRecords()[idx];
  if (!r) return;
  closeRecordsModal();

  currentInvoice = String(r.Invoice || '').replace(/\D/g, '');
  currentQrUrl = r.qrUrl || '';
  document.getElementById('qr-raw-input').value = currentInvoice;
  document.getElementById('invoice-banner').style.display = 'flex';
  document.getElementById('display-invoice').textContent = formatInvoiceDisplay(currentInvoice);
  document.getElementById('invoice-state-tag').textContent = '修改/補送模式';
  document.getElementById('invoice-state-tag').className = 'status-tag warn';

  const fb = r.formBackup || r;
  if (fb.CustID_Value) document.getElementById('CustID_Value').value = fb.CustID_Value;
  if (fb.Send_Type) selectSeg('Send_Type', fb.Send_Type);
  if (fb.Goods_Type) selectSeg('Goods_Type', fb.Goods_Type);
  if (fb.Recipient_Name) document.getElementById('Recipient_Name').value = fb.Recipient_Name;
  if (fb.Recipient_Phone) document.getElementById('Recipient_Phone').value = fb.Recipient_Phone;
  if (fb.Recipient_Ext) document.getElementById('Recipient_Ext').value = fb.Recipient_Ext;
  if (fb.Recipient_Country) {
    document.getElementById('Recipient_Country').value = fb.Recipient_Country;
    await onCountryChange('Recipient', fb.Recipient_City || '', fb.Recipient_Road || '');
  }
  if (r.Recipient_zip) document.getElementById('Recipient_zip').value = r.Recipient_zip;
  if (fb.Recipient_Address) document.getElementById('Recipient_Address').value = fb.Recipient_Address;
  if (fb.Count) document.getElementById('Count').value = fb.Count;
  if (fb.Content) document.getElementById('Content').value = fb.Content;
  if (fb.Remark) document.getElementById('Remark').value = fb.Remark;

  showToast(`已載入單號 ${formatInvoiceDisplay(currentInvoice)} 資料`);
}

function exportRecordsCsvClient() {
  const list = getLocalRecords();
  if (!list.length) {
    showToast('本機尚無紀錄可匯出');
    return;
  }

  const headers = [
    ['createdAt', '最後更新時間'],
    ['Invoice', '託運單號'],
    ['CustID_Value', '契約客代'],
    ['Send_Type_Text', '寄件類別'],
    ['Goods_Type_Text', '貨件溫層'],
    ['ProductType_Text', '商品種類'],
    ['Count', '件數'],
    ['Content', '品名(內容物)'],
    ['Sender_Name', '寄件人姓名/公司'],
    ['Sender_Phone', '寄件人電話'],
    ['Sender_Ext', '寄件人分機'],
    ['Sender_FullAddress', '寄件人完整地址'],
    ['Recipient_Name', '收件人姓名/公司'],
    ['Recipient_Phone', '收件人電話'],
    ['Recipient_Ext', '收件人分機'],
    ['DeliveryType_Text', '配送方式'],
    ['Recipient_FullAddress', '收件人完整地址'],
    ['Remark', '備註'],
    ['hctStatus', '新竹物流送出狀態']
  ];

  const esc = (v) => {
    const s = v == null ? '' : String(v);
    if (s.includes(',') || s.includes('"') || s.includes('\n')) {
      return `"${s.replace(/"/g, '""')}"`;
    }
    return s;
  };

  const lines = [
    headers.map((h) => esc(h[1])).join(','),
    ...list.map((r) => headers.map((h) => esc(r[h[0]])).join(','))
  ];
  const blob = new Blob(['\uFEFF' + lines.join('\r\n')], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `HCT_Local_Records_${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

// ==================== 系統與 LIFF 設定彈窗 ====================
function openSettingsModal() {
  const cfg = getLocalConfig();
  document.getElementById('set-liff-id').value = cfg.liffId || '';
  document.getElementById('set-gsheet-url').value = cfg.gsheetUrl || '';
  document.getElementById('set-default-cust-id').value =
    document.getElementById('CustID_Value').value || cfg.custId || '';
  document.getElementById('modal-settings').classList.add('open');
}

function closeSettingsModal() {
  document.getElementById('modal-settings').classList.remove('open');
}

async function saveGasSettings() {
  const liffId = document.getElementById('set-liff-id').value.trim();
  const gsheetUrl = document.getElementById('set-gsheet-url').value.trim();
  const defaultCustId = document.getElementById('set-default-cust-id').value.replace(/\D/g, '');

  saveLocalConfig({ liffId, gsheetUrl, custId: defaultCustId });
  if (defaultCustId) {
    document.getElementById('CustID_Value').value = defaultCustId;
  }

  try {
    await fetch('/api/config', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ liffId, gsheetUrl, defaultCustId })
    });
  } catch {}

  closeSettingsModal();
  if (liffId && !isLiffReady) {
    await initLiffIfConfigured();
  }
  showToast('💾 已儲存設定（所有連入此伺服器的同仁將自動套用）！');
}

async function testGsheetWebhook() {
  const gsheetUrl = document.getElementById('set-gsheet-url').value.trim();
  if (!gsheetUrl) {
    showToast('⚠️ 請先貼上 Google Apps Script 網址');
    return;
  }
  saveLocalConfig({ gsheetUrl });
  showToast('正在測試連線至公司 Google Sheet...');
  try {
    const json = await callBackend('init-sync');
    if (json && json.ok) {
      showToast('🎉 連線成功！寄件資料將集中寫入 Google Sheet');
    } else {
      showToast('❌ 連線失敗：' + (json.error || '請確認部署權限設為所有人'));
    }
  } catch (e) {
    showToast('連線失敗：' + e.message);
  }
}

async function copyColleagueShareLink() {
  const liffId = document.getElementById('set-liff-id').value.trim();
  const gsheetUrl = document.getElementById('set-gsheet-url').value.trim();
  const custId =
    document.getElementById('set-default-cust-id').value.replace(/\D/g, '') ||
    document.getElementById('CustID_Value').value.replace(/\D/g, '');

  await saveGasSettings();

  if (liffId) {
    const liffUrl = `https://liff.line.me/${liffId}`;
    try {
      await navigator.clipboard.writeText(liffUrl);
      showToast(`🔗 已複製 LINE LIFF 連結 (${liffUrl})！`);
      return;
    } catch {
      prompt('請複製以下 LINE LIFF 連結分享給同仁：', liffUrl);
      return;
    }
  }

  const u = new URL(window.location.origin + window.location.pathname);
  if (gsheetUrl) u.searchParams.set('gas', gsheetUrl);
  if (custId) u.searchParams.set('cust', custId);

  try {
    await navigator.clipboard.writeText(u.toString());
    showToast('🔗 已複製「同仁一鍵設定連結」！可貼到 LINE 群組給同仁點開');
  } catch {
    prompt('請複製以下連結分享給同仁：', u.toString());
  }
}

window.addEventListener('DOMContentLoaded', async () => {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js').catch(() => {});
  }

  const params = new URLSearchParams(window.location.search);
  const gasParam = params.get('gas');
  const custParam = params.get('cust');
  const liffParam = params.get('liffId');
  if (gasParam || custParam || liffParam) {
    const patch = {};
    if (gasParam && gasParam.startsWith('https://script.google.com/')) patch.gsheetUrl = gasParam;
    if (custParam) patch.custId = custParam.replace(/\D/g, '');
    if (liffParam) patch.liffId = liffParam.trim();
    saveLocalConfig(patch);
  }

  initCountrySelects();
  initSignaturePad();
  await syncServerDefaultConfig();
  await applyLocalConfigToForm();
  await initLiffIfConfigured();
});
