/**
 * CARVLAK AUTOMOTORES | Tasación & Peritaje en Vivo
 * Desarrollado para Maximiliano Irujo, Jonathan Kaitazoff y el equipo de CARVLAK.
 */

// ==============================================================================
// ESTADO GLOBAL DE LA APLICACIÓN
// ==============================================================================
const STATE = {
  activeOperator: localStorage.getItem('carvlak_live_operator') || "Maximiliano Irujo",
  bossName: localStorage.getItem('carvlak_boss_name') || "Jonathan Kaitazoff",
  bossPhone: localStorage.getItem('carvlak_boss_phone') || "59899267964",
  costPerPanel: parseInt(localStorage.getItem('carvlak_cost_per_panel') || "90", 10),
  
  hasStructuralDamage: false,
  
  // Estados de paneles: 'original' | 'repintada' | 'masillada' | 'danada'
  panels: {
    paragolpes_del: 'original',
    capo: 'original',
    parabrisas: 'original',
    techo: 'original',
    luneta: 'original',
    baul: 'original',
    paragolpes_tras: 'original',
    guardabarros_del_izq: 'original',
    puerta_del_izq: 'original',
    puerta_tras_izq: 'original',
    guardabarros_tras_izq: 'original',
    guardabarros_del_der: 'original',
    puerta_del_der: 'original',
    puerta_tras_der: 'original',
    guardabarros_tras_der: 'original'
  },

  // Nombres legibles de paneles
  panelLabels: {
    paragolpes_del: 'Paragolpes Delantero',
    capo: 'Capó',
    parabrisas: 'Parabrisas',
    techo: 'Techo',
    luneta: 'Luneta Trasera',
    baul: 'Baúl / Portón Trasero',
    paragolpes_tras: 'Paragolpes Trasero',
    guardabarros_del_izq: 'Guardabarros Del. Izq.',
    puerta_del_izq: 'Puerta Del. Izq.',
    puerta_tras_izq: 'Puerta Tras. Izq.',
    guardabarros_tras_izq: 'Guardabarros Tras. Izq.',
    guardabarros_del_der: 'Guardabarros Del. Der.',
    puerta_del_der: 'Puerta Del. Der.',
    puerta_tras_der: 'Puerta Tras. Der.',
    guardabarros_tras_der: 'Guardabarros Tras. Der.'
  },

  // Fotos capturadas (base64 comprimido)
  photos: {
    frente: null,
    lat_izq: null,
    lat_der: null,
    trasera: null,
    interior: null,
    tablero: null,
    motor: null,
    libreta: null
  },
  extraPhotos: [],

  // Historial de peritajes
  history: JSON.parse(localStorage.getItem('carvlak_live_history') || '[]')
};

// ==============================================================================
// INICIALIZACIÓN
// ==============================================================================
document.addEventListener('DOMContentLoaded', () => {
  initUI();
  initSvgMap();
  attachFormListeners();
  updateInspectionSummary();
  calculateOfferNumbers();
  renderHistory();

  // Registrar Service Worker si está soportado
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js').catch(err => console.log('SW no registrado:', err));
  }
});

function initUI() {
  const operatorSelect = document.getElementById('operatorSelect');
  if (operatorSelect) {
    operatorSelect.value = STATE.activeOperator;
  }
  updateBossDisplay();
}

function updateBossDisplay() {
  const label = document.getElementById('bossLabelDisplay');
  if (label) {
    label.textContent = `${STATE.bossName} (+${STATE.bossPhone})`;
  }
  const settingName = document.getElementById('settingBossName');
  const settingPhone = document.getElementById('settingBossPhone');
  const settingCost = document.getElementById('settingCostPerPanel');
  if (settingName) settingName.value = STATE.bossName;
  if (settingPhone) settingPhone.value = STATE.bossPhone;
  if (settingCost) settingCost.value = STATE.costPerPanel;
}

function changeOperator(val) {
  STATE.activeOperator = val;
  localStorage.setItem('carvlak_live_operator', val);
  showToast(`Inspector: ${val}`, '👤');
  updateInspectionSummary();
}

