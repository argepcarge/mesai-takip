/* SÜRÜM KODU: HTML'de her değişiklikte bunu artır (örn: 2026.10.02-b) */

// Aynı anda yalnızca bir birim ücret bölümü açık kalır.
function toggleUnitRate(button) {
  const group = button.closest('.unit-rate-group');
  if (!group) return;
  const willOpen = button.getAttribute('aria-expanded') !== 'true';
  document.querySelectorAll('.unit-rate-group').forEach(item => {
    const toggle = item.querySelector('.unit-rate-toggle');
    const details = item.querySelector('.unit-rate-details');
    if (!toggle || !details) return;
    const open = item === group && willOpen;
    toggle.setAttribute('aria-expanded', String(open));
    details.hidden = !open;
  });
}

const APP_VERSION = '2026.11.02-beta.15';
const JS_REV = 8;

const monthNames = [
  "OCAK", "ŞUBAT", "MART", "NİSAN", "MAYIS", "HAZİRAN",
  "TEMMUZ", "AĞUSTOS", "EYLÜL", "EKİM", "KASIM", "ARALIK"
];

const weekDaysFullTR = [
  'PAZAR', 'PAZARTESİ', 'SALI', 'ÇARŞAMBA', 'PERŞEMBE', 'CUMA', 'CUMARTESİ'
];

/* TÜRKİYE RESMİ TATİL VE DİNİ BAYRAM VERİLERİ */
const religiousHolidays = {
  2026: {
    '03-19': 'Ramazan B. (Arife)',
    '03-20': 'Ramazan B. 1',
    '03-21': 'Ramazan B. 2',
    '03-22': 'Ramazan B. 3',
    '05-26': 'Kurban B. (Arife)',
    '05-27': 'Kurban B. 1',
    '05-28': 'Kurban B. 2',
    '05-29': 'Kurban B. 3',
    '05-30': 'Kurban B. 4'
  },
  2027: {
    '03-09': 'Ramazan B. (Arife)',
    '03-10': 'Ramazan B. 1',
    '03-11': 'Ramazan B. 2',
    '03-12': 'Ramazan B. 3',
    '05-16': 'Kurban B. (Arife)',
    '05-17': 'Kurban B. 1',
    '05-18': 'Kurban B. 2',
    '05-19': 'Kurban B. 3',
    '05-20': 'Kurban B. 4'
  },
  2028: {
    '02-26': 'Ramazan B. (Arife)',
    '02-27': 'Ramazan B. 1',
    '02-28': 'Ramazan B. 2',
    '02-29': 'Ramazan B. 3',
    '05-04': 'Kurban B. (Arife)',
    '05-05': 'Kurban B. 1',
    '05-06': 'Kurban B. 2',
    '05-07': 'Kurban B. 3',
    '05-08': 'Kurban B. 4'
  }
};

function getOfficialHoliday(year, monthIdx, dayNum) {
  const mm = String(monthIdx + 1).padStart(2, '0');
  const dd = String(dayNum).padStart(2, '0');
  const mmdd = `${mm}-${dd}`;

  if (mmdd === '01-01') return 'Yılbaşı';
  if (mmdd === '04-23') return '23 Nisan';
  if (mmdd === '05-01') return '1 Mayıs';
  if (mmdd === '05-19') return '19 Mayıs';
  if (mmdd === '07-15') return '15 Temmuz';
  if (mmdd === '08-30') return '30 Ağustos';
  if (mmdd === '10-28') return '29 Ekim (Arife)';
  if (mmdd === '10-29') return '29 Ekim';

  if (religiousHolidays[year] && religiousHolidays[year][mmdd]) {
    return religiousHolidays[year][mmdd];
  }

  return null;
}

let dayShiftsData = {};
let lastFocusedDay = 1;
let activeModalRowIndex = 0;

function is2XType(t) {
  if (!t) return false;
  return t.includes('2') || t.includes('SERVİS') || t.includes('%100');
}

function toSafeUpperAscii(str) {
  const trUpperMap = {
    'ç': 'C', 'Ç': 'C', 'ğ': 'G', 'Ğ': 'G', 'ı': 'I', 'I': 'I',
    'i': 'I', 'İ': 'I', 'ö': 'O', 'Ö': 'O', 'ş': 'S', 'Ş': 'S', 'ü': 'U', 'Ü': 'U'
  };

  return String(str || '')
    .replace(/[çÇğĞıIİiöÖşŞüÜ]/g, match => trUpperMap[match] || match)
    .toUpperCase()
    .replace(/[^A-Z0-9_-]+/g, '_')
    .replace(/^_+|_+$/g, '');
}

function updateDynamicTitle() {
  const nameVal = (document.getElementById('name')?.value || '').trim();
  const monthIdx = parseInt(document.getElementById('selectMonth').value);
  const monthName = monthNames[monthIdx];
  const yearVal = document.getElementById('selectYear').value;

  if (nameVal) {
    document.title = `${nameVal}_${monthName}_${yearVal}_MESAİ ÇİZELGESİ`;
  } else {
    document.title = `MESAİ ÇİZELGESİ ${monthName}_${yearVal}`;
  }
}

/* CARLITO PRELOAD */
let carlitoRegBase64 = null;
let carlitoBoldBase64 = null;
let fontPreloadPromise = null;

function arrayBufferToBase64(buffer) {
  let binary = '';
  const bytes = new Uint8Array(buffer);
  const chunk = 8192;
  for (let i = 0; i < bytes.byteLength; i += chunk) {
    binary += String.fromCharCode.apply(null, bytes.subarray(i, i + chunk));
  }
  return btoa(binary);
}

function preloadPdfFonts() {
  if (fontPreloadPromise) return fontPreloadPromise;

  fontPreloadPromise = Promise.all([
    fetch('./fonts/Carlito-Regular.ttf')
      .then(r => {
        if (!r.ok) throw new Error('Carlito-Regular.ttf bulunamadı.');
        return r.arrayBuffer();
      })
      .then(buf => arrayBufferToBase64(buf)),
    fetch('./fonts/Carlito-Bold.ttf')
      .then(r => {
        if (!r.ok) throw new Error('Carlito-Bold.ttf bulunamadı.');
        return r.arrayBuffer();
      })
      .then(buf => arrayBufferToBase64(buf))
  ]).then(([reg, bold]) => {
    carlitoRegBase64 = reg;
    carlitoBoldBase64 = bold;
    return { reg, bold };
  }).catch(err => {
    console.warn('Carlito fontları yüklenemedi, varsayılan fonta dönülüyor:', err);
    return null;
  });

  return fontPreloadPromise;
}

/* ŞABLON UYGULAMA İŞLEMLERİ */
function applyTemplateToActiveDay(timeVal) {
  if (!lastFocusedDay || lastFocusedDay < 1 || lastFocusedDay > currentDaysCount) {
    lastFocusedDay = 1;
  }
  const timeInput = document.getElementById('time' + lastFocusedDay);
  if (timeInput) {
    timeInput.value = timeVal;
    delete dayShiftsData[lastFocusedDay];
    updateMultiShiftUI(lastFocusedDay);
    save();
    calc();
    showSavedToast(`${lastFocusedDay}. Gün: ${timeVal}`);
  }
}

function applyTemplateToModalRow(timeVal) {
  const container = document.getElementById('shiftRowsContainer');
  const rows = container.querySelectorAll('.shift-row');
  if (rows.length === 0) return;

  if (activeModalRowIndex >= rows.length || activeModalRowIndex < 0) {
    activeModalRowIndex = 0;
  }
  const targetInput = rows[activeModalRowIndex].querySelector('.shift-time-input');
  if (targetInput) {
    targetInput.value = timeVal;
    targetInput.focus();
  }
}

