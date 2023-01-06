/**
 * A mission
 * @typedef {Object} Mission
 * @property {Function} run Function to run to execute the mission
 * @property {String} name Mission name
 * @property {Number} [maxParticipants=Number.Infinity] max number of participants for the mission
 * @property {Number} [minParticipants=0] min number of participants for the mission
 * @property {Object} [autoDiscover] a way to auto discover the mission
 * @property {Object} [onDiscover] text to display when the mission is discovered
 * @property {Object} [costs] mission costs
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
 * Static list of all missions, not reactive
 * @type {Object.<string, Mission>}
 */
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
      const nextMission = toUnlock.find((unlockable) => !state.availableMissionsSet.has(unlockable));
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
      wood: 2,
    },
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
      const nextId = Math.max(...state.humans.map((h) => h.id)) + 1;
      const name = names.find((n) => !currentNames.has(n)) || 'Someone';

      /**
       * @type Human
       */
      const human = {
        id: nextId,
        name: name,
        type: 'civilian',
        assignment: null,
        starving: true,
      };

      state.humans.push(human);

      state.messages.push(`Un nouveau survivant rejoint votre campement : ${name}`);
    },
  },
  hiddenEat: {
    name: 'Nourrir les humains',
    hidden: true,
    order: 1,
    run: (state) => {
      const foodResource = state.resource('rawFood');
      const humans = state.humans.sort((h1) => (h1.starving ? -1 : 1));
      for (let human of humans) {
        if (foodResource.qty >= 2) {
          foodResource.qty -= 2;
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
