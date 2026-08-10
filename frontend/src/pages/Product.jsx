import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import { assets } from "../assets/frontend_assets/assets";
import RelatedProducts from "../components/RelatedProducts";
import { toast } from "react-toastify";
import axios from "axios";

const REVIEWS = [
  { name: 'Alex M.', rating: 5, date: 'Jan 2025', comment: 'Absolutely love the quality! Fits perfectly and the fabric feels premium.' },
  { name: 'Sarah K.', rating: 4, date: 'Feb 2025', comment: 'Great product overall. Colour is exactly as shown. Delivery was quick too.' },
  { name: 'James R.', rating: 5, date: 'Mar 2025', comment: 'Bought this as a gift and the recipient was thrilled. Will definitely order again.' },
];

const StarRating = ({ rating }) => (
  <div className="flex gap-0.5">
    {[1,2,3,4,5].map(i => (
      <svg key={i} className={`w-3.5 h-3.5 ${i <= rating ? 'text-amber-400' : 'text-gray-200'}`} fill="currentColor" viewBox="0 0 20 20">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
      </svg>
    ))}
  </div>
);

const DescriptionSection = ({ productData }) => {
  const [activeTab, setActiveTab] = useState('description');
  const [expanded, setExpanded] = useState(false);
  const content = productData.detailedDescription || productData.description;
  const paragraphs = content.split('\n').filter(p => p.trim());
  const preview = paragraphs.slice(0, 2);
  const hasMore = paragraphs.length > 2;

  return (
    <div className="mt-20">
      {/* Tab Headers */}
      <div className="flex gap-0 border-b border-gray-200">
        {['description', 'reviews'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-3 text-sm font-medium tracking-wide capitalize transition-colors relative ${
              activeTab === tab
                ? 'text-gray-900'
                : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            {tab === 'reviews' ? 'Reviews (235)' : 'Description'}
            {activeTab === tab && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-900" />
            )}
          </button>
        ))}
      </div>

      {/* Description Tab */}
      {activeTab === 'description' && (
        <div className="py-8 px-1">
          <div className="flex flex-col gap-4 text-sm text-gray-500 leading-relaxed max-w-3xl">
            {(expanded ? paragraphs : preview).map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>
          {hasMore && (
            <button
              onClick={() => setExpanded(prev => !prev)}
              className="mt-4 flex items-center gap-1.5 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
            >
              {expanded ? 'Show less' : 'Show more'}
              <svg
                className={`w-4 h-4 transition-transform duration-300 ${expanded ? 'rotate-180' : ''}`}
                fill="none" stroke="currentColor" viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          )}
        </div>
      )}

      {/* Reviews Tab */}
      {activeTab === 'reviews' && (
        <div className="py-8 px-1">
          {/* Summary */}
          <div className="flex items-center gap-4 mb-8 pb-8 border-b border-gray-100">
            <div className="text-center">
              <p className="text-5xl font-light text-gray-900">4.8</p>
              <StarRating rating={5} />
              <p className="text-xs text-gray-400 mt-1">235 reviews</p>
            </div>
            <div className="flex-1 flex flex-col gap-1.5 max-w-xs">
              {[5,4,3,2,1].map(star => (
                <div key={star} className="flex items-center gap-2">
                  <span className="text-xs text-gray-400 w-2">{star}</span>
                  <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-amber-400 rounded-full"
                      style={{ width: star === 5 ? '78%' : star === 4 ? '15%' : star === 3 ? '5%' : '1%' }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Review Cards */}
          <div className="flex flex-col gap-6">
            {REVIEWS.map((review, i) => (
              <div key={i} className="flex flex-col gap-2 pb-6 border-b border-gray-100 last:border-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-xs font-medium text-gray-600">
                      {review.name[0]}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-800">{review.name}</p>
                      <p className="text-xs text-gray-400">{review.date}</p>
                    </div>
                  </div>
                  <StarRating rating={review.rating} />
                </div>
                <p className="text-sm text-gray-500 leading-relaxed pl-11">{review.comment}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const Product = () => {
  const { productId } = useParams();
  const { currency, addToCart, token, navigate, setBuyNowItem, backendUrl } = useContext(ShopContext);
  const [productData, setProductData] = useState(false);
  const [image, setImage] = useState("");
  const [size, setSize] = useState("");

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        const { data } = await axios.get(`${backendUrl}/api/product/single/${productId}`);
        if (data.success) {
          setProductData(data.product);
          setImage(data.product.image[0]);
        } else {
          toast.error(data.message);
        }
      } catch (error) {
        toast.error(error.message);
      }
    };
    fetchProductData();
  }, [productId]);

  return productData ? (
    <div className="pt-10 transition-opacity ease-in duration-500 opacity-100">
      {/* ---------------- product data ------------ */}
      <div className="flex gap-12 sm:gap-12 flex-col sm:flex-row">
        {/* -------------Product Images ---------- */}
        <div className="flex-1 flex flex-col-reverse gap-3 sm:flex-row">
          <div className="flex sm:flex-col overflow-x-auto sm:overflow-y-scroll justify-between sm:justify-normal sm:w-[18.7%] w-full">
            {productData.image.map((item, index) => (
              <img
                src={item}
                alt=""
                key={index}
                className="w-[23%] sm:w-full sm:mb-3 flex-shrink-0 cursor-pointer h-[90px] sm:h-[130px] object-cover"
                onClick={() => setImage(item)}
              />
            ))}
          </div>

          {/* ------------- product main image ---------- */}
          <div className="w-full sm:w-[80%]">
            <img
              src={image}
              alt=""
              className="w-full h-[380px] sm:h-[600px] object-cover"
            />
          </div>
        </div>

        {/* ------ product Info ---------- */}
        <div className="flex-1">
          <h1 className="font-medium text-2xl">{productData.name}</h1>
          <div className="flex items-center gap-1 mt-2">
            <img src={assets.star_icon} alt="" className="w-3 5" />
            <img src={assets.star_icon} alt="" className="w-3 5" />
            <img src={assets.star_icon} alt="" className="w-3 5" />
            <img src={assets.star_icon} alt="" className="w-3 5" />
            <img src={assets.star_dull_icon} alt="" className="w-3 5" />
            <p className="pl-2">(1008)</p>
          </div>

          {/* ----- product price ----- */}
          <p className="mt-5 text-3xl font-medium">
            {currency}
            {productData.price}
          </p>

          {/* --- product description */}
          <p className="mt-5 text-gray-500 md:w-4/5">
            {productData.description}
          </p>
          <div className="felx flex-col gap-4 my-8">
            {/* --- product size --- */}
            <p>Select Size</p>
            <div className="flex gap-2">
              {productData.sizes.map((item, index) => (
                <button
                  className={` py-2 px-4 ${
                    item === size ? "bg-blue-700 text-white" : "bg-gray-100 "
                  }`}
                  key={index}
                  onClick={() => setSize(item)}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          {/* --- add to cart / buy now buttons --- */}
          <div className="flex gap-4">
            <button
              className="bg-black text-white px-8 py-3 text-sm active:bg-gray-700"
              onClick={() => addToCart(productData._id, size)}
            >
              ADD TO CART
            </button>
            <button
              className="border border-black text-black px-8 py-3 text-sm hover:bg-black hover:text-white transition-colors active:bg-gray-700"
              onClick={() => {
                if (!token) { navigate('/login'); return; }
                if (!size) { toast.error('Select Product Size!'); return; }
                setBuyNowItem({ itemId: productData._id, size });
                navigate('/place-order');
              }}
            >
              BUY NOW
            </button>
          </div>

          <hr className="mt-8 sm:w-4/5" />
          <div className="text-sm text-gray-500 mt-5 flex flex-col gap-1">
            <p>100% Original Product.</p>
            <p>Cash on delivery is available on this product.</p>
            <p>Easy return and exchange policy within 7 days.</p>
          </div>
        </div>
      </div>

      {/* -------- Description and Review Section ------- */}
      <DescriptionSection productData={productData} />

      {/* -------- Display related Products ---------- */}

      <RelatedProducts
        category={productData.category}
        subCategory={productData.subCategory}
      />
    </div>
  ) : (
    <div className="opacity-0"></div>
  );
};

export default Product;
