import React from 'react'
import logoImg from '../../assets/images/LogoSolyLuna.webp'

export const Logo = () => {
  return (
    <div className='z-1 size-28 sm:size-40 md:size-56 lg:size-72'>
        <img src={logoImg} alt="Logo Sol y Luna" className="w-full h-full object-contain" />
    </div>
  )
}