// ==============================================================================
// NAVEGACIÓN DE PESTAÑAS (TABS)
// ==============================================================================
function switchTab(tabId) {
  const tabs = ['tab-vehiculo', 'tab-carroceria', 'tab-mecanica', 'tab-fotos', 'tab-oferta'];
  tabs.forEach(t => {
    const el = document.getElementById(t);
    const navBtn = document.getElementById(`nav-${t}`);
    if (el) {
      if (t === tabId) {
        el.classList.remove('hidden');
      } else {
        el.classList.add('hidden');
      }
    }
    if (navBtn) {
      if (t === tabId) {
        navBtn.classList.add('bg-[#2D3E46]', 'text-white', 'shadow-sm');
        navBtn.classList.remove('text-slate-600', 'hover:bg-slate-100');
      } else {
        navBtn.classList.remove('bg-[#2D3E46]', 'text-white', 'shadow-sm');
        navBtn.classList.add('text-slate-600', 'hover:bg-slate-100');
      }
    }
  });

  // Al abrir oferta, forzar recálculo
  if (tabId === 'tab-oferta') {
    calculateOfferNumbers();
  }

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ==============================================================================
// DAÑO ESTRUCTURAL (ALERTA ROJA)
// ==============================================================================
function setStructuralDamage(hasDamage) {
  STATE.hasStructuralDamage = hasDamage;
  const btnNo = document.getElementById('btnStructNo');
  const btnYes = document.getElementById('btnStructYes');
  const detailsBox = document.getElementById('structuralDetailsBox');
  const card = document.getElementById('structuralCard');

  if (hasDamage) {
    btnYes.className = 'px-4 py-2 rounded-lg text-xs font-bold transition-all bg-rose-600 text-white shadow-sm';
    btnNo.className = 'px-4 py-2 rounded-lg text-xs font-bold transition-all text-slate-700 hover:bg-slate-200';
    detailsBox.classList.remove('hidden');
    card.classList.add('border-rose-500', 'bg-rose-50/20');
    card.classList.remove('border-slate-200');
    showToast('⚠️ Daño Estructural Activado', '🚨');
  } else {
    btnNo.className = 'px-4 py-2 rounded-lg text-xs font-bold transition-all bg-emerald-600 text-white shadow-sm';
    btnYes.className = 'px-4 py-2 rounded-lg text-xs font-bold transition-all text-slate-700 hover:bg-rose-100';
    detailsBox.classList.add('hidden');
    card.classList.remove('border-rose-500', 'bg-rose-50/20');
    card.classList.add('border-slate-200');
    // Desmarcar checkboxes
    document.querySelectorAll('.struct-check').forEach(cb => cb.checked = false);
    document.getElementById('structuralNotes').value = '';
  }

  updateInspectionSummary();
}

// ==============================================================================
// MAPA INTERACTIVO DE PANELES (SVG + LISTA)
// ==============================================================================
function initSvgMap() {
  const svgMap = document.getElementById('carSvgMap');
  if (!svgMap) return;

  // Asignar evento click a cada path interactivo del SVG
  Object.keys(STATE.panels).forEach(panelId => {
    const el = document.getElementById(`part-${panelId}`);
    if (el) {
      el.addEventListener('click', () => {
        cyclePanelState(panelId);
      });
    }
  });
}

function cyclePanelState(panelId) {
  const cycleOrder = ['original', 'repintada', 'masillada', 'danada'];
  const currentState = STATE.panels[panelId] || 'original';
  const nextIndex = (cycleOrder.indexOf(currentState) + 1) % cycleOrder.length;
  const nextState = cycleOrder[nextIndex];

  STATE.panels[panelId] = nextState;
  updatePanelUI(panelId, nextState);
  updatePanelsSummary();
  autoCalculatePaintCost();
  updateInspectionSummary();
}

function updatePanelUI(panelId, state) {
  // 1. Actualizar clase en el SVG
  const svgEl = document.getElementById(`part-${panelId}`);
  if (svgEl) {
    svgEl.classList.remove('state-original', 'state-repintada', 'state-masillada', 'state-danada');
    svgEl.classList.add(`state-${state}`);
  }

  // 2. Actualizar badge en la lista
  const badgeEl = document.getElementById(`badge-${panelId}`);
  if (badgeEl) {
    const config = {
      original: { text: 'Original', class: 'bg-slate-100 text-slate-600 font-bold' },
      repintada: { text: 'Repintada', class: 'bg-amber-100 text-amber-800 font-extrabold border border-amber-300' },
      masillada: { text: 'Masilla', class: 'bg-orange-100 text-orange-800 font-extrabold border border-orange-300' },
      danada: { text: 'Dañada', class: 'bg-rose-100 text-rose-800 font-extrabold border border-rose-400' }
    };
    const c = config[state] || config.original;
    badgeEl.textContent = c.text;
    badgeEl.className = `text-[10px] px-1.5 py-0.5 rounded ${c.class}`;
  }
}

function resetAllPanels() {
  Object.keys(STATE.panels).forEach(p => {
    STATE.panels[p] = 'original';
    updatePanelUI(p, 'original');
  });
  updatePanelsSummary();
  autoCalculatePaintCost();
  updateInspectionSummary();
  showToast('Carrocería reseteada a Original', '🎨');
}

function updatePanelsSummary() {
  const nonOriginal = Object.entries(STATE.panels).filter(([_, state]) => state !== 'original');
  const countBadge = document.getElementById('panelsSummaryBadge');
  const detailText = document.getElementById('panelsDetailText');
  const navBadge = document.getElementById('repaintedCountBadge');

  if (countBadge) {
    countBadge.textContent = `${nonOriginal.length} piezas`;
  }

  if (navBadge) {
    if (nonOriginal.length > 0) {
      navBadge.textContent = nonOriginal.length;
      navBadge.classList.remove('hidden');
    } else {
      navBadge.classList.add('hidden');
    }
  }

  if (detailText) {
    if (nonOriginal.length === 0) {
      detailText.textContent = 'Vehículo 100% original de fábrica en todos sus paneles.';
      detailText.className = 'text-xs text-emerald-700 mt-1 font-medium';
    } else {
      const summaryList = nonOriginal.map(([pId, state]) => {
        const name = STATE.panelLabels[pId] || pId;
        return `${name} (${state.toUpperCase()})`;
      });
      detailText.textContent = `Detalles: ${summaryList.join(', ')}.`;
      detailText.className = 'text-xs text-amber-900 mt-1 font-medium';
    }
  }
}

function autoCalculatePaintCost() {
  // Cantidad de piezas a repintar o reparar (repintada, masillada, dañada)
  const repaintedCount = Object.values(STATE.panels).filter(s => s !== 'original').length;
  const costInput = document.getElementById('costPintura');
  const helper = document.getElementById('costPinturaHelper');
  
  if (costInput) {
    const totalSugerido = repaintedCount * STATE.costPerPanel;
    costInput.value = totalSugerido > 0 ? totalSugerido : '';
    if (helper) {
      helper.textContent = repaintedCount > 0 
        ? `${repaintedCount} pieza(s) x USD $${STATE.costPerPanel}` 
        : 'Auto-calculado según piezas';
    }
  }
  calculateOfferNumbers();
}

// ==============================================================================
// GESTIÓN DE FOTOS EN VIVO (CÁMARA, COMPRESIÓN, WEB SHARE)
// ==============================================================================
function triggerPhotoInput(slotId) {
  const input = document.getElementById(`input-${slotId}`);
  if (input) input.click();
}

function handlePhotoUpload(slotId, inputEl) {
  if (!inputEl.files || !inputEl.files[0]) return;
  const file = inputEl.files[0];

  compressImageFile(file, (base64) => {
    STATE.photos[slotId] = base64;
    renderPhotoSlot(slotId, base64);
    updatePhotoCount();
    updateInspectionSummary();
    showToast(`Foto capturada: ${slotId}`, '📸');
  });
}

function renderPhotoSlot(slotId, base64) {
  const slot = document.getElementById(`slot-${slotId}`);
  const img = document.getElementById(`img-${slotId}`);
  const placeholder = document.getElementById(`placeholder-${slotId}`);
  const delBtn = document.getElementById(`del-${slotId}`);

  if (slot && img && placeholder && delBtn) {
    img.src = base64;
    img.classList.remove('hidden');
    placeholder.classList.add('hidden');
    delBtn.classList.remove('hidden');
    slot.classList.add('has-image');
  }
}

function deletePhoto(slotId) {
  STATE.photos[slotId] = null;
  const slot = document.getElementById(`slot-${slotId}`);
  const img = document.getElementById(`img-${slotId}`);
  const placeholder = document.getElementById(`placeholder-${slotId}`);
  const delBtn = document.getElementById(`del-${slotId}`);
  const input = document.getElementById(`input-${slotId}`);

  if (slot && img && placeholder && delBtn) {
    img.src = '';
    img.classList.add('hidden');
    placeholder.classList.remove('hidden');
    delBtn.classList.add('hidden');
    slot.classList.remove('has-image');
  }
  if (input) input.value = '';
  updatePhotoCount();
  updateInspectionSummary();
}

function handleExtraPhotosUpload(inputEl) {
  if (!inputEl.files || inputEl.files.length === 0) return;

  Array.from(inputEl.files).forEach(file => {
    compressImageFile(file, (base64) => {
      STATE.extraPhotos.push(base64);
      renderExtraPhotos();
      updatePhotoCount();
      updateInspectionSummary();
    });
  });
  inputEl.value = '';
  showToast('Foto(s) extra agregada(s)', '➕');
}

function renderExtraPhotos() {
  const container = document.getElementById('extraPhotosContainer');
  const noPhotosText = document.getElementById('noExtraPhotosText');
  if (!container) return;

  container.innerHTML = '';
  if (STATE.extraPhotos.length === 0) {
    if (noPhotosText) container.appendChild(noPhotosText);
    return;
  }

  STATE.extraPhotos.forEach((b64, idx) => {
    const div = document.createElement('div');
    div.className = 'photo-slot has-image relative';
    div.innerHTML = `
      <img src="${b64}" class="w-full h-full object-cover">
      <button type="button" onclick="deleteExtraPhoto(${idx})" class="photo-badge-del">&times;</button>
    `;
    container.appendChild(div);
  });
}

function deleteExtraPhoto(idx) {
  STATE.extraPhotos.splice(idx, 1);
  renderExtraPhotos();
  updatePhotoCount();
  updateInspectionSummary();
}

function updatePhotoCount() {
  const coreCount = Object.values(STATE.photos).filter(Boolean).length;
  const totalCount = coreCount + STATE.extraPhotos.length;
  const badge = document.getElementById('photoCountBadge');
  if (badge) {
    if (totalCount > 0) {
      badge.textContent = totalCount;
      badge.classList.remove('hidden');
    } else {
      badge.classList.add('hidden');
    }
  }
}

// Compresor ultraliviano con Canvas
function compressImageFile(file, callback) {
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = (e) => {
    const img = new Image();
    img.src = e.target.result;
    img.onload = () => {
      const maxDim = 1200;
      let w = img.width;
      let h = img.height;
      if (w > h && w > maxDim) {
        h = Math.round((h * maxDim) / w);
        w = maxDim;
      } else if (h > maxDim) {
        w = Math.round((w * maxDim) / h);
        h = maxDim;
      }

      const canvas = document.createElement('canvas');
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, w, h);
      const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.82);
      callback(compressedDataUrl);
    };
  };
}

