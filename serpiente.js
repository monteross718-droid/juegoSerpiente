
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
      

    // Primera pintura del juego al cargar la página
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


