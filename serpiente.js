
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

    const comida = {
    x: Math.floor(Math.random() * (canvas.width / TAMANIO_CELDA)),
    y: Math.floor(Math.random() * (canvas.height / TAMANIO_CELDA))
    };  

    // Primera pintura del juego al cargar la página
    


    let puntaje = 0; 

  function reiniciarJuego() {
  pausarJuego(); // Detiene el movimiento

  serpiente.length = 0; // Vacía la serpiente
  serpiente.push(
    { x: 10, y: 10 },
    { x: 10, y: 9 },
    { x: 9, y: 9 },
    { x: 8, y: 9 }
  ); // Recupera su forma inicial

  puntaje = 0;
  document.getElementById("puntaje").innerText = puntaje;
  direccionActual = "derecha";

  generarComida();
  dibujarTodo(); // Muestra los cambios
}
comida.x = 11; // Una columna a la derecha de la cabeza
comida.y = 10; // Misma fila que la cabeza

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
  direccionActual = direccion; 
}

function moverSerpiente() {
  // Guarda la cola antes de que el movimiento la elimine
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

  if (atrapaComida()) {
    puntaje++; // Suma un punto
    console.log("Puntaje:", puntaje);
    document.getElementById("puntaje").innerText = puntaje;

    serpiente.push(colaAnterior);
    console.log("Cuadros:", serpiente.length); // Recupera la cola: crece un cuadro
    generarComida();              // Coloca otra comida
  }

  dibujarTodo(); // Actualiza la pantalla
}

function iniciarJuego() {
  if (intervaloSerpiente === null) {
  
    intervaloSerpiente = setInterval(moverSerpiente, 1000);
  }
}

function pausarJuego() {
  clearInterval(intervaloSerpiente); 
  intervaloSerpiente = null;         
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
