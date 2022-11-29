export const options = {
    method: 'GET',
    headers: {
        'X-RapidAPI-Key': 'e141dd466emshad832b56164ffd3p1e5d18jsn4f8688ae1c4e',
        'X-RapidAPI-Host': 'forward-reverse-geocoding.p.rapidapi.com'
    }
};

export const fetchData = async(url, options)=>{
    const response = await fetch(url,options)
    const data = await response.json()
    return data
}
