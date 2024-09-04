document.addEventListener('DOMContentLoaded', () => {
    const buildTable = document.getElementById('buildTable').getElementsByTagName('tbody')[0];
    const addRowBtn = document.getElementById('addRowBtn');
    let currentRow = null;

    addRowBtn.addEventListener('click', () => {
        const row = buildTable.insertRow();
        row.classList.add('fila_azul');

        // Insertar celdas con inputs
        for (let i = 0; i < 5; i++) {
            const cell = row.insertCell(i);
            const input = document.createElement('input');
            input.type = 'text';
            input.className = 'form-control form-control-sm bg-transparent text-white time';
            input.style.maxWidth = 'max-content';
            cell.appendChild(input);
        }

        // Celda de Build Order
        const buildOrderCell = row.insertCell(5);
        buildOrderCell.className = 'build-order-cell'; // Aplicar el estilo de flex

        // Celda de acciones con botón para abrir el modal
        const actionCell = row.insertCell(6);
        actionCell.className = 'action-cell';
        const actionBtn = document.createElement('button');
        actionBtn.className = 'btn btn-secondary btn-sm';
        actionBtn.textContent = 'Acciones';
        actionBtn.addEventListener('click', () => {
            currentRow = row;
            const actionsModal = new bootstrap.Modal(document.getElementById('actionsModal'));
            actionsModal.show();
        });
        actionCell.appendChild(actionBtn);
    });

    // Agregar texto
    document.getElementById('addTextBtn').addEventListener('click', () => {
        if (currentRow) {
            const cell = currentRow.cells[5]; // "Build Order" es la columna 5
            const text = prompt('Ingrese el texto:');
            if (text) {
                const span = document.createElement('span');
                span.textContent = text;
                span.className = 'text-white'; // Aplicar estilos si es necesario
                cell.appendChild(span);
            }
        }
    });

    // Agregar imagen
    document.getElementById('addImageBtn').addEventListener('click', () => {
        const imageModal = new bootstrap.Modal(document.getElementById('imageModal'));
        imageModal.show();
    });

    // Insertar imagen seleccionada
    document.getElementById('insertImageBtn').addEventListener('click', () => {
        const fileInput = document.getElementById('imageInput');
        if (fileInput.files.length > 0) {
            const file = fileInput.files[0];
            const reader = new FileReader();
            reader.onload = (e) => {
                if (currentRow) {
                    const cell = currentRow.cells[5]; // "Build Order" es la columna 5
                    const img = document.createElement('img');
                    img.src = e.target.result;
                    img.className = 'img-fluid';
                    cell.appendChild(img);
                }
            };
            reader.readAsDataURL(file);
        }
        const imageModal = bootstrap.Modal.getInstance(document.getElementById('imageModal'));
        imageModal.hide();
    });

    // Eliminar fila
    document.getElementById('deleteRowBtn').addEventListener('click', () => {
        if (currentRow) {
            currentRow.remove();
            currentRow = null; // Reset currentRow after deletion
        }
        const actionsModal = bootstrap.Modal.getInstance(document.getElementById('actionsModal'));
        actionsModal.hide();
    });

    // Descargar imagen sin la columna de acciones
    document.getElementById('downloadImageBtn').addEventListener('click', () => {
        // Ocultar columna de acciones
        const actionCells = document.querySelectorAll('.action-cell, th:last-child');
        actionCells.forEach(cell => cell.style.display = 'none');

        // Aplicar estilos para eliminar bordes de cuadrículas
        document.getElementById('buildTable').classList.add('hide-borders');

        html2canvas(document.getElementById('buildTable'), {
            useCORS: true
        }).then(canvas => {
            const link = document.createElement('a');
            link.href = canvas.toDataURL('image/png');
            link.download = 'tabla.png';
            link.click();

            // Restaurar estilos
            actionCells.forEach(cell => cell.style.display = '');
            document.getElementById('buildTable').classList.remove('hide-borders');
        });
    });

    // Exportar tabla a JSON
    document.getElementById('exportTable').addEventListener('click', () => {
        const tableData = [];
        for (let i = 1; i < buildTable.rows.length; i++) {
            const row = buildTable.rows[i];
            const rowData = {
                time: row.cells[0].querySelector('input').value,
                food: row.cells[1].querySelector('input').value,
                wood: row.cells[2].querySelector('input').value,
                gold: row.cells[3].querySelector('input').value,
                favor: row.cells[4].querySelector('input').value,
                buildOrder: row.cells[5].innerHTML
            };
            tableData.push(rowData);
        }

        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(tableData));
        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", "build_order_table.json");
        document.body.appendChild(downloadAnchorNode);
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
    });

    // Cargar tabla desde JSON
    document.getElementById('loadTable').addEventListener('click', () => {
        const fileInput = document.getElementById('loadTableFile');
        const file = fileInput.files[0];

        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                const tableData = JSON.parse(e.target.result);
                buildTable.innerHTML = ''; // Limpiar la tabla existente

                tableData.forEach(rowData => {
                    const newRow = buildTable.insertRow();
                    newRow.classList.add('fila_azul');

                    newRow.insertCell(0).innerHTML = `<input type="text" value="${rowData.time}" class="form-control form-control-sm bg-transparent text-white time" style="max-width: max-content;">`;
                    newRow.insertCell(1).innerHTML = `<input type="text" value="${rowData.food}" class="form-control form-control-sm bg-transparent text-white" style="max-width: max-content;">`;
                    newRow.insertCell(2).innerHTML = `<input type="text" value="${rowData.wood}" class="form-control form-control-sm bg-transparent text-white" style="max-width: max-content;">`;
                    newRow.insertCell(3).innerHTML = `<input type="text" value="${rowData.gold}" class="form-control form-control-sm bg-transparent text-white" style="max-width: max-content;">`;
                    newRow.insertCell(4).innerHTML = `<input type="text" value="${rowData.favor}" class="form-control form-control-sm bg-transparent text-white" style="max-width: max-content;">`;
                    newRow.insertCell(5).innerHTML = rowData.buildOrder;

                    const actionCell = newRow.insertCell(6);
                    actionCell.className = 'action-cell';
                    const actionBtn = document.createElement('button');
                    actionBtn.className = 'btn btn-secondary btn-sm';
                    actionBtn.textContent = 'Acciones';
                    actionBtn.addEventListener('click', () => {
                        currentRow = newRow;
                        const actionsModal = new bootstrap.Modal(document.getElementById('actionsModal'));
                        actionsModal.show();
                    });
                    actionCell.appendChild(actionBtn);
                });
            };
            reader.readAsText(file);
        }
    });
});
