const CLE_LOCAL_STORAGE = 'taches_lpta2';

const formTache = document.querySelector('#formTache');
const champTitre = document.querySelector('#champTitre');
const champDescription = document.querySelector('#champDescription');
const champPriorite = document.querySelector('#champPriorite');
const listeTaches = document.querySelector('#listeTaches');
const compteurResultats = document.querySelector('#compteurResultats');
const boutonsFiltre = document.querySelectorAll('.bouton-filtre');

let taches = JSON.parse(localStorage.getItem(CLE_LOCAL_STORAGE) || '[]');
let filtreActif = 'toutes';

function sauvegarder() {
  localStorage.setItem(CLE_LOCAL_STORAGE, JSON.stringify(taches));
}

function classePriorite(priorite) {
  if (priorite === 'Haute') return 'priorite-haute';
  if (priorite === 'Moyenne') return 'priorite-moyenne';
  return 'priorite-basse';
}

function render() {
  let listeFiltre = taches;

  if (filtreActif === 'en-cours') {
    listeFiltre = taches.filter((t) => !t.completee);
  }

  if (filtreActif === 'completees') {
    listeFiltre = taches.filter((t) => t.completee);
  }

  compteurResultats.textContent =
    listeFiltre.length <= 1 ? `${listeFiltre.length} tâche` : `${listeFiltre.length} tâches`;

  if (listeFiltre.length === 0) {
    listeTaches.innerHTML = '<p class="message-vide">Aucune tâche pour ce filtre.</p>';
    return;
  }

  listeTaches.innerHTML = listeFiltre
    .map(
      (t) => `
      <article class="carte-tache ${t.completee ? 'completee' : ''}" data-id="${t.id}">
        <h3>${t.titre}</h3>
        <p>${t.description}</p>
        <div class="meta-tache">
          <span class="badge-priorite ${classePriorite(t.priorite)}">Priorité : ${t.priorite}</span>
          <span>${t.completee ? 'État : Complétée' : 'État : En cours'}</span>
        </div>
        <div class="actions-tache">
          <button type="button" data-action="toggle">${t.completee ? 'Remettre en cours' : 'Marquer complétée'}</button>
          <button type="button" data-action="supprimer">Supprimer</button>
        </div>
      </article>
    `
    )
    .join('');
}

function ajouterTache(event) {
  event.preventDefault();

  const titre = champTitre.value.trim();
  const description = champDescription.value.trim();
  const priorite = champPriorite.value;

  if (!titre || !description) return;

  taches.push({
    id: Date.now(),
    titre,
    description,
    priorite,
    completee: false,
  });

  sauvegarder();
  formTache.reset();
  champPriorite.value = 'Moyenne';
  render();
}

function gererActionsTaches(event) {
  const bouton = event.target.closest('button');
  if (!bouton) return;

  const carte = bouton.closest('.carte-tache');
  if (!carte) return;

  const id = Number(carte.dataset.id);

  if (bouton.dataset.action === 'toggle') {
    taches = taches.map((t) => (t.id === id ? { ...t, completee: !t.completee } : t));
  }

  if (bouton.dataset.action === 'supprimer') {
    taches = taches.filter((t) => t.id !== id);
  }

  sauvegarder();
  render();
}

function gererFiltres(event) {
  const bouton = event.target.closest('.bouton-filtre');
  if (!bouton) return;

  filtreActif = bouton.dataset.filtre;
  boutonsFiltre.forEach((b) => b.classList.toggle('actif', b === bouton));
  render();
}

function initialiserApplication() {
  formTache.addEventListener('submit', ajouterTache);
  listeTaches.addEventListener('click', gererActionsTaches);
  document.querySelector('.zone-filtres').addEventListener('click', gererFiltres);
  sauvegarder();
  render();
}
