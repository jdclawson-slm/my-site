// Mobile nav toggle
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

navToggle.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', isOpen);
});

navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  });
});

// Scroll reveal animations
const revealEls = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

revealEls.forEach(el => revealObserver.observe(el));

// Footer year
document.getElementById('year').textContent = new Date().getFullYear();

// Weather widget (Open-Meteo, no API key needed)
const weatherIcon = document.getElementById('weatherIcon');
const weatherTemp = document.getElementById('weatherTemp');
const weatherDesc = document.getElementById('weatherDesc');

// Maps WMO weather codes to an emoji + short label
function getWeatherInfo(code) {
  const map = {
    0: ['☀️', 'Clear sky'],
    1: ['🌤️', 'Mostly clear'],
    2: ['⛅', 'Partly cloudy'],
    3: ['☁️', 'Overcast'],
    45: ['🌫️', 'Foggy'],
    48: ['🌫️', 'Foggy'],
    51: ['🌦️', 'Light drizzle'],
    53: ['🌦️', 'Drizzle'],
    55: ['🌦️', 'Heavy drizzle'],
    56: ['🌧️', 'Freezing drizzle'],
    57: ['🌧️', 'Freezing drizzle'],
    61: ['🌧️', 'Light rain'],
    63: ['🌧️', 'Rain'],
    65: ['🌧️', 'Heavy rain'],
    66: ['🌧️', 'Freezing rain'],
    67: ['🌧️', 'Freezing rain'],
    71: ['🌨️', 'Light snow'],
    73: ['🌨️', 'Snow'],
    75: ['🌨️', 'Heavy snow'],
    77: ['🌨️', 'Snow grains'],
    80: ['🌦️', 'Rain showers'],
    81: ['🌧️', 'Rain showers'],
    82: ['🌧️', 'Violent showers'],
    85: ['🌨️', 'Snow showers'],
    86: ['🌨️', 'Snow showers'],
    95: ['⛈️', 'Thunderstorm'],
    96: ['⛈️', 'Thunderstorm'],
    99: ['⛈️', 'Thunderstorm'],
  };
  return map[code] || ['🌎', 'Weather'];
}

function showWeatherError(message) {
  weatherIcon.textContent = '⚠️';
  weatherDesc.textContent = message;
}

function showWeatherPrompt(message) {
  weatherIcon.textContent = '📍';
  weatherTemp.textContent = '';
  weatherDesc.textContent = message;
}

function loadWeather(lat, lon) {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code&temperature_unit=fahrenheit`;

  fetch(url)
    .then(res => res.json())
    .then(data => {
      const current = data.current;
      if (!current) throw new Error('No data');
      const [icon, label] = getWeatherInfo(current.weather_code);
      weatherIcon.textContent = icon;
      weatherTemp.textContent = `${Math.round(current.temperature_2m)}°F`;
      weatherDesc.textContent = label;
    })
    .catch(() => showWeatherError('Weather unavailable'));
}

if ('geolocation' in navigator) {
  navigator.geolocation.getCurrentPosition(
    (position) => {
      loadWeather(position.coords.latitude, position.coords.longitude);
    },
    (error) => {
      if (error.code === error.PERMISSION_DENIED) {
        showWeatherPrompt('Enable location to see your weather.');
      } else {
        showWeatherError('Location unavailable');
      }
    },
    { timeout: 8000 }
  );
} else {
  showWeatherError('Location unsupported');
}
