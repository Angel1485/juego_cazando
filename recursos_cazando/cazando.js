
// ===========================
// NEON CAT // CAZADOR v2.0
// ===========================
 
const canvas = document.getElementById("areaJuego");
const ctx = canvas.getContext("2d");
 
// Variables de posición
let gatoX = 0, gatoY = 0;
let comidaX = 100, comidaY = 200;
 
// Variables de juego
let puntaje = 0;
let tiempo = 15;  //Se cambia el limite de tiempo
let intervalo;
let record = 0;
let nivel = 1;
let vidas = 3;
let combo = 1;
let ultimaComida = 0;
let velocidad = 10;
let pausado = false;
let juegoActivo = false;
 
// Constantes de tamaño
const ANCHO_GATO = 50;
const ALTO_GATO = 50;
const ANCHO_COMIDA = 30;
const ALTO_COMIDA = 30;
 
// ===== BOTONES =====
document.getElementById("btnArriba").onclick = () => mover("arriba");
document.getElementById("btnAbajo").onclick = () => mover("abajo");
document.getElementById("btnIzquierda").onclick = () => mover("izquierda");
document.getElementById("btnDerecha").onclick = () => mover("derecha");
document.getElementById("btnReiniciar").onclick = reiniciarJuego;
 
// ===== TECLADO =====
document.addEventListener("keydown", (e) => {
  if (!juegoActivo || pausado) return;
  if (e.key === "ArrowUp"    || e.key === "w") mover("arriba");
  if (e.key === "ArrowDown"  || e.key === "s") mover("abajo");
  if (e.key === "ArrowLeft"  || e.key === "a") mover("izquierda");
  if (e.key === "ArrowRight" || e.key === "d") mover("derecha");
  if (e.key === "p" || e.key === "P") togglePausa();
  if (e.key === "r" || e.key === "R") reiniciarJuego();
});
 
// ===== DIBUJO =====
function graficarRectangulo(x, y, ancho, alto, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, ancho, alto);
}
 
function graficarGato() {
  // Sombra de neón
  ctx.shadowColor = "#bf00ff";
  ctx.shadowBlur = 20;
  ctx.font = `${ANCHO_GATO}px serif`;
  ctx.textBaseline = "top";
  ctx.fillText("🐱", gatoX, gatoY);
  ctx.shadowBlur = 0;
}
 
function graficarComida() {
  ctx.shadowColor = "#39ff14";
  ctx.shadowBlur = 15;
  ctx.font = `${ANCHO_COMIDA}px serif`;
  ctx.textBaseline = "top";
  ctx.fillText("🐭", comidaX, comidaY);
  ctx.shadowBlur = 0;
}
 
function limpiarCanva() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  // Grid de fondo
  ctx.strokeStyle = "rgba(0,245,255,0.04)";
  ctx.lineWidth = 1;
  for (let x = 0; x < canvas.width; x += 30) {
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height); ctx.stroke();
  }
  for (let y = 0; y < canvas.height; y += 30) {
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); ctx.stroke();
  }
}
 
// ===== MOVIMIENTO =====
function mover(direccion) {
  if (!juegoActivo || pausado) return;
  if (direccion === "arriba"    && gatoY - velocidad >= 0)                         gatoY -= velocidad;
  if (direccion === "abajo"     && gatoY + ALTO_GATO + velocidad <= canvas.height) gatoY += velocidad;
  if (direccion === "izquierda" && gatoX - velocidad >= 0)                         gatoX -= velocidad;
  if (direccion === "derecha"   && gatoX + ANCHO_GATO + velocidad <= canvas.width) gatoX += velocidad;
  limpiarCanva();
  graficarGato();
  graficarComida();
  detectarColision();
}
 
// ===== COLISION =====
function detectarColision() {
  if (gatoX < comidaX + ANCHO_COMIDA &&
      gatoX + ANCHO_GATO > comidaX &&
      gatoY < comidaY + ALTO_COMIDA &&
      gatoY + ALTO_GATO > comidaY)
  {
    // Calcular combo
    const ahora = Date.now();
    if (ahora - ultimaComida < 3000) combo++;
    else combo = 1;
    ultimaComida = ahora;
 
    const puntos = 1 * combo;
    puntaje += puntos;
 
    // Reposicionar comida
    comidaX = generarAleatorio(0, canvas.width - ANCHO_COMIDA);
    comidaY = generarAleatorio(0, canvas.height - ALTO_COMIDA);
 
    // Actualizar UI
    actualizarHUD();
    agregarLog(`+${puntos} pts ${combo > 1 ? "x" + combo + " COMBO!" : ""}`);
    mostrarMensaje(`+${puntos} ${combo > 1 ? "🔥 COMBO x" + combo : ""}`, 800);
 
    limpiarCanva();
    graficarGato();
    graficarComida();
 
    // Subir de nivel cada 5 puntos
    if (puntaje > 0 && puntaje % 5 === 0) subirNivel();
 
    // Ganar
    if (puntaje >= 6 * nivel) terminarJuego(true);
  }
}
 
// ===== NIVEL =====
function subirNivel() {
  nivel++;
  velocidad = Math.min(velocidad + 2, 20);
  mostrarEnSpan("spanNivel", String(nivel).padStart(2, "0"));
  agregarLog(`>> NIVEL ${nivel} DESBLOQUEADO`);
  mostrarMensaje(`⚡ NIVEL ${nivel}`, 1200);
}
 
