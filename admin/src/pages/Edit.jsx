import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { assets } from '../assets/assets'
import { backendUrl } from '../App'
import axios from 'axios'
import { toast } from 'react-toastify'

const Edit = ({ token }) => {
  const { id } = useParams()
  const navigate = useNavigate()

  const [image1, setImage1] = useState(false)
  const [image2, setImage2] = useState(false)
  const [image3, setImage3] = useState(false)
  const [image4, setImage4] = useState(false)

  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [detailedDescription, setDetailedDescription] = useState('')
  const [price, setPrice] = useState('')
  const [category, setCategory] = useState('Men')
  const [subCategory, setSubCategory] = useState('Topwear')
  const [bestseller, setBestseller] = useState(false)
  const [sizes, setSizes] = useState([])
  const [existingImages, setExistingImages] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await axios.get(`${backendUrl}/api/product/single/${id}`)
        if (data.success) {
          const p = data.product
          setName(p.name)
          setDescription(p.description)
          setDetailedDescription(p.detailedDescription || '')
          setPrice(p.price)
          setCategory(p.category)
          setSubCategory(p.subCategory)
          setBestseller(p.bestseller)
          setSizes(p.sizes)
          setExistingImages(p.image)
        } else {
          toast.error(data.message)
        }
      } catch (error) {
        toast.error(error.message)
      }
    }
    fetchProduct()
  }, [id])

  const onSubmitHandler = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const formData = new FormData()
      formData.append('name', name)
      formData.append('description', description)
      formData.append('detailedDescription', detailedDescription)
      formData.append('price', price)
      formData.append('category', category)
      formData.append('subCategory', subCategory)
      formData.append('bestseller', bestseller)
      formData.append('sizes', JSON.stringify(sizes))

      image1 && formData.append('image1', image1)
      image2 && formData.append('image2', image2)
      image3 && formData.append('image3', image3)
      image4 && formData.append('image4', image4)

      const { data } = await axios.put(`${backendUrl}/api/product/update/${id}`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (data.success) {
        toast.success(data.message)
        navigate('/list')
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message)
    } finally {
      setLoading(false)
    }
  }

  const imageSlots = [
    { state: image1, set: setImage1, id: 'eimage1', existing: existingImages[0] },
    { state: image2, set: setImage2, id: 'eimage2', existing: existingImages[1] },
    { state: image3, set: setImage3, id: 'eimage3', existing: existingImages[2] },
    { state: image4, set: setImage4, id: 'eimage4', existing: existingImages[3] },
  ]

  return (
    <form onSubmit={onSubmitHandler} className='flex flex-col w-full items-start gap-3'>
      <p className='text-lg font-medium'>Edit Product</p>

      <div>
        <p className='mb-2'>Images <span className='text-gray-400 text-xs'>(upload new to replace existing)</span></p>
        <div className='flex gap-2'>
          {imageSlots.map(({ state, set, id: slotId, existing }) => (
            <label key={slotId} htmlFor={slotId}>
              <img
                className='w-20 object-cover'
                src={state ? URL.createObjectURL(state) : existing || assets.upload_area}
                alt=''
              />
              <input onChange={(e) => set(e.target.files[0])} type='file' id={slotId} hidden />
            </label>
          ))}
        </div>
      </div>

      <div className='w-full'>
        <p className='mb-2'>Product name</p>
        <input value={name} onChange={(e) => setName(e.target.value)}
          className='w-full max-w-[500px] px-3 py-2' type='text' required />
      </div>

      <div className='w-full'>
        <p className='mb-2'>Product Description <span className='text-gray-400 text-xs'>(short — shown under product title)</span></p>
        <textarea value={description} onChange={(e) => setDescription(e.target.value)}
          className='w-full max-w-[500px] px-3 py-2' required />
      </div>

      <div className='w-full'>
        <p className='mb-2'>Detailed Description <span className='text-gray-400 text-xs'>(shown in Description tab on product page)</span></p>
        <textarea value={detailedDescription} onChange={(e) => setDetailedDescription(e.target.value)}
          className='w-full max-w-[500px] px-3 py-2' rows={6} />
      </div>

      <div className='flex flex-col sm:flex-row gap-2 w-full sm:gap-8'>
        <div>
          <p className='mb-2'>Product Category</p>
          <select value={category} onChange={(e) => setCategory(e.target.value)} className='w-full px-3 py-2'>
            <option value='Men'>Men</option>
            <option value='Women'>Women</option>
            <option value='Kids'>Kids</option>
          </select>
        </div>
        <div>
          <p className='mb-2'>Sub Category</p>
          <select value={subCategory} onChange={(e) => setSubCategory(e.target.value)} className='w-full px-3 py-2'>
            <option value='Topwear'>Topwear</option>
            <option value='Bottomwear'>Bottomwear</option>
            <option value='Winterwear'>Winterwear</option>
          </select>
        </div>
        <div>
          <p className='mb-2'>Product Price</p>
          <input value={price} onChange={(e) => setPrice(e.target.value)}
            className='w-full px-3 py-2 sm:w-[120px]' type='number' required />
        </div>
      </div>

      <div>
        <p className='mb-2'>Product Sizes</p>
        <div className='flex gap-3'>
          {['S', 'M', 'L', 'XL', 'XXL'].map((s) => (
            <div key={s} onClick={() => setSizes(prev => prev.includes(s) ? prev.filter(i => i !== s) : [...prev, s])}>
              <p className={`${sizes.includes(s) ? 'bg-blue-600 text-white' : 'bg-slate-200'} px-3 py-1 cursor-pointer`}>{s}</p>
            </div>
          ))}
        </div>
      </div>

      <div className='flex gap-2 mt-2'>
        <input checked={bestseller} onChange={() => setBestseller(prev => !prev)} type='checkbox' id='bestseller' />
        <label className='cursor-pointer' htmlFor='bestseller'>Add to Bestseller</label>
      </div>

      <button disabled={loading} className='w-28 py-3 mt-4 bg-black text-white' type='submit'>
        {loading ? 'SAVING...' : 'SAVE'}
      </button>
    </form>
  )
}

export default Edit
