import { v4 as uuid } from "uuid";
import { CiHeart, CiUser } from "react-icons/ci";
import { IoIosSearch, IoIosMenu } from "react-icons/io";
import { BsCart } from "react-icons/bs";
import { RxCross1 } from "react-icons/rx";
import { FiPlus } from "react-icons/fi";
import { useEffect, useState } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import { setSearchParameters } from "../Product/ProductSlice";
import { selectLoggedInUser } from "../Auth/AuthSlice";

import logo from "../../assets/logo.png";

export function Navbar({ searchParameter, setSearchParameter }) {
  const [showMobileViewMenu, setShowMobileViewMenu] = useState(false);
  const [showProfileOptions, setShowProfileOptions] = useState(false);
  const [showSearchBar, setShowSearchBar] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const user = useSelector(selectLoggedInUser);
  const { role } = user || {};

  /* ================= NAV LINKS ================= */
  let directLinks = [];
  if (role === "admin") {
    directLinks = [
      { name: "Orders", link: "/admin/orders" },
      { name: "Products", link: "/admin/products" },
    ];
  } else {
    directLinks = [
      { name: "Orders", link: "/myOrders" },
      { name: "Products", link: "/products" },
    ];
  }

  let mobileViewMenuOption = [];
  if (role === "admin") {
    mobileViewMenuOption = [
      { name: "Products", link: "/admin/products" },
      { name: "Orders", link: "/admin/orders" },
    ];
  } else {
    mobileViewMenuOption = [
      { name: "Products", link: "/products" },
      { name: "Wishlist", link: "/wishlist" },
      { name: "Cart", link: "/cart" },
    ];
  }

  let profileOptions = [];
  if (role === "admin") {
    profileOptions = [
      { name: "My Profile", link: "/myProfile" },
      { name: "Orders", link: "/admin/orders" },
      {
        name: user?.userId ? "Logout" : "Login",
        link: user?.userId ? "/logout" : "/login",
      },
    ];
  } else {
    profileOptions = [
      { name: "My Profile", link: "/myProfile" },
      { name: "My Orders", link: "/myOrders" },
      {
        name: user?.userId ? "Logout" : "Login",
        link: user?.userId ? "/logout" : "/login",
      },
    ];
  }

  /* ================= HANDLERS ================= */
  function openProfileMenuHandler(e) {
    e.stopPropagation();
    setShowProfileOptions((prev) => !prev);
  }

  function openMobileViewMenuHandler(e) {
    e.stopPropagation();
    setShowMobileViewMenu((prev) => !prev);
  }

  function addProductHandler() {
    navigate("/admin/products/create");
  }

  /* ================= EFFECTS ================= */
  useEffect(() => {
    function handleClickOutside() {
      setShowMobileViewMenu(false);
      setShowProfileOptions(false);
    }

    window.addEventListener("click", handleClickOutside);
    return () => window.removeEventListener("click", handleClickOutside);
  }, []);

  useEffect(() => {
    if (searchParameter) {
      navigate(role === "admin" ? "/admin/products" : "/products");
    }
  }, [searchParameter, navigate, role]);

  useEffect(() => {
    dispatch(setSearchParameters(searchParameter));
  }, [searchParameter, dispatch]);

  /* ================= JSX ================= */
  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <img src={logo} alt="logo" className="h-9" />
        </Link>

        {/* Desktop Links */}
        <ul className="hidden md:flex items-center gap-6">
          {directLinks.map((link) => (
            <li key={uuid()}>
              <NavLink
                to={link.link}
                className={({ isActive }) =>
                  `text-sm font-medium ${
                    isActive
                      ? "text-blue-600"
                      : "text-slate-600 hover:text-blue-600"
                  }`
                }
              >
                {link.name}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* Right Section */}
        <div className="flex items-center gap-4 relative">
          {/* Search */}
          <input
            type="text"
            value={searchParameter}
            onChange={(e) => setSearchParameter(e.target.value)}
            placeholder="Search products"
            className={`transition-all duration-300 border border-slate-300 rounded-md px-2 py-1 text-sm ${
              showSearchBar ? "w-64 opacity-100" : "w-0 opacity-0 hidden"
            }`}
          />

          <button
            onClick={() => setShowSearchBar((prev) => !prev)}
            className="text-slate-600 hover:text-blue-600"
          >
            <IoIosSearch className="h-5 w-5" />
          </button>

          {/* ADD PRODUCT — ADMIN ONLY */}
          {role === "admin" && (
            <button
              onClick={addProductHandler}
              className="hidden md:flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
            >
              <FiPlus className="h-4 w-4" />
              Add Product
            </button>
          )}

          {/* User Icons */}
          {role !== "admin" && (
            <>
              <Link to="/wishlist" className="text-slate-600 hover:text-blue-600">
                <CiHeart className="h-6 w-6" />
              </Link>
              <Link to="/cart" className="text-slate-600 hover:text-blue-600">
                <BsCart className="h-5 w-5" />
              </Link>
            </>
          )}

          {/* Profile */}
          <button
            onClick={openProfileMenuHandler}
            className="text-slate-600 hover:text-blue-600"
          >
            <CiUser className="h-6 w-6" />
          </button>

          {/* Profile Dropdown */}
          {showProfileOptions && (
            <div className="absolute right-0 top-12 w-48 bg-white border border-slate-200 rounded-lg shadow-lg overflow-hidden">
              {profileOptions.map((option) => (
                <Link key={uuid()} to={option.link}>
                  <div className="px-4 py-2 text-sm text-slate-700 hover:bg-slate-100">
                    {option.name}
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-slate-700"
            onClick={openMobileViewMenuHandler}
          >
            {showMobileViewMenu ? (
              <RxCross1 className="h-6 w-6" />
            ) : (
              <IoIosMenu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {showMobileViewMenu && (
        <div className="md:hidden bg-white border-t border-slate-200">
          {[...mobileViewMenuOption, ...profileOptions].map((item) => (
            <Link key={uuid()} to={item.link}>
              <div className="px-6 py-3 text-sm font-medium text-slate-700 hover:bg-slate-100">
                {item.name}
              </div>
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
