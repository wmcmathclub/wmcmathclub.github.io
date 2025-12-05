// robust clipboard-copy helper with fallbacks
const CLASSROOM_URL = 'https://wmcmathclub.github.io/saskatoon-team-contest.html';    

function fallbackCopyTextToClipboard(text) {
  try {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    // Avoid scrolling to bottom
    textArea.style.position = 'fixed';
    textArea.style.left = '-9999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    const successful = document.execCommand('copy');
    document.body.removeChild(textArea);
    return successful;
  } catch (err) {
    return false;
  }
}

function copyTextToClipboard(text) {
  return new Promise((resolve, reject) => {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(() => resolve(true)).catch(() => {
        // fallback to execCommand
        const ok = fallbackCopyTextToClipboard(text);
        if (ok) resolve(true);
        else reject(new Error('Copy failed'));
      });
    } else {
      const ok = fallbackCopyTextToClipboard(text);
      if (ok) resolve(true);
      else reject(new Error('Copy not supported'));
    }
  });
}

// open link safely; fallback to copy + prompt when popups are blocked
function safeOpen(url){
  let opened = false;
  try{ const w = window.open(url, '_blank', 'noopener'); if(w) opened = true; } catch(e){ opened = false; }
  if(opened) return;
  // popup blocked — try to copy then prompt
  copyTextToClipboard(url).then(()=>{
    alert('Popup blocked — link copied to clipboard. Paste it into your browser address bar to open.');
  }).catch(()=>{
    // last resort: show prompt with the URL so the user can copy it manually
    prompt('Popup blocked. Copy this link and open it manually:', url);
  });
}

moreLink.addEventListener('click', e=>{ e.preventDefault(); safeOpen(CLASSROOM_URL); });
modalLink && modalLink.addEventListener('click', e=>{ e.preventDefault(); safeOpen(CLASSROOM_URL); });
document.getElementById('copyLink').addEventListener('click', ()=>{
  copyTextToClipboard(CLASSROOM_URL).then(()=>{
    alert('Link copied to clipboard');
  }).catch(()=>{
    prompt('Automatic copy failed. Please copy the link manually:', CLASSROOM_URL);
  });
});