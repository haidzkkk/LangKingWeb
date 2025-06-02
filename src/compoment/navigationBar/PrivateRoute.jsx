import { Navigate, Outlet } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { Resource } from "../../data/model/resouce";
import { authUserById } from "../auth/AuthSlice";
import { LOCAL_STORAGE_USER_KEY } from "../../utils/AppConstans";
const PrivateRoute = () => {
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.authState);

  useEffect(() => {
    if (Resource.initialize(currentUser)) {
      const userId = localStorage.getItem(LOCAL_STORAGE_USER_KEY);
      dispatch(authUserById(userId));
    }
  }, []);

  if (Resource.isLoading(currentUser) || Resource.isInitialize(currentUser)) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
            </div>
        );
  }
  if (Resource.isSuccess(currentUser)) {
    return <Outlet />;
  }
  return <Navigate to="/login" />;
};

export default PrivateRoute;
