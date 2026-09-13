import React from 'react'
import readingsIconImg from '../../assets/images/ReadingsIcon.svg'

export const ReadingIcon = ({onClick}) => {
  return (
    <div className='z-1 pr-4 sm:pr-10 md:pr-20'>
        <button  className='flex flex-col items-center p-2 sm:p-3 md:p-4 bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg' onClick={onClick} >
            <img src={readingsIconImg} alt=""
                className='size-10 sm:size-14 md:size-20'></img>
            <p className='font-[monserrat] text-[#6A4A4A] pt-1 sm:pt-2 text-xs sm:text-sm md:text-base text-center'>Lectura de Tarot</p>
        </button>
    </div>
  )
}
