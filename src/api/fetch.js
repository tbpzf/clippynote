
const request = async (url, data) => {
    const headers = {
        Authorization: 'token rtz3yse5lyu5cchj',
        'Content-Type': 'application/json'
    }

    const response = await fetch(url, {
        method: 'POST',
        headers,
        body: JSON.stringify(data)
    })

    if (response.status === 401) {
        throw new Error('请设置token')
    }
    if (!response.ok) {
        throw new Error('Service unavailable')
    }

    return await response.json()
}

export default request;