// ==============================================================================
// COMPARTIR FOTOS A WHATSAPP (WEB SHARE API NATIVA PARA MÓVILES)
// ==============================================================================
async function sharePhotosToWhatsApp() {
  const allImages = [];
  
  // Fotos de ranuras principales
  Object.entries(STATE.photos).forEach(([slot, b64]) => {
    if (b64) allImages.push({ name: `auto_${slot}.jpg`, b64 });
  });

  // Fotos extras
  STATE.extraPhotos.forEach((b64, idx) => {
    allImages.push({ name: `auto_detalle_${idx + 1}.jpg`, b64 });
  });

  if (allImages.length === 0) {
    alert('Primero sacá o subí alguna foto del auto en la pestaña "Fotos en Vivo".');
    switchTab('tab-fotos');
    return;
  }

  // Convertir Base64 a File objects
  const filesArray = [];
  for (const item of allImages) {
    const res = await fetch(item.b64);
    const blob = await res.blob();
    const file = new File([blob], item.name, { type: 'image/jpeg' });
    filesArray.push(file);
  }

  const carInfo = `${document.getElementById('carMarca').value || 'Auto'} ${document.getElementById('carModelo').value || ''} (${document.getElementById('carAno').value || ''})`;

  // Intentar compartir de forma nativa (iOS Safari y Android Chrome permiten mandar fotos a WhatsApp)
  if (navigator.canShare && navigator.canShare({ files: filesArray })) {
    try {
      await navigator.share({
        title: `Fotos ${carInfo} - CARVLAK`,
        text: `Fotos del peritaje de ${carInfo} para Jonathan Kaitazoff`,
        files: filesArray
      });
      showToast('Fotos compartidas con éxito', '📲');
    } catch (err) {
      if (err.name !== 'AbortError') {
        console.error('Error al compartir fotos:', err);
      }
    }
  } else {
    // Fallback: descargar las fotos o notificar al usuario
    alert(`En este dispositivo no se soporta el envío de archivos adjuntos directo por web share. Te sugerimos abrir la web en Safari / Chrome en tu iPhone o descargar las fotos.`);
  }
}

