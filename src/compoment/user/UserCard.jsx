import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import ic_avatar from '../../assets/imoji_avatar.png';

const UserCard = ({ user }) => {
    const navigate = useNavigate();

    return (
        <>
            <div
                className="relative flex flex-col bg-gray-100 items-center p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow group cursor-pointer"
                onClick={() => navigate(`/user/${user.id}`)}
            >
                <div className="w-32 h-32 overflow-hidden rounded-full mb-4">
                    <img
                        src={user.photoURL || ic_avatar}
                        alt={user.displayName}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                </div>
                <h3 className="text-lg font-semibold text-center">{user.displayName}</h3>
                <p className="text-sm text-gray-500 font-bold">{user.username || "--"}</p>
                <p className="text-sm text-gray-500">{user.email || "--"}</p>
                <div className="mt-2 px-3 py-1 bg-green-500 font-bold rounded-full text-sm text-white">
                    {user.role || 'User'}
                </div>
            </div>
        </>
    );
};

UserCard.propTypes = {
    user: PropTypes.shape({
        id: PropTypes.string.isRequired,
        displayName: PropTypes.string.isRequired,
        email: PropTypes.string.isRequired,
        photoURL: PropTypes.string,
        role: PropTypes.string
    }).isRequired,
};

export default UserCard;