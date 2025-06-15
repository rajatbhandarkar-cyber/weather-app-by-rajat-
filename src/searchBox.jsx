import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import "./SearchBox.css";
import {useState} from "react";

export default function SearchBox({updateInfo}) {
     let [city,setCity] = useState("");
     let [error,setError] = useState(false);
    const API_URL = "https://api.openweathermap.org/geo/1.0/direct";
    const API_KEY = "e088efae5b1f59eb1c7e3cc61d41520b";


    let getCurrentWeather = async( lat,lon) => {
      try{
        let url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`;
        let response = await fetch(url);
        let data = await response.json();

        let result = {
            feelslike:data.main.feels_like,
            temp:data.main.temp,
            tempMin:data.main.temp_min,
            tempMax:data.main.temp_max,
            humidity:data.main.humidity,
            weather:data.weather[0].description,
            city:data.name,
        };
        console.log(result);
        return result;    
      }catch(err) {
        throw err;
      };    
    };

    let getWeatherInfo = async () => {
       let response = await fetch(`${API_URL}?q=${city}&limit=1&appid=${API_KEY}`);
       let jsonResponse  = await response.json();
       
       if(jsonResponse.length === 0) {
        console.log("No matching location found");
        return null;
       } 
       let {lat,lon,name} = jsonResponse[0];
       const normalize = (str) => str.trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
       if(normalize(name) != normalize(city)){
            alert(`Closest match found: "${name}", not "${city}". Please try a more accurate location.`);
            return null;
       }
       let result = await getCurrentWeather(lat,lon);
       return result;
    };
   
    let handleChange = (event) => {
       setCity(event.target.value);
    };

    let handleSubmit = async (event) => { 
      try{
       event.preventDefault();
       let newInfo = await getWeatherInfo();
       if(newInfo) {
         updateInfo(newInfo);
       }
       setCity("");
      } catch{
        setError(true);
      };
    };

    return(
      <div className='SearchBox'>
        <form onSubmit={handleSubmit}>
          <TextField id="city" label="City Name" variant="outlined" required value={city} onChange={handleChange} />
          <br></br>
          <br></br>
          <Button variant="contained" type="submit">Search</Button>
          {error && <p>No such place exists!</p>}
        </form>
      </div>
    );
};