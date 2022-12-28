import Human from './Human.js';
import Resource from './Resource.js';
import PendingMission from './PendingMission.js';

const missions = {
  basicFoodMission: {
    name: 'Chercher de la nourriture',
    run: (state) => {
      state.resources.rawFood.qty += 3;
    },
  },
  basicWoodMission: {
    name: 'Chercher du bois',
    run: (state) => {
      state.resources.wood.qty += 2;
    },
  },
  basicMetalMission: {
    name: 'Chercher du métal',
    run: (state) => {
      state.resources.metal.qty += 1;
    },
  },
};

export default {
  components: {
    Human,
    Resource,
    PendingMission,
  },
  data() {
    return {
      resources: [
        { id: 'day', name: 'Jour', qty: 0, icon: '📅' },
        { id: 'human', name: 'Humain', qty: 1, icon: '🧑' },
        { id: 'rawFood', name: 'Nourriture', qty: 10, icon: '🍖' },
        { id: 'wood', name: 'Bois', qty: 0, icon: '🪵' },
        { id: 'metal', name: 'Métal', qty: 0, icon: '⚙️' },
      ],
      humans: [
        {
          id: 1,
          name: 'Marc',
          type: 'civilian',
          assignment: null,
        },
        {
          id: 2,
          name: 'Jenny',
          type: 'civilian',
          assignment: null,
        },
      ],
      availableMissions: ['basicFoodMission', 'basicWoodMission', 'basicMetalMission'],
      pendingMissions: [],
      buildings: [],
    };
  },
  methods: {
    nextDay() {
      this.pendingMissions = this.availableMissions.map((am) => ({
        participants: [],
        mission: missions[am],
      }));
    },
  },
  mounted() {
    this.nextDay();
  },
};
