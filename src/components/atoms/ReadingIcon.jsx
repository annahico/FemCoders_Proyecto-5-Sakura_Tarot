import React from 'react'
import readingsIconImg from '../../assets/images/ReadingsIcon.svg'

export const ReadingIcon = ({onClick}) => {
  return (
    <div className='z-1 pr-4 sm:pr-10 md:pr-20'>
        <button  className='flex flex-col items-center' onClick={onClick} >
            <img src={readingsIconImg}
                className='size-10 sm:size-14 md:size-20'></img>
            <p className='font-[monserrat] text-[#6A4A4A] p-2 sm:p-3 md:p-5 text-xs sm:text-sm md:text-base text-center'>Lectura de Tarot</p>
        </button>
    </div>
  )
}
