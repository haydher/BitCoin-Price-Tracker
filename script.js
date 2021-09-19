// get push notification permission
// default, granted, denied
// if notification allowed then show notification
if (Notification.permission === "granted") {
 // show notification access
 console.log("permission ", Notification.permission);
 // show desktop notification
 // showNotification();
} else if (Notification.permission !== "denied") {
 // if notification is "default" then ask for it
 // read notification type
 Notification.requestPermission().then((performance) => {
  // if notification is allowed then show the notification
  if (Notification.permission === "granted") {
   // show notification status
   console.log("permission ", Notification.permission);
   // show notification
   // showNotification();
  }
 });
}

const intervalTime = 3000;
const chartDataLimit = 90;

const lastUpdated = document.querySelector("#lastUpdated");

const lowestHTML = document.querySelector("#lowest");
const highestHTML = document.querySelector("#highest");
const CurrPrice = document.querySelector("#CurrPrice");
const priceChangeColor = document.querySelectorAll(".CurrPrice");
const priceChangePic = document.querySelector(".priceChangePic");

const lowestValue = document.querySelector("#lowestValue");
const highValue = document.querySelector("#highValue");

const lowestLimit = document.querySelector("#lowestLimit");
const highestLimit = document.querySelector("#highestLimit");

let lowestLimitNotif = 0,
 highestLimitNotif = 0;

// update the notification values
const btn = document.querySelector("button");
btn.addEventListener("click", (e) => {
 e.preventDefault();
 if (lowestValue.value != 0) {
  lowestLimit.innerHTML = lowestValue.value;
  lowestLimitNotif = lowestValue.value;
  lowestValue.value = "";
 }
 if (highValue.value != 0) {
  highestLimit.innerHTML = highValue.value;
  highestLimitNotif = highValue.value;
  highValue.value = "";
 }
});

const apiCall = "https://api.coindesk.com/v1/bpi/currentprice.json";

let i = 0,
 previousPrice = 0,
 priceRate,
 priceArr = [],
 lowest = 0,
 highest = 0;

function getData() {
 fetch(apiCall)
  .then((response) => response.json())
  .then((data) => {
   // get the time for the graph
   const newDate = new Date();
   const currTime = `${newDate.getHours().toString()}:${newDate.getMinutes().toString()}`;

   // turn the string into number
   priceRate = data.bpi.USD.rate.replace(/,/g, "");
   // console.log(priceRate);

   // update the price on the screen
   if (priceRate < lowest || lowest == 0) {
    lowest = priceRate;
    lowestHTML.innerHTML = formateNumber(lowest);
   }
   // update the price on the screen
   if (priceRate > highest || highest == 0) {
    highest = priceRate;
    highestHTML.innerHTML = formateNumber(highest);
   }
   // notify if price drops
   if (lowest <= lowestLimitNotif) {
    showLowestNotification(lowest);
   }
   // notify if price gets high
   if (highest >= highValue) {
    showHighestNotification(highest);
   }
   // update the graph
   if (previousPrice != priceRate) {
    addData(chart, currTime, priceRate, lowest, highest);
    i++;
    // if too many items in chart
    if (i > chartDataLimit) removeData(chart);
   }
   if (priceRate < previousPrice) {
    priceChangeColor.forEach((element) => {
     element.style.color = "#FF2C2C";
    });
    priceChangePic.src = "imgs/priceDown.svg";
   }
   CurrPrice.innerHTML = formateNumber(priceRate);
   previousPrice = priceRate;
  });

 // show last updated time under the graph
 lastUpdated.innerHTML = intervalTime / 1000;
}

getData();

setInterval(getData, intervalTime);

let checkNotificationShown = false;
function showLowestNotification(lowest) {
 if (checkNotificationShown == false) {
  //  get new notification
  let notification = new Notification(
   // show the title
   `Price of BitCoin is now ${lowest}`,
   {
    // show body of the notification
    body: `LOW PRICE TO BUY. The price right now is at ${lowest}`,
   }
  );
  // on click function
  notification.onclick = (e) => {
   e.preventDefault();
   // console.log(e);
   checkNotificationShown = true;
  };
  checkNotificationShown = true;
 }
}