// ===== TIEMPO =====
function restarTiempo() {
  tiempo--;
  mostrarEnSpan("spanTiempo", String(tiempo).padStart(3, "0"));
  actualizarBarraTiempo();
  if (tiempo <= 0) {
    vidas--;
    actualizarVidas();
    if (vidas <= 0) {
      terminarJuego(false);
    } else {
      tiempo = 15; // Se actualzia nuevo tiempo
      agregarLog(">> VIDA PERDIDA");
      mostrarMensaje("💔 VIDA PERDIDA", 1000);
    }
  }
}
 
// ===== FIN DE JUEGO =====
function terminarJuego(gano) {
  clearInterval(intervalo);
  juegoActivo = false;
  if (puntaje > record) {
    record = puntaje;
    mostrarEnSpan("spanRecord", String(record).padStart(3, "0"));
  }
  const overlay = document.getElementById("overlay");
  const title = document.getElementById("overlayTitle");
  const score = document.getElementById("overlayScore");
  overlay.classList.remove("hidden");
  title.textContent = gano ? "¡GANASTE!" : "GAME OVER";
  title.style.color = gano ? "var(--neon-green)" : "var(--neon-pink)";
  title.style.textShadow = gano ? "0 0 20px var(--neon-green)" : "0 0 20px var(--neon-pink)";
  score.textContent = `PUNTAJE: ${puntaje} | NIVEL: ${nivel} | RÉCORD: ${record}`;
  agregarLog(gano ? ">> VICTORIA" : ">> GAME OVER");
}
 
// ===== HUD =====
function actualizarHUD() {
  mostrarEnSpan("spanPuntaje", String(puntaje).padStart(3, "0"));
  mostrarEnSpan("spanCombo", `x${combo}`);
  const barPuntaje = document.getElementById("puntajeBar");
  if (barPuntaje) barPuntaje.style.width = Math.min((puntaje / (6 * nivel)) * 100, 100) + "%";
}
 
function actualizarBarraTiempo() {
  const bar = document.getElementById("tiempoBar");
  if (bar) bar.style.width = (tiempo / 15) * 100 + "%";
}
 
function actualizarVidas() {
  const vds = document.querySelectorAll(".life");
  vds.forEach((v, i) => {
    if (i >= vidas) v.classList.add("lost");
    else v.classList.remove("lost");
  });
}
 
function agregarLog(msg) {
  const log = document.getElementById("logPanel");
  if (!log) return;
  const linea = document.createElement("div");
  linea.textContent = `> ${msg}`;
  log.prepend(linea);
  if (log.children.length > 8) log.removeChild(log.lastChild);
}
 
function mostrarMensaje(texto, duracion) {
  const msg = document.getElementById("mensaje");
  if (!msg) return;
  msg.textContent = texto;
  setTimeout(() => { msg.textContent = ""; }, duracion);
}
 
// ===== PAUSA =====
function togglePausa() {
  if (!juegoActivo) return;
  pausado = !pausado;
  const btn = document.getElementById("btnPausa");
  if (pausado) {
    clearInterval(intervalo);
    btn.textContent = "▶ REANUDAR";
    mostrarMensaje("⏸ PAUSADO", 99999);
  } else {
    intervalo = setInterval(restarTiempo, 1000);
    btn.textContent = "⏸ PAUSA";
    mostrarMensaje("", 0);
  }
}
 
// ===== VELOCIDAD =====
function cambiarVelocidad() {
  const modos = [
    { nombre: "LENTO", vel: 6 },
    { nombre: "NORMAL", vel: 10 },
    { nombre: "RÁPIDO", vel: 16 },
    { nombre: "EXTREMO", vel: 22 }
  ];
  const actual = modos.findIndex(m => m.vel === velocidad);
  const siguiente = (actual + 1) % modos.length;
  velocidad = modos[siguiente].vel;
  document.getElementById("btnVelocidad").textContent = `⚡ VELOCIDAD: ${modos[siguiente].nombre}`;
  agregarLog(`>> VELOCIDAD: ${modos[siguiente].nombre}`);
}
 
// ===== INICIAR =====
function iniciarJuego() {
  juegoActivo = true;
  pausado = false;
  gatoX = (canvas.width / 2) - (ANCHO_GATO / 2);
  gatoY = (canvas.height / 2) - (ALTO_GATO / 2);
  limpiarCanva();
  graficarGato();
  graficarComida();
  actualizarHUD();
  actualizarBarraTiempo();
  mostrarEnSpan("spanNivel", "01");
  mostrarEnSpan("spanTiempo", "015");
  agregarLog(">> JUEGO INICIADO");
  intervalo = setInterval(restarTiempo, 1000);
}
 
// ===== REINICIAR =====
function reiniciarJuego() {
  clearInterval(intervalo);
  document.getElementById("overlay").classList.add("hidden");
  document.getElementById("btnPausa").textContent = "⏸ PAUSA";
  puntaje = 0;
  tiempo = 15;
  nivel = 1;
  vidas = 3;
  combo = 1;
  velocidad = 10;
  pausado = false;
  comidaX = generarAleatorio(0, canvas.width - ANCHO_COMIDA);
  comidaY = generarAleatorio(0, canvas.height - ALTO_COMIDA);
  actualizarVidas();
  mostrarEnSpan("spanCombo", "x1");
  document.getElementById("btnVelocidad").textContent = "⚡ VELOCIDAD: NORMAL";
  iniciarJuego();
}
 
// ===== UTILIDADES =====
function generarAleatorio(min, max) {
  let random = Math.random();
  let numero = random * (max - min + 1);
  let numeroEntero = Math.ceil(numero);
  numeroEntero = numeroEntero + min - 1;
  return numeroEntero;
}
 
function mostrarEnSpan(spanId, valor) {
  let componente = document.getElementById(spanId);
  if (componente) componente.textContent = valor;
}
 