/* YENİ SADELEŞTİRİLMİŞ WHATSAPP / NOT DEFTERİ RAPORU */
async function copyWhatsAppReport(btn) {
  const name = (document.getElementById('name')?.value || '').trim() || 'BELİRTİLMEDİ';
  const year = document.getElementById('selectYear')?.value;
  const monthIdx = parseInt(document.getElementById('selectMonth')?.value, 10);
  const monthName = monthNames[monthIdx];

  let text = `📋 ŞENGÜN MAKİNA ${monthName} ${year} FAZLA MESAİ ÇİZELGESİ\n`;
  text += `👤 PERSONEL: ${name}\n\n`;

  text += `\`\`\`\n`;
  text += `TARİH       MESAİ SAATLERİ   MOLA  YEMEK\n`;
  text += `----------------------------------------\n`;

  const daysInMonth = getDaysInMonth(parseInt(year), monthIdx);
  let hasData = false;

  for (let i = 1; i <= daysInMonth; i++) {
    const dayStr = String(i).padStart(2, '0');
    const monthStr = String(monthIdx + 1).padStart(2, '0');
    const dFormatted = `${dayStr}.${monthStr}.${year}`;

    const timeVal = (document.getElementById('time' + i)?.value || '').trim();
    const breakVal = (document.getElementById('break' + i)?.value || '').trim();
    const mealVal = (document.getElementById('meal' + i)?.value || '').trim();

    const sList = dayShiftsData[i];

    if (sList && sList.length > 1) {
      hasData = true;
      const firstShift = sList[0].time.padEnd(16, ' ');
      const brStr = (breakVal || '0').padEnd(5, ' ');
      const mlStr = (mealVal || '-');
      text += `${dFormatted}  ${firstShift} ${brStr} ${mlStr}\n`;

      for (let s = 1; s < sList.length; s++) {
        const subShift = sList[s].time.padEnd(16, ' ');
        text += `            ${subShift}\n`;
      }
    } else if (timeVal) {
      hasData = true;
      const tStr = timeVal.padEnd(16, ' ');
      const brStr = (breakVal || '0').padEnd(5, ' ');
      const mlStr = (mealVal || '-');
      text += `${dFormatted}  ${tStr} ${brStr} ${mlStr}\n`;
    }
  }

  if (!hasData) {
    text += `(Bu ay için henüz mesai kaydı girilmedi)\n`;
  }

  text += `\`\`\`\n`;

  try {
    await navigator.clipboard.writeText(text);
    showSavedToast('Rapor panoya kopyalandı ✓');
  } catch(e) {
    const ta = document.createElement('textarea');
    ta.value = text;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
    showSavedToast('Rapor panoya kopyalandı ✓');
  }
}

/* VERİ GERİ YÜKLEME */
function openRestoreModal() {
  document.getElementById('restoreTextInput').value = '';
  document.getElementById('restoreModal').classList.remove('hidden');
}
function closeRestoreModal() {
  document.getElementById('restoreModal').classList.add('hidden');
}
function handleRestoreModalBackdrop(e) {
  if (e.target.id === 'restoreModal') closeRestoreModal();
}

function applyRestoredText() {
  const raw = document.getElementById('restoreTextInput')?.value || '';
  if (!raw.trim()) {
    alert('Lütfen yapıştırılacak metni girin.');
    return;
  }

  const nameMatch = raw.match(/PERSONEL:\s*(.*)/i);
  if (nameMatch && nameMatch[1]) {
    const nameElem = document.getElementById('name');
    if (nameElem) nameElem.value = nameMatch[1].trim();
  }

  const salaryMatch = raw.match(/MAAŞ:\s*([\d,.]+)/i);
  if (salaryMatch && salaryMatch[1]) {
    const salElem = document.getElementById('salary');
    if (salElem) {
      const num = salaryMatch[1].replace(/\D/g, '');
      salElem.value = num ? Number(num).toLocaleString('tr-TR') : '0';
      rememberSalary();
    }
  }

  const year = parseInt(document.getElementById('selectYear').value);
  const month = parseInt(document.getElementById('selectMonth').value);

  const lines = raw.split('\n');
  let currentDay = null;

  for (let line of lines) {
    line = line.trim();
    if (!line || line.startsWith('---') || line.startsWith('```') || line.startsWith('TARİH')) continue;

    const dateMatch = line.match(/^(\d{2})\.(\d{2})\.(\d{4})\s+(.+)$/);
    if (dateMatch) {
      const dayNum = parseInt(dateMatch[1], 10);
      const rest = dateMatch[4].trim();
      const tokens = rest.split(/\s+/);
      const shiftTime = tokens[0] || '';
      const brk = (tokens[1] && tokens[1] !== '-' && tokens[1] !== '0') ? tokens[1] : (tokens[1] === '0' ? '0' : '');
      const meal = (tokens[2] && tokens[2] !== '-') ? tokens[2] : '';

      currentDay = dayNum;
      const holidayName = getOfficialHoliday(year, month, dayNum);
      const defaultType = holidayName ? '2X (%100)' : '1.5X (%50)';

      const timeElem = document.getElementById('time' + dayNum);
      const breakElem = document.getElementById('break' + dayNum);
      const mealElem = document.getElementById('meal' + dayNum);
      const typeElem = document.getElementById('type' + dayNum);

      if (timeElem) timeElem.value = shiftTime;
      if (breakElem) breakElem.value = (brk === '0' ? '' : brk);
      if (mealElem) mealElem.value = meal;
      if (typeElem) typeElem.value = defaultType;

      delete dayShiftsData[dayNum];
      if (shiftTime) {
        dayShiftsData[dayNum] = [{
          time: shiftTime,
          type: defaultType
        }];
      }
      continue;
    }

    if (currentDay && line.match(/^(\d{1,2}[:.]\d{2}-\d{1,2}[:.]\d{2})/)) {
      const tokens = line.split(/\s+/);
      const shiftTime = tokens[0];
      const holidayName = getOfficialHoliday(year, month, currentDay);
      const defaultType = holidayName ? '2X (%100)' : '1.5X (%50)';

      if (!dayShiftsData[currentDay]) {
        dayShiftsData[currentDay] = [];
      }
      dayShiftsData[currentDay].push({
        time: shiftTime,
        type: defaultType
      });

      const timeElem = document.getElementById('time' + currentDay);
      if (timeElem) {
        timeElem.value = dayShiftsData[currentDay].map(s => s.time).join(' / ');
      }
    }
  }

  for (let i = 1; i <= currentDaysCount; i++) {
    updateMultiShiftUI(i);
  }

  closeRestoreModal();
  save();
  calc();
  showSavedToast('Veriler başarıyla yüklendi ✓');
}

