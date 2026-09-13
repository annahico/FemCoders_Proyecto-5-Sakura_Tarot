import React from 'react'
import historyIconImg from '../../assets/images/HistoryIcon.svg'

export const HistoryIcon = ({onClick}) => {
  return (
    <div className='z-1 pl-4 sm:pl-10 md:pl-20'>
        <button className='flex flex-col items-center p-2 sm:p-3 md:p-4 bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg' onClick={onClick}>
            <img src={historyIconImg} alt=""
                className='size-10 sm:size-14 md:size-20'></img>
            <p className='font-[monserrat] text-[#6A4A4A] pt-1 sm:pt-2 text-xs sm:text-sm md:text-base text-center'>Historial de Lecturas</p>
        </button>
    </div>
  )
}
