import Human from './Human.js';
import Resource from './Resource.js';
import PendingMission from './PendingMission.js';
import missions from '../constants/missions.js';
const KEYS_TO_SAVE = ['resources', 'humans', 'availableMissions'];

let pendingMissionCount = 0;

export default {
  components: {
    Human,
    Resource,
    PendingMission,
  },
  data() {
    return {
      messages: [],
      resources: [
        { id: 'day', name: 'Jour', qty: 1, icon: '📅' },
        { id: 'human', name: 'Humain', qty: 1, icon: '🧑' },
        { id: 'rawFood', name: 'Nourriture', qty: 10, icon: '🍖', max: 15 },
        { id: 'wood', name: 'Bois', qty: 0, icon: '🪵', used: false },
        { id: 'rawMetal', name: 'Bouts de métaux', qty: 0, icon: '🗑️', used: false },
        { id: 'metal', name: 'Métal', qty: 0, icon: '⚙️', used: false },
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
      availableMissions: ['basicFoodMission', 'basicExplore', 'hiddenCalendar', 'hiddenEat'],
      pendingMissions: [],
      buildings: [],
    };
  },
  computed: {
    pendingMissionsVisible() {
      return this.pendingMissions.filter((pm) => !pm.mission.hidden);
    },
    visibleResources() {
      return this.resources.filter((r) => r.used !== false);
    },
    erroredMissions() {
      return this.pendingMissions.filter((pm) => {
        const participants = this.pmParticipants(pm);
        const invalid = participants.length != 0 && pm.mission.minParticipants && participants.length < pm.mission.minParticipants;
        pm.valid = !invalid;
        return invalid;
      });
    },
    canMoveToNextDay() {
      return this.erroredMissions.length == 0;
    },
  },
  methods: {
    nextDay() {
      // Sort out current day
      this.messages = [];
      const pendingMissions = this.pendingMissions.sort((m1, m2) => (m1.mission.order || 0) - (m2.mission.order || 0));
      for (const pendingMission of pendingMissions) {
        pendingMission.mission.run(
          this,
          this.humans.filter((h) => h.assignment && h.assignment.id === pendingMission.id)
        );
      }

      this.prepDay();
    },
    prepDay() {
      // Clean up
      this.humans.forEach((h) => (h.assignment = null));

      // Auto discover missions
      for (let missionName in missions) {
        const mission = missions[missionName];
        if (mission.autoDiscover && !this.availableMissions.includes(missionName)) {
          for (let resourceName in mission.autoDiscover) {
            const r = this.getResource(resourceName);
            if (r >= mission.autoDiscover[resourceName]) {
              this.availableMissions.push(missionName);
              if (mission.onDiscover) {
                this.messages.push(mission.onDiscover);
              }
            }
          }
        }
      }
      this.pendingMissions = this.availableMissions.map((am) => ({
        id: pendingMissionCount++,
        mission: missions[am],
      }));
    },
    pmParticipants(pm) {
      return this.humans.filter((h) => h.assignment && h.assignment.id === pm.id);
    },
    resource(id) {
      return this.resources.find((r) => r.id == id);
    },
    getResource(id) {
      return this.resources.find((r) => r.id == id).qty;
    },
    setResourceRelative(id, relativeQty) {
      const resource = this.resource(id);
      resource.qty += relativeQty;

      if (resource.qty > 0 && !resource.used) {
        resource.used = true;
      }

      if (resource.qty < 0) {
        resource.qty = 0;
        return false;
      } else if (resource.max && resource.qty > resource.max) {
        resource.qty = resource.max;
        return false;
      }
      return true;
    },
    save() {
      const save = {};
      KEYS_TO_SAVE.forEach((k) => (save[k] = this[k]));
      localStorage.setItem('save', JSON.stringify(save));
    },
    load() {
      const saveJson = localStorage.getItem('save');
      if (!saveJson) {
        this.messages.push('Aucune sauvegarde');
        return;
      }
      const save = JSON.parse(saveJson);

      KEYS_TO_SAVE.forEach((k) => (this[k] = save[k]));
      this.prepDay();
    },
  },
  mounted() {
    this.prepDay();
  },
};
