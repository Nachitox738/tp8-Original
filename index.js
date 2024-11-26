const express = require('express');
const fs = require('fs');
const cors = require('cors');
const app = express();
const port = 3000;

app.use(express.json());
app.use(express.static('./public'));
app.use(cors());

const leerDatos = () => {
  try {
    const datos = fs.readFileSync('./JSON/datos.json');
    return JSON.parse(datos);
  } catch (error) {
    console.log(error);
  }
};

const escribirDatos = (datos) => {
  try {
    fs.writeFileSync('./JSON/datos.json', JSON.stringify(datos));
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
  res.json({ productos: datos.productos });
});

app.post('/productos', (req, res) => {
  const datos = leerDatos();
  const nuevoProducto = {
    id: datos.productos.length + 1,
    ...req.body
  };
  datos.productos.push(nuevoProducto);
  escribirDatos(datos);
  res.json({ mensaje: 'Producto agregado', producto: nuevoProducto });
});

app.put('/productos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const nuevosDatos = req.body;
  const datos = leerDatos();
  const producto = datos.productos.find(p => p.id === id);

  if (!producto) {
    return res.status(404).json({ mensaje: 'Producto no encontrado' });
  }

  Object.assign(producto, nuevosDatos);
  escribirDatos(datos);
  res.json({ mensaje: 'Producto actualizado', producto });
});

app.delete('/productos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const datos = leerDatos();
  const index = datos.productos.findIndex(p => p.id === id);

  if (index === -1) {
    return res.status(404).json({ mensaje: 'Producto no encontrado' });
  }

  const [productoEliminado] = datos.productos.splice(index, 1);
  reIndexar(datos);
  escribirDatos(datos);
  res.json({ mensaje: 'Producto eliminado', producto: productoEliminado });
});

app.listen(port, () => {
  console.log(`Servidor corriendo en el puerto ${port}`);
});
