import React, { useEffect } from 'react';
import '../styles/styles.css';

export default function Proyecto() {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://cdn.shyft.network/sdk/shyft.min.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();

    const nombre = document.getElementById('nombre').value;
    const apellido = document.getElementById('apellido').value;
    const dni = document.getElementById('ine').value;

    const apiKey = 'SEpqyrj_eb9pksty';

    const shyftSDK = new ShyftSDK(apiKey);

    shyftSDK
      .verificarIdentidad(nombre, apellido, dni)
      .then(function (respuesta) {
        if (respuesta.verificado) {
          alert('Verificación exitosa');
        } else {
          alert('Verificación fallida');
        }
      })
      .catch(function (error) {
        alert('Error al realizar la verificación');
        console.error(error);
      });
  };

  return (
    <>
      <h1>Verificación de Identidad</h1>

      <div className="container">
        <form id="verificacion-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="nombre">Nombre:</label>
            <input type="text" id="nombre" name="nombre" required />
          </div>

          <div className="form-group">
            <label htmlFor="apellido">Apellido:</label>
            <input type="text" id="apellido" name="apellido" required />
          </div>

          <div className="form-group">
            <label htmlFor="ine">INE:</label>
            <input type="text" id="ine" name="ine" required />
          </div>

          <div className="form-group">
            <input type="submit" value="Verificar" />
          </div>
        </form>
      </div>
    </>
  );
}
