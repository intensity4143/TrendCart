import React from 'react'
import Title from '../components/Title'
import { assets } from '../assets/frontend_assets/assets'
import NewsLetterBox from '../components/NewsLetterBox'

const About = () => {
  return (
    <div className='animate-in fade-in duration-700'>
      
      <div className='text-2xl text-center pt-10'>
        <Title text1={'ABOUT'} text2={'TRENDCART'} />
      </div>

      <div className='my-12 flex flex-col md:flex-row gap-16 items-center'>
        <div className='w-full md:max-w-[450px] overflow-hidden rounded-sm shadow-sm'>
             <img 
                className='w-full hover:scale-105 transition-transform duration-500' 
                src={assets.about_img} 
                alt="About TrendCart" 
            />
        </div>
        
        <div className='flex flex-col justify-center gap-8 md:w-2/4 text-gray-600 leading-relaxed'>
          <p>
            TrendCart was founded on a simple premise: fashion moves fast, and you should too. We are dedicated to bringing the latest global styles directly to your screen, ensuring that "Shop the Trend" is more than just a slogan—it's a lifestyle.
          </p>

          <p>
            Our team of curators scours the fashion landscape to find pieces that define the moment. Whether you're looking for timeless essentials or the latest viral looks, TrendCart provides a platform where quality meets the cutting edge of design.
          </p>

          <div className='border-l-4 border-gray-800 pl-4'>
            <b className='text-gray-800 text-lg block mb-2'>Our Mission</b>
            <p>To redefine the digital shopping experience by providing instant access to emerging trends with uncompromising quality and a seamless user journey.</p>
          </div>
        </div>
      </div>

      <div className='text-2xl py-8'>
        <Title text1={'WHY'} text2={'CHOOSE US'} />
      </div>

      <div className='flex flex-col md:flex-row text-sm mb-24'>
        <div className='border border-gray-100 px-10 md:px-16 py-12 sm:py-20 flex flex-col gap-5 hover:bg-gray-800 hover:text-white transition-all duration-300 group'>
          <b className='text-gray-800 group-hover:text-white uppercase tracking-widest'>Trend-First Curation:</b>
          <p className='text-gray-600 group-hover:text-gray-300'>We don't just sell clothes; we sell the current movement. Our catalog is updated constantly to reflect what's happening in fashion right now.</p>
        </div>

        <div className='border border-gray-100 px-10 md:px-16 py-12 sm:py-20 flex flex-col gap-5 hover:bg-gray-800 hover:text-white transition-all duration-300 group'>
          <b className='text-gray-800 group-hover:text-white uppercase tracking-widest'>Seamless Shopping:</b>
          <p className='text-gray-600 group-hover:text-gray-300'>From lightning-fast browsing to a secure, one-click checkout, TrendCart is built for the modern shopper who values time and style.</p>
        </div>

        <div className='border border-gray-100 px-10 md:px-16 py-12 sm:py-20 flex flex-col gap-5 hover:bg-gray-800 hover:text-white transition-all duration-300 group'>
          <b className='text-gray-800 group-hover:text-white uppercase tracking-widest'>Customer Priority:</b>
          <p className='text-gray-600 group-hover:text-gray-300'>Your style journey is our priority. Our dedicated support team ensures that your experience with TrendCart is nothing short of exceptional.</p>
        </div>
      </div>

      <NewsLetterBox/>
      
    </div>
  )
}

export default About