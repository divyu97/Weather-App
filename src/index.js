import "./styles.css";

let results = document.querySelector("#results");

function cleanData(data) {
    let curr = data["currentConditions"];
    return {"temp": curr["temp"], "cond": curr["conditions"], "qnh": String(curr["pressure"]).padStart(4, "0"), "icon": curr["icon"]};
}

function loading() {
    if (results.textContent.length === 10)
        results.textContent = "Loading";
    else
        results.textContent += ".";
}

async function getData(city) {
    let timer;
    try {
        results.textContent = "Loading";
        timer = setInterval(loading, 300);
        let response = await fetch(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${city}?key=3B98CBJ37XK6NVTBSR7BKBEBV&unitGroup=metric`, {mode: 'cors'});
        let data = await response.json();
        clearInterval(timer);
        return cleanData(data);
    } catch {
        clearInterval(timer);
        throw new Error("No data found");
    }
}

document.querySelector("#search").addEventListener("click", function() {
    let search = document.querySelector("#city");

    let city = search.value;
    search.value = "";
    
    if (city.trim() === "")
        alert("Please enter a valid city name");
    else 
        getData(city).then((data) => {
            results.textContent = "";
            results.innerHTML = `
                <div id="res-heading">Weather Data for '${city}':</div>
                <div id="data">
                    <div class="info">
                        <img alt="conditions icon" id="icon">
                        <div class="label">Conditions</div>
                    </div>
                    <div class="info" id="temp">
                        <div class="reading">${data["temp"]}°C</div>
                        <div class="label">Temperature</div>
                    </div>
                    <div class="info" id="qnh">
                        <div class="reading">${data["qnh"]} hPa</div>
                        <div class="label">Pressure</div>
                    </div>
                </div>`
            ;
            import(`./icons/${data["icon"]}.svg`).then((module) => {
                document.querySelector("#icon").src = module.default;
            });
        }).catch(() => {
            results.textContent = `No weather data found for '${city}'`;
        });
});