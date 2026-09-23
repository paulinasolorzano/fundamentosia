const RULES = [
  { id: "R1", text: "Si la tierra está seca y no llueve, entonces las plantas necesitan agua.", formula: "(P ∧ ¬R) → A" },
  { id: "R2", text: "Si las plantas necesitan agua y el tanque tiene agua, entonces se activa el riego.", formula: "(A ∧ S) → B" },
  { id: "R3", text: "Si las plantas necesitan agua y el tanque no tiene agua, entonces se genera una alerta.", formula: "(A ∧ ¬S) → E" },
  { id: "R4", text: "Si la temperatura es alta, entonces se debe ventilar.", formula: "Q → C" },
  { id: "R5", text: "Si se debe ventilar y no hay personas, entonces se abre la ventana.", formula: "(C ∧ ¬T) → D" }
];

const CASES = [
  { name: "Caso 1", humedad: 22, temperatura: 34, llueve: false, tanque: 65, persona: false },
  { name: "Caso 2", humedad: 20, temperatura: 25, llueve: true, tanque: 70, persona: false },
  { name: "Caso 3", humedad: 18, temperatura: 31, llueve: false, tanque: 10, persona: true },
  { name: "Caso 4", humedad: 60, temperatura: 35, llueve: false, tanque: 80, persona: true },
  { name: "Caso 5", humedad: 45, temperatura: 24, llueve: false, tanque: 50, persona: false }
];

const $ = (id) => document.getElementById(id);
const inputs = { humedad: $("humedad"), temperatura: $("temperatura"), tanque: $("tanque"), llueve: $("llueve"), persona: $("persona") };

function inferir(datos) {
  const p = datos.humedad < 30;
  const q = datos.temperatura > 30;
  const r = datos.llueve;
  const s = datos.tanque > 20;
  const t = datos.persona;
  const steps = [];
  const actions = [];
  const a = p && !r;
  if (a) steps.push({ rule: "R1", text: "La tierra está seca y no llueve: las plantas necesitan agua." });
  const b = a && s;
  if (b) { steps.push({ rule: "R2", text: "Necesitan agua y el tanque tiene agua: el riego puede activarse." }); actions.push({ text: "Activar riego", type: "" }); }
  const e = a && !s;
  if (e) { steps.push({ rule: "R3", text: "Necesitan agua, pero el tanque no tiene suficiente: se genera una alerta." }); actions.push({ text: "Alerta: falta agua", type: "alert" }); }
  const c = q;
  if (c) steps.push({ rule: "R4", text: "La temperatura es alta: el invernadero debe ventilarse." });
  const d = c && !t;
  if (d) { steps.push({ rule: "R5", text: "Debe ventilarse y no hay personas: la ventana puede abrirse." }); actions.push({ text: "Abrir ventana", type: "" }); }
  if (c && t) actions.push({ text: "Ventilar manualmente", type: "alert" });
  return { props: { P: p, Q: q, R: r, S: s, T: t }, steps, actions };
}

function readInputs() {
  return { humedad: +inputs.humedad.value, temperatura: +inputs.temperatura.value, tanque: +inputs.tanque.value, llueve: inputs.llueve.checked, persona: inputs.persona.checked };
}

function render(datos = readInputs()) {
  $("humedadValue").value = `${datos.humedad} %`;
  $("temperaturaValue").value = `${datos.temperatura} °C`;
  $("tanqueValue").value = `${datos.tanque} %`;
  const result = inferir(datos);
  const labels = { P: "P · Tierra seca", Q: "Q · Temperatura alta", R: "R · Llueve", S: "S · Tanque con agua", T: "T · Hay una persona" };
  $("propositions").innerHTML = Object.entries(result.props).map(([key, value]) => `<span class="chip ${value ? "true" : "false"}">${labels[key]} · ${value ? "V" : "F"}</span>`).join("");
  $("inferenceList").innerHTML = result.steps.length ? result.steps.map(step => `<li><span class="rule-tag">${step.rule}</span><span>${step.text}</span></li>`).join("") : '<li class="empty">Ninguna regla produce una conclusión con estos datos.</li>';
  $("actions").innerHTML = result.actions.length ? result.actions.map(a => `<span class="action ${a.type}">${a.text}</span>`).join("") : '<span class="action none">Sin acciones</span>';
}

function loadCase(data) {
  Object.entries(data).forEach(([key, value]) => { if (inputs[key]) inputs[key].type === "checkbox" ? inputs[key].checked = value : inputs[key].value = value; });
  render();
  $("simulador").scrollIntoView({ behavior: "smooth", block: "start" });
}

function renderRules() {
  $("rulesGrid").innerHTML = RULES.map(rule => `<article class="rule-card"><span class="number">${rule.id}</span><p>${rule.text}</p><span class="formula">${rule.formula}</span></article>`).join("");
}

let checked = new Set();
function renderCases() {
  $("caseGrid").innerHTML = CASES.map((c, i) => `<article class="case-card" id="case-${i}"><h3>${c.name}</h3><div class="case-data"><span>Humedad: ${c.humedad} %</span><span>Temperatura: ${c.temperatura} °C</span><span>Llueve: ${c.llueve ? "Sí" : "No"}</span><span>Tanque: ${c.tanque} %</span><span>Persona: ${c.persona ? "Sí" : "No"}</span></div><div class="case-result" id="result-${i}"></div><button type="button" data-case="${i}">Ejecutar caso</button></article>`).join("");
  document.querySelectorAll("[data-case]").forEach(button => button.addEventListener("click", () => {
    const i = +button.dataset.case;
    const result = inferir(CASES[i]);
    const text = result.actions.length ? result.actions.map(a => a.text).join(" · ") : "Sin acciones";
    $(`result-${i}`).innerHTML = `<strong>Resultado:</strong><br>${text}`;
    $(`case-${i}`).classList.add("checked");
    checked.add(i); $("score").textContent = `${checked.size} / 5 comprobados`;
    loadCase(CASES[i]);
  }));
}

Object.values(inputs).forEach(input => input.addEventListener("input", () => render()));
$("resetBtn").addEventListener("click", () => loadCase(CASES[0]));
renderRules(); renderCases(); render();
