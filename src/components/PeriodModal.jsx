import React, { useState, useEffect } from 'react';
import { formatDateRange } from '../utils/dateHelpers';

const PeriodModal = ({ isOpen, onClose, onSubmit, dateRange, editingPeriod = null }) => {
  const [formData, setFormData] = useState({
    nom: '',
    description: '',
    couleur: '#3B82F6'
  });

  const [errors, setErrors] = useState({});

  const predefinedColors = [
    '#3B82F6', // Blue
    '#EF4444', // Red
    '#10B981', // Green
    '#F59E0B', // Yellow
    '#8B5CF6', // Purple
    '#EC4899', // Pink
    '#06B6D4', // Cyan
    '#84CC16', // Lime
    '#F97316', // Orange
    '#6B7280'  // Gray
  ];

  useEffect(() => {
    if (editingPeriod) {
      setFormData({
        nom: editingPeriod.nom,
        description: editingPeriod.description,
        couleur: editingPeriod.couleur
      });
    } else {
      setFormData({
        nom: '',
        description: '',
        couleur: '#3B82F6'
      });
    }
    setErrors({});
  }, [editingPeriod, isOpen]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleColorSelect = (color) => {
    setFormData(prev => ({
      ...prev,
      couleur: color
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.nom.trim()) {
      newErrors.nom = 'Le nom est obligatoire';
    }
    
    if (!formData.couleur) {
      newErrors.couleur = 'Veuillez choisir une couleur';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    const periodData = {
      ...formData,
      nom: formData.nom.trim(),
      description: formData.description.trim()
    };
    
    if (dateRange) {
      periodData.dateDebut = dateRange.dateDebut;
      periodData.dateFin = dateRange.dateFin;
    }
    
    onSubmit(periodData);
  };

  const handleClose = () => {
    setFormData({
      nom: '',
      description: '',
      couleur: '#3B82F6'
    });
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">
              {editingPeriod ? 'Modifier la période' : 'Nouvelle période'}
            </h3>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {dateRange && (
            <div className="mb-4 p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                <span className="font-medium">Période :</span> {formatDateRange(dateRange.dateDebut, dateRange.dateFin)}
                {dateRange.jours.length > 1 && (
                  <span className="ml-2">({dateRange.jours.length} jours)</span>
                )}
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="nom" className="block text-sm font-medium text-gray-700 mb-1">
                Nom de la période *
              </label>
              <input
                type="text"
                id="nom"
                name="nom"
                value={formData.nom}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.nom ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Ex: Vacances de la Toussaint"
                maxLength={50}
              />
              {errors.nom && (
                <p className="mt-1 text-sm text-red-600">{errors.nom}</p>
              )}
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Description de la période..."
                maxLength={200}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Couleur *
              </label>
              <div className="grid grid-cols-5 gap-2">
                {predefinedColors.map(color => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => handleColorSelect(color)}
                    className={`w-10 h-10 rounded-full border-2 transition-all ${
                      formData.couleur === color 
                        ? 'border-gray-800 scale-110' 
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                    style={{ backgroundColor: color }}
                    title={`Couleur ${color}`}
                  />
                ))}
              </div>
              
              <div className="mt-3">
                <label htmlFor="couleur-custom" className="block text-xs text-gray-500 mb-1">
                  Ou choisir une couleur personnalisée :
                </label>
                <input
                  type="color"
                  id="couleur-custom"
                  name="couleur"
                  value={formData.couleur}
                  onChange={handleInputChange}
                  className="w-16 h-8 border border-gray-300 rounded cursor-pointer"
                />
              </div>
              
              {errors.couleur && (
                <p className="mt-1 text-sm text-red-600">{errors.couleur}</p>
              )}
            </div>

            <div className="flex space-x-3 pt-4">
              <button
                type="button"
                onClick={handleClose}
                className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
              >
                {editingPeriod ? 'Modifier' : 'Créer'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PeriodModal; 