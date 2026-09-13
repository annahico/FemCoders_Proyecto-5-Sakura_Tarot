import React, { useContext, useEffect, useState } from 'react';
import { TarotContext } from '../context/TarotContext';
import { useNavigate } from 'react-router-dom';
import { readingApi } from '../services/readingApi';
import { AlertDisplay } from '../components/molecules/AlertDisplay';

const readings = readingApi();

export function HistoryPage() {
  const { history, setHistory, isLoadingHistory } = useContext(TarotContext);
  const navigate = useNavigate();
  const [alertMessage, setAlertMessage] = useState("");
  const [selectedReading, setSelectedReading] = useState(null);

  useEffect(() => {
    if (alertMessage) {
      const timer = setTimeout(() => setAlertMessage(""), 2000);
      return () => clearTimeout(timer);
    }
  }, [alertMessage]);

  const handleDeleteOne = async (id, event) => {
    event.stopPropagation();
    try {
      await readings.deleteReading(id);
      setHistory(prev => prev.filter(item => item.id !== id));
      if (selectedReading?.id === id) setSelectedReading(null);
      setAlertMessage("Lectura eliminada");
    } catch (error) {
      console.error("Error al borrar:", error);
      setAlertMessage("No se pudo eliminar la lectura. Inténtalo de nuevo.");
    }
  };

  const handleClearAll = async () => {
    // window.confirm se mantiene aquí a propósito: es una acción destructiva
    // irreversible y los componentes Alert/AlertDisplay del proyecto son solo
    // informativos (no tienen botones de confirmar/cancelar).
    if (window.confirm("¿Estás seguro de que quieres borrar todo el historial?")) {
      try {
        const deletePromises = history.map((item) => readings.deleteReading(item.id));
        await Promise.allSettled(deletePromises);
        setHistory([]);
        setAlertMessage("Historial eliminado");
      } catch (error) {
        console.error("Error al limpiar historial:", error);
        setAlertMessage("No se pudo limpiar el historial. Inténtalo de nuevo.");
      }
    }
  };

  return (
    <div
      className="min-h-screen w-full flex flex-col items-center p-4 md:p-10"
    >
      {alertMessage && <AlertDisplay message={alertMessage} />}
      <div className="w-full max-w-6xl rounded-3xl bg-white/40 backdrop-blur-xl shadow-2xl p-6 md:p-10 overflow-y-auto max-h-[90vh]">
        
        <header className="sticky top-0 z-20 -mx-6 md:-mx-10 px-6 md:px-10 py-3 mb-8 bg-white/40 backdrop-blur-xl rounded-b-2xl flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-center md:text-left">
            <h1 className="text-2xl md:text-3xl font-bold text-pink-900">El Amanecer Mágico</h1>
            <p className="text-sm text-pink-700 italic">Tu cronología mística</p>
          </div>

          <button
            onClick={() => navigate('/')}
            aria-label="Volver al inicio"
            title="Volver al inicio"
            className="bg-white/60 p-3 rounded-full shadow-lg hover:scale-110 transition-transform text-2xl"
          >
            ⭐
          </button>
        </header>

        {isLoadingHistory ? (
          <p className="text-center text-pink-800 py-20 italic text-lg">✨ Cargando tu historial...</p>
        ) : history.length === 0 ? (
          <p className="text-center text-pink-800 py-20 italic text-lg">No tienes lecturas guardadas.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {history.map((item) => (
              <div
                key={item.id}
                onClick={() => setSelectedReading(item)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && setSelectedReading(item)}
                className="bg-white/60 rounded-2xl p-5 shadow-md border border-white/50 flex flex-col justify-between hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer"
              >

                <div className="grid grid-cols-3 gap-2 mb-4 text-center">
                  {['past', 'present', 'future'].map((time) => (
                    <div key={time} className="flex flex-col items-center">
                      <p className="text-[10px] md:text-xs text-pink-800 mb-1 font-bold uppercase">
                        {time === 'past' ? 'Pasado' : time === 'present' ? 'Presente' : 'Futuro'}
                      </p>
                      {item.cards[time] ? (
                        <img 
                          src={item.cards[time].sakuraCard}
                          alt={item.cards[time].spanishName}
                          className="h-24 w-full object-cover rounded-lg shadow-sm border border-pink-100"
                        />
                      ) : (
                        <div className="h-24 w-full bg-pink-100 rounded-lg border-2 border-dashed border-pink-200" />
                      )}
                    </div>
                  ))}
                </div>

                <div className="border-t border-pink-200/50 pt-3 mt-auto">
                  <div className="flex items-center justify-between text-xs text-pink-900 font-medium">
                    <span>{item.date}</span>
                    <button
                      onClick={(e) => handleDeleteOne(item.id, e)}
                      aria-label="Eliminar lectura"
                      title="Eliminar lectura"
                      className="bg-red-100/50 p-2 rounded-full text-red-600 hover:bg-red-500 hover:text-white transition-colors"
                    >
                      🗑️
                    </button>
                  </div>
                  <p className="text-[10px] text-pink-700 mt-1 uppercase font-bold tracking-tighter">
                    Consultante: {item.username || 'Anónimo'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {history.length > 0 && (
          <div className="flex justify-center mt-10">
            <button 
              onClick={handleClearAll}
              className="px-10 py-3 rounded-full bg-pink-800 text-white font-bold shadow-lg hover:bg-pink-900 transition-colors uppercase tracking-widest text-sm"
            >
              🧹 Limpiar historial
            </button>
          </div>
        )}
      </div>

      {selectedReading && (
        <div
          className="fixed inset-0 z-30 bg-black/50 flex items-center justify-center p-4"
          onClick={() => setSelectedReading(null)}
        >
          <div
            className="w-full max-w-4xl max-h-[85vh] overflow-y-auto bg-[#fde8EE] rounded-3xl p-6 md:p-10 shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedReading(null)}
              aria-label="Cerrar"
              title="Cerrar"
              className="absolute top-4 right-4 bg-white/60 w-9 h-9 rounded-full shadow-lg hover:scale-110 transition-transform text-lg"
            >
              ✕
            </button>

            <h2 className="text-xl md:text-2xl font-bold text-pink-900 text-center mb-1">Tu lectura del {selectedReading.date}</h2>
            <p className="text-center text-sm text-pink-700 italic mb-8">Consultante: {selectedReading.username || 'Anónimo'}</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10">
              {['past', 'present', 'future'].map((tiempo) => {
                const card = selectedReading.cards[tiempo];
                const labels = { past: 'Pasado', present: 'Presente', future: 'Futuro' };
                if (!card) return null;
                return (
                  <div key={tiempo} className="bg-white/50 backdrop-blur-xl p-5 sm:p-6 rounded-2xl border border-white/60 flex flex-col items-center shadow-lg">
                    <span className="text-[#880E4F] text-xs uppercase tracking-[0.3em] mb-4 font-semibold">
                      ✦ {labels[tiempo]}
                    </span>
                    <img
                      src={card.sakuraCard}
                      alt={card.spanishName}
                      className="w-32 h-48 object-cover rounded-lg shadow-md mb-4"
                    />
                    <h3 className="text-[#880E4F] font-serif text-lg mb-2 text-center">{card.spanishName}</h3>
                    <p className="text-[#880E4F]/90 text-[13px] text-center leading-relaxed italic px-2">
                      {card.meaning}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}