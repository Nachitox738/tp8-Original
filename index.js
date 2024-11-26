const express = require('express');
const fs = require('fs');
const cors = require('cors');
const app = express();
const port = 3000;

app.use(express.json());
app.use(express.static('/public'));
app.use(cors());

const leerDatos = () => {
  try {
    const datos = fs.readFileSync('/public/JSON/datos.json');
    return JSON.parse(datos);
  } catch (error) {
    console.log(error);
    return { productos: [] }; 
  }
};

const escribirDatos = (datos) => {
  try {
    fs.writeFileSync('/public/JSON/datos.json', JSON.stringify(datos, null, 2));
  } catch (error) {
    console.log(error);
  }
};

function reIndexar(datos) {
  let indice = 1;
  datos.productos.map((p) => {
    p.id = indice;
    indice++;
  });
}

app.get('/productos', (req, res) => {
  const datos = leerDatos();
  res.json(datos); 
});

app.post('/productos', (req, res) => {
  const datos = leerDatos();
  const nuevoProducto = {
    id: datos.productos.length + 1, 
    ...req.body
  };
  datos.productos.push(nuevoProducto);
  escribirDatos(datos);
  res.json({ mensaje: 'Nuevo Producto Agregado', Producto: nuevoProducto });
});

app.put('/productos/:id', (req, res) => {
  const id = req.params.id;
  const nuevosDatos = req.body;
  const datos = leerDatos();
  const prodEncontrado = datos.productos.find((p) => p.id == id);

  if (!prodEncontrado) {
    return res.status(404).json('No se encuentra el producto');
  }

  datos.productos = datos.productos.map(p => p.id == id ? { ...p, ...nuevosDatos } : p);
  escribirDatos(datos);
  res.json({ mensaje: 'Producto actualizado', Producto: nuevosDatos });
});

app.delete('/productos/:id', (req, res) => {
  const id = req.params.id;
  const datos = leerDatos();
  const prodEncontrado = datos.productos.find((p) => p.id == id);

  if (!prodEncontrado) {
    return res.status(404).json('No se encuentra el producto');
  }

  datos.productos = datos.productos.filter((p) => p.id != id);
  reIndexar(datos);
  escribirDatos(datos);
  res.json({ mensaje: 'Producto eliminado', Producto: prodEncontrado });
});

app.listen(port, () => {
  console.log(`Servidor corriendo en el puerto ${port}`);
});
