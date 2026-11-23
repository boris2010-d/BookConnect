// Uses PDF.js as an ES module. Files remain on the user's device.
const statusElement = document.getElementById('readerStatus');
const fileInput = document.getElementById('pdfFile');
const controls = document.getElementById('readerControls');
const canvas = document.getElementById('pdfCanvas');
const indicator = document.getElementById('pageIndicator');
let pdfDocument = null, pageNumber = 1, zoom = 1.2, documentKey = '', renderTask = null, renderVersion = 0;
const pdfjsUrl = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.10.38/pdf.min.mjs';
async function renderPage() {
  if (!pdfDocument) return;
  const version = ++renderVersion;
  try {
    if (renderTask) { renderTask.cancel(); try { await renderTask.promise; } catch (_) {} }
    if (version !== renderVersion) return;
    const page = await pdfDocument.getPage(pageNumber);
    if (version !== renderVersion) return;
    const viewport = page.getViewport({scale: zoom});
    const context = canvas.getContext('2d');
    canvas.width = Math.ceil(viewport.width); canvas.height = Math.ceil(viewport.height);
    renderTask = page.render({canvasContext:context, viewport});
    await renderTask.promise;
    if (version !== renderVersion) return;
    indicator.textContent = 'Страница ' + pageNumber + ' от ' + pdfDocument.numPages;
    document.getElementById('previousPage').disabled = pageNumber <= 1;
    document.getElementById('nextPage').disabled = pageNumber >= pdfDocument.numPages;
    try { localStorage.setItem(documentKey, String(pageNumber)); } catch (_) {}
    statusElement.textContent = 'Книгата е отворена.';
  } catch (error) {
    if (error?.name !== 'RenderingCancelledException') statusElement.textContent = 'Неуспешно показване на страницата.';
  }
}
fileInput.addEventListener('change', async () => {
  const file = fileInput.files?.[0]; if (!file) return;
  if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) { statusElement.textContent='Избери PDF файл.'; return; }
  controls.hidden = true; statusElement.textContent='Зареждане на PDF...';
  try {
    const pdfjs = await import(pdfjsUrl);
    pdfjs.GlobalWorkerOptions.workerSrc='https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.10.38/pdf.worker.min.mjs';
    const data = new Uint8Array(await file.arrayBuffer());
    if (pdfDocument) await pdfDocument.destroy();
    pdfDocument = await pdfjs.getDocument({data}).promise;
    documentKey = 'bookconnect:reading:' + file.name + ':' + file.size + ':' + file.lastModified;
    let saved = 1; try { saved = Number(localStorage.getItem(documentKey)) || 1; } catch (_) {}
    pageNumber = Math.max(1, Math.min(pdfDocument.numPages, saved)); zoom=1.2;
    controls.hidden = false; await renderPage();
  } catch (_) { statusElement.textContent='PDF файлът не може да се отвори. Проверете файла и интернет връзката.'; }
});
document.getElementById('previousPage').addEventListener('click',()=>{if(pageNumber>1){pageNumber--;renderPage();}});
document.getElementById('nextPage').addEventListener('click',()=>{if(pdfDocument&&pageNumber<pdfDocument.numPages){pageNumber++;renderPage();}});
document.getElementById('zoomIn').addEventListener('click',()=>{zoom=Math.min(3,zoom+.2);renderPage();});
document.getElementById('zoomOut').addEventListener('click',()=>{zoom=Math.max(.5,zoom-.2);renderPage();});