// ==============================================================================
// CÁLCULO DE NÚMEROS Y OFERTA SUGERIDA
// ==============================================================================
function toggleDeudaInput(selectId, inputId) {
  const sel = document.getElementById(selectId);
  const inp = document.getElementById(inputId);
  if (sel && inp) {
    if (sel.value.includes('pendientes') || sel.value.includes('Tiene')) {
      inp.disabled = false;
      inp.classList.remove('bg-slate-100');
      inp.classList.add('bg-white');
      inp.focus();
    } else {
      inp.disabled = true;
      inp.value = '';
      inp.classList.add('bg-slate-100');
      inp.classList.remove('bg-white');
    }
  }
  updateInspectionSummary();
}

function calculateOfferNumbers() {
  const valMercado = parseFloat(document.getElementById('valMercado').value) || 0;
  const costPintura = parseFloat(document.getElementById('costPintura').value) || 0;
  const costMecanica = parseFloat(document.getElementById('costMecanica').value) || 0;
  const costCubiertas = parseFloat(document.getElementById('costCubiertas').value) || 0;
  const costDeudas = parseFloat(document.getElementById('costDeudas').value) || 0;
  const valPretension = parseFloat(document.getElementById('valPretensionCliente').value) || 0;
  const valMargen = parseFloat(document.getElementById('valMargen').value) || 1500;

  const totalGastos = costPintura + costMecanica + costCubiertas + costDeudas;

  // Actualizar display de gastos
  const displayGastos = document.getElementById('totalGastosDisplay');
  if (displayGastos) {
    displayGastos.textContent = `- USD $${formatNumber(totalGastos)}`;
  }

  // Oferta sugerida
  let ofertaCalculada = 0;
  if (valMercado > 0) {
    ofertaCalculada = Math.max(0, valMercado - totalGastos - valMargen);
  }

  // Redondear a centenas o número limpio
  const ofertaLimpia = Math.round(ofertaCalculada / 100) * 100;
  const ofertaDisplay = document.getElementById('ofertaSugeridaDisplay');
  const floatingOffer = document.getElementById('floatingOfferDisplay');
  const ofertaExplicacion = document.getElementById('ofertaCalculoExplicacion');
  const statusViabilidad = document.getElementById('statusViabilidad');

  if (ofertaDisplay) {
    ofertaDisplay.textContent = `USD $${formatNumber(ofertaLimpia)}`;
  }
  if (floatingOffer) {
    floatingOffer.textContent = `USD $${formatNumber(ofertaLimpia)}`;
  }

  // Análisis de pretensión del cliente vs oferta sugerida
  if (valMercado > 0) {
    if (valPretension > 0) {
      const diferencia = valPretension - ofertaLimpia;
      if (diferencia <= 0) {
        statusViabilidad.className = 'text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-200 text-emerald-950 border border-emerald-400';
        statusViabilidad.textContent = '🟢 Negocio Muy Favorable';
        ofertaExplicacion.textContent = `El cliente pide USD $${formatNumber(valPretension)}, lo cual deja un margen incluso superior al estimado. ¡Para cerrar ya!`;
      } else if (diferencia <= 800) {
        statusViabilidad.className = 'text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-amber-200 text-amber-950 border border-amber-400';
        statusViabilidad.textContent = '🟡 Negociable en Patio';
        ofertaExplicacion.textContent = `El cliente pretende USD $${formatNumber(valPretension)} (diferencia de USD $${formatNumber(diferencia)} con la oferta calculada). Negociable.`;
      } else {
        statusViabilidad.className = 'text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-rose-200 text-rose-950 border border-rose-400';
        statusViabilidad.textContent = '🔴 Pretensión Alta';
        ofertaExplicacion.textContent = `El cliente pide USD $${formatNumber(valPretension)}, muy por encima de los números de compra (diferencia USD $${formatNumber(diferencia)}).`;
      }
    } else {
      statusViabilidad.className = 'text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800';
      statusViabilidad.textContent = 'Cotización calculada';
      ofertaExplicacion.textContent = `Mercado USD $${formatNumber(valMercado)} - Gastos USD $${formatNumber(totalGastos)} - Margen USD $${formatNumber(valMargen)}.`;
    }
  }

  updateInspectionSummary();
}