/* PDF PAYLAŞMA */
async function shareVectorPDF(btn) {
  updateDynamicTitle();

  const oldText = btn ? btn.textContent : 'PDF Paylaş';

  if (btn) {
    btn.disabled = true;
    btn.textContent = 'PDF Hazırlanıyor...';
  }

  try {
    if (!window.jspdf || !window.jspdf.jsPDF) {
      throw new Error('jsPDF kütüphanesi yüklenemedi.');
    }

    if (!carlitoRegBase64 || !carlitoBoldBase64) {
      await preloadPdfFonts();
    }

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const hasCustomFont = !!(carlitoRegBase64 && carlitoBoldBase64);

    if (hasCustomFont) {
      doc.addFileToVFS('Carlito-Regular.ttf', carlitoRegBase64);
      doc.addFont('Carlito-Regular.ttf', 'Carlito', 'normal');

      doc.addFileToVFS('Carlito-Bold.ttf', carlitoBoldBase64);
      doc.addFont('Carlito-Bold.ttf', 'Carlito', 'bold');

      doc.setFont('Carlito', 'normal');
    }

    const activeFont = hasCustomFont ? 'Carlito' : 'helvetica';

    const name = (document.getElementById('name')?.value || '').trim();
    const year = document.getElementById('selectYear')?.value;
    const monthIdx = parseInt(document.getElementById('selectMonth')?.value, 10);
    const monthName = monthNames[monthIdx];
    
    const titleText = `ŞENGÜN MAKİNA ${monthName} AYI FAZLA MESAİ ÇİZELGESİ`;

    const tableBody = [];

    tableBody.push([
      { 
        content: titleText, 
        colSpan: 4, 
        styles: { 
          halign: 'center', 
          font: activeFont, 
          fontStyle: 'bold', 
          fontSize: 10, 
          cellPadding: 2.8, 
          fillColor: [255, 255, 255] 
        } 
      }
    ]);

    tableBody.push([
      { 
        content: 'ADI-SOYADI', 
        styles: { 
          halign: 'center', 
          font: activeFont, 
          fontStyle: 'bold', 
          fontSize: 9, 
          fillColor: [255, 255, 255] 
        } 
      },
      { 
        content: name, 
        colSpan: 3, 
        styles: { 
          halign: 'center', 
          font: activeFont, 
          fontStyle: 'bold', 
          fontSize: 9.5, 
          fillColor: [255, 255, 255] 
        } 
      }
    ]);

    tableBody.push([
      { content: 'TARİH', styles: { halign: 'center', font: activeFont, fontStyle: 'bold', fontSize: 8.5, fillColor: [255, 255, 255] } },
      { content: 'MESAİ SAATLERİ', styles: { halign: 'center', font: activeFont, fontStyle: 'bold', fontSize: 8.5, fillColor: [255, 255, 255] } },
      { content: 'MOLA(DK)', styles: { halign: 'center', font: activeFont, fontStyle: 'bold', fontSize: 8.5, fillColor: [255, 255, 255] } },
      { content: 'YOL-YEMEK', styles: { halign: 'center', font: activeFont, fontStyle: 'bold', fontSize: 8.5, fillColor: [255, 255, 255] } }
    ]);

    const daysInCurrentMonth = getDaysInMonth(parseInt(year), monthIdx);

    for (let i = 1; i <= 31; i++) {
      if (i <= daysInCurrentMonth) {
        const dayStr = String(i).padStart(2, '0');
        const monthStr = String(monthIdx + 1).padStart(2, '0');
        const dateFormatted = `${dayStr}.${monthStr}.${year}`;

        const timeVal = (document.getElementById('time' + i)?.value || '').trim();
        const breakVal = document.getElementById('break' + i)?.value || '';
        const mealVal = document.getElementById('meal' + i)?.value || '';

        let timeFontSize = 8.5;
        if (timeVal.length > 25) {
          timeFontSize = 7.0;
        } else if (timeVal.length > 18) {
          timeFontSize = 7.5;
        }

        tableBody.push([
          { content: dateFormatted, styles: { halign: 'center', font: activeFont } },
          { content: timeVal, styles: { halign: 'center', font: activeFont, fontSize: timeFontSize } },
          { content: breakVal, styles: { halign: 'center', font: activeFont } },
          { content: mealVal, styles: { halign: 'center', font: activeFont } }
        ]);
      } else {
        tableBody.push([
          { content: '' },
          { content: '' },
          { content: '' },
          { content: '' }
        ]);
      }
    }

    doc.autoTable({
      body: tableBody,
      startY: 8,
      margin: { left: 10, right: 10, top: 8, bottom: 22 },
      theme: 'grid',
      styles: {
        font: activeFont,
        fontSize: 8.5,
        textColor: [0, 0, 0],
        lineColor: [0, 0, 0],
        lineWidth: 0.25,
        cellPadding: 1.05,
        valign: 'middle',
        fillColor: [255, 255, 255]
      },
      columnStyles: {
        0: { cellWidth: 42.0 },
        1: { cellWidth: 72.0 },
        2: { cellWidth: 34.0 },
        3: { cellWidth: 42.0 }
      },
      pageBreak: 'avoid',
      didDrawPage: function (data) {
        const finalY = data.cursor.y + 7.5;
        const pageWidth = doc.internal.pageSize.getWidth();

        doc.setFont(activeFont, 'bold');
        doc.setFontSize(9);
        doc.text('SORUMLU AD SOYAD', pageWidth / 2, finalY, { align: 'center' });
        doc.text(name, pageWidth / 2, finalY + 4.8, { align: 'center' });
        doc.text('İMZA', pageWidth / 2, finalY + 9.6, { align: 'center' });
      }
    });

    const safeName = toSafeUpperAscii(name);
    const safeMonth = toSafeUpperAscii(monthNames[monthIdx]);
    let rawFileName = safeName ? `${safeName}_${safeMonth}_${year}_MESAI` : `MESAI_${safeMonth}_${year}`;
    const fileName = rawFileName + '.pdf';

    const pdfBlob = doc.output('blob');
    const pdfFile = new File([pdfBlob], fileName, {
      type: 'application/pdf',
      lastModified: Date.now()
    });

    if (navigator.canShare && navigator.canShare({ files: [pdfFile] })) {
      await navigator.share({ files: [pdfFile] });
    } else if (navigator.share) {
      await navigator.share({ files: [pdfFile] });
    } else {
      downloadFile(pdfBlob, fileName);
    }

  } catch (err) {
    if (err && err.name === 'AbortError') return;
    console.error('Vektörel PDF hatası:', err);
    alert('PDF oluşturulurken hata oluştu:\n' + (err && err.message ? err.message : err));
  } finally {
    if (btn) {
      btn.disabled = false;
      btn.textContent = oldText;
    }
  }
}

function downloadFile(blob, fileName) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}

function syncName() {
  updateDynamicTitle();
}

function initYearSelect() {
  const sel = document.getElementById('selectYear');
  sel.innerHTML = '';
  const now = new Date();
  const currentYear = now.getFullYear();

  const startYear = Math.min(2026, currentYear);
  const endYear = Math.max(2031, currentYear + 5);

  for (let y = startYear; y <= endYear; y++) {
    const opt = document.createElement('option');
    opt.value = y;
    opt.textContent = y;
    if (y === currentYear) opt.selected = true;
    sel.appendChild(opt);
  }

  document.getElementById('selectMonth').value = now.getMonth();
}

function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}

function getStorageKey() {
  const year = document.getElementById('selectYear').value;
  const month = document.getElementById('selectMonth').value;
  return `fazlaMesaiCizelgesi_${year}_${month}`;
}

/* Ortak personel adı ve yeni aylara taşınacak son girilen maaş.
   Eski ayların maaşları kendi aylık kayıtlarında korunur. */
const PROFILE_NAME_KEY = 'fazlaMesaiCizelgesi_profileName';
const LAST_SALARY_KEY = 'fazlaMesaiCizelgesi_lastSalary';

function formatStoredSalary(value) {
  const digits = String(value ?? '').replace(/\D/g, '');
  return digits ? Number(digits).toLocaleString('tr-TR') : '0';
}

/* Eski sürümün aylık kayıtlarından ilk açılış için bilgi devral. */
function findLegacyProfileValue(field) {
  let result = null;
  let latestPeriod = -1;
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    const match = /^fazlaMesaiCizelgesi_(\d{4})_(\d{1,2})$/.exec(key || '');
    if (!match) continue;
    try {
      const data = JSON.parse(localStorage.getItem(key) || '{}');
      const value = data && data[field];
      if (typeof value !== 'string' || !value.trim()) continue;
      if (field === 'salary' && Number(value.replace(/\D/g, '')) <= 0) continue;
      const period = Number(match[1]) * 12 + Number(match[2]);
      if (period > latestPeriod) {
        latestPeriod = period;
        result = value;
      }
    } catch (e) { /* Eski bozuk kayıtlar atlanır. */ }
  }
  return result;
}

