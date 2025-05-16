import { clearAccessToken } from '../../services/authservices';
import axiosPrivate from '../../api/axiosPrivate';

const logout = async () => {
    try {
        await axiosPrivate.post('http://localhost:3000/api/auth/logout', {}, { withCredentials: true });
        clearAccessToken();
        window.location.href = '/login';
    } catch (error) {
        console.error(error?.response?.data);
    }
};

export default logout;
