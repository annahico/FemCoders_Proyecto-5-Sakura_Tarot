import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTarot } from '../../context/TarotContext';
import { Cards } from '../atoms/Cards';

export const CardReading = () => {
  const { deck, selectedCards, handleSelect, revealReading, isRevealed, isLoadingDeck, saveReading } = useTarot();
  const navigate = useNavigate();
  const [isSaving, setIsSaving] = useState(false);
  const [hasSaved, setHasSaved] = useState(false);

  // A new reading resets isRevealed to false (see revealReading in
  // TarotProvider), so use that to also reset the "already saved" flag.
  useEffect(() => {
    if (!isRevealed) setHasSaved(false);
  }, [isRevealed]);

  const handleSaveReading = async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      navigate("/login");
      return;
    }
    setIsSaving(true);
    try {
      await saveReading(user.id, user.username);
      setHasSaved(true);
    } catch {
      // saveReading already surfaces an error message via TarotProvider's alert
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoadingDeck) return <p className="text-[#880E4F]">✨ Cargando mazo mágico...</p>;
  if (!deck || deck.length === 0) return <p className="text-[#880E4F]">No se pudo cargar el mazo. Inténtalo de nuevo más tarde.</p>;

  return (
    <div className="w-full max-w-6xl flex flex-col items-center gap-8 md:gap-12 relative px-2 sm:px-4">

      <div className="w-full flex justify-end px-2 sm:px-6 md:px-10">
        <button
          onClick={() => navigate('/')}
          aria-label="Volver al Inicio"
          title="Volver al Inicio"
          className="bg-white/40 p-3 rounded-full text-2xl hover:scale-125 transition-transform shadow-lg border border-white/50"
        >
          ⭐
        </button>
      </div>

      <div className="bg-white/10 backdrop-blur-md rounded-[40px] p-4 sm:p-6 md:p-10 border border-white/20 shadow-2xl w-full">
        <p className="text-[#880E4F] mb-8 mx-auto w-fit bg-white/90 backdrop-blur-sm rounded-full px-4 sm:px-6 py-2 text-center font-medium italic shadow">
          Elige 3 cartas para conocer tu destino:
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-x-3 sm:gap-x-4 md:gap-x-6 gap-y-6 sm:gap-y-8 md:gap-y-10 justify-items-center max-w-4xl mx-auto">
          {deck.slice(0, 10).map((card) => (
            <div
              key={card.id}
              onClick={() => handleSelect(card)}
              className={`cursor-pointer transition-all duration-300 ${
                selectedCards.find(c => c.id === card.id)
                ? 'opacity-20 scale-90 pointer-events-none'
                : 'hover:-translate-y-2'
              }`}
            >
              <Cards card={card} isRevealed={false} />
            </div>
          ))}
        </div>

        <div className="flex flex-wrap justify-center items-center mt-10 gap-4 sm:gap-6">
          <button
            onClick={revealReading}
            disabled={selectedCards.length < 3 && !isRevealed}
            className={`px-6 sm:px-8 md:px-10 py-2 rounded-full uppercase text-[10px] tracking-[0.2em] transition-all border
              ${(selectedCards.length === 3 || isRevealed)
                ? 'bg-[#F48FB1]/40 border-[#880E4F]/30 text-[#880E4F] hover:bg-[#F48FB1]/60'
                : 'bg-gray-300/20 border-gray-400/30 text-gray-500 cursor-not-allowed'}`}
          >
            {isRevealed ? 'Nueva Lectura' : '✨ Revelar Destino'}
          </button>

          <button
            onClick={() => navigate('/history')}
            className="px-6 sm:px-8 py-2 rounded-full uppercase text-[10px] tracking-[0.2em] transition-all border border-[#880E4F]/30 bg-white/10 text-[#880E4F] hover:bg-white/30 flex items-center gap-2 shadow-sm"
          >
            📜 Historial
          </button>
        </div>
      </div>

      {isRevealed && selectedCards.length === 3 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10 w-full mt-10 animate-fade-in pb-20">
          {['past', 'present', 'future'].map((tiempo, index) => {
            const card = selectedCards[index];
            const labels = { past: 'Pasado', present: 'Presente', future: 'Futuro' };
            return (
              <div key={tiempo} className="bg-white/15 backdrop-blur-xl p-5 sm:p-6 md:p-8 rounded-t-[80px] sm:rounded-t-[100px] md:rounded-t-[120px] border-t border-x border-white/40 flex flex-col items-center shadow-lg">
                <span className="text-[#880E4F] text-xs uppercase tracking-[0.3em] mb-8 font-semibold">
                  ✦ {labels[tiempo]}
                </span>
                <div className="scale-110 mb-6">
                  <Cards card={card} isRevealed={true} />
                </div>
                <h3 className="text-[#880E4F] font-serif text-xl mb-3">{card.spanishName}</h3>
                <p className="text-[#880E4F]/90 text-[13px] text-center leading-relaxed italic px-2">
                  {card.meaning}
                </p>
              </div>
            );
          })}
        </div>
      )}

      {isRevealed && selectedCards.length === 3 && (
        <div className="flex justify-center -mt-6 pb-4">
          <button
            onClick={handleSaveReading}
            disabled={isSaving || hasSaved}
            className={`px-10 py-2 rounded-full uppercase text-[10px] tracking-[0.2em] transition-all border
              ${hasSaved
                ? 'bg-green-100/40 border-green-700/30 text-green-800 cursor-default'
                : 'bg-[#F48FB1]/40 border-[#880E4F]/30 text-[#880E4F] hover:bg-[#F48FB1]/60'}
              disabled:cursor-not-allowed`}
          >
            {hasSaved ? '✓ Lectura guardada' : isSaving ? 'Guardando...' : '💾 Guardar Lectura'}
          </button>
        </div>
      )}
    </div>
  );
};