function rememberSalary() {
  const salaryEl = document.getElementById('salary');
  if (salaryEl) localStorage.setItem(LAST_SALARY_KEY, salaryEl.value || '0');
}

let currentDaysCount = 31;

function formatHoursMinutes(totalMins) {
  if (!totalMins || totalMins <= 0) return '00:00 Sa';
  const h = Math.floor(totalMins / 60);
  const m = totalMins % 60;
  return String(h).padStart(2, '0') + ':' + String(m).padStart(2, '0') + ' Sa';
}

function formatCardDuration(totalMins) {
  const mins = Math.max(0, Math.trunc(totalMins || 0));
  const hours = Math.floor(mins / 60);
  const rest = mins % 60;
  return (hours ? `${hours} saat` : '') + (rest ? `${hours ? ' ' : ''}${rest} dk` : '') || '0 dk';
}

function toggleOvertimeCard(day) {
  if (!window.matchMedia('(max-width: 700px)').matches) return;
  const row = document.getElementById('rowSheet2_' + day);
  const header = document.getElementById('d' + day);
  if (!row || row.classList.contains('hidden-row')) return;
  const open = row.classList.toggle('overtime-expanded');
  if (header) {
    header.setAttribute('aria-expanded', String(open));
    header.setAttribute('aria-label', `${day}. gün mesai ayrıntılarını ${open ? 'kapat' : 'aç'}`);
  }
}

function formatSummaryDuration(totalMins) {
  const mins = Math.max(0, Math.trunc(totalMins || 0));
  return `${Math.floor(mins / 60)} saat ${mins % 60} dk (${mins} dk)`;
}

function buildTables() {
  const year = parseInt(document.getElementById('selectYear').value);
  const month = parseInt(document.getElementById('selectMonth').value);

  const today = new Date();
  const todayY = today.getFullYear();
  const todayM = today.getMonth();
  const todayD = today.getDate();

  currentDaysCount = getDaysInMonth(year, month);
  if (todayY === year && todayM === month) {
    lastFocusedDay = todayD;
  } else {
    lastFocusedDay = 1;
  }

  const subElem = document.getElementById('titleSub');
  if (subElem) subElem.textContent = `${monthNames[month].toUpperCase()} AYI FAZLA MESAİ ÇİZELGESİ`;

  const tbody1 = document.getElementById('tbodySheet1');
  const tbody2 = document.getElementById('tbodySheet2');

  tbody1.innerHTML = '';
  tbody2.innerHTML = '';

  for (let i = 1; i <= currentDaysCount; i++) {
    const dayStr = String(i).padStart(2, '0');
    const monthStr = String(month + 1).padStart(2, '0');
    const dateFormatted = `${dayStr}.${monthStr}.${year}`;

    const dow = new Date(year, month, i).getDay();
    const weekdayFull = weekDaysFullTR[dow];
    const isWeekend = dow === 0 || dow === 6;
    const isToday = (year === todayY && month === todayM && i === todayD);

    const holidayName = getOfficialHoliday(year, month, i);
    const isHoliday = !!holidayName;

    const tr1 = document.createElement('tr');
    tr1.id = `rowSheet1_${i}`;
    if (isToday) tr1.classList.add('row-today');
    if (isHoliday) tr1.classList.add('row-holiday');

    let subDayHtml = '';
    if (isHoliday) {
      subDayHtml = `
        <span class="sub-day-name ${isWeekend ? 'weekend-day' : ''}">${weekdayFull}</span>
        <span class="sub-holiday-name">${holidayName.toUpperCase()}</span>
      `;
    } else {
      subDayHtml = `<span class="sub-day-name ${isWeekend ? 'weekend-day' : ''}">${weekdayFull}</span>`;
    }

    tr1.innerHTML = `
      <td class="cell-date-td">
        <div class="cell-date-wrap">
          <span class="main-date">${dateFormatted}</span>
          ${subDayHtml}
        </div>
      </td>
      <td>
        <div class="time-cell-wrap" id="timeWrap${i}">
          <input 
            id="time${i}" 
            type="text"
            inputmode="tel"
            pattern="[0-9]*"
            aria-label="${dateFormatted} mesai saatleri" 
            onfocus="lastFocusedDay=${i}"
            oninput="formatTimeLive(this);onDirectTimeChange(${i});scheduleSaveCalc()" 
            onblur="autoZero(${i})">
          <div id="multiDisplay${i}" class="multi-shift-box hidden" onclick="openShiftModal(${i})" title="Çoklu mesaiyi düzenlemek için tıklayın"></div>
          <button 
            type="button" 
            id="btnShift${i}" 
            class="btn-shift-modal" 
            onclick="openShiftModal(${i})" 
            title="Çoklu Mesai Ekle / Düzenle">+</button>
        </div>
      </td>
      <td class="center">
        <input 
          id="break${i}" 
          class="center" 
          type="text" 
          inputmode="tel" 
          pattern="[0-9]*"
          maxlength="4" 
          aria-label="${dateFormatted} mola dakika" 
          onfocus="lastFocusedDay=${i}"
          oninput="this.value=this.value.replace(/\\D/g,'');scheduleSaveCalc()" 
          onblur="autoZero(${i})">
      </td>
      <td>
        <input 
          id="meal${i}" 
          aria-label="${dateFormatted} yol-yemek" 
          onfocus="lastFocusedDay=${i}"
          oninput="scheduleSaveCalc()" 
          onblur="autoZero(${i})">
      </td>
    `;
    tbody1.appendChild(tr1);

    const tr2 = document.createElement('tr');
    tr2.id = `rowSheet2_${i}`;
    if (isWeekend) tr2.classList.add('weekend');
    if (isHoliday) tr2.classList.add('row-holiday');
    if (isToday) tr2.classList.add('row-today');

    tr2.innerHTML = `
      <td class="cell-header" id="d${i}" data-label="" role="button" tabindex="0" aria-expanded="false" aria-label="${dateFormatted} mesai ayrıntılarını aç" onclick="toggleOvertimeCard(${i})" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();toggleOvertimeCard(${i})}">
        <div style="display:flex; justify-content:space-between; align-items:center; width:100%;">
          <div class="cell-date-wrap">
            <div class="overtime-date-line"><span class="main-date">${dateFormatted}</span><span id="typeBadges${i}" class="overtime-type-badges"></span></div>
            <span class="sub-day-name">${weekdayFull}</span>
          </div>
          ${isToday ? '<span class="overtime-today-label">BUGÜN</span>' : ''}
          <span class="overtime-header-right"><button type="button" class="overtime-edit-btn" title="Mesaiyi düzenle" aria-label="${dateFormatted} mesaisini düzenle" onclick="event.stopPropagation();openShiftModal(${i})" onkeydown="event.stopPropagation()">✎</button><span class="overtime-chevron" aria-hidden="true">⌄</span></span>
        </div>
      </td>
      <td id="shiftRange${i}" data-label="MESAİ ARALIĞI">-</td>
      <td id="bText${i}" data-label="MOLA(DK)">0</td>
      <td data-label="MESAİ TİPİ">
        <select id="type${i}" title="1.5X: %50 zamlı | 2X: %100 zamlı" onchange="onTypeChange(${i})">
          <option value="1.5X (%50)">1.5X (%50)</option>
          <option value="2X (%100)" ${isHoliday ? 'selected' : ''}>2X (%100)</option>
        </select>
      </td>
      <td class="center" id="duration${i}" data-label="TOPLAM SÜRE"></td>
      <td class="right" id="pay${i}" data-label="ÜCRET"></td>
    `;
    tbody2.appendChild(tr2);
  }

  for (let e = 1; e <= 6; e++) {
    const extraId = 33 + e;
    const trExtra = document.createElement('tr');
    trExtra.id = `rowSheet2_${extraId}`;
    trExtra.classList.add('extra-row');

    trExtra.innerHTML = `
      <td class="cell-header" data-label="TARİH">
        <span class="main-date">EKSTRA ${e}</span>
        <span class="sub-day-name">ÖZEL MESAİ</span>
      </td>
      <td data-label="MESAİ ARALIĞI">-</td>
      <td data-label="MOLA(DK)">0</td>
      <td data-label="MESAİ TİPİ">
        <select id="type${extraId}" title="1.5X: %50 zamlı | 2X: %100 zamlı" onchange="scheduleSaveCalc()">
          <option value="1.5X (%50)">1.5X (%50)</option>
          <option value="2X (%100)">2X (%100)</option>
        </select>
      </td>
      <td class="center" data-label="TOPLAM SÜRE">
        <div style="display:flex;align-items:center;justify-content:center;gap:4px;">
          <input 
            id="b${extraId}" 
            type="text" 
            inputmode="tel" 
            pattern="[0-9]*" 
            placeholder="0"
            style="width:50px; text-align:center; border:1px solid #cbd5e1; border-radius:4px; background:transparent; color:inherit; padding:3px; font-weight:bold; font-size:12.5px;" 
            oninput="this.value=this.value.replace(/\\D/g,'');scheduleSaveCalc()">
          <span style="font-size:11px;font-weight:700;">Dk</span>
          <span id="duration${extraId}" style="font-size:11px;opacity:0.8;"></span>
        </div>
      </td>
      <td class="right" id="pay${extraId}" data-label="ÜCRET"></td>
    `;
    tbody2.appendChild(trExtra);
  }

  updateDynamicTitle();
}

