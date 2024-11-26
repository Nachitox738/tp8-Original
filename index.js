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
    const datos = fs.readFileSync('./JSON/datos.json', 'utf-8');
    return JSON.parse(datos); 
  } catch (error) {
    console.log(error);
    return { productos: [] };  
  }
};

const escribirDatos = (datos) => {
  try {
    fs.writeFileSync('./JSON/datos.json', JSON.stringify(datos, null, 2)); 
  } catch (error) {
    console.log(error);
  }
};

app.get('/productos', (req, res) => {
  const datos = leerDatos();
  res.json(datos.productos);  
});

app.post('/productos', (req, res) => {
  const datos = leerDatos();
  
  const nuevoProducto = {
    id: datos.productos.length + 1, 
    ...req.body 
  };

  datos.productos.push(nuevoProducto);
  escribirDatos(datos);

  res.json({
    mensaje: 'Nuevo Producto Agregado',
    Producto: nuevoProducto
  });
});

app.put('/productos/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const nuevosDatos = req.body;
    
    const datos = leerDatos();
    const productoIndex = datos.productos.findIndex(p => p.id === id);
    
    if (productoIndex === -1) {
      return res.status(404).json({ mensaje: 'Producto no encontrado' });
    }
    datos.productos[productoIndex] = { ...datos.productos[productoIndex], ...nuevosDatos };
    escribirDatos(datos);
  
    res.json({ mensaje: 'Producto actualizado', producto: datos.productos[productoIndex] });
  });

app.delete('/productos/:id', (req, res) => {
  const id = req.params.id;
  const datos = leerDatos();
  const prodEncontrado = datos.productos.find((p) => p.id == id);

  if (!prodEncontrado) {
    return res.status(404).json('Producto no encontrado');
  }

  datos.productos = datos.productos.filter(p => p.id != id);
  escribirDatos(datos);

  res.json({
    mensaje: 'Producto eliminado',
    Producto: prodEncontrado
  });
});

app.listen(port, () => {
  console.log(`Servidor corriendo en el puerto ${port}`);
});