const missions = {
  basicFoodMission: {
    name: 'Chercher de la nourriture',
    run: (state, participants) => {
      state.setResourceRelative('rawFood', participants.length * 3);
    },
  },
  basicExplore: {
    name: "Explorer l'environnement",
    maxParticipants: 1,
    run: (state, participants) => {
      if (participants.length === 0) {
        return;
      }

      const toUnlock = ['basicWoodMission', 'basicMetalMission'];
      const knownMissions = new Set(state.availableMissions);
      const nextMission = toUnlock.find((unlockable) => !knownMissions.has(unlockable));
      if (nextMission) {
        state.availableMissions.push(nextMission);
        state.messages.push(`Votre recherche est fructueuse ! Vous découvrez « ${missions[nextMission].name} »`);
      } else {
        state.availableMissions = state.availableMissions.filter((m) => m !== 'basicExplore');
        state.messages.push(`Plus rien à trouver`);
      }
    },
  },
  basicWoodMission: {
    name: 'Chercher du bois',
    run: (state, participants) => {
      state.setResourceRelative('wood', participants.length * 2);
    },
  },
  basicMetalMission: {
    name: 'Chercher des bouts de métaux',
    run: (state, participants) => {
      state.setResourceRelative('rawMetal', participants.length);
    },
  },
  refineMetalMission: {
    name: 'Faire fondre le métal',
    maxParticipants: 2,
    run: (state, participants) => {
      for (let i = 0; i < participants.length; i++) {
        if (state.resource('rawMetal').qty >= 2) {
          state.setResourceRelative('rawMetal', -2);
          state.setResourceRelative('metal', 1);
        }
      }
    },
  },
  buildPantry: {
    name: 'Construire un garde-manger',
    maxParticipants: 3,
    minParticipants: 3,
    autoDiscover: {
      wood: 5,
    },
    onDiscover: 'Avec tout ce bois, nous pourrions construire un garde-manger pour augmenter la quantité maximale de nourriture stockée !',
    run: (state) => {
      state.resource('rawFood').max += 10;
    },
  },
  hiddenEat: {
    hidden: true,
    order: 1,
    run: (state) => {
      const foodResource = state.resource('rawFood');
      for (let human of state.humans) {
        if (foodResource.qty >= 2) {
          foodResource.qty -= 2;
          human.starving = false;
        } else {
          human.starving = true;
        }
      }
    },
  },
  hiddenCalendar: {
    hidden: true,
    order: 1,
    run: (state) => {
      state.resource('day').qty++;
      state.resource('human').qty = state.humans.length;
    },
  },
};

export default missions;
