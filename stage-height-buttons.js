(function(){
  'use strict';
  
  const LS_KEY = 'zerro.stage.bottom.space';
  
  function addBottomSpace(px) {
    const stage = document.getElementById('stage');
    if (!stage) return;
    
    const clamped = Math.max(0, Math.min(10000, px));
    
    let spacer = stage.querySelector('#stageBottomSpacer');
    
    if (clamped === 0) {
      if (spacer) spacer.remove();
      updateDisplay(0);
      try { localStorage.setItem(LS_KEY, '0'); } catch(e) {}
      return;
    }
    
    if (!spacer) {
      spacer = document.createElement('div');
      spacer.id = 'stageBottomSpacer';
      spacer.style.cssText = 'width:100%;background:transparent;pointer-events:none;';
      stage.appendChild(spacer);
    }
    
    spacer.style.height = clamped + 'px';
    
    try { localStorage.setItem(LS_KEY, String(clamped)); } catch(e) {}
    updateDisplay(clamped);
  }
  
  function updateDisplay(px) {
    const display = document.getElementById('spaceDisplay');
    if (!display) return;
    
    if (px === 0) {
      display.textContent = 'Стандарт';
      display.style.color = '#9fb2c6';
    } else {
      display.textContent = '+' + px;
      display.style.color = '#2ea8ff';
    }
  }
  
  function getSaved() {
    try {
      return parseInt(localStorage.getItem(LS_KEY) || '0', 10);
    } catch(e) {
      return 0;
    }
  }
  
  function adjust(delta) {
    addBottomSpace(getSaved() + delta);
  }
  
  function createUI() {
    const topbar = document.querySelector('.topbar');
    if (!topbar) {
      setTimeout(createUI, 200);
      return;
    }
    
    if (document.getElementById('spaceControls')) return;
    
    const wrap = document.createElement('div');
    wrap.id = 'spaceControls';
    wrap.style.cssText = 'display:flex;gap:4px;align-items:center;margin-left:10px;padding-left:10px;border-left:1px solid #203043;';
    
    const label = document.createElement('span');
    label.textContent = 'Доп. высота:';
    label.style.cssText = 'color:#9fb2c6;font-size:11px;';
    
    const display = document.createElement('span');
    display.id = 'spaceDisplay';
    display.style.cssText = 'font-weight:600;font-size:11px;min-width:65px;text-align:center;';
    
    const minus = document.createElement('button');
    minus.className = 'btn';
    minus.textContent = '-300';
    minus.type = 'button';
    minus.style.cssText = 'padding:4px 8px;font-size:11px;';
    minus.onclick = () => adjust(-300);
    
    const plus = document.createElement('button');
    plus.className = 'btn';
    plus.textContent = '+300';
    plus.type = 'button';
    plus.style.cssText = 'padding:4px 8px;font-size:11px;';
    plus.onclick = () => adjust(300);
    
    const reset = document.createElement('button');
    reset.className = 'btn ghost';
    reset.textContent = 'Сброс';
    reset.type = 'button';
    reset.style.cssText = 'padding:4px 8px;font-size:11px;';
    reset.onclick = () => addBottomSpace(0);
    
    wrap.append(label, display, minus, plus, reset);
    topbar.appendChild(wrap);
    
    const saved = getSaved();
    if (saved > 0) {
      setTimeout(() => addBottomSpace(saved), 300);
    } else {
      updateDisplay(0);
    }
  }
  
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => setTimeout(createUI, 100));
  } else {
    setTimeout(createUI, 100);
  }
})();