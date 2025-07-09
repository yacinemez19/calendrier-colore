import React, { useState, useEffect } from 'react';
import { formatDateRange } from '../utils/dateHelpers';

const PeriodInspector = ({ selectedPeriod, onUpdatePeriod, onClearSelection, selectedAgendaId }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    nom: '',
    description: '',
    couleur: '#3B82F6',
    dateDebut: '',
    dateFin: '',
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
    if (selectedPeriod) {
      setFormData({
        nom: selectedPeriod.nom,
        description: selectedPeriod.description,
        couleur: selectedPeriod.couleur,
        dateDebut: selectedPeriod.dateDebut,
        dateFin: selectedPeriod.dateFin,
      });
      setIsEditing(false);
      setErrors({});
    }
  }, [selectedPeriod]);

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
    
    if (!formData.dateDebut) {
      newErrors.dateDebut = 'La date de début est obligatoire';
    }
    
    if (!formData.dateFin) {
      newErrors.dateFin = 'La date de fin est obligatoire';
    }
    
    if (formData.dateDebut && formData.dateFin && formData.dateFin < formData.dateDebut) {
      newErrors.dateFin = 'La date de fin doit être après la date de début';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validateForm()) {
      return;
    }
    
    const updates = {
      nom: formData.nom.trim(),
      description: formData.description.trim(),
      couleur: formData.couleur,
      dateDebut: formData.dateDebut,
      dateFin: formData.dateFin
    };
    onUpdatePeriod(selectedPeriod.id, updates);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      nom: selectedPeriod.nom,
      description: selectedPeriod.description,
      couleur: selectedPeriod.couleur,
      dateDebut: selectedPeriod.dateDebut,
      dateFin: selectedPeriod.dateFin,
    });
    setErrors({});
    setIsEditing(false);
  };

  if (!selectedAgendaId) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6 h-full">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">
            Inspecteur
          </h3>
        </div>
        
        <div className="text-center py-8">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 48 48">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5l7-7 7 7M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <h4 className="mt-2 text-sm font-medium text-gray-900">Aucun agenda sélectionné</h4>
          <p className="mt-1 text-sm text-gray-500">
            Sélectionnez un agenda pour voir ses périodes.
          </p>
        </div>
      </div>
    );
  }

  if (!selectedPeriod) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6 h-full">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">
            Inspecteur
          </h3>
        </div>
        
        <div className="text-center py-8">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 48 48">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5l7-7 7 7M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <h4 className="mt-2 text-sm font-medium text-gray-900">Aucune période sélectionnée</h4>
          <p className="mt-1 text-sm text-gray-500">
           .
          </p>
          <img
            src="/anatole.png"
            alt="image"
            className="block mx-auto w-50 h-50 object-cover rounded-lg shadow-lg border border-gray-200 bg-white hover:scale-105 transition-transform duration-300"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 h-full">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">
          Inspecteur
        </h3>
        <button
          onClick={onClearSelection}
          className="text-gray-400 hover:text-gray-600 transition-colors"
          title="Fermer"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="space-y-6">
        {/* Période info */}
        <div className="p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <div
              className="w-4 h-4 rounded-full"
              style={{ backgroundColor: selectedPeriod.couleur }}
            />
            <span className="text-sm font-medium text-gray-900">
              {formatDateRange(selectedPeriod.dateDebut, selectedPeriod.dateFin)}
            </span>
          </div>
          <p className="text-xs text-gray-500">
            {selectedPeriod.jours.length} jour{selectedPeriod.jours.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Form fields */}
        <div className="space-y-4">
          <div>
            <label htmlFor="nom" className="block text-sm font-medium text-gray-700 mb-1">
              Nom de la période
            </label>
            {isEditing ? (
              <input
                type="text"
                id="nom"
                name="nom"
                value={formData.nom}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.nom ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Nom de la période"
                maxLength={50}
              />
            ) : (
              <p className="px-3 py-2 text-sm text-gray-900 bg-gray-50 rounded-md">
                {selectedPeriod.nom}
              </p>
            )}
            {errors.nom && (
              <p className="mt-1 text-sm text-red-600">{errors.nom}</p>
            )}
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            {isEditing ? (
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
            ) : (
              <p className="px-3 py-2 text-sm text-gray-900 bg-gray-50 rounded-md min-h-[80px]">
                {selectedPeriod.description || <span className="text-gray-400">Aucune description</span>}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Couleur
            </label>
            {isEditing ? (
              <div>
                <div className="grid grid-cols-5 gap-2 mb-3">
                  {predefinedColors.map(color => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => handleColorSelect(color)}
                      className={`w-8 h-8 rounded-full border-2 transition-all ${
                        formData.couleur === color 
                          ? 'border-gray-800 scale-110' 
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                      style={{ backgroundColor: color }}
                      title={`Couleur ${color}`}
                    />
                  ))}
                </div>
                
                <div>
                  <label htmlFor="couleur-custom" className="block text-xs text-gray-500 mb-1">
                    Couleur personnalisée :
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
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <div
                  className="w-8 h-8 rounded-full border-2 border-gray-200"
                  style={{ backgroundColor: selectedPeriod.couleur }}
                />
                <span className="text-sm text-gray-900 font-mono">
                  {selectedPeriod.couleur}
                </span>
              </div>
            )}
            {errors.couleur && (
              <p className="mt-1 text-sm text-red-600">{errors.couleur}</p>
            )}
          </div>

          {/* Date fields */}
          <div className="space-y-4">
            <div>
              <label htmlFor="dateDebut" className="block text-sm font-medium text-gray-700 mb-1">
                Date de début
              </label>
              {isEditing ? (
                <input
                  type="date"
                  id="dateDebut"
                  name="dateDebut"
                  value={formData.dateDebut}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.dateDebut ? 'border-red-300' : 'border-gray-300'}`}
                />
              ) : (
                <p className="px-3 py-2 text-sm text-gray-900 bg-gray-50 rounded-md">
                  {formData.dateDebut}
                </p>
              )}
              {errors.dateDebut && (
                <p className="mt-1 text-sm text-red-600">{errors.dateDebut}</p>
              )}
            </div>
            <div>
              <label htmlFor="dateFin" className="block text-sm font-medium text-gray-700 mb-1">
                Date de fin
              </label>
              {isEditing ? (
                <input
                  type="date"
                  id="dateFin"
                  name="dateFin"
                  value={formData.dateFin}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.dateFin ? 'border-red-300' : 'border-gray-300'}`}
                />
              ) : (
                <p className="px-3 py-2 text-sm text-gray-900 bg-gray-50 rounded-md">
                  {formData.dateFin}
                </p>
              )}
              {errors.dateFin && (
                <p className="mt-1 text-sm text-red-600">{errors.dateFin}</p>
              )}
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="pt-4 border-t border-gray-200">
          {isEditing ? (
            <div className="flex space-x-3">
              <button
                onClick={handleCancel}
                className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={handleSave}
                className="flex-1 px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
              >
                Sauvegarder
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="w-full px-4 py-2 text-sm font-medium text-blue-700 bg-blue-50 border border-blue-200 rounded-md hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
            >
              Modifier
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PeriodInspector; 