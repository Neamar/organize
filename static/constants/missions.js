/**
 * A mission
 * @typedef {Object} Mission
 * @property {missionRun} run Function to run to execute the mission
 * @property {String} name Mission name
 * @property {Number} [maxParticipants=Number.Infinity] max number of participants for the mission
 * @property {Number} [minParticipants=0] min number of participants for the mission
 * @property {Function} [autoDiscover] return true to auto-discover the mission
 * @property {Object} [onDiscover] text to display when the mission is discovered
 * @property {Object} [costs] mission costs per participant
 * @property {Boolean} [hidden=false] if the mission should be displayed on the UI
 * @property {Number} [order=0] when the mission should be executed (0 = first, 1 = after, 2 = ...)
 */

/**
 * A human
 * @typedef {Object} Human
 * @property {Number} id human id
 * @property {String} name human name
 * @property {('civilian'|'engineer'|'military')} type human type
 * @property {String?} assignment mission currently assigned
 * @property {Boolean} assignmentLocked is this assignment locked (will reoccur every day)
 * @property {Boolean} starving is the human starving
 */

/**
 * A resource cost for a pending mission
 * @typedef {Object} PendingMissionResource
 * @property {Object} resource
 * @property {Number} qty cost for the mission
 * @property {Boolean} valid do we have enough
 */

/**
 * A pending mission
 * @typedef {Object} PendingMission
 * @property {Number} id mission id
 * @property {Mission} mission the associated mission
 * @property {Human[]} participants the participants
 * @property {Boolean} validParticipants if the pending mission has valid participants or not
 * @property {PendingMissionResource[]} resources cost in resources
 * @property {Boolean} valid if the pending mission is ready to run or not
 */

/**
 * This callback type is called `requestCallback` and is displayed as a global symbol.
 *
 * @callback missionRun
 * @param {Object} state current state
 * @param {Human[]} participants list of participants
 */

/**
 * Static list of all missions, not reactive
 * @type {Object.<string, Mission>}
 */
