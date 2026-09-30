function calcularTotal() {

    let subtotal = 0;

    const filas = document.querySelectorAll("#tablaProductos tr");

    filas.forEach(fila => {

        const cantidad =
            parseFloat(fila.querySelector(".cantidad").value) || 0;

        const precioUnitario =
            parseFloat(fila.querySelector(".precioUnitario").value) || 0;

        const totalLinea = cantidad * precioUnitario;

        fila.querySelector(".precioTotal").value =
            "$ " + totalLinea.toFixed(2);

        subtotal += totalLinea;
    });

    const iva = subtotal * 0.21;
    const total = subtotal + iva;

    const cuota12 = total / 12;

    const total18 = total * 1.75;
    const cuota18 = total18 / 18;

    document.getElementById("subtotal").innerText =
        "$ " + subtotal.toFixed(2);

    document.getElementById("iva").innerText =
        "$ " + iva.toFixed(2);

    document.getElementById("total").innerText =
        "$ " + total.toFixed(2);

    document.getElementById("ahora12").innerText =
        "12 cuotas de $ " + cuota12.toFixed(2);

    document.getElementById("ahora18").innerText =
        "18 cuotas de $ " + cuota18.toFixed(2);
}

function exportarPDF() {

    calcularTotal();

    const { jsPDF } = window.jspdf;

    const doc = new jsPDF();

    const cliente =
        document.getElementById("cliente").value;

    doc.setFontSize(18);
    doc.text("PRESUPUESTO", 80, 20);

    doc.setFontSize(12);
    doc.text("Cliente: " + cliente, 10, 40);

    let y = 60;

    const filas = document.querySelectorAll("#tablaProductos tr");

    filas.forEach((fila) => {

        const cantidad =
            fila.querySelector(".cantidad").value;

        const producto =
            fila.querySelector(".producto").value;

        const precio =
            fila.querySelector(".precioUnitario").value;

        if(producto !== ""){

            doc.text(
                `${cantidad} - ${producto} - $${precio}`,
                10,
                y
            );

            y += 10;
        }
    });

    y += 10;

    doc.text(
        document.getElementById("subtotal").innerText,
        10,
        y
    );

    y += 10;

    doc.text(
        document.getElementById("iva").innerText,
        10,
        y
    );

    y += 10;

    doc.text(
        document.getElementById("total").innerText,
        10,
        y
    );

    doc.save("Presupuesto.pdf");
}
