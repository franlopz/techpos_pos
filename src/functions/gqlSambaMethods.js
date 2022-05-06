import toast from 'react-hot-toast'

export const getConnectionData = async () => {
    const connectionData = JSON.parse(window.localStorage.getItem('connectionData')) ?? { ipaddress: '', port: '', identifier: '', key: '' };
    return connectionData;
}

const auth = async (options = {}, retries) => {
    const { timeout = 10000 } = options;
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);
    const { ipaddress, port, identifier, key } = await getConnectionData()
    const url = `http://${ipaddress}:${port}/Token`;
    const params = new URLSearchParams();
    params.append('grant_type', 'client_credentials');
    params.append('client_secret', key);
    params.append('client_id', identifier);
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: params,
        signal: controller.signal,
        ...options,
    };

    try {
        const toastLoading = toast.loading('Autentificando...', { id: 'AuthLoading' })
        const response = await fetch(url, requestOptions);
        toast.dismiss(toastLoading)
        clearTimeout(id);
        const data = await response.json();
        window.localStorage.setItem('expiresin', parseInt(Date.now()) + (parseInt(data.expires_in) * 1000));
        window.localStorage.setItem('access_token', data.access_token);


        return data.access_token;
    } catch (e) {
        if (retries === 1) {
            toast.dismiss()
            toast.error('Error al autentificar')
            throw ('Error al autentificar')
        }
        return auth({}, retries - 1)
    }
}

export const gqlQuery = async (query, token = window.localStorage.getItem('access_token'), options = {}) => {
    const { ipaddress, port } = await getConnectionData()
    const { timeout = 10000 } = options;
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);
    const url = `http://${ipaddress}:${port}/api/graphql`;
    const body = {
        'query': query
    };
    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify(body),
        signal: controller.signal,
        ...options,
    };
    try {
        const response = await fetch(url, requestOptions);
        clearTimeout(id);
        if (response.status === 200) {
            // console.log(data);
            const data = await response.json();
            return data;
        }
        if (response.status === 401) {
            window.localStorage.setItem('expiresin', 0);
            window.localStorage.setItem('access_token', '');
            throw ('Error al autentificar')
        }
        if (response.status === 400) {
            return 'Bad Request';
        }

    } catch (e) {
        throw (e)
    }
    // console.log(data);
}


export const testConnection = async ({ ipaddress, port, origin = 'settings' }, options = {}) => {

    const savedData = await getConnectionData()
    // console.log({ savedipaddress, savedport })
    let url = ''
    if (origin === 'settings') {
        url = `http://${ipaddress}:${port}/api/helper`;
        // throw 'errorrr'
    } else {
        url = `http://${savedData.ipaddress}:${savedData.port}/api/helper`;
    }

    try {
        const { timeout = 2000 } = options;
        const controller = new AbortController();
        const id = setTimeout(() => controller.abort(), timeout);

        const response = await fetch(url, {
            ...options,
            signal: controller.signal
        });
        clearTimeout(id);
        if (response.status === 200) {
            // console.log(data);
            const data = await response.json();
            return data;
        }
    } catch (e) {
        console.log(e)
        return 'Failed'
    }

}

export const sambaHelper = async (query = 'baseconfig', serial = '', entityType = '', options = {}) => {
    const { ipaddress, port } = await getConnectionData()
    const { timeout = 10000 } = options;
    const url = `http://${ipaddress}:${port}/api/helper`;
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);

    const params = new URLSearchParams();
    params.append('query', query);
    params.append('serial', serial);
    params.append('entity_type', entityType);
    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: params,
        signal: controller.signal,
        ...options,
    }
    try {
        const response = await fetch(url, requestOptions);
        clearTimeout(id);
        const data = await response.json();
        console.log(data)
        return data;
    } catch (e) {

    }

}


export default auth;