function showHighestNotification(highest) {
 if (checkNotificationShown == false) {
  //  get new notification
  let notification = new Notification(
   // show the title
   `Price is at now ${highest}`,
   {
    // show body of the notification
    body: "Hey the price is going down from the highest. Better Sell Now!!",
   }
  );
  // on click function
  notification.onclick = (e) => {
   e.preventDefault();
   // console.log(e);
   checkNotificationShown = true;
  };
  checkNotificationShown = true;
 }
}
// show notification again after 5 mins
function pauseNotification() {
 if (checkNotificationShown == true) {
  checkNotificationShown = false;
 }
}
setInterval(pauseNotification, 300000);

const canvas = document.querySelector("canvas").getContext("2d");
const chart = new Chart(canvas, {
 // The type of chart we want to create
 type: "line",
 // The data for our dataset
 data: {
  labels: [],
  datasets: [
   {
    label: `Price `,
    backgroundColor: "#80b6f4",
    borderColor: "#80b6f4",
    pointBorderColor: "#80b6f4",
    pointBackgroundColor: "#80b6f4",
    pointHoverBackgroundColor: "#80b6f4",
    pointHoverBorderColor: "#80b6f4",
    pointBorderWidth: 5,
    pointHoverRadius: 10,
    pointHoverBorderWidth: 1,
    pointRadius: 2,
    fill: false,
    borderWidth: 2,
    data: [],
   },
  ],
 },

 // Configuration options go here
 options: {
  scales: {
   yAxes: [
    {
     ticks: {
      min: 0,
      max: 1,
      stepSize: 100,
      fontColor: "rgba(0,0,0,0.5)",
     },
    },
   ],
   xAxes: [
    {
     gridLines: {
      zeroLineColor: "transparent",
      display: false,
     },
     ticks: {
      padding: 20,
      fontColor: "rgba(0,0,0,0.5)",
      fontStyle: "bold",
     },
    },
   ],
  },
 },
});

function addData(chart, label, data, lowest, highest) {
 // sort the array to geet the smallest and largest values of the chart from data to plot graph
 const sortedArr = chart.data.datasets[0].data.sort();
 let smallest, biggest;
 if (sortedArr.length === 0) {
  smallest = lowest;
  biggest = highest;
 } else {
  smallest = sortedArr[0];
  // gets the last value of the array. if the array hols only 1 value then use the highest number
  if (sortedArr.length >= 2 || sortedArr != undefined) biggest = sortedArr[sortedArr.length - 1];
 }

 // update the labes (0, 1, 2 ..)
 chart.data.labels.push(label);
 // update the chart height. min
 // round the numbers to the nearest 100
 chart.options.scales.yAxes[0].ticks.min = Math.ceil((Number(smallest) - 150) / 100) * 100;
 // update the chart height. max
 // round the numbers to the nearest 100
 chart.options.scales.yAxes[0].ticks.max = Math.ceil((Number(biggest) + 150) / 100) * 100;
 // push the graph values in the chart
 chart.data.datasets.forEach((dataset) => {
  dataset.data.push(data);
 });
 chart.update();
}
function removeData(chart) {
 chart.data.labels.shift();
 chart.data.datasets.forEach((dataset) => {
  dataset.data.shift();
 });
 chart.update();
}

function formateNumber(number) {
 return roundNumber(number)
  .toString()
  .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
function roundNumber(number) {
 return Math.round(number * 100) / 100;
}
// const notifyBtn = document.querySelector("#notifyMe");
// notifyBtn.addEventListener("click", () => {
//  setInterval(() => {
//   testNotification();
//  }, 3000);
// });

// function testNotification() {
//  //  get new notification
//  let notification = new Notification(
//   // show the title
//   `Testing Testing  Testing`,
//   {
//    // show body of the notification
//    body: `Test Successful`,
//   }
//  );
//  // on click function
//  notification.onclick = (e) => {
//   e.preventDefault();
//   // console.log(e);
//   window.open("https://www.haydher.tk/");
//  };
//  console.log("notification sent");
// }
