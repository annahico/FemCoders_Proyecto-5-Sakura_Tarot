import React from 'react'
import historyIconImg from '../../assets/images/HistoryIcon.svg'

export const HistoryIcon = ({onClick}) => {
  return (
    <div className='z-1 pl-4 sm:pl-10 md:pl-20'>
        <button className='flex flex-col items-center' onClick={onClick}>
            <img src={historyIconImg} alt="Book Icon"
                className='size-10 sm:size-14 md:size-20'></img>
            <p className='font-[monserrat] text-[#6A4A4A] p-2 sm:p-3 md:p-5 text-xs sm:text-sm md:text-base text-center'>Historial de Lecturas</p>
        </button>
    </div>
  )
}