function clearDayRow(dayNum) {
  const timeElem = document.getElementById('time' + dayNum);
  const breakElem = document.getElementById('break' + dayNum);
  const mealElem = document.getElementById('meal' + dayNum);
  const typeElem = document.getElementById('type' + dayNum);

  if (timeElem) timeElem.value = '';
  if (breakElem) breakElem.value = '';
  if (mealElem) mealElem.value = '';

  delete dayShiftsData[dayNum];
  updateMultiShiftUI(dayNum);

  const year = parseInt(document.getElementById('selectYear').value);
  const month = parseInt(document.getElementById('selectMonth').value);
  const holidayName = getOfficialHoliday(year, month, dayNum);
  if (typeElem) {
    typeElem.disabled = false;
    typeElem.value = holidayName ? '2X (%100)' : '1.5X (%50)';
  }

  save();
  calc();
}

function clearActiveDayFromModal() {
  if (!activeModalDay) return;
  clearDayRow(activeModalDay);
  closeShiftModal();
}

/* ÇOKLU MESAİ MODAL İŞLEMLERİ */
let activeModalDay = null;

function openShiftModal(dayNum) {
  activeModalDay = dayNum;
  activeModalRowIndex = 0;
  const year = parseInt(document.getElementById('selectYear').value);
  const month = parseInt(document.getElementById('selectMonth').value);
  const dayStr = String(dayNum).padStart(2, '0');
  const monthStr = String(month + 1).padStart(2, '0');
  const dow = new Date(year, month, dayNum).getDay();
  const holidayName = getOfficialHoliday(year, month, dayNum);
  const labelSuffix = holidayName ? `(${weekDaysFullTR[dow]} • ${holidayName})` : weekDaysFullTR[dow];
  const dateText = `${dayStr}.${monthStr}.${year} - ${labelSuffix}`;

  document.getElementById('modalTitle').textContent = `Mesai Düzenle: ${dateText}`;
  const container = document.getElementById('shiftRowsContainer');
  container.innerHTML = '';

  const existingShifts = dayShiftsData[dayNum];

  if (existingShifts && existingShifts.length > 0) {
    existingShifts.forEach(s => addShiftRow(s.time, s.type));
  } else {
    const directVal = (document.getElementById('time' + dayNum)?.value || '').trim();
    const defaultType = holidayName ? '2X (%100)' : '1.5X (%50)';
    const currentType = document.getElementById('type' + dayNum)?.value || defaultType;

    if (directVal.includes('/')) {
      const parts = directVal.split('/').map(p => p.trim());
      parts.forEach(p => addShiftRow(p, currentType));
    } else if (directVal.length > 0) {
      addShiftRow(directVal, currentType);
      addShiftRow('', '2X (%100)');
    } else {
      addShiftRow('', defaultType);
      addShiftRow('', '2X (%100)');
    }
  }

  document.getElementById('shiftModal').classList.remove('hidden');
}

function closeShiftModal() {
  document.getElementById('shiftModal').classList.add('hidden');
  activeModalDay = null;
}

function handleModalBackdropClick(e) {
  if (e.target.id === 'shiftModal') {
    closeShiftModal();
  }
}

function addShiftRow(timeVal = '', typeVal = '1.5X (%50)') {
  const container = document.getElementById('shiftRowsContainer');
  const count = container.children.length;
  if (count >= 4) {
    alert('Bir güne en fazla 4 mesai aralığı ekleyebilirsiniz.');
    return;
  }

  const is2X = is2XType(typeVal);

  const row = document.createElement('div');
  row.className = 'shift-row';
  row.innerHTML = `
    <span class="shift-row-label">${count + 1}. Mesai:</span>
    <input 
      type="text" 
      class="shift-time-input" 
      inputmode="tel"
      pattern="[0-9]*"
      placeholder="örn: 17:30-20:30" 
      value="${timeVal}" 
      onfocus="trackModalRowFocus(this)"
      oninput="formatTimeLive(this)">
    <select class="shift-type-select">
      <option value="1.5X (%50)" ${!is2X ? 'selected' : ''}>1.5X (%50)</option>
      <option value="2X (%100)" ${is2X ? 'selected' : ''}>2X (%100)</option>
    </select>
    <button type="button" class="btn-shift-del" title="Sil" onclick="this.parentElement.remove();relabelShiftRows()">&times;</button>
  `;
  container.appendChild(row);
}

function trackModalRowFocus(inputElem) {
  const rows = Array.from(document.querySelectorAll('#shiftRowsContainer .shift-row'));
  const parent = inputElem.closest('.shift-row');
  activeModalRowIndex = rows.indexOf(parent);
}

function relabelShiftRows() {
  const rows = document.querySelectorAll('#shiftRowsContainer .shift-row');
  rows.forEach((r, idx) => {
    const lbl = r.querySelector('.shift-row-label');
    if (lbl) lbl.textContent = `${idx + 1}. Mesai:`;
  });
}

function saveShiftModal() {
  if (!activeModalDay) return;

  const rows = document.querySelectorAll('#shiftRowsContainer .shift-row');
  const newShifts = [];

  for (let r of rows) {
    const timeInput = r.querySelector('.shift-time-input');
    const typeSelect = r.querySelector('.shift-type-select');
    const val = (timeInput.value || '').trim();

    if (val) {
      const parts = val.split('-');
      const a = parseTime(parts[0] || '');
      const z = parseTime(parts[1] || '');
      if (a === null || z === null) {
        alert(`"${val}" geçerli bir saat aralığı değil! Lütfen "17:30-20:30" veya "17302030" biçiminde girin.`);
        timeInput.focus();
        return;
      }
      newShifts.push({
        time: val,
        type: typeSelect.value
      });
    }
  }

  const timeElem = document.getElementById('time' + activeModalDay);
  const typeElem = document.getElementById('type' + activeModalDay);

  if (newShifts.length === 0) {
    delete dayShiftsData[activeModalDay];
    if (timeElem) timeElem.value = '';
  } else if (newShifts.length === 1) {
    dayShiftsData[activeModalDay] = newShifts;
    if (timeElem) timeElem.value = newShifts[0].time;
    if (typeElem) typeElem.value = newShifts[0].type;
  } else {
    dayShiftsData[activeModalDay] = newShifts;
    if (timeElem) timeElem.value = newShifts.map(s => s.time).join(' / ');
  }

  closeShiftModal();
  save();
  calc();
}

