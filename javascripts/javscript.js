function formatNumber(num) {
    return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
  }

  //FETCHING THE API//
    fetch(`https://api.covid19api.com/summary`)
    .then((res) => res.json())
    .then((data) => {

        if(data.Message != "") {

            iziToast.error({
                title: "Caching in progress",
                position: "topCenter",
                timeout: 3000,
            });
        } else {
            const active = document.querySelector("#active-cases-global");
            const death = document.querySelector("#death-cases-global");
            const recovered = document.querySelector("#recover-cases-global");
    
            active.append(formatNumber(data.Global.TotalConfirmed));
            death.append(formatNumber(data.Global.TotalDeaths));
            recovered.append(formatNumber(data.Global.TotalRecovered));
        }

    })

    fetch(`https://api.covid19api.com/live/country/Philippines`)
    .then((res) => res.json())
    .then((data) => {

        if(data.message == "Not Found") {

            iziToast.error({
                title: "Country not found",
                position: "topCenter",
                timeout: 3000,
            });
        } else {
            let length = data.length;
            let index = length - 1;

            const active = document.querySelector("#active-cases");
            const death = document.querySelector("#death-cases");
            const recovered = document.querySelector("#recover-cases");
            const countryTitle = document.querySelector("#select-country");

            active.append(formatNumber(data[index].Confirmed));
            death.append(formatNumber(data[index].Deaths));
            recovered.append(formatNumber(data[index].Recovered));
            countryTitle.append("Covid Cases in" + " " + data[index].Country);

        }
    })

    .catch(err => {
        console.log(err)

        Swal.fire({
            title: 'Server Error!',
            text: 'No data has been fetched!',
            icon: 'error',
            confirmButtonText: 'Close'
          })
    })


const countriesList = document.getElementById("selection");
let countries;

countriesList.addEventListener("change", newCountrySelection => {
    const selectedCountry = document.querySelector("#selection").value;

    fetch(`https://api.covid19api.com/live/country/${selectedCountry}`)
    .then((res) => res.json())
    .then((data) => {

        const active = document.querySelector("#active-cases");
        const death = document.querySelector("#death-cases");
        const recovered = document.querySelector("#recover-cases");
        const countryTitle = document.querySelector("#select-country");

        active.innerHTML = '';
        death.innerHTML = '';
        recovered.innerHTML = '';
        countryTitle.innerHTML = '';

        if(data.message == "Not Found") {

            iziToast.error({
                title: "Country not found",
                position: "topCenter",
                timeout: 3000,
            });

        } else {
            let length = data.length;
            let index = length - 1;

            const active = document.querySelector("#active-cases");
            const death = document.querySelector("#death-cases");
            const recovered = document.querySelector("#recover-cases");
            const countryTitle = document.querySelector("#select-country");
            const countryCode = data[index].CountryCode;

            active.append(formatNumber(data[index].Confirmed));
            death.append(formatNumber(data[index].Deaths));
            recovered.append(formatNumber(data[index].Recovered));
            countryTitle.innerHTML = `<img src="https://www.countryflags.io/${countryCode}/flat/64.png"> `;
            countryTitle.append("Covid Cases in" + " " + data[index].Country);

        }
    })

    .catch(err => {
        console.log(err)

        Swal.fire({
            title: 'Server Error!',
            text: 'No data found',
            icon: 'error',
            confirmButtonText: 'Close'
          })
    })
});


// GET COUNTRY - REST COUNTRY API
fetch("https://restcountries.eu/rest/v2/all")
.then(res => res.json())
.then(data => initialize(data))
.catch(err => console.log("Error:", err));

function initialize(countriesData) {
  countries = countriesData;
  let options = "";
    
  countries.forEach(country => options+=`<option value="${country.name}">${country.name}</option>`);
  countriesList.innerHTML = options;
  $("#selection option[value=Philippines]").prop("selected", true)

}