const missions = {
  basicFoodMission: {
    name: 'Chercher de la nourriture',
    run: (state, participants) => {
      state.setResourceRelative('rawFood', participants.length * 3, true);
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
      const messagesText = {
        basicWoodMission: 'Une petite forêt à proximité pourrait fournir du bois pour différents usages.',
        basicMetalMission:
          "Un avion s'est écrasé pas loin. Aucun survivant malheureusement, mais plusieurs pièces de métal pourraient être récupérées et utilisées.",
      };
      const nextMission = toUnlock.find((unlockable) => !state.availableMissionsSet.has(unlockable));
      if (nextMission) {
        state.availableMissions.push(nextMission);
        state.messages.push(messagesText[nextMission]);
      } else {
        state.removeMission('basicExplore');
        state.messages.push(`${participants[0].name} revient bredouille de son exploration. Il va falloir faire avec ce que vous avez...`);
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
    autoDiscover: (state) => state.getResource('wood') >= 4,
    costs: {
      wood: 5,
    },
    onDiscover: 'Avec tout ce bois, nous pourrions construire un garde-manger pour augmenter la quantité maximale de nourriture stockée !',
    run: (state, participants) => {
      if (participants.length > 0) {
        state.resource('rawFood').max += 10;
      }
    },
  },
  refineMetal: {
    name: 'Raffiner du métal',
    maxParticipants: 1,
    autoDiscover: (state) => state.getResource('rawMetal') >= 2,
    costs: {
      rawMetal: 2,
    },
    onDiscover: "Faire fondre ces bouts de métaux pourrait nous donner de l'acier utilisable !",
    run: (state, participants) => {
      if (participants.length > 0) {
        state.setResourceRelative('rawMetal', -2);
        state.setResourceRelative('metal', 2);
      }
    },
  },
  buildRadio: {
    name: 'Construire une radio',
    maxParticipants: 1,
    autoDiscover: (state) => state.getResource('rawMetal') >= 1 && !state.values.madeRadio,
    onDiscover: 'Ce bout de métal pourrait peut être permettre de réparer une radio cassée qui traîne dans un coin ?',
    run: (state, participants) => {
      if (participants.length > 0) {
        state.removeMission('buildRadio');
        state.values.madeRadio = true;
      }
    },
  },
  buildKitchen: {
    name: 'Construire une cuisine',
    minParticipants: 3,
    maxParticipants: 3,
    autoDiscover: (state) => state.getResource('metal') >= 2,
    onDiscover: 'Une cuisine permettrait de manger des plats de meilleure qualité, et améliorerait le moral du groupe.',
    run: (state, participants) => {
      if (participants.length > 0) {
        state.availableMissions.push('cookFood');
        state.removeMission('buildKitchen');
      }
    },
  },
  cookFood: {
    name: 'Cuisiner des plats chauds',
    run: (state, participants) => {
      if (participants.length > 0) {
        const toCook = Math.min(2 * participants.length, state.resource('rawFood').qty);
        state.setResourceRelative('rawFood', -toCook);
        state.setResourceRelative('food', toCook + participants.length);
      }
    },
  },
  findHuman: {
    name: 'Trouver des survivants',
    maxParticipants: 1,
    run: (state, participants) => {
      if (participants.length === 0) {
        return;
      }
      const names = [
        'Abby',
        'John',
        'Sheldon',
        'Shelly',
        'Eve',
        'Samantha',
        'Rowan',
        'Kyle',
        'Janja',
        'Adam',
        'Mateo',
        'Laura',
        'Justin',
        'Millie',
        'Javier',
        'Cassidy',
        'Nils',
      ].sort(() => 0.5 - Math.random());
      const currentNames = new Set(state.humans.map((h) => h.name));
      // start generated ids at 50
      const nextId = Math.max(50, Math.max(...state.humans.map((h) => h.id)) + 1);
      const name = names.find((n) => !currentNames.has(n)) || 'Someone';

      /**
       * @type Human
       */
      const human = {
        id: nextId,
        name: name,
        type: 'civilian',
        assignment: null,
        assignmentLocked: false,
        starving: true,
      };

      state.humans.push(human);

      state.messages.push(`Un nouveau survivant rejoint votre campement : ${name}`);
    },
  },
  makeMilitary: {
    name: 'Former un militaire',
    maxParticipants: 2,
    run: (state, participants) => {
      if (participants.length > 0) {
        throw new Error('Not implemented');
      }
    },
  },
  hiddenEat: {
    name: 'Nourrir les humains',
    hidden: true,
    order: 1,
    run: (state) => {
      const rawFoodResource = state.resource('rawFood');
      const foodResource = state.resource('food');
      const humans = state.humans.sort((h1) => (h1.starving ? -1 : 1));
      for (let human of humans) {
        const willEat = human.type === 'military' ? 3 : 2;
        if (foodResource.qty >= willEat) {
          foodResource.qty -= willEat;
          human.starving = false;
        } else if (foodResource.qty > 0 && rawFoodResource.qty - foodResource.qty >= willEat) {
          rawFoodResource.qty -= willEat - foodResource.qty;
          foodResource.qty = 0;
        } else if (rawFoodResource.qty >= willEat) {
          rawFoodResource.qty -= willEat;
          human.starving = false;
        } else {
          if (human.starving) {
            // Oh no! Don't starve twice...
            state.humans = state.humans.filter((h) => h.id !== human.id);
            state.messages.push(`${human.name} est mort de faim...`);
          } else {
            human.starving = true;
          }
        }
      }

      if (foodResource.qty > 0) {
        foodResource.qty = 0;
        state.messages.push('Il y avait trop de nourriture chaude, il a fallu en jeter.');
      }
      if (rawFoodResource.qty > rawFoodResource.max) {
        // You can tempoarily get over the limit when scavenging, but this doesn't carry over to the next day
        rawFoodResource.qty = rawFoodResource.max;
      }
    },
  },
  hiddenCalendar: {
    name: 'Avancer le calendrier',
    hidden: true,
    order: 1,
    run: (state) => {
      state.resource('day').qty++;
      state.resource('human').qty = state.humans.length;
    },
  },
};

export default missions;