// ==============================================================================
// GENERADOR DEL REPORTE DIRECTO PARA JONATHAN (WHATSAPP)
// ==============================================================================
function generateWhatsappMessageText() {
  const marca = (document.getElementById('carMarca').value || '').trim();
  const modelo = (document.getElementById('carModelo').value || '').trim();
  const version = (document.getElementById('carVersion').value || '').trim();
  const ano = (document.getElementById('carAno').value || '').trim();
  const km = (document.getElementById('carKm').value || '').trim();
  const patente = (document.getElementById('carPatente').value || '').trim();
  const color = (document.getElementById('carColor').value || '').trim();
  const transmision = document.getElementById('carTransmision').value;
  const combustible = document.getElementById('carCombustible').value;
  const llaves = document.getElementById('carLlaves').value;
  const duenos = document.getElementById('carDuenos').value;
  const service = document.getElementById('carService').value;

  const clientNombre = (document.getElementById('clientNombre').value || '').trim();
  const clientObjetivo = document.getElementById('clientObjetivo').value;

  // Piezas no originales
  const nonOriginal = Object.entries(STATE.panels).filter(([_, state]) => state !== 'original');
  const repaintedNames = nonOriginal.map(([pId, st]) => `${STATE.panelLabels[pId]} (${st.toUpperCase()})`);
  const paintNotes = (document.getElementById('paintNotes').value || '').trim();

  // Daño estructural
  let structuralText = '❌ NO (Estructura sana)';
  if (STATE.hasStructuralDamage) {
    const checkedIssues = Array.from(document.querySelectorAll('.struct-check:checked')).map(c => c.value);
    const structNotes = (document.getElementById('structuralNotes').value || '').trim();
    structuralText = `🚨 SÍ TIENE DAÑO ESTRUCTURAL:\n   • ${checkedIssues.join('\n   • ')}`;
    if (structNotes) structuralText += `\n   • Nota: ${structNotes}`;
  }

  // Mecánica
  const motorSonido = document.getElementById('motorSonido').value;
  const motorHumo = document.getElementById('motorHumo').value;
  const motorPerdidas = document.getElementById('motorPerdidas').value;
  const caja = document.getElementById('mecanicaCaja').value;
  const testigos = document.getElementById('testigosTablero').value;
  const aire = document.getElementById('aireAcondicionado').value;
  const mecanicaNotes = (document.getElementById('mecanicaNotes').value || '').trim();

  // Cubiertas & Papeles
  const cubDel = document.getElementById('cubiertasDelanteras').value;
  const cubTras = document.getElementById('cubiertasTraseras').value;
  const auxilio = document.getElementById('cubiertasAuxilio').value;
  const libreta = document.getElementById('docsLibreta').value;
  const titulos = document.getElementById('docsTitulos').value;
  
  const suciveStatus = document.getElementById('docsSuciveStatus').value;
  const suciveMonto = document.getElementById('docsSuciveMonto').value;
  const suciveText = suciveMonto ? `${suciveStatus} ($${suciveMonto})` : suciveStatus;

  const multasStatus = document.getElementById('docsMultasStatus').value;
  const multasMonto = document.getElementById('docsMultasMonto').value;
  const multasText = multasMonto ? `${multasStatus} ($${multasMonto})` : multasStatus;

  // Números
  const valMercado = parseFloat(document.getElementById('valMercado').value) || 0;
  const costPintura = parseFloat(document.getElementById('costPintura').value) || 0;
  const costMecanica = parseFloat(document.getElementById('costMecanica').value) || 0;
  const costCubiertas = parseFloat(document.getElementById('costCubiertas').value) || 0;
  const costDeudas = parseFloat(document.getElementById('costDeudas').value) || 0;
  const totalGastos = costPintura + costMecanica + costCubiertas + costDeudas;
  const valPretension = parseFloat(document.getElementById('valPretensionCliente').value) || 0;
  const valMargen = parseFloat(document.getElementById('valMargen').value) || 1500;
  const ofertaLimpia = valMercado > 0 ? Math.max(0, Math.round((valMercado - totalGastos - valMargen) / 100) * 100) : 0;

  // Conteo fotos
  const totalPhotos = Object.values(STATE.photos).filter(Boolean).length + STATE.extraPhotos.length;

  const now = new Date();
  const fechaStr = `${String(now.getDate()).padStart(2, '0')}/${String(now.getMonth() + 1).padStart(2, '0')}/${now.getFullYear()} - ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

  // REDACCIÓN DEL MENSAJE EJECUTIVO PARA JONATHAN
  let msg = `🚗 *PERITAJE EN VIVO | CARVLAK*\n`;
  msg += `----------------------------------------\n`;
  msg += `👤 *Inspector:* ${STATE.activeOperator}\n`;
  msg += `📅 *Fecha:* ${fechaStr}\n\n`;

  msg += `🚘 *VEHÍCULO:*\n`;
  msg += `• *Auto:* ${marca || 'Auto'} ${modelo} ${version ? '(' + version + ')' : ''}\n`;
  msg += `• *Año:* ${ano || '-'} | *KM:* ${km ? formatNumber(km) + ' km' : '-'}\n`;
  msg += `• *Matrícula:* ${patente || '-'} | *Color:* ${color || '-'}\n`;
  msg += `• *Caja:* ${transmision} | *Combustible:* ${combustible}\n`;
  msg += `• *Llaves:* ${llaves}\n`;
  msg += `• *Historial:* ${duenos} • ${service}\n`;
  if (clientNombre) {
    msg += `• *Cliente:* ${clientNombre} (${clientObjetivo})\n`;
  }
  msg += `\n`;

  msg += `⚠️ *ESTRUCTURA & CHAPA:*\n`;
  msg += `• *Daño Estructural:* ${structuralText}\n`;
  if (nonOriginal.length > 0) {
    msg += `• *Piezas no originales (${nonOriginal.length}):* ${repaintedNames.join(', ')}\n`;
  } else {
    msg += `• *Carrocería:* 100% original de fábrica en todos los paneles\n`;
  }
  if (paintNotes) {
    msg += `• *Detalle Chapa:* ${paintNotes}\n`;
  }
  msg += `\n`;

  msg += `⚙️ *MECÁNICA & ESTADO:*\n`;
  msg += `• *Motor:* ${motorSonido}\n`;
  msg += `• *Gases/Humo:* ${motorHumo} | *Pérdidas:* ${motorPerdidas}\n`;
  msg += `• *Caja/Embrague:* ${caja}\n`;
  msg += `• *Tablero:* ${testigos}\n`;
  msg += `• *Aire Acondicionado:* ${aire}\n`;
  msg += `• *Cubiertas:* Del. ${cubDel} | Tras. ${cubTras} | Auxilio: ${auxilio}\n`;
  if (mecanicaNotes) {
    msg += `• *Notas:* ${mecanicaNotes}\n`;
  }
  msg += `\n`;

  msg += `📑 *DOCUMENTACIÓN:*\n`;
  msg += `• *Libreta:* ${libreta}\n`;
  msg += `• *Títulos:* ${titulos}\n`;
  msg += `• *Patente:* ${suciveText} | *Multas:* ${multasText}\n\n`;

  msg += `💵 *NÚMEROS & OFERTA SUGERIDA:*\n`;
  if (valMercado > 0) {
    msg += `• *Venta Mercado (Plaza):* USD $${formatNumber(valMercado)}\n`;
    if (totalGastos > 0) {
      msg += `• *Gastos Reacondicionamiento:* USD $${formatNumber(totalGastos)} (Pintura $${formatNumber(costPintura)}, Mec/Cub $${formatNumber(costMecanica + costCubiertas)})\n`;
    }
    if (valPretension > 0) {
      msg += `• *Cliente pide:* USD $${formatNumber(valPretension)}\n`;
    }
    msg += `🎯 *OFERTA EN MANO SUGERIDA:* USD $${formatNumber(ofertaLimpia)}\n`;
  } else {
    msg += `• *(Sin valor de reventa cargado aún)*\n`;
    if (valPretension > 0) msg += `• *Cliente pide:* USD $${formatNumber(valPretension)}\n`;
  }

  if (totalPhotos > 0) {
    msg += `\n📸 *(Te adjunto ${totalPhotos} fotos a continuación)*\n`;
  } else {
    msg += `\n*(Sin fotos adjuntas)*\n`;
  }

  msg += `----------------------------------------\n`;
  msg += `¿Qué te parece Jonathan? ¿Le tiramos esa oferta?`;

  return msg;
}

function updateInspectionSummary() {
  const preview = document.getElementById('whatsappMessagePreview');
  if (preview) {
    preview.textContent = generateWhatsappMessageText();
  }
}

// ==============================================================================
// ACCIÓN PRINCIPAL: ENVIAR A JONATHAN POR WHATSAPP
// ==============================================================================
function sendDirectToJonathan() {
  const msg = generateWhatsappMessageText();
  const phone = STATE.bossPhone.replace(/[^0-9]/g, '');

  if (!phone) {
    alert('Por favor configurá el número de teléfono de Jonathan en Ajustes (⚙️).');
    openSettingsModal();
    return;
  }

  const encodedMsg = encodeURIComponent(msg);
  const waUrl = `https://wa.me/${phone}?text=${encodedMsg}`;

  // Guardar en historial automáticamente
  saveCurrentInspection(false);

  // Abrir WhatsApp en nueva pestaña / app
  window.open(waUrl, '_blank');
  showToast('Abriendo chat con Jonathan...', '📲');
}

