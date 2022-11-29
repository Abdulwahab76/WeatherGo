import React, { useState, useEffect } from 'react';
import { fetchData, options } from './utils/fetchApi';
import { AiFillCloseCircle, AiOutlineClose, } from 'react-icons/ai';
import GpsFixedIcon from '@mui/icons-material/GpsFixed';
import TemporaryDrawer from './components/drawer'
import Tooltip from '@mui/material/Tooltip';




const api = {
  key: "62544921898d80ab50b8e34bd7f3f88a",
  base: "https://api.openweathermap.org/data/2.5/"
}

function App() {
  const [query, setQuery] = useState('');
  const [weather, setWeather] = useState({});
  const [latitude, setLatitude] = useState('')
  const [longitude, setLongitude] = useState('')
  const [geocoding, setGeocoding] = useState()
  const [navbarOpen, setNavbarOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [gpsLocation, setGpsLocation] = useState(false)
  const [error, setError] = useState(false);

  console.log('here', process.env.REACT_APP_RAPID_KEY);
  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      // setLatitude(position.coords.latitude)
      // setLongitude(position.coords.longitude)
      const geocode = async () => {
        setLoading(true)
        try {
          setError(false);
          let geo = await fetchData(`https://forward-reverse-geocoding.p.rapidapi.com/v1/reverse?lat=${position.coords.latitude}&lon=${position.coords.longitude}&accept-language=en&polygon_threshold=0.0`, options)
          setGeocoding(geo)
        } catch (err) {

          setError(true);
          console.log('err', err);
        }
        setLoading(false)
      }
      setLoading(false)
      geocode()
    })

  }, [gpsLocation])

  function getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(showPosition);

    } else {
      console.log("Geolocation is not supported by this browser.");
    }
  }

  function showPosition(position) {

  }
  getLocation()


  const search = async (evt) => {
    if (evt.key === "Enter") {
      try {
        let data = await fetchData(`${api.base}weather?q=${query}&units=metric&APPID=${api.key}`)
        setWeather(data)
        setQuery('')
      } catch (err) {
      }


    }
  }
  const dateBuilder = (d) => {
    let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

    let day = days[d.getDay()];
    let date = d.getDate();
    let month = months[d.getMonth()];
    let year = d.getFullYear();

    return `${day} ${date} ${month} ${year}`
  }
let weatherKeys = Object.keys(weather)
  let icons = 'http://openweathermap.org/img/wn/'
  return (
    <div className='main'>
      {!gpsLocation && <div className='cool-link'> <p> Weather<span>Go</span></p></div>}
      {gpsLocation && <div className='drawer'>
        <TemporaryDrawer geocoding={geocoding} />
      </div>}



      <div className={(typeof weather.main != "undefined") ? ((weather.main.temp > 16) ? 'app warm' : 'app') : 'app'}>
        <main>

          <div className="search-box">
            <input
              type="text"
              className="search-bar"
              placeholder="Search..."
              onChange={e => setQuery(e.target.value)}
              value={query}
              onKeyPress={search}
            />
          </div>
          {(typeof weather.main != "undefined")? (
            <div>
              <div className="location-box">
                <div className="location">{weather.name}, {weather.sys.country}</div>
                <div className="date">{dateBuilder(new Date())}</div>
              </div>
              <div className="weather-box">
                <div className="temp">
                  {Math.round(weather.main.temp)}°c
                </div>
                <div className="weather">
                  <p>{weather.weather[0].main}</p>
                  <img src={`${icons}/${weather.weather[0].icon}.png`} />
                </div>
              </div>
            </div>
          ) : ('')
          }
          <div onClick={() =>
            setGpsLocation(!gpsLocation)

          }>
            <Tooltip title={gpsLocation ? "Live Location On" : 'Live Location Off'}><GpsFixedIcon className={gpsLocation ? 'gps blue' : 'gps'} /></Tooltip>


          </div>
          <footer>
            <p>Made with WebDev || {dateBuilder(new Date())}</p>
          </footer>
        </main>

      </div>

    </div>

  );
}

export default App;
