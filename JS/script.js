document.addEventListener("DOMContentLoaded", () => {
  const tabs = document.querySelectorAll("#myTab a");
  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const tabId = tab.getAttribute("href").substring(1);
      loadImages(tabId);
    });
  });

  const activeTab = document.querySelector("#myTab .nav-link.active");
  if (activeTab) {
    const initialTabId = activeTab.getAttribute("href").substring(1);
    loadImages(initialTabId);
  }
});

async function loadImages(tabId) {
  const sections = ["units", "structures", "tech", "extras"];

  sections.forEach(async (section) => {
    const container = document.getElementById(`${tabId}-${section}`);
    container.innerHTML = "";

    try {
      const response = await fetch(`/assets/${tabId}/${section}/image.json`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const images = await response.json();

      images.forEach((url) => {
        const img = document.createElement("img");
        img.src = `/assets/${tabId}/${section}/${url}`;
        img.alt = url;
        img.draggable = true;

        img.addEventListener("click", () => addToTable(img.src));

        img.addEventListener("dragstart", (e) => {
          e.dataTransfer.setData("text/plain", img.src);
          startDragging(e);
        });
        container.appendChild(img);
      });
    } catch (error) {
      console.error(`Error loading ${section} images:`, error.message);
    }
  });
}

function addToTable(imgSrc) {
  const table = document.querySelector(".custom-table tbody");

  let lastRow = table.querySelector("tr:last-child");
  if (!lastRow) {
    lastRow = table.insertRow();
  }

  let lastCell = lastRow.querySelector("td:last-child");
  if (!lastCell) {
    lastCell = lastRow.insertCell();
    lastCell.classList.add("editable");
    lastCell.setAttribute("contenteditable", "true");
  }

  const img = document.createElement("img");
  img.src = imgSrc;
  img.alt = "Imagen agregada";
  img.draggable = true;
  img.classList.add("added-img");

  lastCell.appendChild(img);
}

function startDragging(event) {
  document.addEventListener("mousemove", handleMouseMove);
  document.addEventListener("mouseup", stopDragging);
  dragInterval = setInterval(() => {
    if (event.clientY < 50) {
      window.scrollBy(0, -10);
    } else if (window.innerHeight - event.clientY < 50) {
      window.scrollBy(0, 10);
    }
  }, 20);
}

function handleMouseMove(event) {
  if (dragInterval) {
    if (event.clientY < 50) {
      window.scrollBy(0, -10);
    } else if (window.innerHeight - event.clientY < 50) {
      window.scrollBy(0, 10);
    }
  }
}

function stopDragging() {
  document.removeEventListener("mousemove", handleMouseMove);
  document.removeEventListener("mouseup", stopDragging);
  clearInterval(dragInterval);
  dragInterval = null;
}

document.querySelectorAll(".image-selector img").forEach((img) => {
  img.addEventListener("dragstart", (event) => {
    event.dataTransfer.setData("text/plain", event.target.src);
  });
});

document.getElementById("download-btn").addEventListener("click", () => {
  const table = document.querySelector(".custom-table");
  html2canvas(table).then((canvas) => {
    const link = document.createElement("a");
    link.href = canvas.toDataURL("image/png");
    link.download = "tabla.png";
    link.click();
  });
});