import { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot, query, where } from 'firebase/firestore';
import { getDateRange, generateId } from '../utils/dateHelpers';

/**
 * Custom hook for managing periods with Firebase persistence
 * @param {string|null} selectedAgendaId - The currently selected agenda ID
 */
export const usePeriods = (selectedAgendaId) => {
  const [periods, setPeriods] = useState([]);
  const [selectedPeriodId, setSelectedPeriodId] = useState(null);

  // Charger en temps réel les périodes de l'agenda sélectionné
  useEffect(() => {
    if (!selectedAgendaId) {
      setPeriods([]);
      setSelectedPeriodId(null);
      return;
    }

    const periodsQuery = query(
      collection(db, 'periods'), 
      where('agendaId', '==', selectedAgendaId)
    );
    
    const unsub = onSnapshot(periodsQuery, (snapshot) => {
      setPeriods(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    
    return () => unsub();
  }, [selectedAgendaId]);

  /**
   * Create a new period
   * @param {Object} periodData - Period data {nom, description, couleur, dateDebut, dateFin}
   */
  const createPeriod = async (periodData) => {
    if (!selectedAgendaId) {
      throw new Error('Aucun agenda sélectionné');
    }
    
    const newPeriod = {
      ...periodData,
      agendaId: selectedAgendaId,
      jours: getDateRange(periodData.dateDebut, periodData.dateFin)
    };
    await addDoc(collection(db, 'periods'), newPeriod);
  };

  /**
   * Update an existing period
   * @param {string} periodId - Period ID
   * @param {Object} updates - Updates to apply
   */
  const updatePeriod = async (periodId, updates) => {
    const periodRef = doc(db, 'periods', periodId);
    let updateData = { ...updates };
    if (updates.dateDebut || updates.dateFin) {
      updateData.jours = getDateRange(
        updates.dateDebut || periods.find(p => p.id === periodId).dateDebut,
        updates.dateFin || periods.find(p => p.id === periodId).dateFin
      );
    }
    await updateDoc(periodRef, updateData);
  };

  /**
   * Delete a period
   * @param {string} periodId - Period ID
   */
  const deletePeriod = async (periodId) => {
    try {
      await deleteDoc(doc(db, 'periods', periodId));
      if (selectedPeriodId === periodId) {
        setSelectedPeriodId(null);
      }
    } catch (error) {
      console.error('Erreur lors de la suppression Firestore:', error, periodId);
    }
  };

  /**
   * Get periods that contain a specific date
   * @param {string} date - Date string (YYYY-MM-DD)
   * @returns {Array} Array of periods
   */
  const getPeriodsForDate = (date) => {
    return periods.filter(period => period.jours.includes(date));
  };

  /**
   * Get the selected period
   * @returns {Object|null} Selected period or null
   */
  const getSelectedPeriod = () => {
    return periods.find(period => period.id === selectedPeriodId) || null;
  };

  /**
   * Select a period
   * @param {string} periodId - Period ID
   */
  const selectPeriod = (periodId) => {
    setSelectedPeriodId(periodId);
  };

  /**
   * Clear period selection
   */
  const clearSelection = () => {
    setSelectedPeriodId(null);
  };

  return {
    periods,
    selectedPeriodId,
    createPeriod,
    updatePeriod,
    deletePeriod,
    getPeriodsForDate,
    getSelectedPeriod,
    selectPeriod,
    clearSelection
  };
}; 