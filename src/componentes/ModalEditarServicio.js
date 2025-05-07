import React, { useState, useEffect } from "react";

const ModalEditarServicio = ({ servicio, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    booking_date: '',
    booking_time: '',
    quantity: 1,
    special_requests: ''
  });

  useEffect(() => {
    if (servicio) {
      console.log('Datos de servicio recibidos:', servicio);
      
      setFormData({
        booking_date: servicio.booking_date || '',
        booking_time: servicio.booking_time || '',
        quantity: servicio.quantity || 1,
        special_requests: servicio.special_requests || ''
      });
    }
  }, [servicio]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Enviando datos de formulario:', formData);
    
    onSave(servicio.id, formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-bold mb-4">Editar Reserva de Servicio</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Fecha de Reserva
            </label>
            <div className="w-full p-2 border rounded-lg bg-gray-100">
              {formData.booking_date}
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Hora de Reserva
            </label>
            <div className="w-full p-2 border rounded-lg bg-gray-100">
              {formData.booking_time}
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Cantidad
            </label>
            <input
              type="number"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg"
              min="1"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Solicitudes Especiales
            </label>
            <textarea
              name="special_requests"
              value={formData.special_requests}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg"
              rows="3"
            ></textarea>
          </div>
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 rounded-lg"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-accent text-white rounded-lg"
            >
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalEditarServicio;