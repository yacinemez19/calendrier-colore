# Agenda Coloré

Une application web moderne de gestion d'agenda pour la visualisation et la gestion de périodes colorées sur un calendrier.

## 🎯 Fonctionnalités

- **Calendrier interactif** : Navigation entre septembre, octobre, novembre et décembre 2025
- **Sélection de périodes** : Cliquer-glisser pour sélectionner des plages de dates
- **Périodes colorées** : Créer des périodes avec nom, description et couleur personnalisée
- **Gestionnaire de périodes** : Visualiser, modifier et supprimer les périodes créées
- **Inspecteur détaillé** : Édition en direct des propriétés des périodes
- **Persistance locale** : Sauvegarde automatique dans localStorage

## 🚀 Démarrage rapide

### Prérequis
- Node.js (version 14 ou supérieure)
- npm ou yarn

### Installation

```bash
# Cloner le repository
git clone <repository-url>
cd agenda-colore

# Installer les dépendances
npm install

# Démarrer l'application
npm start
```

L'application sera accessible à l'adresse : `http://localhost:3000`

## 📱 Utilisation

1. **Navigation** : Utilisez les boutons en haut de la page pour naviguer entre les mois
2. **Créer une période** :
   - Cliquez et faites glisser sur le calendrier pour sélectionner des jours
   - Une modale s'ouvre pour définir le nom, la description et la couleur
   - Validez pour créer la période
3. **Visualiser les périodes** : Les périodes apparaissent colorées sur le calendrier et listées à droite
4. **Modifier une période** : Cliquez sur une période dans la liste, puis utilisez l'inspecteur à gauche
5. **Supprimer une période** : Cliquez sur l'icône de suppression dans la liste

## 🏗️ Architecture

```
src/
├── components/          # Composants React
│   ├── Calendar.jsx    # Calendrier principal avec sélection
│   ├── PeriodModal.jsx # Modale de création/édition
│   ├── PeriodList.jsx  # Liste des périodes
│   └── PeriodInspector.jsx # Inspecteur de période
├── hooks/              # Hooks personnalisés
│   └── usePeriods.js   # Gestion des périodes avec localStorage
├── utils/              # Utilitaires
│   └── dateHelpers.js  # Fonctions de manipulation de dates
└── App.js             # Composant principal
```

## 🎨 Technologies utilisées

- **React 19** : Framework principal
- **Tailwind CSS 4** : Styles et design system
- **JavaScript ES6+** : Logique applicative
- **localStorage** : Persistance des données

## 📋 Structure des données

Les périodes sont stockées avec la structure suivante :

```javascript
{
  id: 'uuid',
  nom: 'Vacances de la Toussaint',
  description: 'Vacances scolaires de la Toussaint',
  couleur: '#FFB347',
  dateDebut: '2025-10-19',
  dateFin: '2025-11-04',
  jours: ['2025-10-19', '2025-10-20', ..., '2025-11-04']
}
```

## 🔧 Scripts disponibles

- `npm start` : Démarre le serveur de développement
- `npm test` : Lance les tests
- `npm run build` : Génère la version de production
- `npm run eject` : Éjecte la configuration (non recommandé)

## 🎯 Roadmap

- [x] Calendrier de base avec navigation
- [x] Sélection de périodes par cliquer-glisser
- [x] Création de périodes colorées
- [x] Liste et gestion des périodes
- [x] Inspecteur pour l'édition
- [x] Persistance localStorage
- [ ] Export/import des données
- [ ] Thèmes de couleurs
- [ ] Mode responsive mobile
- [ ] Notifications et rappels

## 🤝 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à :

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/AmazingFeature`)
3. Commit vos changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 📞 Support

Pour toute question ou suggestion :
- Créez une issue sur GitHub
- Contactez l'équipe de développement

---

Fait avec ❤️ pour une meilleure organisation du temps
