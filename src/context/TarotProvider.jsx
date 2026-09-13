import { useState, useEffect, useCallback } from 'react';
import { TarotContext } from './TarotContext';
import { sakuraApi } from '../services/sakuraApi';
import { readingApi } from '../services/readingApi';
import { AlertDisplay } from '../components/molecules/AlertDisplay';

const api = sakuraApi();
const readings = readingApi();

export const TarotProvider = ({ children }) => {
    const [deck, setDeck] = useState([]);
    const [selectedCards, setSelectedCards] = useState([]);
    const [isRevealed, setIsRevealed] = useState(false);
    const [history, setHistory] = useState([]);
    const [isLoadingDeck, setIsLoadingDeck] = useState(true);
    const [isLoadingHistory, setIsLoadingHistory] = useState(true);
    const [alertMessage, setAlertMessage] = useState("");

    useEffect(() => {
        if (alertMessage) {
            const timer = setTimeout(() => setAlertMessage(""), 2000);
            return () => clearTimeout(timer);
        }
    }, [alertMessage]);

    const initGame = useCallback(async () => {
        setIsLoadingDeck(true);
        try {
            const cards = await api.getRandomCards(10);
            setDeck(cards);
        } catch (error) {
            console.error("Error cargando cartas:", error);
            setAlertMessage("No se pudieron cargar las cartas. Inténtalo de nuevo más tarde.");
        } finally {
            setIsLoadingDeck(false);
        }
    }, []);

    const fetchHistory = useCallback(async () => {
        setIsLoadingHistory(true);
        try {
            const user = JSON.parse(localStorage.getItem("user"));
            if (!user) {
                setHistory([]);
                return;
            }
            const userReadings = await readings.getReadingsByUserId(user.id);
            setHistory(userReadings);
        } catch (error) {
            console.error("Error cargando historial:", error);
            setAlertMessage("No se pudo cargar el historial. Inténtalo de nuevo más tarde.");
        } finally {
            setIsLoadingHistory(false);
        }
    }, []);

    useEffect(() => {
        let isMounted = true;
        const loadInitialData = async () => {
            try {
                await Promise.all([fetchHistory(), initGame()]);
            } catch (error) {
                if (isMounted) console.error("Error al cargar datos iniciales:", error);
            }
        };
        loadInitialData();
        return () => { isMounted = false; };
    }, [fetchHistory, initGame]);

    const saveReading = async (userId, username) => {
        try {
            const cards = {
                past: selectedCards[0],
                present: selectedCards[1],
                future: selectedCards[2]
            };
            const savedReading = await readings.saveReading(userId, username, cards);
            setHistory(prev => [...prev, savedReading]);
            setAlertMessage("✨ Lectura guardada en el historial mágico");
            return savedReading;
        } catch (error) {
            console.error("Error en saveReading:", error.message);
            setAlertMessage("No se pudo guardar la lectura. Inténtalo de nuevo.");
            throw error;
        }
    };

    const handleSelect = (card) => {
        if (!isRevealed && selectedCards.length < 3 && !selectedCards.find(c => c.id === card.id)) {
            setSelectedCards([...selectedCards, card]);
        }
    };

    const revealReading = () => {
        if (isRevealed) {
            setSelectedCards([]);
            setIsRevealed(false);
            initGame();
        } else {
            if (selectedCards.length === 3) setIsRevealed(true);
        }
    };

    const getCardLabel = (id) => {
        const index = selectedCards.findIndex(c => c.id === id);
        if (index === 0) return "Pasado";
        if (index === 1) return "Presente";
        if (index === 2) return "Futuro";
        return null;
    };

    return (
        <TarotContext.Provider value={{
            deck, selectedCards, isRevealed, history,
            isLoadingDeck, isLoadingHistory,
            setHistory, handleSelect, revealReading, getCardLabel, saveReading
        }}>
            {alertMessage && <AlertDisplay message={alertMessage} />}
            {children}
        </TarotContext.Provider>
    );
};
