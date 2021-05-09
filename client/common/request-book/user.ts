import {Request} from 'common/lib/request';

export interface LoginParams {
    email: string;
    code?: number;
}

async function login(params: LoginParams) {
    const {email, code} = params;

    return Request.post('/api/v1/user/login', {email, code}, {responseType: 'json'});
}

export const User = {
    login
};
