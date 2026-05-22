import React from 'react'

const Title = ({ title1, title2 ,subTitle }) => {
  return (
    <div className='text-center'>
       <h1 className='text-black font-semibold  sm:text-4xl text-2xl text-center'>{title1} <span className='text-primary'>{title2}</span></h1>
       <p className='text-gray-500 text-md text-center mt-3'>{subTitle}</p>
    </div>
  )
}

export default Title
