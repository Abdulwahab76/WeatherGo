import React, { useState, useEffect } from 'react';
import { fetchData, options } from './utils/fetchApi';
import GpsFixedIcon from '@mui/icons-material/GpsFixed';
import TemporaryDrawer from './components/drawer'
import Tooltip from '@mui/material/Tooltip';
import { Snackbar } from "@mui/material";


const api = {
  key: "62544921898d80ab50b8e34bd7f3f88a",
  base: "https://api.openweathermap.org/data/2.5/"
}

function App() {
  const [query, setQuery] = useState('');
  const [weather, setWeather] = useState({});
  const [geocoding, setGeocoding] = useState()
  const [loading, setLoading] = useState(false)
  const [gpsLocation, setGpsLocation] = useState(false)
  const [countryFlag, setCountryFlag] = useState()
  const [isCopied, setIsCopied] = useState(false);

  const locationWatchId = React.useRef(null)
  const cancelLocationWatch = () => {
    if (locationWatchId.current && navigator.geolocation) {
      navigator.geolocation.clearWatch(locationWatchId.current);
    }
  };


  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      const geocode = async () => {
        setLoading(true)
        try {
          let geo = await fetchData(`https://forward-reverse-geocoding.p.rapidapi.com/v1/reverse?lat=${position.coords.latitude}&lon=${position.coords.longitude}&accept-language=en&polygon_threshold=0.0`, options)
          setGeocoding(geo)
   
          console.log(geo);
        } catch (err) {
          console.log('err', err);
        }
      }
      geocode()
    })
    // if(query){
     
    // }
    
    return cancelLocationWatch

  }, [gpsLocation, loading])

  console.log(geocoding);
// clipboard



  function getLocation() {
    if (navigator.geolocation) {
      locationWatchId.current = navigator.geolocation.watchPosition(showPosition, error);

    } else {
      console.log("Geolocation is not supported by this browser.");
    }
  }
  function error(err) {
    setLoading(false)

    console.log('user denied access', err);
  }
  function showPosition(position) {

    console.log('user access');
  }
  getLocation()

  useEffect(() => {
    if (geocoding) {
      const handleButtonClick = () => {
        const url = ` https://countryflagsapi.com/png/${geocoding.address.country}`
        setCountryFlag(url)
      }
      handleButtonClick()
    }

  }, [countryFlag, geocoding])

  console.log('flag', countryFlag);

  const search = async (evt) => {
    if (evt.key === "Enter") {
      try {
        let data = await fetchData(`${api.base}weather?q=${query}&units=metric&APPID=${api.key}`)
        document.title = `WeatherGo | ${query}`
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
  let icons = 'http://openweathermap.org/img/wn/'
  return (
    <div className='main'>
      {!gpsLocation && <div className='cool-link'> <p> Weather<span>Go</span></p></div>}
      {gpsLocation && <div className='drawer'>
        <TemporaryDrawer geocoding={geocoding} flagImage={countryFlag} setIsCopied={setIsCopied}/>
      </div>}
      <Snackbar
        message="Copied to clibboard"
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        autoHideDuration={20000}
        onClose={() => setIsCopied(false)}
        open={isCopied}
      />

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
          {(typeof weather.main != "undefined") ? (
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
          {loading && <div onClick={() =>
            setGpsLocation(!gpsLocation)

          }>
            <Tooltip title={gpsLocation ? "Live Location On" : 'Live Location Off'}><GpsFixedIcon className={gpsLocation ? 'gps blue' : 'gps'} /></Tooltip>


          </div>}
          <footer>
            <p>Made with WebDev  <span>|| {dateBuilder(new Date())}</span> </p>
          </footer>
        </main>

      </div>

    </div>

  );
}

export default App;
