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
            input.className = 'form-control bg-transparent text-white';
            cell.appendChild(input);
        }

        // Celda de Build Order
        const buildOrderCell = row.insertCell(5);
        buildOrderCell.className = 'build-order-cell'; // Aplicar el estilo de flex

        // Celda de acciones con botón para abrir el modal
        const actionCell = row.insertCell(6);
        actionCell.className = 'action-cell'; // Añadir una clase para ocultar más fácilmente
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
        const actionCells = document.querySelectorAll('.action-cell, th:last-child');
        
        // Ocultar columna de acciones
        actionCells.forEach(cell => cell.style.display = 'none');

        html2canvas(document.getElementById('buildTable'), {
            useCORS: true
        }).then(canvas => {
            const link = document.createElement('a');
            link.href = canvas.toDataURL('image/png');
            link.download = 'tabla.png';
            link.click();
            
            // Mostrar nuevamente columna de acciones
            actionCells.forEach(cell => cell.style.display = '');
        });
    });
});
