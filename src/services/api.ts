import axios from 'services/axios.customize'
const loginAPI = (username: string, password: string) => {
    const BACKEND_URL = '/api/v1/auth/login';
    const data = {
        username: username,
        password: password
    }
    return axios.post<IBackendRes<ILogin>>(BACKEND_URL, data, { headers: { delay: 1000 } });
}

const registerAPI = (fullName: string, email: string, password: string, phone: string) => {
    const BACKEND_URL = '/api/v1/user/register';
    const data = {
        fullName: fullName,
        email: email,
        password: password,
        phone: phone
    }
    return axios.post<IBackendRes<IRegister>>(BACKEND_URL, data);
}
const fetchAccountAPI = () => {
    const BACKEND_URL = '/api/v1/auth/account'
    return axios.get<IBackendRes<IFetchAccount>>(BACKEND_URL, { headers: { delay: 1000 } })
}
const logOutAPI = () => {
    const BACKEND_URL = '/api/v1/auth/logout'
    return axios.post<IBackendRes<string>>(BACKEND_URL, { headers: { delay: 500 } });

}
const getUsersAPI = (query: string) => {
    const BACKEND_URL = `/api/v1/user?${query}`;
    return axios.get<IBackendRes<IModelPaginate<IUserTable>>>(BACKEND_URL)

}
const createUserAPI = (fullname: string, password: string, email: string, phone: string) => {
    const BACKEND_URL = '/api/v1/user';
    const data = {
        fullName: fullname,
        password: password,
        email: email,
        phone: phone,
    }
    return axios.post<IBackendRes<IRegister>>(BACKEND_URL, data, { headers: { delay: 500 } });
}

const bulkCreateUserAPI = (data: {
    fullName: string,
    password: string,
    email: string,
    phone: string
}[]) => {
    const BACKEND_URL = '/api/v1/user/bulk-create'
    return axios.post<IBackendRes<IResponseImport>>(BACKEND_URL, data, { headers: { delay: 1000 } })
}
const updateUserAPI = (_id: string, fullName: string, phone: string) => {
    const headers = { delay: 1000 };
    const BACKEND_URL = '/api/v1/user';
    const data = {
        _id: _id,
        fullName: fullName,
        phone: phone
    }
    return axios.put<IBackendRes<IUserTable>>(BACKEND_URL, data, { headers })
}
const deleteUserAPI = (_id: string) => {
    const headers = { delay: 1000 };
    const BACKEND_URL = `/api/v1/user/${_id}`;
    return axios.delete<IBackendRes<IResponseDelete>>(BACKEND_URL, { headers })

}
const getBookAPI = (query: string) => {
    const BACKEND_URL = `/api/v1/book?${query}`
    const headers = { delay: 500 };
    return axios.get<IBackendRes<IModelPaginate<IBookTable>>>(BACKEND_URL, { headers })
}
const getCategoryAPI = () => {
    const BACKEND_URL = '/api/v1/database/category';
    return axios.get<IBackendRes<string[]>>(BACKEND_URL)
}

const callUploadBookImgAPI = (fileImg: any, folder: string) => {
    const bodyFormData = new FormData();
    bodyFormData.append('fileImg', fileImg);
    const BACKEND_URL = '/api/v1/file/upload';
    return axios<IBackendRes<{ fileUploaded: string }>>({
        method: 'post',
        url: BACKEND_URL,
        data: bodyFormData,
        headers: {
            "Content-Type": "multipart/form-data",
            "upload-type": folder
        },
    });
}
const createBookAPI = (mainText: string, author: string,
    price: number, quantity: number, category:
        string, thumbnail: string, slider: string[]) => {
    const BACKEND_URL = '/api/v1/book';
    const data = {
        mainText: mainText,
        author: author,
        price: price,
        quantity: quantity,
        category: category,
        thumbnail: thumbnail,
        slider: slider
    }
    return axios.post<IBackendRes<IBookTable>>(BACKEND_URL, data);
}
const updateBookAPI = (_id: string, mainText: string, author: string,
    price: number, quantity: number, category:
        string, thumbnail: string, slider: string[]) => {
    const BACKEND_URL = `/api/v1/book/${_id}`;
    const data = {
        mainText: mainText,
        author: author,
        price: price,
        quantity: quantity,
        category: category,
        thumbnail: thumbnail,
        slider: slider
    }
    return axios.put<IBackendRes<IBookTable>>(BACKEND_URL, data);
}
const deleteBookAPI = (_id: string) => {
    const headers = { delay: 1000 };
    const BACKEND_URL = `/api/v1/book/${_id}`;
    return axios.delete<IBackendRes<IResponseDelete>>(BACKEND_URL, { headers })

}
const getBookWithIdAPI = (_id: string) => {
    const BACKEND_URL = `api/v1/book/${_id}`;
    const headers = { delay: 1000 };
    return axios.get<IBackendRes<IBookTable>>(BACKEND_URL, { headers })

}
const createOrderAPI = (
    name: string, address: string,
    phone: string, totalPrice: number,
    type: string, detail: any) => {
    const BACKEND_URL = "/api/v1/order";
    const headers = { delay: 1000 };
    return axios.post<IBackendRes<IRegister>>(BACKEND_URL, { name, address, phone, totalPrice, type, detail }, { headers })
}
const getOrderHistoryAPI = () => {
    const BACKEND_URL = '/api/v1/history';
    const headers = { delay: 1000 };
    return axios.get<IBackendRes<IHistory[]>>(BACKEND_URL, { headers })
}
const updateUserInfoAPI = (_id: string, fullName: string, phone: string, avatar: string) => {
    const headers = { delay: 1000 };
    const BACKEND_URL = '/api/v1/user';
    const data = {
        _id: _id,
        fullName: fullName,
        phone: phone,
        avatar: avatar
    }
    return axios.put<IBackendRes<IUserTable>>(BACKEND_URL, data, { headers })
}
const changePasswordAPI = (email: string, oldpass: string, newpass: string) => {
    const headers = { delay: 1000 };
    const BACKEND_URL = '/api/v1/user/change-password';
    const data = {
        email: email,
        oldpass: oldpass,
        newpass: newpass
    }
    return axios.post<IBackendRes<IRegister>>(BACKEND_URL, data, { headers })

}
const getListOrderAPI = (query: string) => {
    const BACKEND_URL = `/api/v1/order?${query}`
    const headers = { delay: 500 };
    return axios.get<IBackendRes<IModelPaginate<IOrderTable>>>(BACKEND_URL, { headers })
}
const getDashboardDataAPI = () => {
    const BACKEND_URL = "/api/v1/database/dashboard";
    return axios.get<IBackendRes<IDashboard>>(BACKEND_URL);
}
export {
    loginAPI, registerAPI, fetchAccountAPI, logOutAPI,
    getUsersAPI, createUserAPI, bulkCreateUserAPI,
    updateUserAPI, deleteUserAPI, getBookAPI, getCategoryAPI,
    callUploadBookImgAPI, createBookAPI, updateBookAPI, deleteBookAPI,
    getBookWithIdAPI, createOrderAPI, getOrderHistoryAPI, updateUserInfoAPI,
    changePasswordAPI, getListOrderAPI, getDashboardDataAPI
};