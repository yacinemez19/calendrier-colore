import React, { useState } from 'react';

const AgendaSelector = ({ 
  agendas, 
  selectedAgendaId, 
  onSelectAgenda, 
  onCreateAgenda, 
  onDeleteAgenda,
  onDuplicateAgenda 
}) => {
  const [isCreating, setIsCreating] = useState(false);
  const [newAgendaName, setNewAgendaName] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [isDuplicating, setIsDuplicating] = useState(false);

  const handleCreateAgenda = async () => {
    if (newAgendaName.trim()) {
      try {
        await onCreateAgenda({ nom: newAgendaName.trim() });
        setNewAgendaName('');
        setIsCreating(false);
      } catch (error) {
        console.error('Erreur lors de la création de l\'agenda:', error);
      }
    }
  };

  const handleDeleteAgenda = async (agendaId) => {
    try {
      await onDeleteAgenda(agendaId);
      setShowDeleteConfirm(null);
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'agenda:', error);
    }
  };

  const handleDuplicateAgenda = async (agendaId) => {
    if (!onDuplicateAgenda) return;
    
    setIsDuplicating(true);
    try {
      await onDuplicateAgenda(agendaId);
    } catch (error) {
      console.error('Erreur lors de la duplication de l\'agenda:', error);
    } finally {
      setIsDuplicating(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleCreateAgenda();
    } else if (e.key === 'Escape') {
      setIsCreating(false);
      setNewAgendaName('');
    }
  };

  if (agendas.length === 0 && !isCreating) {
    return (
      <div className="flex items-center space-x-3">
        <span className="text-gray-500 text-sm">Aucun agenda</span>
        <button
          onClick={() => setIsCreating(true)}
          className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Créer un agenda
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-3">
      <span className="text-sm text-gray-500">Agenda :</span>
      
      {!isCreating ? (
        <>
          <select
            value={selectedAgendaId || ''}
            onChange={(e) => onSelectAgenda(e.target.value)}
            className="px-3 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Sélectionner un agenda</option>
            {agendas.map(agenda => (
              <option key={agenda.id} value={agenda.id}>
                {agenda.nom}
              </option>
            ))}
          </select>
          
          <button
            onClick={() => setIsCreating(true)}
            className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
            title="Créer un nouvel agenda"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>
          
          {selectedAgendaId && onDuplicateAgenda && (
            <button
              onClick={() => handleDuplicateAgenda(selectedAgendaId)}
              disabled={isDuplicating}
              className="p-1 text-gray-400 hover:text-green-600 transition-colors disabled:opacity-50"
              title="Dupliquer l'agenda sélectionné"
            >
              {isDuplicating ? (
                <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              )}
            </button>
          )}
          
          {selectedAgendaId && agendas.length > 1 && (
            <button
              onClick={() => setShowDeleteConfirm(selectedAgendaId)}
              className="p-1 text-gray-400 hover:text-red-600 transition-colors"
              title="Supprimer l'agenda sélectionné"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          )}
        </>
      ) : (
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={newAgendaName}
            onChange={(e) => setNewAgendaName(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Nom du nouvel agenda"
            className="px-3 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            autoFocus
          />
          <button
            onClick={handleCreateAgenda}
            disabled={!newAgendaName.trim()}
            className="px-3 py-1 text-sm bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-300 transition-colors"
          >
            Créer
          </button>
          <button
            onClick={() => {
              setIsCreating(false);
              setNewAgendaName('');
            }}
            className="px-3 py-1 text-sm bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
          >
            Annuler
          </button>
        </div>
      )}

      {/* Confirmation de suppression */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Supprimer l'agenda
            </h3>
            <p className="text-gray-600 mb-6">
              Êtes-vous sûr de vouloir supprimer cet agenda ? Toutes les périodes associées seront également supprimées. Cette action est irréversible.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={() => handleDeleteAgenda(showDeleteConfirm)}
                className="flex-1 px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 transition-colors"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AgendaSelector; 