const CLE_LOCAL_STORAGE = 'utilisateurs_demo';

const utilisateursParDefaut = [
  { id: 1, nom: 'Alice Katshabala', email: 'alice@example.com' },
  { id: 2, nom: 'Faby Lado', email: 'faby@example.com' },
  { id: 3, nom: 'Charlie Tatukila', email: 'charlie@example.com' },
  { id: 4, nom: 'Kevin Mbuyi', email: 'kevin@example.com' },
  { id: 5, nom: 'Syria Tatukila', email: 'syria@example.com' },
];

const champRecherche = document.querySelector('#champRecherche');
const compteurResultats = document.querySelector('#compteurResultats');
const listeUtilisateurs = document.querySelector('#listeUtilisateurs');
const formUtilisateur = document.querySelector('#formUtilisateur');
const champNom = document.querySelector('#champNom');
const champEmail = document.querySelector('#champEmail');
const boutonEnregistrer = document.querySelector('#boutonEnregistrer');
const boutonAnnuler = document.querySelector('#boutonAnnuler');
const boutonReinitialiser = document.querySelector('#boutonReinitialiser');

let utilisateurs = chargerUtilisateurs();
let idEnEdition = null;

function chargerUtilisateurs() {
  const texte = localStorage.getItem(CLE_LOCAL_STORAGE);

  if (!texte) {
    return [...utilisateursParDefaut];
  }

  try {
    return JSON.parse(texte);
  } catch (erreur) {
    return [...utilisateursParDefaut];
  }
}

function sauvegarderUtilisateurs() {
  localStorage.setItem(CLE_LOCAL_STORAGE, JSON.stringify(utilisateurs));
}

function rechercherUtilisateurs(texteRecherche) {
  const texte = texteRecherche.toLowerCase().trim();

  if (texte === '') {
    return utilisateurs;
  }

  return utilisateurs.filter((utilisateur) => {
    const nom = utilisateur.nom.toLowerCase();
    const email = utilisateur.email.toLowerCase();
    return nom.includes(texte) || email.includes(texte);
  });
}

function creerElementUtilisateur(utilisateur) {
  const ligne = document.createElement('tr');
  ligne.dataset.id = String(utilisateur.id);

  const celluleNom = document.createElement('td');
  celluleNom.textContent = utilisateur.nom;

  const celluleEmail = document.createElement('td');
  celluleEmail.textContent = utilisateur.email;

  const celluleActions = document.createElement('td');
  celluleActions.innerHTML = `
    <button type="button" data-action="modifier">Modifier</button>
    <button type="button" data-action="supprimer">Supprimer</button>
  `;

  ligne.append(celluleNom, celluleEmail, celluleActions);

  return ligne;
}

function afficherUtilisateurs() {
  const resultats = rechercherUtilisateurs(champRecherche.value);

  compteurResultats.textContent =
    resultats.length === 1
      ? '1 utilisateur trouvé'
      : `${resultats.length} utilisateurs trouvés`;

  listeUtilisateurs.textContent = '';

  if (resultats.length === 0) {
    const ligneVide = document.createElement('tr');
    const celluleVide = document.createElement('td');
    celluleVide.colSpan = 3;
    celluleVide.textContent = 'Aucun utilisateur trouvé.';
    ligneVide.appendChild(celluleVide);
    listeUtilisateurs.appendChild(ligneVide);
    return;
  }

  const lignes = resultats.map(creerElementUtilisateur);
  lignes.forEach((ligne) => listeUtilisateurs.appendChild(ligne));
}

function prochainId() {
  if (utilisateurs.length === 0) {
    return 1;
  }

  const ids = utilisateurs.map((utilisateur) => utilisateur.id);
  return Math.max(...ids) + 1;
}

function reinitialiserFormulaire() {
  idEnEdition = null;
  boutonEnregistrer.textContent = 'Ajouter';
  boutonAnnuler.hidden = true;
  champNom.value = '';
  champEmail.value = '';
}

function demarrerEdition(id) {
  const utilisateur = utilisateurs.find((item) => item.id === id);
  if (!utilisateur) {
    return;
  }

  idEnEdition = id;
  champNom.value = utilisateur.nom;
  champEmail.value = utilisateur.email;
  boutonEnregistrer.textContent = 'Enregistrer la modification';
  boutonAnnuler.hidden = false;
}

function supprimerUtilisateur(id) {
  utilisateurs = utilisateurs.filter((utilisateur) => utilisateur.id !== id);
  sauvegarderUtilisateurs();
  afficherUtilisateurs();

  if (idEnEdition === id) {
    reinitialiserFormulaire();
  }
}

function gererSoumissionFormulaire(event) {
  event.preventDefault();

  const nom = champNom.value.trim();
  const email = champEmail.value.trim();

  if (nom === '' || email === '') {
    return;
  }

  if (idEnEdition === null) {
    utilisateurs.push({ id: prochainId(), nom, email });
  } else {
    utilisateurs = utilisateurs.map((utilisateur) => {
      if (utilisateur.id === idEnEdition) {
        return { ...utilisateur, nom, email };
      }
      return utilisateur;
    });
  }

  sauvegarderUtilisateurs();
  reinitialiserFormulaire();
  afficherUtilisateurs();
}

function gererReinitialisation() {
  localStorage.removeItem(CLE_LOCAL_STORAGE);
  utilisateurs = [...utilisateursParDefaut];
  reinitialiserFormulaire();
  afficherUtilisateurs();
}

function gererClicTableau(event) {
  const bouton = event.target.closest('button');
  if (!bouton) {
    return;
  }

  const ligne = bouton.closest('tr');
  if (!ligne || !ligne.dataset.id) {
    return;
  }

  const id = Number(ligne.dataset.id);

  if (bouton.dataset.action === 'modifier') {
    demarrerEdition(id);
  }

  if (bouton.dataset.action === 'supprimer') {
    supprimerUtilisateur(id);
  }
}

function initialiserApplication() {
  champRecherche.addEventListener('input', afficherUtilisateurs);
  formUtilisateur.addEventListener('submit', gererSoumissionFormulaire);
  boutonAnnuler.addEventListener('click', reinitialiserFormulaire);
  boutonReinitialiser.addEventListener('click', gererReinitialisation);
  listeUtilisateurs.addEventListener('click', gererClicTableau);

  sauvegarderUtilisateurs();
  afficherUtilisateurs();
}



// window.addEventListener('load', initialiserApplication);



