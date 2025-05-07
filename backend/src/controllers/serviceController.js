const Service = require('../models/Service');
const fs = require('fs');
const path = require('path');
// Obtener todos los servicios
exports.getAllServices = async (req, res) => {
  try {
    const services = await Service.getAll();
    res.json(services);
  } catch (error) {
    console.error('Error al obtener servicios:', error);
    res.status(500).json({ message: 'Error al obtener servicios' });
  }
};
// Obtener un servicio por ID
exports.getServiceById = async (req, res) => {
  try {
    const service = await Service.getById(req.params.id);
    if (!service) {
      return res.status(404).json({ message: 'Servicio no encontrado' });
    }
    res.json(service);
  } catch (error) {
    console.error('Error al obtener servicio:', error);
    res.status(500).json({ message: 'Error al obtener servicio' });
  }
};

// Obtener servicios por categoría (food o spa)
exports.getServicesByCategory = async (req, res) => {
    try {
      const { category } = req.params;
      
      // Validar que la categoría sea válida
      if (!['food', 'spa'].includes(category)) {
        return res.status(400).json({ message: 'Categoría no válida. Debe ser "food" o "spa"' });
      }
      
      // Usar el método del modelo Service en lugar de una conexión directa
      const services = await Service.getByCategory(category);
      
      res.json(services);
    } catch (error) {
      console.error('Error al obtener servicios por categoría:', error);
      res.status(500).json({ message: 'Error al obtener servicios por categoría' });
    }
  };


// Crear un nuevo servicio
exports.createService = async (req, res) => {
  try {
    console.log('Body recibido:', req.body);
    console.log('Archivo recibido:', req.file);
    
    const { name, description, price, category, duration, available } = req.body;
    
    // Validaciones básicas
    if (!name || !price || !category) {
      return res.status(400).json({ message: 'Nombre, precio y categoría son obligatorios' });
    }
    
    if (category !== 'food' && category !== 'spa') {
      return res.status(400).json({ message: 'Categoría inválida. Debe ser "food" o "spa"' });
    }
    
    // Manejar la imagen
    let image_url = null; // Inicializar como null por defecto
    
    if (req.file) {
      // Si se subió un archivo, usar la ruta del archivo
      image_url = `/img/service/${req.file.filename}`;
      console.log('Imagen subida:', image_url);
    } else if (req.body.image_url && req.body.image_url !== 'null' && req.body.image_url !== '') {
      // Si no se subió un archivo pero se proporcionó una URL válida, usar esa URL
      image_url = req.body.image_url;
      console.log('URL de imagen proporcionada:', image_url);
    } else {
      // Si no hay imagen o es null, dejar como null
      console.log('No se proporcionó imagen, usando null');
    }
    
    // Asegurarse de que price sea un número
    const numericPrice = parseFloat(price);
    if (isNaN(numericPrice)) {
      return res.status(400).json({ message: 'El precio debe ser un número válido' });
    }
    
    const newService = await Service.create({
      name,
      description,
      price: numericPrice,
      category,
      image_url,
      duration: duration || null,
      available: available !== undefined ? available : true
    });
    
    res.status(201).json(newService);
  } catch (error) {
    console.error('Error al crear servicio:', error);
    res.status(500).json({ message: 'Error al crear servicio' });
  }
};

// Actualizar un servicio
exports.updateService = async (req, res) => {
  try {
    console.log('Body recibido en update:', req.body);
    console.log('Archivo recibido en update:', req.file);
    
    const serviceId = req.params.id;
    const serviceData = req.body;
    
    // Obtener el servicio actual para verificar si hay que actualizar la imagen
    const currentService = await Service.getById(serviceId);
    if (!currentService) {
      return res.status(404).json({ message: 'Servicio no encontrado' });
    }
    
    // Manejar la imagen
    if (req.file) {
      // Si se subió un archivo, usar la ruta del archivo
      serviceData.image_url = `/img/service/${req.file.filename}`;
      console.log('Nueva imagen subida:', serviceData.image_url);
      
      // Eliminar la imagen anterior si existe y no es la imagen por defecto
      if (
        currentService.image_url && 
        !currentService.image_url.includes('default-service.jpg') && 
        currentService.image_url.startsWith('/img/service/')
      ) {
        try {
          const oldImagePath = path.join(__dirname, '../../../public', currentService.image_url);
          if (fs.existsSync(oldImagePath)) {
            fs.unlinkSync(oldImagePath);
            console.log('Imagen anterior eliminada:', oldImagePath);
          }
        } catch (err) {
          // No detener el flujo si falla el borrado
          console.error('Error al eliminar imagen anterior:', err);
        }
      }
    } else if (serviceData.image_url === 'null' || serviceData.image_url === '') {
      // Si se envió explícitamente null o cadena vacía, establecer como null
      serviceData.image_url = null;
      console.log('Imagen establecida a null explícitamente');
    } else if (!serviceData.image_url) {
      // Si no se proporcionó image_url, mantener la imagen actual
      serviceData.image_url = currentService.image_url;
      console.log('Manteniendo imagen actual:', serviceData.image_url);
    }
    
    // Asegurarse de que price sea un número si está presente
    if (serviceData.price) {
      const numericPrice = parseFloat(serviceData.price);
      if (isNaN(numericPrice)) {
        return res.status(400).json({ message: 'El precio debe ser un número válido' });
      }
      serviceData.price = numericPrice;
    }
    
    const updatedService = await Service.update(serviceId, serviceData);
    res.json(updatedService);
  } catch (error) {
    console.error('Error al actualizar servicio:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};
// Eliminar un servicio
exports.deleteService = async (req, res) => {
  try {
    const serviceId = req.params.id;
    
    // Obtener el servicio para eliminar su imagen si es necesario
    const service = await Service.getById(serviceId);
    if (service && service.image_url && service.image_url.startsWith('/img/service/')) {
      try {
        const imagePath = path.join(__dirname, '../../../public', service.image_url);
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
        }
      } catch (err) {
        // No detener el flujo si falla el borrado
        console.error('Error al eliminar imagen:', err);
      }
    }
    
    await Service.delete(serviceId);
    res.json({ message: 'Servicio eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar servicio:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};