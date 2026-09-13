import axios from "axios";
import { API_BASE_URL } from "./apiConfig";

export const readingApi = () => {
  const url = `${API_BASE_URL}/readings`;

  const createReadableDate = () => {
    const now = new Date();
    return now.toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  const createReadingObject = (userId, username, cards) => {
    return {
      userId: userId,
      username: username,
      date: createReadableDate(),
      cards: {
        past: cards.past,
        present: cards.present,
        future: cards.future,
      },
    };
  };

  const saveReading = async (userId, username, cards) => {
    try {
      const newReading = createReadingObject(userId, username, cards);
      const response = await axios.post(url, newReading);
      return response.data;
    } catch (error) {
      console.error("Error en saveReading:", error.message);
      throw error;
    }
  };

  const getReadingsByUserId = async (userId) => {
    try {
      const response = await axios.get(`${url}?userId=${userId}`);
      return response.data;
    } catch (error) {
      console.error("Error en getReadingsByUserId:", error.message);
      throw error;
    }
  };

  const getReadingById = async (readingId) => {
    try {
      const response = await axios.get(`${url}/${readingId}`);
      return response.data;
    } catch (error) {
      console.error("Error en getReadingById:", error.message);
      throw error;
    }
  };

  const deleteReading = async (readingId) => {
    try {
      const response = await axios.delete(`${url}/${readingId}`);
      return response.data;
    } catch (error) {
      console.error("Error en deleteReading:", error.message);
      throw error;
    }
  };

  const deleteAllReadings = async (userId) => {
    try {
      const readings = await getReadingsByUserId(userId);

      if (readings.length === 0) return { deleted: 0 };

      const deletePromises = readings.map((reading) => axios.delete(`${url}/${reading.id}`));

      const results = await Promise.allSettled(deletePromises);
      const deleted = results.filter((r) => r.status === "fulfilled").length;

      return { deleted };
    } catch (error) {
      console.error("Error en deleteAllReadings:", error.message);
      throw error;
    }
  };

  return {
    createReadableDate,
    createReadingObject,
    saveReading,
    getReadingsByUserId,
    getReadingById,
    deleteReading,
    deleteAllReadings,
  };
};
