import React, { useState } from 'react';
import { MONTHS } from './utils/dateHelpers';
import { usePeriods } from './hooks/usePeriods';
import { useAgendas } from './hooks/useAgendas';
import Calendar from './components/Calendar';
import PeriodModal from './components/PeriodModal';
import PeriodList from './components/PeriodList';
import PeriodInspector from './components/PeriodInspector';
import AgendaSelector from './components/AgendaSelector';

function App() {
  const [selectedMonth, setSelectedMonth] = useState(9); // September by default
  const [selectedDays, setSelectedDays] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dateRange, setDateRange] = useState(null);
  const [showInstructions, setShowInstructions] = useState(true);

  // Gestion des agendas
  const {
    agendas,
    selectedAgendaId,
    selectedAgenda,
    createAgenda,
    updateAgenda,
    deleteAgenda,
    duplicateAgenda,
    selectAgenda
  } = useAgendas();

  // Gestion des périodes pour l'agenda sélectionné
  const {
    periods,
    selectedPeriodId,
    createPeriod,
    updatePeriod,
    deletePeriod,
    getPeriodsForDate,
    getSelectedPeriod,
    selectPeriod,
    clearSelection
  } = usePeriods(selectedAgendaId);

  // Affichage des mois dans l'ordre voulu : septembre à décembre, puis janvier à mai
  const availableMonths = [9, 10, 11, 12, 1, 2, 3, 4, 5].filter(m => MONTHS[m]);

  // Carrousel pour les mois
  const MONTHS_VISIBLE = 4;
  const [monthCarouselIndex, setMonthCarouselIndex] = useState(0);
  const maxCarouselIndex = Math.max(0, availableMonths.length - MONTHS_VISIBLE);
  const visibleMonths = availableMonths.slice(monthCarouselIndex, monthCarouselIndex + MONTHS_VISIBLE);

  const handlePrevMonths = () => {
    setMonthCarouselIndex(i => Math.max(0, i - 1));
  };
  const handleNextMonths = () => {
    setMonthCarouselIndex(i => Math.min(maxCarouselIndex, i + 1));
  };

  const handleDateRangeSelect = (range) => {
    if (!selectedAgendaId) {
      alert('Veuillez d\'abord sélectionner ou créer un agenda');
      return;
    }
    setDateRange(range);
    setIsModalOpen(true);
  };

  const handleCreatePeriod = async (periodData) => {
    try {
      await createPeriod(periodData);
      setIsModalOpen(false);
      setSelectedDays([]);
      setDateRange(null);
    } catch (error) {
      console.error('Erreur lors de la création de la période:', error);
      alert('Erreur lors de la création de la période');
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedDays([]);
    setDateRange(null);
  };

  const handleSelectPeriod = (periodId) => {
    selectPeriod(periodId);
  };

  const handleUpdatePeriod = async (periodId, updates) => {
    try {
      await updatePeriod(periodId, updates);
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la période:', error);
    }
  };

  const handleDeletePeriod = async (periodId) => {
    try {
      await deletePeriod(periodId);
    } catch (error) {
      console.error('Erreur lors de la suppression de la période:', error);
    }
  };

  const selectedPeriod = getSelectedPeriod();

  // Fonctions pour navigation mois via le titre du calendrier
  const currentMonthIndex = availableMonths.indexOf(selectedMonth);
  const handlePrevMonth = () => {
    if (currentMonthIndex > 0) {
      setSelectedMonth(availableMonths[currentMonthIndex - 1]);
    }
  };
  const handleNextMonth = () => {
    if (currentMonthIndex < availableMonths.length - 1) {
      setSelectedMonth(availableMonths[currentMonthIndex + 1]);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">
                RFP des grands 🅱️
              </h1>
            </div>
            
            {/* Agenda Selector */}
            <div className="flex items-center">
              <AgendaSelector
                agendas={agendas}
                selectedAgendaId={selectedAgendaId}
                onSelectAgenda={selectAgenda}
                onCreateAgenda={createAgenda}
                onDeleteAgenda={deleteAgenda}
                onDuplicateAgenda={duplicateAgenda}
              />
            </div>

            {/* Month Navigation */}
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500 mr-3">Mois :</span>
              <button
                onClick={handlePrevMonths}
                disabled={monthCarouselIndex === 0}
                className={`px-2 py-1 rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-100 transition-colors ${monthCarouselIndex === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                aria-label="Mois précédents"
              >
                &#8592;
              </button>
              {visibleMonths.map(month => (
                <button
                  key={month}
                  onClick={() => setSelectedMonth(month)}
                  className={`w-24 px-3 py-1 text-sm font-medium rounded-md transition-colors text-ellipsis overflow-hidden whitespace-nowrap ${
                    selectedMonth === month
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {MONTHS[month].name}
                </button>
              ))}
              <button
                onClick={handleNextMonths}
                disabled={monthCarouselIndex === maxCarouselIndex}
                className={`px-2 py-1 rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-100 transition-colors ${monthCarouselIndex === maxCarouselIndex ? 'opacity-50 cursor-not-allowed' : ''}`}
                aria-label="Mois suivants"
              >
                &#8594;
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-12 gap-6 h-[calc(100vh-180px)]">
          {/* Left Panel - Inspector */}
          <div className="col-span-3">
            <PeriodInspector
              selectedPeriod={selectedPeriod}
              onUpdatePeriod={handleUpdatePeriod}
              onClearSelection={clearSelection}
              selectedAgendaId={selectedAgendaId}
            />
          </div>

          {/* Center Panel - Calendar */}
          <div className="col-span-6">
            <Calendar
              selectedMonth={selectedMonth}
              periods={periods}
              getPeriodsForDate={getPeriodsForDate}
              onDateRangeSelect={handleDateRangeSelect}
              selectedDays={selectedDays}
              setSelectedDays={setSelectedDays}
              onPrevMonth={currentMonthIndex > 0 ? handlePrevMonth : undefined}
              onNextMonth={currentMonthIndex < availableMonths.length - 1 ? handleNextMonth : undefined}
            />
          </div>

          {/* Right Panel - Period List */}
          <div className="col-span-3">
            <PeriodList
              periods={periods}
              onSelectPeriod={handleSelectPeriod}
              selectedPeriodId={selectedPeriodId}
              onDeletePeriod={handleDeletePeriod}
              selectedAgendaId={selectedAgendaId}
              agendaName={selectedAgenda?.nom}
            />
          </div>
        </div>
      </main>

      {/* Period Creation Modal */}
      <PeriodModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleCreatePeriod}
        dateRange={dateRange}
      />

      {/* Instructions overlay for first-time users */}
      {showInstructions && agendas.length === 0 && !isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-40 pointer-events-none">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-md mx-4 pointer-events-auto">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 mb-4">
                <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a4 4 0 118 0v4m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Bienvenue dans votre agenda coloré !
              </h3>
              <p className="text-sm text-gray-500 mb-4">
                Pour commencer, créez votre premier agenda en haut de la page, puis sélectionnez des dates sur le calendrier pour créer vos premières périodes colorées.
              </p>
              <button
                onClick={() => setShowInstructions(false)}
                className="w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
              >
                Compris !
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