function copyWhatsappMessage() {
  const msg = generateWhatsappMessageText();
  navigator.clipboard.writeText(msg).then(() => {
    const btnText = document.getElementById('copyBtnText');
    if (btnText) {
      const orig = btnText.textContent;
      btnText.textContent = '¡Copiado!';
      setTimeout(() => { btnText.textContent = orig; }, 2000);
    }
    showToast('Reporte copiado al portapapeles', '📋');
  }).catch(() => {
    alert('No se pudo copiar automáticamente. Podés seleccionar el texto en pantalla.');
  });
}

// ==============================================================================
// HISTORIAL DE PERITAJES (LOCALSTORAGE)
// ==============================================================================
function saveCurrentInspection(showFeedback = true) {
  const marca = document.getElementById('carMarca').value.trim() || 'Auto';
  const modelo = document.getElementById('carModelo').value.trim() || 'Sin modelo';
  const ano = document.getElementById('carAno').value.trim() || '';
  const km = document.getElementById('carKm').value.trim() || '';
  const oferta = document.getElementById('ofertaSugeridaDisplay').textContent.trim();
  const clientNombre = document.getElementById('clientNombre').value.trim();

  const item = {
    id: 'peritaje_' + Date.now(),
    date: new Date().toISOString(),
    car: `${marca} ${modelo} ${ano}`.trim(),
    km: km,
    oferta: oferta,
    client: clientNombre || 'Cliente de patio',
    hasDamage: STATE.hasStructuralDamage,
    repaintedCount: Object.values(STATE.panels).filter(s => s !== 'original').length,
    operator: STATE.activeOperator,
    message: generateWhatsappMessageText()
  };

  STATE.history.unshift(item);
  // Mantener últimos 50
  if (STATE.history.length > 50) STATE.history.pop();
  localStorage.setItem('carvlak_live_history', JSON.stringify(STATE.history));

  renderHistory();
  if (showFeedback) {
    showToast('Peritaje guardado en historial', '💾');
  }
}

function renderHistory() {
  const container = document.getElementById('historyListContainer');
  const countBadge = document.getElementById('historyCountBadge');
  if (countBadge) countBadge.textContent = STATE.history.length;
  if (!container) return;

  if (STATE.history.length === 0) {
    container.innerHTML = `
      <div class="text-center py-8 text-slate-400 text-xs">
        <span class="text-3xl block mb-2">📁</span>
        No hay peritajes registrados hoy.
      </div>
    `;
    return;
  }

  container.innerHTML = '';
  STATE.history.forEach((h, idx) => {
    const d = new Date(h.date);
    const dateStr = `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')} hs`;
    
    const div = document.createElement('div');
    div.className = 'bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs space-y-1.5 hover:bg-slate-100 transition-colors';
    div.innerHTML = `
      <div class="flex justify-between items-start">
        <h4 class="font-bold text-slate-900 text-sm">${h.car}</h4>
        <span class="text-[10px] text-slate-500 font-semibold">${dateStr}</span>
      </div>
      <div class="flex flex-wrap items-center gap-2 text-[11px] text-slate-600">
        <span>👤 ${h.client}</span>
        <span>•</span>
        <span>${h.km ? h.km + ' km' : 'KM sin reg.'}</span>
        <span>•</span>
        <span class="font-extrabold text-emerald-800">${h.oferta}</span>
      </div>
      <div class="flex items-center gap-1.5 pt-1">
        ${h.hasDamage ? '<span class="px-1.5 py-0.2 rounded text-[10px] font-bold bg-rose-100 text-rose-800">Daño Estructural</span>' : ''}
        ${h.repaintedCount > 0 ? `<span class="px-1.5 py-0.2 rounded text-[10px] font-bold bg-amber-100 text-amber-800">${h.repaintedCount} piezas rep.</span>` : '<span class="px-1.5 py-0.2 rounded text-[10px] font-bold bg-slate-200 text-slate-700">100% Original</span>'}
      </div>
      <div class="pt-2 flex justify-end gap-2">
        <button onclick="copyHistoryMessage(${idx})" class="bg-white border border-slate-300 hover:bg-slate-200 px-2 py-1 rounded text-[11px] font-bold">
          Copiar Reporte
        </button>
        <button onclick="resendHistoryToWhatsapp(${idx})" class="bg-emerald-600 hover:bg-emerald-500 text-white px-2 py-1 rounded text-[11px] font-bold">
          Reenviar a WhatsApp
        </button>
      </div>
    `;
    container.appendChild(div);
  });
}

