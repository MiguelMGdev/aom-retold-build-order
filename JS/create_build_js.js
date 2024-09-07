document.addEventListener("DOMContentLoaded", () => {
  const colorPicker = document.getElementById("colorPicker");
  const colorCode = document.getElementById("colorCode");
  const downloadBtn = document.getElementById("downloadBtn");
  const uploadBtn = document.getElementById("uploadBtn");
  const uploadFileBtn = document.getElementById("uploadFileBtn");
  const tbody = document.querySelector(".custom-table tbody");
  let borderColor = colorPicker.value;

  function updateRowBorders() {
    tbody.querySelectorAll("tr").forEach((row) => {
      row.style.borderBottomColor = borderColor;
    });
  }
  function addRow() {
    const newRow = document.createElement("tr");
    newRow.innerHTML = `
        <th class="editable resources" contenteditable="true"></th>
        <td class="editable resources" contenteditable="true"></td>
        <td class="editable resources" contenteditable="true"></td>
        <td class="editable resources" contenteditable="true"></td>
        <td class="editable resources" contenteditable="true"></td>
        <td class="editable build-order" contenteditable="true"></td>
    `;
    newRow.style.borderBottomColor = borderColor;
    tbody.appendChild(newRow);
    addDragEvents(newRow.querySelectorAll(".editable"));
}
  addRow();

  updateRowBorders();

  colorPicker.addEventListener("input", (event) => {
    borderColor = event.target.value;
    colorCode.value = borderColor;
    updateRowBorders();
  });

  

  document.getElementById("addRowBtn").addEventListener("click", () => {
    const newRow = document.createElement("tr");
    newRow.innerHTML = `
            <th class="editable resources" contenteditable="true"></th>
            <td class="editable resources" contenteditable="true"></td>
            <td class="editable resources" contenteditable="true"></td>
            <td class="editable resources" contenteditable="true"></td>
            <td class="editable resources" contenteditable="true"></td>
            <td class="editable build-order" contenteditable="true"></td>
        `;
    newRow.style.borderBottomColor = borderColor;
    tbody.appendChild(newRow);
    addDragEvents(newRow.querySelectorAll(".editable"));
  });

  function handleDragStart(event) {
    event.dataTransfer.setData("text/html", event.target.outerHTML);
    event.dataTransfer.setData("dragged-type", event.target.tagName);
    event.target.classList.add("dragging");
  }

  function handleDragOver(event) {
    event.preventDefault();
    event.target.classList.add("dragover");
  }

  function handleDrop(event) {
    event.preventDefault();
    event.target.classList.remove("dragover");
    const draggedData = event.dataTransfer.getData("text/html");
    const draggedType = event.dataTransfer.getData("dragged-type");
    const targetCell = event.target;

    if (targetCell && targetCell.classList.contains("editable")) {
      const existingContent = targetCell.innerHTML;

      if (draggedType === "IMG") {
        targetCell.innerHTML = existingContent;
        const container = document.createElement("div");
        container.innerHTML = draggedData;
        const img = container.querySelector("img");
        if (img) {
          img.style.display = "inline";
          img.style.marginLeft = "8px";
          targetCell.appendChild(img);
        }
      } else {
        targetCell.innerHTML = existingContent + draggedData;
      }

      const draggedElement = document.querySelector(
        `[data-dragged-src="${event.dataTransfer.getData("dragged-src")}"]`
      );
      if (draggedElement) {
        draggedElement.remove();
      }
    }
    event.target.classList.remove("dragging");
  }

  function addDragEvents(cells) {
    cells.forEach((cell) => {
      cell.addEventListener("dragstart", handleDragStart);
      cell.addEventListener("dragover", handleDragOver);
      cell.addEventListener("drop", handleDrop);
    });
  }

  addDragEvents(document.querySelectorAll(".editable"));
});
