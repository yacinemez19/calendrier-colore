import { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot, query, where, getDocs } from 'firebase/firestore';

/**
 * Custom hook for managing agendas with Firebase persistence
 */
export const useAgendas = () => {
  const [agendas, setAgendas] = useState([]);
  const [selectedAgendaId, setSelectedAgendaId] = useState(null);

  // Charger les agendas en temps réel
  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'agendas'), async (snapshot) => {
      const agendasData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      
      // Si aucun agenda n'existe, créer un agenda par défaut
      if (agendasData.length === 0) {
        try {
          const defaultAgenda = {
            nom: 'Mon Agenda',
            createdAt: new Date().toISOString()
          };
          const docRef = await addDoc(collection(db, 'agendas'), defaultAgenda);
          const newAgendaData = { id: docRef.id, ...defaultAgenda };
          setAgendas([newAgendaData]);
          setSelectedAgendaId(docRef.id);
        } catch (error) {
          console.error('Erreur lors de la création de l\'agenda par défaut:', error);
          setAgendas(agendasData);
        }
      } else {
        setAgendas(agendasData);
        
        // Sélectionner automatiquement le premier agenda s'il n'y en a pas de sélectionné
        if (agendasData.length > 0 && !selectedAgendaId) {
          setSelectedAgendaId(agendasData[0].id);
        }
      }
    });
    return () => unsub();
  }, [selectedAgendaId]);

  /**
   * Create a new agenda
   * @param {Object} agendaData - Agenda data {nom}
   */
  const createAgenda = async (agendaData) => {
    const newAgenda = {
      nom: agendaData.nom.trim(),
      createdAt: new Date().toISOString()
    };
    const docRef = await addDoc(collection(db, 'agendas'), newAgenda);
    
    // Sélectionner automatiquement le nouvel agenda
    setSelectedAgendaId(docRef.id);
    
    return docRef.id;
  };

  /**
   * Update an existing agenda
   * @param {string} agendaId - Agenda ID
   * @param {Object} updates - Updates to apply
   */
  const updateAgenda = async (agendaId, updates) => {
    const agendaRef = doc(db, 'agendas', agendaId);
    await updateDoc(agendaRef, {
      ...updates,
      updatedAt: new Date().toISOString()
    });
  };

  /**
   * Delete an agenda and all its periods
   * @param {string} agendaId - Agenda ID
   */
  const deleteAgenda = async (agendaId) => {
    try {
      // Supprimer toutes les périodes de cet agenda
      const periodsQuery = query(collection(db, 'periods'), where('agendaId', '==', agendaId));
      const periodsSnapshot = await getDocs(periodsQuery);
      
      const deletePromises = periodsSnapshot.docs.map(doc => deleteDoc(doc.ref));
      await Promise.all(deletePromises);
      
      // Supprimer l'agenda
      await deleteDoc(doc(db, 'agendas', agendaId));
      
      // Si c'était l'agenda sélectionné, sélectionner le premier disponible
      if (selectedAgendaId === agendaId) {
        const remainingAgendas = agendas.filter(a => a.id !== agendaId);
        setSelectedAgendaId(remainingAgendas.length > 0 ? remainingAgendas[0].id : null);
      }
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'agenda:', error);
      throw error;
    }
  };

  /**
   * Duplicate an agenda with all its periods
   * @param {string} agendaId - Agenda ID to duplicate
   */
  const duplicateAgenda = async (agendaId) => {
    try {
      // Trouver l'agenda à dupliquer
      const originalAgenda = agendas.find(a => a.id === agendaId);
      if (!originalAgenda) {
        throw new Error('Agenda introuvable');
      }

      // Créer le nouvel agenda
      const duplicatedAgenda = {
        nom: `${originalAgenda.nom} (Copie)`,
        createdAt: new Date().toISOString()
      };
      const newAgendaRef = await addDoc(collection(db, 'agendas'), duplicatedAgenda);
      const newAgendaId = newAgendaRef.id;

      // Récupérer toutes les périodes de l'agenda original
      const periodsQuery = query(collection(db, 'periods'), where('agendaId', '==', agendaId));
      const periodsSnapshot = await getDocs(periodsQuery);

      // Dupliquer toutes les périodes
      const duplicatePromises = periodsSnapshot.docs.map(doc => {
        const periodData = doc.data();
        const duplicatedPeriod = {
          ...periodData,
          agendaId: newAgendaId
        };
        return addDoc(collection(db, 'periods'), duplicatedPeriod);
      });

      await Promise.all(duplicatePromises);

      // Sélectionner automatiquement le nouvel agenda
      setSelectedAgendaId(newAgendaId);

      return newAgendaId;
    } catch (error) {
      console.error('Erreur lors de la duplication de l\'agenda:', error);
      throw error;
    }
  };

  /**
   * Select an agenda
   * @param {string} agendaId - Agenda ID
   */
  const selectAgenda = (agendaId) => {
    setSelectedAgendaId(agendaId);
  };

  /**
   * Get the selected agenda
   * @returns {Object|null} Selected agenda or null
   */
  const getSelectedAgenda = () => {
    return agendas.find(agenda => agenda.id === selectedAgendaId) || null;
  };

  return {
    agendas,
    selectedAgendaId,
    selectedAgenda: getSelectedAgenda(),
    createAgenda,
    updateAgenda,
    deleteAgenda,
    duplicateAgenda,
    selectAgenda
  };
}; 