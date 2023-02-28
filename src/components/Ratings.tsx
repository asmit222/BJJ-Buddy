import React from 'react'

interface Props {
  rating: number
}

const Ratings: React.FC<Props> = ({ rating }) => {
  return (
    <span className='star-icons'>
      {[...Array(Math.trunc(Number(rating)))].map((_, index) => (
        <i key={index} className='fas fa-star fa-star10'></i>
      ))}
      {Number(rating) % 1 >= 0.25 && Number(rating) % 1 <= 0.7 && (
        <i className='fas fa-star-half fa-star10'></i>
      )}
      {Number(rating) % 1 >= 0.71 && <i className='fas fa-star fa-star10'></i>}
    </span>
  )
}

export default Ratings