/* ÇOKLU MESAİDE BUTONU GİZLEYİP TEK MESAİDE + GETİREN FONKSİYON */
function updateMultiShiftUI(dayNum) {
  const sList = dayShiftsData[dayNum];
  const inputElem = document.getElementById('time' + dayNum);
  const multiBox = document.getElementById('multiDisplay' + dayNum);
  const btnElem = document.getElementById('btnShift' + dayNum);
  const tr1Elem = document.getElementById('rowSheet1_' + dayNum);

  if (sList && sList.length > 1) {
    if (inputElem) inputElem.classList.add('hidden');
    if (multiBox) {
      multiBox.classList.remove('hidden');
      multiBox.innerHTML = sList.map(s => `<span class="multi-shift-line">${s.time}</span>`).join('');
    }
    if (btnElem) {
      btnElem.classList.add('hidden');
    }
    if (tr1Elem) tr1Elem.classList.add('row-multi-active');
  } else {
    if (inputElem) inputElem.classList.remove('hidden');
    if (multiBox) {
      multiBox.classList.add('hidden');
      multiBox.innerHTML = '';
    }
    if (btnElem) {
      btnElem.classList.remove('hidden');
      btnElem.classList.remove('has-multi');
      btnElem.textContent = '+';
      btnElem.title = 'Çoklu Mesai Ekle / Düzenle';
    }
    if (tr1Elem) tr1Elem.classList.remove('row-multi-active');
  }
}

function onDirectTimeChange(dayNum) {
  const timeElem = document.getElementById('time' + dayNum);
  const val = (timeElem?.value || '').trim();

  if (!val.includes('/')) {
    delete dayShiftsData[dayNum];
    updateMultiShiftUI(dayNum);
  }

  if (!val) {
    const year = parseInt(document.getElementById('selectYear').value);
    const month = parseInt(document.getElementById('selectMonth').value);
    const holidayName = getOfficialHoliday(year, month, dayNum);
    const typeElem = document.getElementById('type' + dayNum);
    if (typeElem) {
      typeElem.disabled = false;
      typeElem.value = holidayName ? '2X (%100)' : '1.5X (%50)';
    }
  }
}

function onTypeChange(dayNum) {
  const typeSelect = document.getElementById('type' + dayNum);
  if (!typeSelect) return;
  const val = typeSelect.value;

  if (dayShiftsData[dayNum] && dayShiftsData[dayNum].length > 0) {
    dayShiftsData[dayNum].forEach(s => {
      s.type = val;
    });
  }
  save();
  calc();
}

function getShiftMinutes(timeStr) {
  const parts = (timeStr || '').split('-');
  if (parts.length !== 2) return null;
  const a = parseTime(parts[0].trim());
  const z = parseTime(parts[1].trim());
  if (a === null || z === null) return null;

  let mins = 0;
  if (a === 0 && z === 0) {
    mins = 24 * 60;
  } else {
    mins = z - a;
    if (mins < 0) mins += 24 * 60;
  }
  return mins;
}

function updateMonthDays() {
  flushPendingSaveCalc();
  buildTables();
  restore();
  calc();
}

function showSheet(n) {
  document.getElementById('sheet1').classList.toggle('hidden', n !== 1);
  document.getElementById('sheet2').classList.toggle('hidden', n !== 2);
  document.getElementById('sheet4').classList.toggle('hidden', n !== 4);

  const order = [1, 2, 4];
  document.querySelectorAll('.tab').forEach((b, i) => b.classList.toggle('active', order[i] === n));
}

function parseTime(s) {
  const m = (s || '').trim().match(/^(\d{1,2})[:. ](\d{2})$/);
  if (!m) return null;
  let h = +m[1];
  let min = +m[2];
  if (h > 23 || min > 59) return null;
  return h * 60 + min;
}

function formatTimeLive(input) {
  let val = input.value;
  if (val.includes('/')) return;

  let clean = val.replace(/\D/g, '').slice(0, 8);

  if (clean.length === 8) {
    input.value = `${clean.slice(0,2)}:${clean.slice(2,4)}-${clean.slice(4,6)}:${clean.slice(6,8)}`;
  } else if (clean.length === 4 && !val.includes(':') && !val.includes('-')) {
    input.value = `${clean.slice(0,2)}:${clean.slice(2,4)}`;
  } else if (clean.length < 8 && val.includes('-')) {
    input.value = val;
  }
}

function autoZero(i) {
  flushPendingSaveCalc();
}

/* MAAŞ VE KESİNTİLER İÇİN YARDIMCI FORMAT FONKSİYONLARI */
function clearZeroOnFocus(input) {
  if (input.value.trim() === '0') {
    input.value = '';
  }
}

function restoreZeroOnBlur(input) {
  if (input.value.trim() === '') {
    input.value = '0';
  }
}

function ensureNumber(input) {
  restoreZeroOnBlur(input);
  save();
  calc();
}

function formatSalaryLive(input) {
  const cursor = input.selectionStart;
  const oldLen = input.value.length;
  let raw = input.value.replace(/\D/g, '');
  if (!raw) {
    input.value = '';
    return;
  }
  if (raw.length > 12) raw = raw.slice(0, 12);
  const formatted = Number(raw).toLocaleString('tr-TR');
  input.value = formatted;
  const newLen = formatted.length;
  const diff = newLen - oldLen;
  const newCursor = Math.max(0, (cursor || 0) + diff);
  try {
    input.setSelectionRange(newCursor, newCursor);
  } catch(e) {}
}

