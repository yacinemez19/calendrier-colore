import React, { useState } from 'react';
import { formatDateRange } from '../utils/dateHelpers';

const PeriodList = ({ periods, onSelectPeriod, selectedPeriodId, onDeletePeriod, selectedAgendaId, agendaName }) => {
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const handleDelete = (periodId) => {
    setDeleteConfirm(periodId);
  };

  const confirmDelete = () => {
    if (deleteConfirm) {
      onDeletePeriod(deleteConfirm);
      setDeleteConfirm(null);
    }
  };

  const cancelDelete = () => {
    setDeleteConfirm(null);
  };

  const truncateText = (text, maxLength = 60) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 h-full">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Périodes{agendaName ? ` - ${agendaName}` : ''}
          </h3>
          {selectedAgendaId && (
            <span className="text-sm text-gray-500">
              {periods.length} période{periods.length !== 1 ? 's' : ''}
            </span>
          )}
        </div>
      </div>

      {!selectedAgendaId ? (
        <div className="text-center py-8">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 48 48">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5l7-7 7 7M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <h4 className="mt-2 text-sm font-medium text-gray-900">Aucun agenda sélectionné</h4>
          <p className="mt-1 text-sm text-gray-500">
            Sélectionnez ou créez un agenda pour voir ses périodes.
          </p>
        </div>
      ) : periods.length === 0 ? (
        <div className="text-center py-8">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 48 48">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V7M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8M8 21l4-4 4 4M8 21l4-4 4 4" />
          </svg>
          <h4 className="mt-2 text-sm font-medium text-gray-900">Aucune période</h4>
          <p className="mt-1 text-sm text-gray-500">
            Sélectionnez des jours sur le calendrier pour créer votre première période.
          </p>
        </div>
      ) : (
        <div className="space-y-3 max-h-[calc(100vh-250px)] overflow-y-auto flex-1">
          {periods.map((period) => (
            <div
              key={period.id}
              className={`border rounded-lg p-4 cursor-pointer transition-all duration-200 ${
                selectedPeriodId === period.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              }`}
              onClick={() => onSelectPeriod(period.id)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-2">
                    <div
                      className="w-4 h-4 rounded-full flex-shrink-0"
                      style={{ backgroundColor: period.couleur }}
                    />
                    <h4 className="text-sm font-medium text-gray-900 truncate">
                      {period.nom}
                    </h4>
                  </div>
                  
                  <p className="text-xs text-gray-600 mb-1">
                    {formatDateRange(period.dateDebut, period.dateFin)}
                    <span className="ml-2 text-gray-400">
                      ({period.jours.length} jour{period.jours.length !== 1 ? 's' : ''})
                    </span>
                  </p>
                  
                  {period.description && (
                    <p className="text-xs text-gray-500 mt-1">
                      {truncateText(period.description)}
                    </p>
                  )}
                </div>
                
                <div className="flex items-center space-x-1 ml-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(period.id);
                    }}
                    className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                    title="Supprimer"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete confirmation modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-sm w-full">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                  <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
              </div>
              
              <div className="text-center">
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Supprimer la période
                </h3>
                <p className="text-sm text-gray-500 mb-6">
                  Êtes-vous sûr de vouloir supprimer cette période ? Cette action ne peut pas être annulée.
                </p>
                
                <div className="flex space-x-3">
                  <button
                    onClick={cancelDelete}
                    className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={confirmDelete}
                    className="flex-1 px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors"
                  >
                    Supprimer
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PeriodList; 