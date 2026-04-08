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
const VELOCIDAD = 10;

document.getElementById("btnArriba").onclick = () => mover("arriba");
document.getElementById("btnAbajo").onclick = () => mover("abajo");
document.getElementById("btnIzquierda").onclick = () => mover("izquierda");
document.getElementById("btnDerecha").onclick = () => mover("derecha");

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

function mover(direccion)
{
    if (direccion === "arriba") gatoY -= VELOCIDAD;     
    if (direccion === "abajo") gatoY += VELOCIDAD;     
    if (direccion === "izquierda") gatoX -= VELOCIDAD;     
    if (direccion === "derecha") gatoX += VELOCIDAD;
    graficarGato();
}

iniciarJuego();
//window.onload = iniciarJuego;


