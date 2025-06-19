import "./styles.css";

function cleanData(data) {
    curr = data["currentConditions"];
    return {"temp": curr["temp"], "cond": curr["conditions"], "qnh": String(curr["pressure"]).padStart(4, "0"), "icon": curr["icon"]};
}

async function getData(city) {
    let response = await fetch(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${city}?key=3B98CBJ37XK6NVTBSR7BKBEBV&unitGroup=metric`, {mode: 'cors'});
    let data = await response.json();
    return cleanData(data);
}