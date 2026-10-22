
    // 1. Capturamos el canvas y su contexto de dibujo
    const canvas = document.getElementById("canvasJuego");
    const ctx = canvas.getContext("2d");
    const TAMANIO_CELDA = 25;
    const FILAS = canvas.height / TAMANIO_CELDA;
    const serpiente = [
    { x: 10, y: 10 }, 
    { x: 10, y: 9 },
    { x: 9, y: 9 },
    { x: 8, y: 9 },
    
    ];
      
    let intervaloSerpiente = null;
    let direccionActual = "derecha";
    let velocidad = 300;    
    let juegoTerminado = false;
    let segundos = 0;
    let intervaloTiempo = null;

    const comida = {
    x: Math.floor(Math.random() * (canvas.width / TAMANIO_CELDA)),
    y: Math.floor(Math.random() * (canvas.height / TAMANIO_CELDA))
    };  

    // Primera pintura del juego al cargar la página
    


    let puntaje = 0; 

  function reiniciarJuego() {
  pausarJuego(); 
  segundos = 0;
  document.getElementById("tiempo").innerText = "0 s";

  serpiente.length = 0;
  serpiente.push(
    { x: 10, y: 10 },
    { x: 10, y: 9 },
    { x: 9, y: 9 },
    { x: 8, y: 9 }
  );

  puntaje = 0;
  direccionActual = "derecha";
  juegoTerminado = false; // Quita el GAME OVER

  document.getElementById("puntaje").innerText = puntaje;
  document.getElementById("estado").innerText = "Listo";
  document.getElementById("mensaje").innerText =
    "Pulsa Iniciar para comenzar.";

  generarComida();
  dibujarTodo();
}

