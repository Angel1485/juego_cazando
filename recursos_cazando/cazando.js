let canvas = document.getElementById("areaJuego");
let ctx = canvas.getContext("2d");
let gatoX = 0;
let gatoY = 0;
let comidaX = 100;
let comidaY = 200;
let puntaje = 0;
let tiempo = 10;
let intervalo;

const ANCHO_GATO = 50;
const ALTO_GATO = 50;
const ANCHO_COMIDA = 30;
const ALTO_COMIDA = 30;

document.getElementById("btnArriba").onclick = moverArriba;
document.getElementById("btnAbajo").onclick = moverAbajo;
document.getElementById("btnIzquierda").onclick = moverIzquierda;
document.getElementById("btnDerecha").onclick = moverDerecha;
document.getElementById("btnReiniciar").onclick = reiniciarJuego;

function graficarRectangulo(x,y,ancho,alto,color)
{
    ctx.fillStyle = color;
    ctx.fillRect(x,y,ancho,alto);
}

function graficarGato()
{
    graficarRectangulo(gatoX,gatoY,ANCHO_GATO,ALTO_GATO,"#500C78");
}

function graficarComida()
{
    graficarRectangulo(comidaX,comidaY,ANCHO_COMIDA,ALTO_COMIDA,"#19780c");
}

function iniciarJuego()
{
    gatoX = (canvas.width / 2) - (ANCHO_GATO / 2); 
    gatoY = (canvas.height / 2) - (ALTO_GATO / 2);
    graficarGato();
    graficarComida();
    intervalo = setInterval(restarTiempo, 1000);
}

function moverIzquierda()
{
     if (gatoX - 10 >= 0)
     {
        gatoX -= 10;
        limpiarCanva();
        graficarGato();
        graficarComida();
        detectarColision();
     }
    
}

function moverArriba()
{
    if (gatoY - 10 >= 0)
    {
        gatoY -= 10;
        limpiarCanva();
        graficarGato();
        graficarComida();
        detectarColision();
    }
    
}
function moverAbajo()
{
    if (gatoY + ALTO_GATO + 10 <= canvas.height)
    {
        gatoY += 10;
        limpiarCanva();
        graficarGato();
        graficarComida();
        detectarColision();
    }
    
}

function moverDerecha()
{
    if (gatoX + ANCHO_GATO + 10 <= canvas.width)
    {
        gatoX += 10;
        limpiarCanva();
        graficarGato();
        graficarComida();
        detectarColision();
    }
    
}

function limpiarCanva()
{
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function detectarColision()
{
    if (gatoX < comidaX + ANCHO_COMIDA &&
        gatoX + ANCHO_GATO > comidaX &&
        gatoY < comidaY + ALTO_COMIDA &&
        gatoY + ALTO_GATO > comidaY)
    {
        comidaX = generarAleatorio(0, canvas.width - ANCHO_COMIDA);
        comidaY = generarAleatorio(0, canvas.height - ALTO_COMIDA);

        puntaje += 3; // se aumenta el puntaje para la prueba de ganador
        mostrarEnSpan("spanPuntaje", puntaje);

        limpiarCanva();
        graficarGato();
        graficarComida();

         if (puntaje >= 6)
        {
            alert("¡Felicidades, ganaste! Puntaje: " + puntaje);
            reiniciarJuego()
        }
 
    }
}

function generarAleatorio(min,max){
    let random=Math.random();
    let numero=random*(max-min+1);
    let numeroEntero = Math.ceil(numero);
    numeroEntero = numeroEntero+min-1;
    return numeroEntero
}

function mostrarEnSpan(spanId,valor){
    let componente=document.getElementById(spanId);
    componente.textContent=valor;
}

function restarTiempo()
{
    tiempo -= 1;
    mostrarEnSpan("spanTiempo", tiempo);

    if (tiempo <= 0)
    {
        alert("¡Game Over! Tu puntaje fue: " + puntaje);
        reiniciarJuego()
    }
}

function reiniciarJuego()
{
    clearInterval(intervalo);

    tiempo = 10;
    puntaje = 0;
    gatoX = (canvas.width / 2) - (ANCHO_GATO / 2);
    gatoY = (canvas.height / 2) - (ALTO_GATO / 2);
    comidaX = generarAleatorio(0, canvas.width - ANCHO_COMIDA);
    comidaY = generarAleatorio(0, canvas.height - ALTO_COMIDA);

    mostrarEnSpan("spanTiempo", tiempo);
    mostrarEnSpan("spanPuntaje", puntaje);

    limpiarCanva();
    graficarGato();
    graficarComida();

    intervalo = setInterval(restarTiempo, 1000);
}
