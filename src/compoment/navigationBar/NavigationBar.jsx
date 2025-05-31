import { NavLink, useLocation, Outlet, useNavigate } from "react-router-dom";
import './NavigationBarStyle.scss'
import userIcon from '../../assets/ic_user.png';
import { useEffect, useRef, useState } from "react";

const NavigationBar = () => {
    const [open, setOpen] = useState(false);
    const menuRef = useRef(null);
    const location = useLocation();
    const navigate = useNavigate();

    const toggleMenu = () => setOpen(!open);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setOpen(false);
            }
        };

        document.addEventListener("mouseup", handleClickOutside);
        return () => document.removeEventListener("mouseup", handleClickOutside);
    }, []);

    const handleLogout = () => {
        setOpen(false);
        navigate('/login');
    };

    const isHomeActive = location.pathname === "/" || location.pathname === "/home";

    return (
        <>
            <div className="topnav flex items-center fixed top-0 left-0 right-0 bg-white shadow-md z-[1] h-[72px]">
                <NavLink
                    className={({ isActive }) =>
                        (isActive || isHomeActive
                        ? "text-green-600 font-semibold border-b-2 border-green-600"
                        : "text-gray-600 hover:text-green-500")
                    }
                    to="/home"
                >
                    Trang chủ
                </NavLink>

                <NavLink
                    className={({ isActive }) =>
                        (isActive
                        ? "text-green-600 font-semibold border-b-2 border-green-600"
                        : "text-gray-600 hover:text-green-500")
                    }
                    to="/user"
                >
                    Người dùng
                </NavLink>

                <div className="ml-auto flex items-center h-full">
                    <div
                        className="flex items-center space-x-4 cursor-pointer select-none"
                        onClick={toggleMenu}
                    >
                        <p className="text-xl font-medium ml-2">Tôi  </p>
                        <img
                            src={userIcon}
                            alt="Avatar"
                            className="w-10 h-10 rounded-full object-cover bg-green-300"
                        />
                    </div>
                </div>
            </div>
            {open && (
                <div
                ref={menuRef}
                className="fixed top-[72px] right-4 w-48 bg-white rounded-lg shadow-lg border z-[100]"
                >
                    <ul className="py-2">
                        <li
                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                            onClick={() => {
                                setOpen(false);
                                navigate('/profile');
                            }}
                        >Chỉnh sửa
                        </li>
                        <li
                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-red-600 hover:text-red-700"
                            onClick={handleLogout}
                        >
                            Đăng xuất
                        </li>
                    </ul>
                </div>
            )}
            <div className="mt-[72px] px-6">
                <Outlet />
            </div>
        </>
    );
};

export default NavigationBar;