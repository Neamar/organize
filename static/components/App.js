import Human from './Human.js';
import Resource from './Resource.js';
import PendingMission from './PendingMission.js';

const missions = {
  basicFoodMission: {
    name: 'Chercher de la nourriture',
    run: (state, participants) => {
      state.resource('rawFood').qty += participants.length * 3;
    },
  },
  basicWoodMission: {
    name: 'Chercher du bois',
    run: (state, participants) => {
      state.resource('wood').qty += participants.length * 2;
    },
  },
  basicMetalMission: {
    name: 'Chercher du métal',
    run: (state, participants) => {
      state.resource('metal').qty += participants.length;
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

let pendingMissionCount = 0;

export default {
  components: {
    Human,
    Resource,
    PendingMission,
  },
  data() {
    return {
      resources: [
        { id: 'day', name: 'Jour', qty: 1, icon: '📅' },
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
      availableMissions: ['basicFoodMission', 'basicWoodMission', 'basicMetalMission', 'hiddenCalendar', 'hiddenEat'],
      pendingMissions: [],
      buildings: [],
    };
  },
  computed: {
    pendingMissionsVisible() {
      return this.pendingMissions.filter((pm) => !pm.mission.hidden);
    },
  },
  methods: {
    nextDay() {
      const pendingMissions = this.pendingMissions.sort((m1, m2) => (m1.mission.order || 0) - (m2.mission.order || 0));
      for (const pendingMission of pendingMissions) {
        pendingMission.mission.run(
          this,
          this.humans.filter((h) => h.assignment && h.assignment.id === pendingMission.id)
        );
      }
      this.humans.forEach((h) => (h.assignment = null));
      this.pendingMissions = this.availableMissions.map((am) => ({
        id: pendingMissionCount++,
        mission: missions[am],
      }));
    },
    resource(id) {
      return this.resources.find((r) => r.id == id);
    },
  },
  mounted() {
    this.nextDay();
  },
};
