import { useState } from 'react'
import { assets } from '../assets/assets'
import { backendUrl } from '../App'
import axios from 'axios'
import { toast } from 'react-toastify'

const Add = ({token}) => {
  const [image1, setImage1] = useState(false)
  const [image2, setImage2] = useState(false)
  const [image3, setImage3] = useState(false)
  const [image4, setImage4] = useState(false)

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [detailedDescription, setDetailedDescription] = useState("");
  const [price, setPrice] = useState("")
  const [category, setCategory] = useState("Men");
  const [subCategory, setSubCategory] = useState("Topwear")
  const [bestseller, setBestseller] = useState(false);
  const [sizes, setSizes] = useState([]);

  const [loading, setLoading] = useState(false);

  const onSubmitHandler = async(e)=>{
    try {
        e.preventDefault();
        setLoading(true)

        const formData = new FormData()

        formData.append("name", name)
        formData.append("description", description)
        formData.append("detailedDescription", detailedDescription)
        formData.append("price", price)
        formData.append("category", category)
        formData.append("subCategory", subCategory)
        formData.append("bestseller", bestseller)
        formData.append("sizes", JSON.stringify(sizes))

        image1 && formData.append("image1", image1)
        image2 && formData.append("image2", image2)
        image3 && formData.append("image3", image3)
        image4 && formData.append("image4", image4)

        const response = await axios.post(`${backendUrl}/api/product/add`, 
          formData
          ,{ headers: { Authorization: `Bearer ${token}` } }
        )

        if(response.data.success){
          toast.success(response.data.message)
          setName('')
          setDescription('')
          setDetailedDescription('')
          setImage1(false)
          setImage2(false)
          setImage3(false)
          setImage4(false)
          setPrice('')
        }
        else{
          toast.error(response.data.message)
        }
    } 
    catch (error) {
        toast.error(error.response.data.message)
    }
    finally{
      setLoading(false)
    }

  }

  return (
    <form onSubmit={onSubmitHandler} 
      className='flex flex-col w-full items-start gap-3'>

        <div>
            <p className='mb-2'>Upload Image</p>

            {/* field for image uploads */}
            <div className='flex gap-2'>

              <label htmlFor="image1">

                <img 
                  className='w-20' 
                  src={!image1 ? 
                    assets.upload_area : 
                    URL.createObjectURL(image1)} 
                  alt="" />

                <input onChange={(e)=>setImage1(e.target.files[0])} 
                  type="file" id='image1' hidden />
              </label>

              <label htmlFor="image2">
                <img 
                  className='w-20' 
                  src={!image2 ? 
                    assets.upload_area : 
                    URL.createObjectURL(image2)} 
                  alt="" />
                <input onChange={(e)=>setImage2(e.target.files[0])} 
                  type="file" id='image2'hidden />
              </label>

              <label htmlFor="image3">

                <img 
                  className='w-20' 
                  src={!image3 ? 
                    assets.upload_area : 
                    URL.createObjectURL(image3)} 
                  alt="" />

                <input onChange={(e)=>setImage3(e.target.files[0])} 
                  type="file" id='image3' hidden />
              </label>

              <label htmlFor="image4">

                <img 
                  className='w-20' 
                  src={!image4 ? 
                    assets.upload_area : 
                    URL.createObjectURL(image4)} 
                  alt="" />

                <input onChange={(e)=>setImage4(e.target.files[0])} 
                  type="file" id='image4' hidden />
              </label>

            </div>
        </div>

        {/* product name */}
        <div className='w-full'>
          <p className='mb-2'>Product name</p>
          <input
            value={name}
            onChange={(e)=>setName(e.target.value)} 
            className='w-full max-w-[500px] px-3 py-2' type="text" placeholder='Type here' required/>
        </div>

        {/* product description */}
        <div className='w-full'>
          <p className='mb-2'>Product Description <span className='text-gray-400 text-xs'>(short — shown under product title)</span></p>
          <textarea
            value={description}
            onChange={(e)=>setDescription(e.target.value)}
            className='w-full max-w-[500px] px-3 py-2' type="text" placeholder='Write Description here' required/>
        </div>

        {/* detailed description */}
        <div className='w-full'>
          <p className='mb-2'>Detailed Description <span className='text-gray-400 text-xs'>(shown in Description tab on product page)</span></p>
          <textarea
            value={detailedDescription}
            onChange={(e)=>setDetailedDescription(e.target.value)}
            className='w-full max-w-[500px] px-3 py-2'
            placeholder='Write detailed product description — material, fit, care instructions, etc.'
            rows={6}
          />
        </div>

        <div className='flex flex-col sm:flex-row gap-2 w-full sm:gap-8'>

          {/* category */}
          <div>
            <p className='mb-2'>Product Category</p>
            <select onChange={(e)=> setCategory(e.target.value)} 
              className='w-full px-3 py-2'>
              <option value="Men">Men</option>
              <option value="Women">Women</option>
              <option value="Kids">Kids</option>
            </select>
          </div>

          {/* subCategory */}
          <div>
            <p className='mb-2'>Sub Category</p>
            <select onChange={(e)=>setSubCategory(e.target.value)} 
              className='w-full px-3 py-2'>
              <option value="Topwear">Topwear</option>
              <option value="Bottomwear">Bottomwear</option>
              <option value="Winterwear">Winterwear</option>
            </select>
          </div>

          {/* product price */}
          <div>
            <p className='mb-2'>Product Price</p>
            <input 
              value={price}
              onChange={(e)=>setPrice(e.target.value)}
              className='w-full px-3 py-2 sm:w-[120px]' 
              type="Number" placeholder='25' required />
          </div>
        </div>

        {/* sizes */}
        <div>
          <p className='mb-2'>Product Sizes</p>
          <div className='flex gap-3'>

            <div onClick={()=>setSizes(prev => prev.includes("S")? prev.filter(item => item !== 'S') : [...prev, "S"])}>
              <p className={`${sizes.includes("S")? "bg-blue-600 text-white" : "bg-slate-200"} px-3 py-1 cursor-pointer`}>S</p>
            </div>
            
            <div onClick={()=>setSizes(prev => prev.includes("M")? prev.filter(item => item !== 'M') : [...prev, "M"])}>
              <p className={`${sizes.includes("M")? "bg-blue-600 text-white" : "bg-slate-200"} px-3 py-1 cursor-pointer`}>M</p>
            </div>

            <div onClick={()=>setSizes(prev => prev.includes("L")? prev.filter(item => item !== 'L') : [...prev, "L"])}>
              <p className={`${sizes.includes("L")? "bg-blue-600 text-white" : "bg-slate-200"} px-3 py-1 cursor-pointer`}>L</p>
            </div>

            <div onClick={()=>setSizes(prev => prev.includes("XL")? prev.filter(item => item !== 'XL') : [...prev, "XL"])}>
              <p className={`${sizes.includes("XL")? "bg-blue-600 text-white" : "bg-slate-200"} px-3 py-1 cursor-pointer`}>XL</p>
            </div>

            <div onClick={()=>setSizes(prev => prev.includes("XXL")? prev.filter(item => item !== 'XXL') : [...prev, "XXL"])}>
              <p className={`${sizes.includes("XXL")? "bg-blue-600 text-white" : "bg-slate-200"} px-3 py-1 cursor-pointer`}>XXL</p>
            </div>

          </div>
        </div>

        <div className='flex gap-2 mt-2'>
          <input
            checked = {bestseller} 
            onChange={()=> setBestseller(prev => !prev)} 
            type="checkbox" id='bestseller' />
          <label
            className='cursor-pointer' 
            htmlFor="bestseller">Add to Bestseller</label>
        </div>

        <button
          disabled = {loading}
          className='w-28 py-3 mt-4 bg-black text-white' 
          type='submit '>{loading? "ADDING..":"ADD"}</button>
    </form>
  )
}

export default Add
