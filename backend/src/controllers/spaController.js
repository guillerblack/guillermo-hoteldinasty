const Service = require('../models/Service');

// Obtener todos los servicios de SPA
exports.getAllSpaServices = async (req, res) => {
  try {
    // Utilizamos el método getByCategory del modelo Service
    const spaServices = await Service.getByCategory('spa');
    res.json(spaServices);
  } catch (error) {
    console.error('Error al obtener servicios de SPA:', error);
    res.status(500).json({ message: 'Error al obtener servicios de SPA' });
  }
};

// Obtener un servicio de SPA específico por ID
exports.getSpaServiceById = async (req, res) => {
  try {
    const service = await Service.getById(req.params.id);
    
    if (!service) {
      return res.status(404).json({ message: 'Servicio de SPA no encontrado' });
    }
    
    // Verificar que el servicio sea de categoría SPA
    if (service.category !== 'spa') {
      return res.status(400).json({ message: 'El servicio solicitado no es un servicio de SPA' });
    }
    
    res.json(service);
  } catch (error) {
    console.error('Error al obtener servicio de SPA:', error);
    res.status(500).json({ message: 'Error al obtener servicio de SPA' });
  }
};

// Obtener servicios de SPA destacados (si se implementa esta funcionalidad)
exports.getFeaturedSpaServices = async (req, res) => {
  try {
    // Aquí podrías implementar lógica para obtener servicios destacados
    // Por ahora, simplemente devolvemos todos los servicios de SPA
    const spaServices = await Service.getByCategory('spa');
    res.json(spaServices);
  } catch (error) {
    console.error('Error al obtener servicios de SPA destacados:', error);
    res.status(500).json({ message: 'Error al obtener servicios de SPA destacados' });
  }
};