let canvas = document.getElementById("areaJuego");
let ctx = canvas.getContext("2d");
let gatoX = 0;
let gatoY = 0;
let comidaX = 0;
let comidaY = 0;

const ANCHO_GATO = 50;
const ALTO_GATO = 50;
const ANCHO_COMIDA = 30;
const ALTO_COMIDA = 30;

document.getElementById("btnArriba").onclick = moverArriba;
document.getElementById("btnAbajo").onclick = moverAbajo;
document.getElementById("btnIzquierda").onclick = moverIzquierda;
document.getElementById("btnDerecha").onclick = moverDerecha;

iniciarJuego();
//window.onload = iniciarJuego;

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
}

function moverIzquierda()
{
    gatoX -= 10;
    limpiarCanva();
    graficarGato();
    graficarComida();
    detectarColision();
}

function moverArriba()
{
    gatoY -= 10;
    limpiarCanva();
    graficarGato();
    graficarComida();
    detectarColision();
}
function moverAbajo()
{
    gatoY += 10;
    limpiarCanva();
    graficarGato();
    graficarComida();
    detectarColision();
}

function moverDerecha()
{
    gatoX += 10;
    limpiarCanva();
    graficarGato();
    graficarComida();
    detectarColision();
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
        alert("¡El gato atrapo la comida!");
    }
}


