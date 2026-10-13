const API_URL = ['localhost', '127.0.0.1'].includes(location.hostname)
  ? 'http://localhost:3000/api'
      : 'https://comidas-app-five.vercel.app/api';

const $ = s => document.querySelector(s);
const lista = $('#lista');
const status = $('#status');
const contador = $('#contador');
const busca = $('#busca');
const modal = $('#modal');
const form = $('#form');
const erroForm = $('#erroForm');
const preview = $('#preview');
const tpl = $('#tplCard');

const moeda = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });
const FOTO_PADRAO = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 4 3"><rect width="4" height="3" fill="%23ead9c2"/><text x="2" y="1.9" font-size="1" text-anchor="middle">🍽️</text></svg>';

let comidas = [];
let timer;

async function api(caminho = '', opcoes = {}) {
  const res = await fetch(`${API_URL}/comidas${caminho}`, {
    headers: { 'Content-Type': 'application/json' },
    ...opcoes
  });
  const dados = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(dados.erro || `Erro ${res.status}`);
  return dados;
}

async function carregar() {
  status.textContent = 'Carregando…';
  try {
    const q = busca.value.trim();
    comidas = await api(q ? `?q=${encodeURIComponent(q)}` : '');
    renderizar();
  } catch (e) {
    lista.innerHTML = '';
    contador.textContent = '';
    status.textContent = `Não foi possível conectar à API (${e.message}).`;
  }
}

function renderizar() {
  lista.innerHTML = '';
  contador.textContent = `${comidas.length} ${comidas.length === 1 ? 'item' : 'itens'}`;
  status.textContent = comidas.length ? '' : busca.value ? 'Nada encontrado para essa busca.' : 'Nenhuma comida cadastrada ainda.';

  for (const c of comidas) {
    const card = tpl.content.cloneNode(true);
    const img = card.querySelector('img');
    img.src = c.foto;
    img.alt = c.nome;
    img.onerror = () => { img.onerror = null; img.src = FOTO_PADRAO; };
    card.querySelector('.card__marca').textContent = c.marca;
    card.querySelector('.card__nome').textContent = c.nome;
    card.querySelector('.card__preco').textContent = moeda.format(c.preco);
    card.querySelector('[data-acao="editar"]').onclick = () => abrir(c);
    card.querySelector('[data-acao="excluir"]').onclick = () => excluir(c);
    lista.appendChild(card);
  }
}

function abrir(c = null) {
  form.reset();
  erroForm.textContent = '';
  $('#modalTitulo').textContent = c ? 'Editar comida' : 'Nova comida';
  $('#id').value = c?._id || '';
  $('#marca').value = c?.marca || '';
  $('#nome').value = c?.nome || '';
  $('#preco').value = c?.preco ?? '';
  $('#foto').value = c?.foto || '';
  atualizarPreview();
  modal.showModal();
}

function atualizarPreview() {
  const url = $('#foto').value.trim();
  preview.hidden = !/^https?:\/\//i.test(url);
  if (!preview.hidden) preview.src = url;
}

async function salvar(e) {
  e.preventDefault();
  if (!form.reportValidity()) return;
  const id = $('#id').value;
  const corpo = {
    marca: $('#marca').value.trim(),
    nome: $('#nome').value.trim(),
    preco: Number($('#preco').value),
    foto: $('#foto').value.trim()
  };
  const botao = $('#btnSalvar');
  botao.disabled = true;
  erroForm.textContent = '';
  try {
    await api(id ? `/${id}` : '', { method: id ? 'PUT' : 'POST', body: JSON.stringify(corpo) });
    modal.close();
    await carregar();
  } catch (err) {
    erroForm.textContent = err.message;
  } finally {
    botao.disabled = false;
  }
}

async function excluir(c) {
  if (!confirm(`Excluir "${c.nome}"?`)) return;
  try {
    await api(`/${c._id}`, { method: 'DELETE' });
    await carregar();
  } catch (e) {
    alert(e.message);
  }
}

$('#btnNovo').onclick = () => abrir();
$('#btnCancelar').onclick = () => modal.close();
$('#foto').addEventListener('input', atualizarPreview);
preview.onerror = () => { preview.hidden = true; };
form.addEventListener('submit', salvar);
busca.addEventListener('input', () => {
  clearTimeout(timer);
  timer = setTimeout(carregar, 300);
});

carregar();
