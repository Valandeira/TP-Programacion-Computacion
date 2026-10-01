const IVA = 0.21;

function actualizarFechaHora() {

    const ahora = new Date();

    document.getElementById("fechaEmision").textContent =
        ahora.toLocaleDateString("es-AR") +
        " " +
        ahora.toLocaleTimeString("es-AR");
}

setInterval(actualizarFechaHora, 1000);
actualizarFechaHora();

function validarCliente() {

    const cliente =
        document.getElementById("cliente")
        .value
        .trim();

    const palabras = cliente.split(/\s+/);

    if (cliente === "") {

        alert("Debe ingresar Nombre y Apellido.");
        return false;
    }

    if (palabras.length < 2) {

        alert("Ingrese al menos Nombre y Apellido.");
        return false;
    }

    return true;
}

function formatoMoneda(valor) {

    return valor.toLocaleString(
        "es-AR",
        {
            style: "currency",
            currency: "ARS"
        }
    );
}

function calcularTotal() {

    if (!validarCliente()) {
        return;
    }

    let subtotal = 0;

    const filas =
        document.querySelectorAll("#tablaProductos tr");

    filas.forEach(fila => {

        const cantidad =
            parseFloat(
                fila.querySelector(".cantidad").value
            ) || 0;

        const precioUnitario =
            parseFloat(
                fila.querySelector(".precioUnitario").value
            ) || 0;

        const totalLinea =
            cantidad * precioUnitario;

        fila.querySelector(".precioTotal").value =
            formatoMoneda(totalLinea);

        subtotal += totalLinea;
    });

    const iva = subtotal * IVA;
    const total = subtotal + iva;

    const cuota12 = total / 12;

    const total18 = total * 1.75;
    const cuota18 = total18 / 18;

    document.getElementById("subtotal").textContent =
        formatoMoneda(subtotal);

    document.getElementById("iva").textContent =
        formatoMoneda(iva);

    document.getElementById("total").textContent =
        formatoMoneda(total);

    document.getElementById("ahora12").textContent =
        `12 cuotas de ${formatoMoneda(cuota12)}`;

    document.getElementById("ahora18").textContent =
        `18 cuotas de ${formatoMoneda(cuota18)}`;
}

function exportarPDF() {

    if (!validarCliente()) {
        return;
    }

    calcularTotal();

    const { jsPDF } = window.jspdf;

    const doc = new jsPDF();

    const cliente =
        document.getElementById("cliente").value;

    const fecha =
        document.getElementById("fechaEmision")
        .textContent;

    doc.setFontSize(18);
    doc.text("PRESUPUESTO", 75, 20);

    doc.setFontSize(12);

    doc.text(
        `Cliente: ${cliente}`,
        10,
        40
    );

    doc.text(
        `Fecha: ${fecha}`,
        10,
        50
    );

    let y = 70;

    const filas =
        document.querySelectorAll("#tablaProductos tr");

    filas.forEach(fila => {

        const cantidad =
            fila.querySelector(".cantidad").value;

        const producto =
            fila.querySelector(".producto").value;

        const precio =
            fila.querySelector(".precioUnitario").value;

        if (producto !== "") {

            doc.text(
                `${cantidad} x ${producto} - $${precio}`,
                10,
                y
            );

            y += 10;
        }
    });

    y += 10;

    doc.text(
        "Subtotal: " +
        document.getElementById("subtotal").textContent,
        10,
        y
    );

    y += 10;

    doc.text(
        "IVA: " +
        document.getElementById("iva").textContent,
        10,
        y
    );

    y += 10;

    doc.text(
        "Total: " +
        document.getElementById("total").textContent,
        10,
        y
    );

    y += 10;

    doc.text(
        document.getElementById("ahora12").textContent,
        10,
        y
    );

    y += 10;

    doc.text(
        document.getElementById("ahora18").textContent,
        10,
        y
    );

    doc.save("Presupuesto.pdf");
}
