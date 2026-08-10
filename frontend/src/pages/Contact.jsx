import React from 'react'
import Title from '../components/Title'
import { assets } from '../assets/frontend_assets/assets'
import NewsLetterBox from '../components/NewsLetterBox'

const Contact = () => {
  return (
    <div className='animate-in fade-in duration-700'>

      {/* Header Section */}
      <div className='text-center text-2xl pt-10'>
        <Title text1={'CONTACT'} text2={'US'} />
      </div>

      {/* Contact Content Section */}
      <div className='my-10 flex flex-col justify-center md:flex-row gap-16 mb-28'>
        
        {/* Image with subtle shadow/rounded corner */}
        <img 
          className='w-full md:max-w-[480px] rounded-sm shadow-sm' 
          src={assets.contact_img} 
          alt="Our Office" 
        />

        <div className='flex flex-col justify-center items-start gap-8'>
          
          {/* Store Info Group */}
          <div>
            <p className='font-semibold text-xl text-gray-800 tracking-wide mb-4'>Our Store</p>
            <p className='text-gray-500 leading-relaxed'>
              xxxx Ghaziabad <br /> 
              Uttar Pradesh, India 
            </p>
          </div>

          {/* Contact Details Group */}
          <div className='flex flex-col gap-1'>
            <p className='text-gray-500 hover:text-black transition-colors cursor-pointer'>
              <span className='font-medium text-gray-700'>Tel:</span> (+91) 54896xxxxx
            </p>
            <p className='text-gray-500 hover:text-black transition-colors cursor-pointer'>
              <span className='font-medium text-gray-700'>Email:</span> admin@clothesphere.com
            </p>
          </div>

          {/* Careers Section */}
          <div className='pt-4 border-t border-gray-100 w-full'>
            <p className='font-semibold text-xl text-gray-700 tracking-wide mb-3'>Careers at TrendCart</p>
            <p className='text-gray-500 mb-6'>Learn more about our teams and job openings.</p>
            
            <button className='group relative border border-black px-10 py-4 text-sm transition-all duration-500 overflow-hidden'>
              <span className='relative z-10 group-hover:text-white transition-colors duration-500'>Explore Jobs</span>
              <span className='absolute bottom-0 left-0 w-0 h-full bg-black transition-all duration-500 group-hover:w-full'></span>
            </button>
          </div>

        </div>
      </div>

      <NewsLetterBox/>
    </div>
  )
}

export default Contact