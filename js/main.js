const form = document.querySelector("#pdfForm");

const input = document.querySelector("#pdfInput");

const setUrl = async (file, fileName) => {
  const url = window.URL.createObjectURL(file);
  console.log(url);
  getDocument(url, fileName);
};

input.addEventListener("change", (e) => {

  form.dispatchEvent(new Event("submit"));
});

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const file = e.target[0].files[0];
  const fileName = file.name;
  console.log(typeof fileName, fileName);
  setUrl(file, fileName);
});

// const url = "./../docs/pdf.pdf";

let pdfDoc = null,
  pageNum = 1;
(pageIsRendering = false), (pageNumIsPending = null);

const scale = 1,
  canvas = document.querySelector("#pdf-render"),
  ctx = canvas.getContext("2d");

// Render the page

const renderPage = (num) => {
  pageIsRendering = true;

  // Get page
  pdfDoc.getPage(num).then((page) => {
    console.log(page);
    const viewport = page.getViewport({ scale });
    canvas.height = viewport.height;
    canvas.width = viewport.width;

    const renderCtx = {
      canvasContext: ctx,
      viewport,
    };

    page.render(renderCtx).promise.then(() => {
      pageIsRendering = false;

      if (pageNumIsPending !== null) {
        renderPage(pageNumIsPending);
        console.log("check 5");
        pageNumIsPending = null;
      }
    });

    //output current page
    document.querySelector("#page-num").textContent = num;
  });
};

//Check for pages rendering
const queueRenderPage = (num) => {
  if (pageIsRendering) {
    pageNumIsPending = num;
  } else {
    renderPage(num);
  }
};

// show prev page
const showPrevPage = () => {
  if (pageNum <= 1) {
    return;
  }
  pageNum--;
  queueRenderPage(pageNum);
};

// show next page
const showNextPage = () => {
  console.log("check 4");
  if (pageNum >= pdfDoc.numPages) {
    return;
  }
  pageNum++;
  queueRenderPage(pageNum);
};

//Get Document

const getDocument = (url, fileName) => {

  try{
    document.querySelector(".heading").textContent = fileName;
    document.querySelector(".viewer").style.display = "contents";
    pdfjsLib.getDocument(url).promise.then((pdfDoc_) => {
      console.log(url);
      console.log("check 1");
      pdfDoc = pdfDoc_;
      console.log(pdfDoc);

      document.querySelector("#page-count").textContent = pdfDoc.numPages;

      renderPage(pageNum);
    });
  } catch(err){
    console.log(err);
  }
    
};

console.log("check 2");

// Button Events
document.querySelector("#prev-page").addEventListener("click", showPrevPage);
document.querySelector("#next-page").addEventListener("click", showNextPage);

console.log("check 3");
