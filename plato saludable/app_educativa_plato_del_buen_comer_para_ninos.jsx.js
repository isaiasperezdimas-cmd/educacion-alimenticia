<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Juego Interactivo: ¿Es saludable?</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      text-align: center;
      background: linear-gradient(#d9fdd3, #a8e6a3);
    }

    #container {
      position: relative;
      display: inline-block;
    }

    img {
      width: 320px;
      border-radius: 50%;
    }

    .sector {
      position: absolute;
      width: 320px;
      height: 320px;
      border-radius: 50%;
      top: 0;
      left: 0;
      pointer-events: none;
    }

    .verde { box-shadow: 0 0 40px green inset; animation: blink 1s infinite; }
    .amarillo { box-shadow: 0 0 40px orange inset; animation: blink 1s infinite; }
    .rojo { box-shadow: 0 0 40px red inset; animation: blink 1s infinite; }

    @keyframes blink {
      0% { opacity: 1; }
      50% { opacity: 0.3; }
      100% { opacity: 1; }
    }

    #result {
      font-size: 28px;
      margin-top: 20px;
      font-weight: bold;
    }

    button {
      padding: 10px 20px;
      font-size: 18px;
      margin-top: 10px;
      border-radius: 10px;
      border: none;
      background-color: #4CAF50;
      color: white;
      cursor: pointer;
    }
  </style>
</head>
<body>

  <h1>🍽️ Juego Interactivo</h1>
  <p>Toma una foto 📸 y aprende jugando</p>

  <div id="container">
    <img id="plato" src="IMG-20260324-WA0001.jpg">
    <div id="highlight" class="sector"></div>
  </div>

  <br>
  <input type="file" accept="image/*" capture="camera" onchange="analyzeFood(event)">

  <div id="result"></div>

  <button onclick="resetApp()">Reiniciar 🔄</button>

  <!-- Sonidos -->
  <audio id="goodSound" src="https://www.soundjay.com/buttons/sounds/button-4.mp3"></audio>
  <audio id="badSound" src="https://www.soundjay.com/buttons/sounds/button-10.mp3"></audio>

  <script>
    function hablar(texto) {
      const voz = new SpeechSynthesisUtterance(texto);
      voz.lang = "es-MX";
      speechSynthesis.speak(voz);
    }

    async function analyzeFood(event) {
      const file = event.target.files[0];
      const result = document.getElementById('result');
      const highlight = document.getElementById('highlight');
      const goodSound = document.getElementById('goodSound');
      const badSound = document.getElementById('badSound');

      highlight.className = "sector";
      result.innerHTML = "Pensando... 🤔";

      const formData = new FormData();
      formData.append('image', file);

      try {
        const response = await fetch('https://api.imagga.com/v2/tags', {
          method: 'POST',
          headers: {
            'Authorization': 'Basic YWNjX2RkMzNlODFlNDE1YmNmMCA5NDhkNjYxODE4NTMzMmFiNjZmNDlmZjBkNmRhODkzNg=='
          },
          body: formData
        });

        const data = await response.json();
        const tags = data.result.tags.map(t => t.tag.en);

        // MÁS ALIMENTOS (incluye mexicanos)
        const verduras = ['apple','banana','fruit','vegetable','carrot','tomato','lettuce','avocado','salad'];
        const cereales = ['bread','rice','corn','tortilla','pasta','cereal'];
        const proteinas = ['chicken','egg','beans','meat','fish','beef','pork','lentils'];

        if (tags.some(tag => verduras.includes(tag))) {
          result.innerHTML = "👍🏻 Sí es saludable";
          highlight.classList.add('verde');
          goodSound.play();
          hablar("Muy bien, es saludable");
        } else if (tags.some(tag => cereales.includes(tag))) {
          result.innerHTML = "👍🏻 Sí es saludable";
          highlight.classList.add('amarillo');
          goodSound.play();
          hablar("Muy bien, es saludable");
        } else if (tags.some(tag => proteinas.includes(tag))) {
          result.innerHTML = "👍🏻 Sí es saludable";
          highlight.classList.add('rojo');
          goodSound.play();
          hablar("Muy bien, es saludable");
        } else {
          result.innerHTML = "👎🏻 No es saludable";
          badSound.play();
          hablar("No es saludable");
        }

      } catch (error) {
        result.innerHTML = "Error 😢";
      }
    }

    function resetApp() {
      document.getElementById('highlight').className = "sector";
      document.getElementById('result').innerHTML = "";
    }
  </script>

</body>
</html>
