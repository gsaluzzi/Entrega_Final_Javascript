let paquetes = [];

document.addEventListener("DOMContentLoaded", async () => {
  const tabla = document.querySelector("#tabla-paquetes tbody");
  const selectPaquete = document.querySelector("#select-paquete");
  const form = document.querySelector("#formulario-inscripcion");

  const res = await fetch("paquetes.json");
  paquetes = await res.json();

  paquetes.forEach(paquete => {
    const fila = document.createElement("tr");
    fila.innerHTML = `
      <td>${paquete.nombre}</td>
      <td>$${paquete.precio.toLocaleString("es-CL")}</td>
      <td>${paquete.descripcion}</td>
    `;
    tabla.appendChild(fila);

    const option = document.createElement("option");
    option.value = paquete.id;
    option.textContent = paquete.nombre;
    selectPaquete.appendChild(option);
  });

  form.addEventListener("submit", e => {
    e.preventDefault();

    const nombre = form.nombre.value.trim();
    const correo = form.correo.value.trim();
    const paqueteId = parseInt(form.paquete.value);

    if (!nombre || !correo || !paqueteId) {
      Swal.fire({
        icon: "warning",
        title: "Campos incompletos",
        text: "Por favor completa todos los campos."
      });
      return;
    }

    const paqueteSeleccionado = paquetes.find(p => p.id === paqueteId);

    const inscripcion = {
      nombre,
      correo,
      paquete: paqueteSeleccionado
    };

    const inscripciones = JSON.parse(localStorage.getItem("inscripciones")) || [];
    inscripciones.push(inscripcion);
    localStorage.setItem("inscripciones", JSON.stringify(inscripciones));

    Swal.fire({
      icon: "success",
      title: "¡Inscripción exitosa!",
      text: `Te has inscrito al paquete: ${paqueteSeleccionado.nombre}`
    });

    form.reset();
  });
});