dibujarTodo();

    // =========================
    // FUNCIONES DE DIBUJO
    // =========================

    function limpiarCanvas() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

   function dibujarTodo() {
    limpiarCanvas();
    dibujarTablero();
    pintarComida();
    pintarSerpiente();
    }

    function dibujarTablero(){
      
      ctx.strokeStyle = "red";
      for (let x=25; x<= canvas.width; x += TAMANIO_CELDA){

      
      ctx.beginPath();
      ctx.moveTo(x,0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke()
      }
      for (let y=25; y<= canvas.height; y += TAMANIO_CELDA){

      ctx.beginPath();
      ctx.moveTo(0,y);
      ctx.lineTo(canvas.width,y);
      ctx.stroke()
      }
      
    }
    
    function pintarParte (lineaX, lineaY, color ="red"){
      
      const x = lineaX * TAMANIO_CELDA;
      const y = lineaY * TAMANIO_CELDA;
      ctx.fillStyle = color;
      ctx.fillRect(x,y,TAMANIO_CELDA,TAMANIO_CELDA);
      ctx.strokeStyle = "#062562";
      ctx.strokeRect(x,y,TAMANIO_CELDA, TAMANIO_CELDA);
      
    }

   function pintarSerpiente() {
    for (let i = 0; i < serpiente.length; i++) {
    const parte = serpiente[i];
    let color = "red";
    if (i === 0) {
      color = "yellow";
    }
    pintarParte(parte.x, parte.y, color);
  }
}

function moverDerecha() {
  const cabeza = serpiente[0]; 

  const nuevaCabeza = {
    x: cabeza.x + 1, 
    y: cabeza.y     
  };

  serpiente.unshift(nuevaCabeza); 
  serpiente.pop();
}

function moverIzquierda() {
  const cabeza = serpiente[0];
  const nuevaCabeza = {
    x: cabeza.x - 1, // Una columna a la izquierda
    y: cabeza.y
  };
  serpiente.unshift(nuevaCabeza);
  serpiente.pop();
}

function moverArriba() {
  const cabeza = serpiente[0];
  const nuevaCabeza = {
    x: cabeza.x,
    y: cabeza.y - 1 // Una fila hacia arriba
  };
  serpiente.unshift(nuevaCabeza);
  serpiente.pop();
}

function moverAbajo() {
  const cabeza = serpiente[0];
  const nuevaCabeza = {
    x: cabeza.x,
    y: cabeza.y + 1 
  };
  serpiente.unshift(nuevaCabeza);
  serpiente.pop();
}

function cambiarDireccion(direccion) {
  const cabeza = serpiente[0];
  const cuello = serpiente[1];

  // Calcula dónde quedaría la cabeza con la dirección elegida
  let siguienteX = cabeza.x;
  let siguienteY = cabeza.y;

  if (direccion === "derecha") {
    siguienteX++;
  } else if (direccion === "izquierda") {
    siguienteX--;
  } else if (direccion === "arriba") {
    siguienteY--;
  } else if (direccion === "abajo") {
    siguienteY++;
  } else {
    return; // Ignora direcciones desconocidas
  }

  // Si intentaría ocupar el cuello, rechaza el cambio
  if (cuello &&
      siguienteX === cuello.x &&
      siguienteY === cuello.y) {
    return;
  }

  direccionActual = direccion;
}
function moverSerpiente() {
  if (juegoTerminado) {
    return; // No permite seguir moviéndose
  }

  const colaAnterior = serpiente[serpiente.length - 1];

  if (direccionActual === "derecha") {
    moverDerecha();
  } else if (direccionActual === "izquierda") {
    moverIzquierda();
  } else if (direccionActual === "arriba") {
    moverArriba();
  } else if (direccionActual === "abajo") {
    moverAbajo();
  }

  if (tocaBorde()) {
    pausarJuego(); // Detiene el temporizador
    juegoTerminado = true;
    document.getElementById("estado").innerText = "GAME OVER";
    document.getElementById("mensaje").innerText =
      "¡Chocaste con el borde! Pulsa Reiniciar.";
    return; // Termina aquí, sin revisar comida
  }

  if (atrapaComida()) {
    puntaje++;
    document.getElementById("puntaje").innerText = puntaje;
    serpiente.push(colaAnterior);
    generarComida();
  }

  dibujarTodo();
}

function iniciarJuego() {
  if (juegoTerminado) {
    return; // Primero debe reiniciar si perdió
  }

  if (intervaloSerpiente === null) {
    intervaloSerpiente = setInterval(moverSerpiente, velocidad);
    document.getElementById("estado").innerText = "Jugando";
    document.getElementById("mensaje").innerText =
      "Usa las flechas del juego para llegar a la comida.";
    intervaloTiempo = setInterval(function () {
    segundos++; // Suma un segundo
    document.getElementById("tiempo").innerText = segundos + " s";
}, 1000);
  }
  
}

function pausarJuego() {
  clearInterval(intervaloSerpiente); 
  intervaloSerpiente = null;
  clearInterval(intervaloTiempo); 
intervaloTiempo = null;         
}

function pintarComida() {
  pintarParte(comida.x, comida.y, "blue");
}

function atrapaComida() {
  const cabeza = serpiente[0];

  // Deben coincidir tanto la columna como la fila
  return cabeza.x === comida.x && cabeza.y === comida.y;
}

function generarComida() {
  do {
    comida.x = Math.floor(
      Math.random() * (canvas.width / TAMANIO_CELDA)
    );
    comida.y = Math.floor(
      Math.random() * (canvas.height / TAMANIO_CELDA)
    );
  } while (
    // Repite si la comida aparece sobre la serpiente
    serpiente.some(parte =>
      parte.x === comida.x && parte.y === comida.y
    )
  );
}

function tocaBorde() {
  const cabeza = serpiente[0];
  const columnas = canvas.width / TAMANIO_CELDA;
  const filas = canvas.height / TAMANIO_CELDA;

  return cabeza.x < 0 || cabeza.x >= columnas ||
         cabeza.y < 0 || cabeza.y >= filas;
}