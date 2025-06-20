# Support-haven

<div align="center">
  <img src="https://media.discordapp.net/attachments/1351189440793673813/1372716241852170340/cf76ceffe29be32f0ca593b6196dbcd4.jpg?width=965&height=322" alt="Support-haven" width="60%"/>
</div>

---

## ✨ Présentation

**Cette application** est un bot Discord conçu pour :
- Gérer efficacement le support via un système de tickets privés (threads)
- Proposer une FAQ accessible
- Accompagner le recrutement de nouveaux membres grâce à un menu interactif

> _Développé par **Nythique**_

---

## 🚀 Prise en main rapide

### 1. Prérequis
- **Node.js** v18 ou supérieur
- Un serveur Discord où vous avez les droits d'administrateur
- Un bot Discord (token à récupérer sur le [Portail développeur Discord](https://discord.com/developers/applications))

### 2. Installation
```bash
git clone https://github.com/nythique/discord-ticket-bot.git
cd discord-ticket-bot
npm install
```

### 3. Configuration
1. **Sécurisez votre token !**
   - Ouvrez `config.js` et remplacez la valeur de `token` par celui de votre bot Discord.
   - Personnalisez les autres champs (`panelImage`, `commands`, `statuts`, `plannig`) selon vos besoins.
2. **(Optionnel)** Utilisez un fichier `.env` pour stocker le token et modifiez `config.js` pour le lire depuis `process.env.TOKEN`.

### 4. Lancement
```bash
node main.js
```

---

## 🛠️ Fonctionnalités principales

- **Support/Ticket** :
  - Commande personnalisable (voir `config.js`, ex : `sudo apt install support`)
  - Création de tickets privés (threads) pour contacter le staff
  - FAQ intégrée
- **Recrutement** :
  - Menu interactif guidant les candidats à travers les étapes et conditions

---


## 🔒 Conseils de sécurité
- **Ne partagez jamais votre token Discord publiquement !**
- Utilisez un fichier `.env` ou des variables d'environnement pour plus de sécurité.
- Limitez les permissions du bot au strict nécessaire.

---

## ❓ FAQ rapide

- **Comment afficher le panel de support ?**
  Tapez la commande définie dans `config.js` (`commands`) dans un salon textuel du serveur.
- **Qui peut voir les tickets ?**
  Seuls le staff et l'utilisateur ayant créé le ticket ont accès au thread privé.
- **Comment personnaliser les questions de recrutement ?**
  Modifiez les textes dans `main.js` (sections `recrutement_select`).

---

## 🤝 Contribuer

Les contributions sont les bienvenues ! N'hésitez pas à proposer des améliorations via des issues ou des pull requests.

---

<div align="center">
  <b>Tiré de mon projet landhaven</b> — par Nythique
</div>
