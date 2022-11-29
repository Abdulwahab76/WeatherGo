export const options = {
    method: 'GET',
    headers: {
        'X-RapidAPI-Key': process.env.REACT_APP_RAPID_KEY,
        'X-RapidAPI-Host': 'forward-reverse-geocoding.p.rapidapi.com'
    }
};

export const fetchData = async(url, options)=>{
    const response = await fetch(url,options)
    const data = await response.json()
    return data
}
