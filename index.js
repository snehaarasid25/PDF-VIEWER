// const url = "pdsdff.pdf";
const url = "example.pdf";
let pdfdoc = null,
  pagenum = 1,
  pageisrendering = false,
  pagenumispending = null;

const scale = 1.5,
  canvas = document.querySelector("#pdf-render"),
  ctx = canvas.getContext("2d");

// Render the page
const renderpage = (num) => {
  pageisrendering = true;

  //get the page
  pdfdoc.getPage(num).then((page) => {
    ///set the scale

    const viewport = page.getViewport({ scale });
    canvas.height = viewport.height;
    canvas.width = viewport.width;

    const renderctx = {
      canvasContext: ctx,
      viewport,
    };

    page.render(renderctx).promise.then(() => {
      pageisrendering = false;

      if (pagenumispending != null) {
        renderpage(pagenumispending);
        pagenumispending = null;
      }
    });

    //output the currentpage
    document.querySelector("#page-num").textContent = num;
  });
};

//check for the pages rendering
const queuerenderpage = (num) => {
  if (pageisrendering) {
    pagenumispending = num;
  } else {
    renderpage(num);
  }
};

//show the previous page
const showprevpage = () => {
  if (pagenum <= 1) {
    return;
  }
  pagenum--;
  queuerenderpage(pagenum);
};

//show the next page
const shownextpage = () => {
  if (pagenum >= pdfdoc.numPages) {
    return;
  }
  pagenum++;
  queuerenderpage(pagenum);
};

//get the document
pdfjsLib
  .getDocument(url)
  .promise.then((pdfdoc_) => {
    pdfdoc = pdfdoc_;
    // console.log(pdfdoc);

    //to display the total number of pages in the pdf
    document.querySelector("#page-count").textContent = pdfdoc.numPages;

    renderpage(pagenum);
  })
  .catch((err) => {
    const div = document.createElement("div");
    div.className = "error";
    div.appendChild(document.createTextNode(err.message));
    document.querySelector("body").insertBefore(div, canvas);

    //remove the top bar of the buttons
    document.querySelector(".top-bar").style.display = "none";
  });

// make the button to call the previous and next pages of pdf
document.querySelector("#prev-page").addEventListener("click", showprevpage);
document.querySelector("#next-page").addEventListener("click", shownextpage);