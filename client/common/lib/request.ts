import axios, {AxiosRequestConfig} from 'axios';

const VALID_ERRORS: Record<string, string> = {};

function get<T>(url: string, params: any, config?: AxiosRequestConfig): Promise<T> {
    return axios
        .get(url, {
            ...config,
            withCredentials: true,
            params
        })
        .then((res) => res.data)
        .catch((error) => makeError(error, {}, config));
}

function post<T>(url: string, data: any, config?: AxiosRequestConfig): Promise<T> {
    return axios
        .post(url, data, {
            ...config,
            withCredentials: true
        })
        .then((res) => res.data)
        .catch((error) => makeError(error, data, config));
}

function put<T>(url: string, data: any, config?: AxiosRequestConfig): Promise<T> {
    return axios
        .put(url, data, {
            ...config,
            withCredentials: true
        })
        .then((res) => res.data)
        .catch((error) => makeError(error, data, config));
}

function makeError(error: any, request: any, config: any) {
    const {response} = error;
    // eslint-disable-next-line no-console
    console.log(
        'FOR_DEVELOPERS',
        JSON.stringify({
            type: 'error_on_request',
            url: response.request.responseURL,
            request,
            response: response.data,
            config
        })
    );

    const {message} = response.data || {};

    const newError = error;
    newError.clientMessage = VALID_ERRORS[message] || 'Неизвестная ошибка';
    throw newError;
}

export const Request = {
    get,
    put,
    post
};
