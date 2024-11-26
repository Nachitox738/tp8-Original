const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const port = 3000;

app.use(express.json());

app.get('/productos', (req, res) => {
  fs.readFile(path.join(__dirname, 'productos.json'), 'utf8', (err, data) => {
    if (err) return res.status(500).json({ mensaje: 'Error al leer los productos' });
    const productos = JSON.parse(data);
    res.json(productos.productos);
  });
});
o
app.get('/productos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  fs.readFile(path.join(__dirname, 'productos.json'), 'utf8', (err, data) => {
    if (err) return res.status(500).json({ mensaje: 'Error al leer los productos' });
    const productos = JSON.parse(data);
    const producto = productos.productos.find(p => p.id === id);
    if (!producto) return res.status(404).json({ mensaje: 'Producto no encontrado' });
    res.json(producto);
  });
});

app.post('/productos', (req, res) => {
  const nuevoProducto = req.body;
  fs.readFile(path.join(__dirname, 'productos.json'), 'utf8', (err, data) => {
    if (err) return res.status(500).json({ mensaje: 'Error al leer los productos' });
    const productos = JSON.parse(data);
    nuevoProducto.id = productos.productos.length ? productos.productos[productos.productos.length - 1].id + 1 : 1;
    productos.productos.push(nuevoProducto);
    fs.writeFile(path.join(__dirname, 'productos.json'), JSON.stringify(productos, null, 2), (err) => {
      if (err) return res.status(500).json({ mensaje: 'Error al guardar el producto' });
      res.status(201).json({ mensaje: 'Producto añadido correctamente' });
    });
  });
});

app.put('/productos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const { nombre, descripcion, precio, imagen } = req.body;
  
  fs.readFile(path.join(__dirname, 'productos.json'), 'utf8', (err, data) => {
    if (err) return res.status(500).json({ mensaje: 'Error al leer los productos' });
    const productos = JSON.parse(data);
    const productoIndex = productos.productos.findIndex(p => p.id === id);
    if (productoIndex === -1) return res.status(404).json({ mensaje: 'Producto no encontrado' });

    productos.productos[productoIndex] = { id, nombre, descripcion, precio, imagen };
    fs.writeFile(path.join(__dirname, 'productos.json'), JSON.stringify(productos, null, 2), (err) => {
      if (err) return res.status(500).json({ mensaje: 'Error al actualizar el producto' });
      res.json({ mensaje: 'Producto actualizado correctamente' });
    });
  });
});

app.delete('/productos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  fs.readFile(path.join(__dirname, 'productos.json'), 'utf8', (err, data) => {
    if (err) return res.status(500).json({ mensaje: 'Error al leer los productos' });
    const productos = JSON.parse(data);
    const productoIndex = productos.productos.findIndex(p => p.id === id);
    if (productoIndex === -1) return res.status(404).json({ mensaje: 'Producto no encontrado' });

    productos.productos.splice(productoIndex, 1);
    fs.writeFile(path.join(__dirname, 'productos.json'), JSON.stringify(productos, null, 2), (err) => {
      if (err) return res.status(500).json({ mensaje: 'Error al eliminar el producto' });
      res.json({ mensaje: 'Producto eliminado correctamente' });
    });
  });
});

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});