function copyHistoryMessage(idx) {
  const item = STATE.history[idx];
  if (item && item.message) {
    navigator.clipboard.writeText(item.message);
    showToast('Reporte copiado', '📋');
  }
}

function resendHistoryToWhatsapp(idx) {
  const item = STATE.history[idx];
  if (item && item.message) {
    const phone = STATE.bossPhone.replace(/[^0-9]/g, '');
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(item.message)}`;
    window.open(url, '_blank');
  }
}

function toggleHistoryDrawer() {
  const drawer = document.getElementById('historyDrawer');
  if (drawer) {
    drawer.classList.toggle('hidden');
  }
}

function clearHistory() {
  if (confirm('¿Estás seguro de que deseás vaciar el historial de peritajes?')) {
    STATE.history = [];
    localStorage.removeItem('carvlak_live_history');
    renderHistory();
    showToast('Historial vaciado', '🗑️');
  }
}

// ==============================================================================
// MODAL DE AJUSTES & RESET
// ==============================================================================
function openSettingsModal() {
  const modal = document.getElementById('settingsModal');
  if (modal) {
    modal.classList.remove('hidden');
    modal.classList.add('flex');
  }
}

function closeSettingsModal() {
  const modal = document.getElementById('settingsModal');
  if (modal) {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
  }
}

function saveSettings() {
  const name = document.getElementById('settingBossName').value.trim();
  const phone = document.getElementById('settingBossPhone').value.trim();
  const cost = parseInt(document.getElementById('settingCostPerPanel').value, 10) || 90;

  if (name) {
    STATE.bossName = name;
    localStorage.setItem('carvlak_boss_name', name);
  }
  if (phone) {
    STATE.bossPhone = phone;
    localStorage.setItem('carvlak_boss_phone', phone);
  }
  STATE.costPerPanel = cost;
  localStorage.setItem('carvlak_cost_per_panel', cost.toString());

  updateBossDisplay();
  closeSettingsModal();
  autoCalculatePaintCost();
  updateInspectionSummary();
  showToast('Ajustes guardados correctamente', '✅');
}

function resetInspectionForm() {
  if (confirm('¿Deseás iniciar una nueva tasación en blanco? Se limpiará el formulario actual.')) {
    document.querySelectorAll('input:not([type="button"]):not([type="submit"])').forEach(i => {
      if (i.id !== 'settingBossName' && i.id !== 'settingBossPhone' && i.id !== 'valMargen') {
        i.value = '';
      }
    });
    setStructuralDamage(false);
    resetAllPanels();
    Object.keys(STATE.photos).forEach(slot => deletePhoto(slot));
    STATE.extraPhotos = [];
    renderExtraPhotos();
    updatePhotoCount();
    calculateOfferNumbers();
    switchTab('tab-vehiculo');
    showToast('Nueva tasación en blanco iniciada', '🔄');
  }
}

// ==============================================================================
// CARGA DE EJEMPLO DE PRUEBA RÁPIDA (VOLKSWAGEN GOL TREND)
// ==============================================================================
function loadSampleCar() {
  document.getElementById('carMarca').value = 'Volkswagen';
  document.getElementById('carModelo').value = 'Gol Trend';
  document.getElementById('carVersion').value = '1.6 MSI Comfortline';
  document.getElementById('carAno').value = '2020';
  document.getElementById('carKm').value = '64500';
  document.getElementById('carPatente').value = 'SBX 1234';
  document.getElementById('carColor').value = 'Gris Plata';
  document.getElementById('carTransmision').value = 'Manual';
  document.getElementById('carCombustible').value = 'Nafta';
  document.getElementById('carLlaves').value = '2 llaves con comando';
  document.getElementById('carDuenos').value = 'Único dueño de 0km';
  document.getElementById('carService').value = 'Service Oficial con libro sellado';

  document.getElementById('clientNombre').value = 'Carlos Méndez';
  document.getElementById('clientTelefono').value = '099 888 777';
  document.getElementById('clientObjetivo').value = 'Venta directa al contado (necesita el dinero)';

  // Carrocería: Guardabarros del. izq repintado, paragolpes tras con raspón
  resetAllPanels();
  STATE.panels.guardabarros_del_izq = 'repintada';
  updatePanelUI('guardabarros_del_izq', 'repintada');
  STATE.panels.paragolpes_tras = 'danada';
  updatePanelUI('paragolpes_tras', 'danada');
  updatePanelsSummary();
  autoCalculatePaintCost();
  document.getElementById('paintNotes').value = 'Paragolpes trasero con raspón de estacionamiento, resto de fábrica.';

  // Mecánica
  document.getElementById('motorSonido').value = 'Sereno, silencioso y parejo (impecable)';
  document.getElementById('motorHumo').value = 'Sin humo (Gases limpios)';
  document.getElementById('motorPerdidas').value = 'Motor completamente seco (sin pérdidas)';
  document.getElementById('cubiertasDelanteras').value = 'Buenas (70-80%)';
  document.getElementById('cubiertasTraseras').value = 'Buenas (70-80%)';
  document.getElementById('cubiertasAuxilio').value = 'Auxilio sin rodar + crique y llave';
  document.getElementById('interiorEstado').value = 'Impecable (sin manchas, quemaduras ni roturas)';
  document.getElementById('mecanicaNotes').value = 'Embrague suave, aire enfría excelente.';

  // Números
  document.getElementById('valMercado').value = '12500';
  document.getElementById('valPretensionCliente').value = '10500';
  document.getElementById('costMecanica').value = '0';
  document.getElementById('costCubiertas').value = '0';
  document.getElementById('costDeudas').value = '0';

  calculateOfferNumbers();
  updateInspectionSummary();
  showToast('Ejemplo de VW Gol Trend cargado', '🚗');
}

// ==============================================================================
// LISTENERS & AUXILIARES
// ==============================================================================
function attachFormListeners() {
  const inputs = document.querySelectorAll('input, select, textarea');
  inputs.forEach(el => {
    el.addEventListener('input', () => {
      updateInspectionSummary();
    });
    el.addEventListener('change', () => {
      updateInspectionSummary();
    });
  });

  // Listener para preparar vista de impresión
  window.addEventListener('beforeprint', preparePrintSheet);
}

function preparePrintSheet() {
  document.getElementById('printDate').textContent = new Date().toLocaleDateString('es-UY');
  document.getElementById('printOperator').textContent = `Inspector: ${STATE.activeOperator}`;
  document.getElementById('printSignOperator').textContent = STATE.activeOperator;

  const marca = document.getElementById('carMarca').value;
  const modelo = document.getElementById('carModelo').value;
  const ano = document.getElementById('carAno').value;
  const km = document.getElementById('carKm').value;
  const patente = document.getElementById('carPatente').value;
  const color = document.getElementById('carColor').value;

  const vehContainer = document.getElementById('printVehicleDetails');
  if (vehContainer) {
    vehContainer.innerHTML = `
      <div><strong>Vehículo:</strong> ${marca} ${modelo}</div>
      <div><strong>Año:</strong> ${ano}</div>
      <div><strong>Kilometraje:</strong> ${km ? formatNumber(km) + ' km' : '-'}</div>
      <div><strong>Matrícula:</strong> ${patente}</div>
      <div><strong>Color:</strong> ${color}</div>
      <div><strong>Caja:</strong> ${document.getElementById('carTransmision').value}</div>
    `;
  }

  const structEl = document.getElementById('printStructuralDetails');
  if (structEl) {
    structEl.textContent = STATE.hasStructuralDamage 
      ? '🚨 DAÑO ESTRUCTURAL: PRESENTA DAÑOS DE CHASIS / ESTRUCTURA' 
      : '✅ ESTRUCTURA SANA: Sin deformaciones ni cortes estructurales';
    structEl.className = STATE.hasStructuralDamage ? 'font-bold text-red-700' : 'font-bold text-emerald-800';
  }

  const panelsEl = document.getElementById('printPanelsDetails');
  if (panelsEl) {
    const nonOrig = Object.entries(STATE.panels).filter(([_, st]) => st !== 'original');
    if (nonOrig.length === 0) {
      panelsEl.textContent = 'Carrocería: 100% pintura original de fábrica.';
    } else {
      const list = nonOrig.map(([p, st]) => `${STATE.panelLabels[p]} (${st})`);
      panelsEl.textContent = `Piezas repintadas / intervenidas (${nonOrig.length}): ${list.join(', ')}.`;
    }
  }

  const mechContainer = document.getElementById('printMechanicalDetails');
  if (mechContainer) {
    mechContainer.innerHTML = `
      <div><strong>Motor:</strong> ${document.getElementById('motorSonido').value}</div>
      <div><strong>Tablero:</strong> ${document.getElementById('testigosTablero').value}</div>
      <div><strong>Aire:</strong> ${document.getElementById('aireAcondicionado').value}</div>
      <div><strong>Cubiertas Del:</strong> ${document.getElementById('cubiertasDelanteras').value}</div>
      <div><strong>Cubiertas Tras:</strong> ${document.getElementById('cubiertasTraseras').value}</div>
      <div><strong>Auxilio:</strong> ${document.getElementById('cubiertasAuxilio').value}</div>
    `;
  }

  const offerContainer = document.getElementById('printOfferDetails');
  if (offerContainer) {
    offerContainer.innerHTML = `
      <div><strong>Libreta:</strong> ${document.getElementById('docsLibreta').value}</div>
      <div><strong>Títulos:</strong> ${document.getElementById('docsTitulos').value}</div>
      <div><strong>Mercado Estimado:</strong> USD $${formatNumber(document.getElementById('valMercado').value || 0)}</div>
      <div><strong>Oferta Sugerida:</strong> ${document.getElementById('ofertaSugeridaDisplay').textContent}</div>
    `;
  }
}

function formatNumber(num) {
  if (!num && num !== 0) return '0';
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

function showToast(text, icon = '✅') {
  const toast = document.getElementById('toastNotification');
  const toastText = document.getElementById('toastText');
  const toastIcon = document.getElementById('toastIcon');

  if (toast && toastText && toastIcon) {
    toastText.textContent = text;
    toastIcon.textContent = icon;
    toast.classList.remove('-translate-y-20', 'opacity-0');
    toast.classList.add('translate-y-0', 'opacity-100');

    setTimeout(() => {
      toast.classList.remove('translate-y-0', 'opacity-100');
      toast.classList.add('-translate-y-20', 'opacity-0');
    }, 2800);
  }
}
