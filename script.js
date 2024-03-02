const form = document.getElementById("search-form");
const input = document.getElementById("citiesInp");
const msg = document.getElementsByClassName("massage")[0];
const list = document.getElementsByClassName("cities")[0];

const myStorage = window.localStorage;
if (myStorage.length > 0) {
  for (let i = 0; i < myStorage.length; i++) {
    const savedLi = JSON.parse(myStorage.getItem(`${myStorage.key(i)}`));
    const updLi = document.createElement("li");

    updLi.classList.add("city");
    updLi.setAttribute("id", `${myStorage.key(i)}`);
    updLi.innerHTML = savedLi;
    list.appendChild(updLi);
    deleteCity(updLi);
  }
}

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const inputVal = input.value;
  const listItems = document.getElementsByClassName("city");
  const listItemsArray = Array.from(listItems);

  if (listItemsArray.length > 0) {
    const filteredArray = listItemsArray.filter((el) => {
      let content = "";
      if (inputVal.includes(",")) {
        if (inputVal.split(",")[1].length > 2) {
          inputVal = inputVal.split(",")[0];
          content = el
            .querySelector(".city-name span")
            .textContent.toLowerCase();
        } else {
          content = el.querySelector(".city-name").dataset.name.toLowerCase();
        }
      } else {
        content = el.querySelector(".city-name span").textContent.toLowerCase();
      }
      return content == inputVal.toLowerCase();
    });

    if (filteredArray.length > 0) {
      msg.textContent = `You already know the weather for ${
        filteredArray[0].querySelector(".city-name span").textContent
      } ...otherwise be more specific by providing the country code as well 😉`;
      form.reset();
      input.focus();
      return;
    }
  }

  getWeatherInfo(inputVal);

  msg.textContent = "";

  form.reset();
  input.focus();
});

function getWeatherInfo(inputVal) {
  const apiKey = "56c8a8bc3cc6fb699e9ec2fcd0ca0561";
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${inputVal}&appid=${apiKey}&units=metric`;

  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      const { main, name, sys, weather } = data;
      const icon = `https://openweathermap.org/img/wn/${weather[0]["icon"]}@2x.png`;
      const li = document.createElement("li");
      const markup = `
      <h2 class="city-name" data-name="${name},${sys.country}">
        <span>${name}</span>
        <sup>${sys.country}</sup>
      </h2>
      <div class="city-temp">${Math.round(main.temp)}<sup>°C</sup></div>
      <figure>
        <img class="city-icon" src=${icon} alt=${weather[0]["main"]}>
        <figcaption>${weather[0]["description"]}</figcaption>
      </figure>
      `;

      li.classList.add("city");
      li.setAttribute("id", `li${myStorage.length}`);
      li.innerHTML = markup;
      list.appendChild(li);

      deleteCity(li);
      saveInStorage(li);
    })
    .catch(() => {
      msg.textContent = "Please search for a valid city 😩";
    });
}

function saveInStorage(li) {
  myStorage.setItem(`li${myStorage.length}`, JSON.stringify(li.innerHTML));
}

function deleteCity(li) {
  li.addEventListener("click", (e) => {
    const target = e.currentTarget;

    myStorage.removeItem(`${li.id}`);
    target.remove();
  });
}
