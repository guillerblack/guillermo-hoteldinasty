import React, { useState, useEffect } from "react";

const ModalEditarReserva = ({ reserva, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    checkInDate: '',
    checkOutDate: '',
    numAdults: 1,
    numChildren: 0
  });

  useEffect(() => {
    if (reserva) {
      console.log('Datos de reserva recibidos:', reserva);
      
      // Convertir fechas al formato YYYY-MM-DD si es necesario
      let checkInDate = reserva.check_in_date || reserva.checkInDate || '';
      let checkOutDate = reserva.check_out_date || reserva.checkOutDate || '';
      
      // Si las fechas son objetos Date, convertirlas a string
      if (checkInDate instanceof Date) {
        checkInDate = checkInDate.toISOString().split('T')[0];
      }
      
      if (checkOutDate instanceof Date) {
        checkOutDate = checkOutDate.toISOString().split('T')[0];
      }
      
      setFormData({
        checkInDate: checkInDate,
        checkOutDate: checkOutDate,
        numAdults: reserva.num_adults || reserva.numAdults || 1,
        numChildren: reserva.num_children || reserva.numChildren || 0
      });
    }
  }, [reserva]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Enviando datos de formulario:', formData);
    
    // Convertir a los nombres de campo esperados por el backend
    const apiData = {
      check_in_date: formData.checkInDate,
      check_out_date: formData.checkOutDate,
      num_adults: parseInt(formData.numAdults),
      num_children: parseInt(formData.numChildren)
    };
    
    onSave(reserva.id, apiData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-bold mb-4">Editar Reserva</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Fecha de Entrada
            </label>
            <div className="w-full p-2 border rounded-lg bg-gray-100">
              {formData.checkInDate}
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Fecha de Salida
            </label>
            <div className="w-full p-2 border rounded-lg bg-gray-100">
              {formData.checkOutDate}
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Número de Adultos
            </label>
            <input
              type="number"
              name="numAdults"
              value={formData.numAdults}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg"
              min="1"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Número de Niños
            </label>
            <input
              type="number"
              name="numChildren"
              value={formData.numChildren}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg"
              min="0"
              required
            />
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

export default ModalEditarReserva;