function money(x) {
  return isFinite(x)
    ? x.toLocaleString('tr-TR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })
    : '0';
}

function setTextOrVal(id, text) {
  const el = document.getElementById(id);
  if (!el) return;
  if (el.tagName === 'INPUT') el.value = text;
  else el.textContent = text;
}

// Hesaplama sırasında değişmeyen HTML bölümlerini yeniden oluşturma.
function setHTMLIfChanged(element, html) {
  if (element && element.innerHTML !== html) element.innerHTML = html;
}

// Mesai tipi listesini yalnızca normal/karma mod değiştiğinde yeniden kur.
function updateOvertimeTypeSelect(select, mode, selectedType) {
  if (!select) return;
  const mixed = mode === 'mixed';
  const validNormal = select.options.length === 2 &&
    select.options[0].value === '1.5X (%50)' &&
    select.options[1].value === '2X (%100)';
  const validMixed = select.options.length === 1 &&
    select.options[0].textContent === '1.5 & 2X';

  if (mixed && !validMixed) {
    select.innerHTML = '<option selected>1.5 & 2X</option>';
  } else if (!mixed && !validNormal) {
    select.innerHTML = '<option value="1.5X (%50)">1.5X (%50)</option><option value="2X (%100)">2X (%100)</option>';
  }
  if (select.disabled !== mixed) select.disabled = mixed;
  if (!mixed && selectedType && select.value !== selectedType) select.value = selectedType;
}

function calc() {
  const salaryRaw = String(document.getElementById('salary')?.value || '0').replace(/\D/g, '');
  const salary = Number(salaryRaw) || 0;

  const normalMin = salary / 225 / 60;
  const normalHour = salary / 225;

  setTextOrVal('normalMin', money(normalMin) + ' ₺');
  setTextOrVal('normalHour', money(normalHour) + ' ₺');
  setTextOrVal('overtimeMin', money(normalMin * 1.5) + ' ₺');
  setTextOrVal('overtimeHour', money(normalHour * 1.5) + ' ₺');
  setTextOrVal('doubleHour', money(normalHour * 2) + ' ₺');
  setTextOrVal('doubleMin', money(normalMin * 2) + ' ₺');

  let totalMin = 0;
  let mins1_5 = 0;
  let mins2_0 = 0;
  let pay1_5 = 0;
  let pay2_0 = 0;

  for (let i = 1; i <= currentDaysCount; i++) {
    updateMultiShiftUI(i);

    let timeElem = document.getElementById('time' + i);
    let breakElem = document.getElementById('break' + i);
    let rangeElem = document.getElementById('shiftRange' + i);
    let bText = document.getElementById('bText' + i);
    let rowSheet2 = document.getElementById('rowSheet2_' + i);
    let typeElem = document.getElementById('type' + i);
    let durationElem = document.getElementById('duration' + i);
    let payElem = document.getElementById('pay' + i);
    const setOvertimeCardType = (kind) => {
      if (!rowSheet2) return;
      rowSheet2.classList.remove('overtime-15', 'overtime-20', 'overtime-mixed');
      if (kind) rowSheet2.classList.add('overtime-' + kind);
      const badges = document.getElementById('typeBadges' + i);
      if (badges) {
        const badgeHTML = kind === 'mixed'
          ? '<span class="overtime-badge badge-15">1.5X</span><span class="overtime-badge badge-20">2X</span>'
          : kind === '20' ? '<span class="overtime-badge badge-20">2X</span>'
          : kind === '15' ? '<span class="overtime-badge badge-15">1.5X</span>' : '';
        setHTMLIfChanged(badges, badgeHTML);
      }
    };

    let br = Number(breakElem ? breakElem.value : 0) || 0;
    if (bText) bText.textContent = `${br} dk`;

    const sList = dayShiftsData[i];

    if (sList && sList.length > 0) {
      let raw1_5 = 0;
      let raw2_0 = 0;

      sList.forEach(s => {
        const sm = getShiftMinutes(s.time);
        if (sm !== null) {
          if (is2XType(s.type)) raw2_0 += sm;
          else raw1_5 += sm;
        }
      });

      if (rangeElem) {
        setHTMLIfChanged(rangeElem, sList.map(s => s.time).join('<br>'));
      }

      let cut1_5 = Math.min(raw1_5, br);
      let remBreak = br - cut1_5;
      let cut2_0 = Math.min(raw2_0, remBreak);

      let net1_5 = raw1_5 - cut1_5;
      let net2_0 = raw2_0 - cut2_0;
      let dayNetMins = net1_5 + net2_0;
      setOvertimeCardType(dayNetMins <= 0 ? null : net1_5 > 0 && net2_0 > 0 ? 'mixed' : net2_0 > 0 ? '20' : '15');

      if (raw1_5 > 0 && raw2_0 > 0) {
        updateOvertimeTypeSelect(typeElem, 'mixed');
      } else {
        updateOvertimeTypeSelect(typeElem, 'normal', raw2_0 > 0 ? '2X (%100)' : '1.5X (%50)');
      }

      if (rowSheet2) rowSheet2.classList.toggle('hidden-row', dayNetMins <= 0);
      if (timeElem) timeElem.classList.remove('invalid');

      const dPay1_5 = net1_5 * normalMin * 1.5;
      const dPay2_0 = net2_0 * normalMin * 2.0;
      const dayPay = dPay1_5 + dPay2_0;

      if (durationElem) {
        if (dayNetMins > 0) {
          let durHtml = `
            <div class="duration-cell-wrap">
              <div class="main-duration-line">
                <span>${formatCardDuration(dayNetMins)} (${dayNetMins} dk)</span>
              </div>`;
          if (net1_5 > 0 && net2_0 > 0) {
            durHtml += `<div class="sub-split-text">1.5X: ${formatCardDuration(net1_5)} + 2X: ${formatCardDuration(net2_0)}</div>`;
          }
          durHtml += `</div>`;
          setHTMLIfChanged(durationElem, durHtml);
        } else {
          setHTMLIfChanged(durationElem, '');
        }
      }

      if (payElem) {
        payElem.textContent = dayPay > 0 ? `${money(dayPay)} ₺` : '';
      }

      totalMin += dayNetMins;
      mins1_5 += net1_5;
      mins2_0 += net2_0;
      pay1_5 += dPay1_5;
      pay2_0 += dPay2_0;

    } else {
      if (typeElem) {
        const curVal = typeElem.value;
        updateOvertimeTypeSelect(typeElem, 'normal', is2XType(curVal) ? '2X (%100)' : '1.5X (%50)');
      }

      let timeVal = (timeElem?.value || '').trim();
      if (rangeElem) rangeElem.textContent = timeVal || '-';

      const parts = timeVal.split('-');
      const a = parseTime((parts[0] || '').trim());
      const z = parseTime((parts[1] || '').trim());
      let mins = 0;

      if (a !== null && z !== null) {
        const duration = getShiftMinutes(timeVal);
        mins = Math.max(0, duration - br);
      }

      const hasOvertime = mins > 0;
      if (rowSheet2) rowSheet2.classList.toggle('hidden-row', !hasOvertime);

      if (timeElem) {
        const hasContent = timeVal.length > 0;
        const isInvalid = hasContent && (a === null || z === null);
        timeElem.classList.toggle('invalid', isInvalid);
        timeElem.title = isInvalid ? 'Geçersiz format! "10001200" veya "10:00-12:00" biçiminde girin' : '';
      }

      const type = typeElem ? typeElem.value : '1.5X (%50)';
      const mult = is2XType(type) ? 2 : 1.5;

      setOvertimeCardType(mins <= 0 ? null : mult === 2 ? '20' : '15');
      const pay = mins * normalMin * mult;

      if (durationElem) {
        setHTMLIfChanged(durationElem, mins
          ? `<div class="duration-cell-wrap"><div class="main-duration-line"><span>${formatCardDuration(mins)} (${mins} dk)</span></div></div>`
          : '');
      }
      if (payElem) {
        payElem.textContent = pay ? `${money(pay)} ₺` : '';
      }

      totalMin += mins;
      if (mult === 1.5) {
        mins1_5 += mins;
        pay1_5 += pay;
      } else if (mult === 2) {
        mins2_0 += mins;
        pay2_0 += pay;
      }
    }
  }

  for (let extraId = 34; extraId <= 39; extraId++) {
    const bElem = document.getElementById('b' + extraId);
    const typeElem = document.getElementById('type' + extraId);
    const rowSheet2 = document.getElementById('rowSheet2_' + extraId);

    if (!bElem || !typeElem) continue;

    let mins = Number(bElem.value) || 0;
    let type = typeElem.value;
    let mult = is2XType(type) ? 2 : 1.5;

    if (rowSheet2) rowSheet2.classList.toggle('hidden-row', mins <= 0);

    const durationElem = document.getElementById('duration' + extraId);
    const payElem = document.getElementById('pay' + extraId);

    const pay = mins * normalMin * mult;
    if (durationElem) {
      durationElem.textContent = mins ? `(${formatHoursMinutes(mins)})` : '';
    }
    if (payElem) {
      payElem.textContent = pay ? `${money(pay)} ₺` : '';
    }

    totalMin += mins;
    if (mult === 1.5) {
      mins1_5 += mins;
      pay1_5 += pay;
    } else if (mult === 2) {
      mins2_0 += mins;
      pay2_0 += pay;
    }
  }

  const dedHInput = document.getElementById('deductionHours')?.value;
  const dedMInput = document.getElementById('deductionMinutes')?.value;

  const dedH = (dedHInput && !isNaN(dedHInput)) ? parseInt(dedHInput, 10) : 0;
  const dedM = (dedMInput && !isNaN(dedMInput)) ? parseInt(dedMInput, 10) : 0;

  let remainingDeduction = (dedH * 60) + dedM;
  const grossOvertimePay = pay1_5 + pay2_0;

  let cut1_5 = Math.min(mins1_5, remainingDeduction);
  remainingDeduction -= cut1_5;

  let cut2_0 = Math.min(mins2_0, remainingDeduction);
  remainingDeduction -= cut2_0;

  const cutFrom1_5_Val = cut1_5 * normalMin * 1.5;
  const cutFrom2_0_Val = cut2_0 * normalMin * 2.0;
  const cutFromSalaryVal = remainingDeduction * normalMin;

  const totalDeductionMoney = cutFrom1_5_Val + cutFrom2_0_Val + cutFromSalaryVal;
  const netOvertimePay = ((mins1_5 - cut1_5) * normalMin * 1.5) + ((mins2_0 - cut2_0) * normalMin * 2.0);
  // Yol-yemek sütunundaki yalnızca sayısal YOL değerleri toplanır.
  // Günlük mesai ücretlerine ve kesinti hesaplarına yol ücreti karıştırılmaz.
  const fullTicketPrice = Number(String(document.getElementById('ticketPrice')?.value || '0').replace(/\D/g, '')) || 0;
  let totalTrips = 0;
  for (let day = 1; day <= currentDaysCount; day++) {
    const raw = (document.getElementById('meal' + day)?.value || '').trim();
    if (/^\d+$/.test(raw)) totalTrips += Number(raw);
  }
  const totalTravelPay = totalTrips * 2 * fullTicketPrice;
  const netPayWithTravel = netOvertimePay + totalTravelPay;

  document.getElementById('card15Hours').textContent = `${formatSummaryDuration(mins1_5)}`;
  document.getElementById('card15Pay').textContent = `${money(pay1_5)} ₺`;

  document.getElementById('card20Hours').textContent = `${formatSummaryDuration(mins2_0)}`;
  document.getElementById('card20Pay').textContent = `${money(pay2_0)} ₺`;


  setTextOrVal('overtimePay', `${money(grossOvertimePay)} ₺`);
  setTextOrVal('deduction', `${money(totalDeductionMoney)} ₺`);
  setTextOrVal('travelPay', `${money(totalTravelPay)} ₺`);
  setTextOrVal('netPay', `${money(netPayWithTravel)} ₺`);
}

let toastTimer = null;
function showSavedToast(customMsg) {
  const toast = document.getElementById('saveToast');
  if (!toast) return;

  toast.textContent = customMsg || 'Kaydedildi ✓';
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 1200);
}

// Kullanıcı yazmayı bıraktıktan 1000 ms sonra bir kez kaydet ve hesapla.
let pendingSaveCalcTimer = null;
function scheduleSaveCalc() {
  clearTimeout(pendingSaveCalcTimer);
  pendingSaveCalcTimer = setTimeout(flushPendingSaveCalc, 1000);
}

function flushPendingSaveCalc() {
  if (pendingSaveCalcTimer === null) return;
  clearTimeout(pendingSaveCalcTimer);
  pendingSaveCalcTimer = null;
  save();
  calc();
}

// Alan değiştirme, arka plana geçme veya sayfadan çıkmada bekleyen veriyi sakla.
document.addEventListener('focusout', flushPendingSaveCalc);
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'hidden') flushPendingSaveCalc();
});
window.addEventListener('pagehide', flushPendingSaveCalc);

function save() {
  clearTimeout(pendingSaveCalcTimer);
  pendingSaveCalcTimer = null;
  rememberSalary();
  const nameEl = document.getElementById('name');
  if (nameEl) localStorage.setItem(PROFILE_NAME_KEY, nameEl.value);

  const o = {};
  document.querySelectorAll('input,select').forEach(e => {
    if (e.id && e.id !== 'selectYear' && e.id !== 'selectMonth') {
      o[e.id] = e.value;
    }
  });

  o['__shiftsData'] = dayShiftsData;
  localStorage.setItem(getStorageKey(), JSON.stringify(o));
  showSavedToast();
}

function restore() {
  // Bu alanlar tabloyla yeniden oluşturulmaz. Yeni ayda eski ayın kesintisi kalmamalı.
  const deductionHoursEl = document.getElementById('deductionHours');
  const deductionMinutesEl = document.getElementById('deductionMinutes');
  if (deductionHoursEl) deductionHoursEl.value = '0';
  if (deductionMinutesEl) deductionMinutesEl.value = '0';
  const ticketPriceEl = document.getElementById('ticketPrice');
  if (ticketPriceEl) ticketPriceEl.value = '0'; // Yeni ayda önceki ayın bilet fiyatını taşıma.

  try {
    const o = JSON.parse(localStorage.getItem(getStorageKey()) || '{}');
    dayShiftsData = o['__shiftsData'] || {};

    // Personel adı tüm aylar için tek bir kayıttan okunur.
    const nameEl = document.getElementById('name');
    let sharedName = localStorage.getItem(PROFILE_NAME_KEY);
    if (sharedName === null) {
      sharedName = (typeof o.name === 'string' && o.name.trim())
        ? o.name : findLegacyProfileValue('name');
      if (sharedName !== null) localStorage.setItem(PROFILE_NAME_KEY, sharedName);
    }
    if (nameEl) nameEl.value = sharedName ?? '';

    // Yeni ay önceki girilen maaşı devralır, kayıtlı ay ise kendi maaşını kullanır.
    let lastSalary = localStorage.getItem(LAST_SALARY_KEY);
    if (lastSalary === null) {
      lastSalary = findLegacyProfileValue('salary') ?? '0';
      localStorage.setItem(LAST_SALARY_KEY, lastSalary);
    }
    const salaryEl = document.getElementById('salary');
    if (salaryEl) {
      salaryEl.value = formatStoredSalary(Object.prototype.hasOwnProperty.call(o, 'salary')
        ? o.salary : lastSalary);
    }

    Object.entries(o).forEach(([id,v]) => {
      if (id === '__shiftsData' || id === 'name' || id === 'salary') return;
      const e = document.getElementById(id);
      if (e) {
        if (e.tagName === 'SELECT' && id.startsWith('type')) {
          e.value = is2XType(v) ? '2X (%100)' : '1.5X (%50)';
        } else if (e.tagName === 'INPUT') {
          e.value = v;
        }
      }
    });

    syncName();
  } catch(e) {
    console.warn('Kayıtlı veri geri yükleme hatası:', e);
  }
}

window.addEventListener('load', () => {
  initYearSelect();
  buildTables();
  restore();
  calc();
  preloadPdfFonts();

  // HTML, JS ve CSS revizyonlarını ilgili dosyalardan oku ve tek satır göster.
  const htmlRev = document.querySelector('meta[name="html-revision"]')?.content || '?';
  const cssRev = getComputedStyle(document.documentElement)
    .getPropertyValue('--css-rev').trim() || '?';
  const revisionElement = document.getElementById('appVersion');
  if (revisionElement) {
    revisionElement.textContent = `V1.0.JS${JS_REV}.HTML${htmlRev}.CSS${cssRev}`;
  }

});






  
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js').catch(err => console.log('SW Hata:', err));
  });
}
