import React from 'react'
import { Link } from 'react-router-dom'

const ProductCard = ({product}) => {
  return (
    <div className='bg-white shadow-md rounded-md p-4 flex max-sm:flex-col justify-around 
    items-center mb-5'>
        <img src={product.productImage[0][0]} alt="Product_image" width="80px"/>
            <div>
                <h2 className='text-lg font-semibold max-sm:text-center uppercase'>{product.productDesc}</h2>
                <h2 className='text-sm font-semibold max-sm:text-center'>Sponsored By Aamira</h2>
            </div>
            <p className='text-gray-500'>{product.price} TK</p>
            <Link to={`/track/${product._id}`} >
             <button  className='mt-4 text-sm bg-teal-500 hover:bg-teal-600 text-white px-3 py-2 rounded-md'> 
                 Track Order
             </button>   
            </Link> 
    </div>
  )
}

export default ProductCard