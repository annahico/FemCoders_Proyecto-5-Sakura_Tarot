import React from 'react';

export const Cards = ({ card, isRevealed = false, size = "w-24 h-40" }) => {
  if (!card) return null;

  const frontImage = card.sakuraCard || (card.cards && card.cards.sakuraCard);
  const backImage = card.sakuraReverse || (card.cards && card.cards.sakuraReverse);
  const imageSource = isRevealed
    ? frontImage
    : (backImage || "https://i.ibb.co/XxrvMJ2/Reverso-Sakura.jpg");

  return (
    <div className={`${size} flex items-center justify-center`}>
      <img
        src={imageSource} 
        alt={card.spanishName || "Carta Sakura"}
        className="w-full h-full object-contain rounded-lg shadow-md"
        onError={(e) => {
          e.target.onerror = null; 
          e.target.src = "https://i.ibb.co/XxrvMJ2/Reverso-Sakura.jpg";
        }}
      />
    </div>
  );
};