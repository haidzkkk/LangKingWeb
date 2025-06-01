import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { listenToUsers } from "./UserSlice";
import UserCard from './UserCard';

const UserPage = () => {
    const dispatch = useDispatch();
    const { users } = useSelector(state => state.userState);
    const globalState = useSelector(state => state);
    
    useEffect(() => {
        const unsubscribe = listenToUsers(dispatch, globalState);

        return () => {
            unsubscribe();
        };
    }, []);

    if (!users || !users.data) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Quản lý người dùng</h1>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {users.data.map(user => (
                    <UserCard
                        key={user.id}
                        user={user}
                    />
                ))}
            </div>
        </div>
    );
}

export default UserPage;