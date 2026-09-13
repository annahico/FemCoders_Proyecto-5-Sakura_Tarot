import { useNavigate } from 'react-router-dom';

export const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full text-center px-4 gap-4">
      <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-lg px-8 py-10 flex flex-col items-center gap-4">
        <h1 className="text-3xl font-bold text-[#880E4F]">🔮 Esta página no existe</h1>
        <p className="text-[#6A4A4A]">Las cartas no han encontrado nada en este camino.</p>
        <button
          onClick={() => navigate('/')}
          className="mt-2 px-8 py-3 rounded-full uppercase text-sm sm:text-base font-semibold tracking-wide border-2 bg-[#880E4F] border-[#880E4F] text-white hover:bg-[#6d0b3e] transition-all shadow-md"
        >
          ⭐ Volver al inicio
        </button>
      </div>
    </div>
  );
};
