import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import { assets } from "../assets/frontend_assets/assets";
import { useLocation } from "react-router-dom";

const SearchBar = () => {
  const { search, setSearch } = useContext(ShopContext);
  const [visible, setVisible] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setVisible(location.pathname.includes('collection'));
  }, [location]);

  return visible ? (
    <div className="border-t border-[#DDD6C8] py-4 px-4 sm:px-0">
      <div style={{backgroundColor:'#ffffff'}} className="max-w-xl mx-auto flex items-center gap-3 border border-[#DDD6C8] rounded-lg px-4 py-2.5 shadow-sm focus-within:border-[#2C2825] transition-colors">
        <img className="w-4 opacity-40 shrink-0" src={assets.search_icon} alt="" />
        <input
          value={search}
          style={{backgroundColor:'#ffffff'}}
          className="flex-1 outline-none text-sm text-[#2C2825] placeholder-[#A89F95]"
          type="text"
          placeholder="Search products..."
          onChange={(e) => setSearch(e.target.value)}
        />
        {search && (
          <button onClick={() => setSearch('')} className="text-[#A89F95] hover:text-[#2C2825] transition-colors text-lg leading-none">&times;</button>
        )}
      </div>
    </div>
  ) : null;
};

export default SearchBar;
