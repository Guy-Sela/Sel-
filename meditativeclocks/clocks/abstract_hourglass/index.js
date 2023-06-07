  onload = setCurrentTime;

  let upperSeconds = document.getElementById("rectangle1_seconds");
  let lowerSeconds = document.getElementById("rectangle2_seconds");

  let upperMinutes = document.getElementById("rectangle1_minutes");
  let lowerMinutes = document.getElementById("rectangle2_minutes");
  
  let upperHours = document.getElementById("rectangle1_hours");
  let lowerHours = document.getElementById("rectangle2_hours");

  function setCurrentTime() {
      let currentSecond = new Date().getSeconds();
      upperSeconds.style.height = 45 - (currentSecond * 0.75) + "%";
      lowerSeconds.style.height = (currentSecond * 0.75) + "%";

      let currentMinute = new Date().getMinutes();
      upperMinutes.style.height = 45 - (currentMinute * 0.75) + "%";
      lowerMinutes.style.height = (currentMinute * 0.75) + "%";

      let currentHour = new Date().getHours();
      upperHours.style.height = 45 - (currentHour * 1.875) + "%";
      lowerHours.style.height = (currentHour * 1.875) + "%";
  }

  setInterval(setCurrentTime, 1000);
