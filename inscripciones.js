document.addEventListener("DOMContentLoaded", () => {
    const tbody = document.querySelector("#tabla-inscripciones tbody");
    const btnCSV = document.querySelector("#descargar-csv");
  
    let inscripciones = JSON.parse(localStorage.getItem("inscripciones")) || [];
  
    function renderizarTabla() {
      tbody.innerHTML = "";
  
      inscripciones.forEach((inscripcion, index) => {
        const fila = document.createElement("tr");
        fila.innerHTML = `
          <td>${inscripcion.nombre}</td>
          <td>${inscripcion.correo}</td>
          <td>${inscripcion.paquete.nombre}</td>
          <td>$${inscripcion.paquete.precio.toLocaleString("es-CL")}</td>
          <td>
            <button class="btn-eliminar" data-index="${index}">Eliminar</button>
          </td>
        `;
        tbody.appendChild(fila);
      });
  
      // Asociar eventos a botones de eliminar
      document.querySelectorAll(".btn-eliminar").forEach(boton => {
        boton.addEventListener("click", () => {
          const index = boton.getAttribute("data-index");
  
          Swal.fire({
            title: "¿Eliminar inscripción?",
            text: "Esta acción no se puede deshacer.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Sí, eliminar"
          }).then((result) => {
            if (result.isConfirmed) {
              inscripciones.splice(index, 1);
              localStorage.setItem("inscripciones", JSON.stringify(inscripciones));
              renderizarTabla();
  
              Swal.fire("¡Eliminado!", "La inscripción ha sido eliminada.", "success");
            }
          });
        });
      });
    }
  
    btnCSV.addEventListener("click", () => {
      if (inscripciones.length === 0) {
        Swal.fire("Sin datos", "No hay inscripciones para exportar.", "info");
        return;
      }
  
      let csvContent = "data:text/csv;charset=utf-8,Nombre,Correo,Paquete,Precio\n";
  
      inscripciones.forEach(i => {
        const fila = [
          i.nombre,
          i.correo,
          i.paquete.nombre,
          i.paquete.precio
        ].map(valor => `"${valor}"`).join(",");
        csvContent += fila + "\n";
      });
  
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", "inscripciones.csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  
    // Inicializa la tabla
    renderizarTabla();
  });
  