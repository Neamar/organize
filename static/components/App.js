import Human from './Human.js';
import Resource from './Resource.js';
import Event from './Event.js';
import Mission from './Mission.js';
import missions from '../constants/missions.js';
import events from '../constants/events.js';
const KEYS_TO_SAVE = ['resources', 'humans', 'availableMissions'];

export default {
  components: {
    Human,
    Resource,
    Mission,
    Event,
  },
  data() {
    return {
      events: [],
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
      buildings: [],
    };
  },
  computed: {
    /**
     * @type Array
    */
    // @ts-ignore
    pendingMissions() {
      return this.availableMissions.map((missionName) => {
        const mission = missions[missionName];
        const participants = this.humans.filter((h) => h.assignment === missionName);
        const invalid = participants.length != 0 && mission.minParticipants && participants.length < mission.minParticipants;
        return {
          id: missionName,
          mission: mission,
          participants: this.humans.filter((h) => h.assignment === missionName),
          valid: !invalid
        };
      });
    },
    pendingMissionsVisible() {
      return this.pendingMissions.filter((pm) => !pm.mission.hidden);
    },
    visibleResources() {
      return this.resources.filter((r) => r.used !== false);
    },
    canMoveToNextDay() {
      return this.pendingMissions.filter(pm => !pm.valid).length == 0;
    },
    nextEvent() {
      return this.events[0];
    }
  },
  methods: {
    assign({ missionId, humanId }) {
      const human = this.humans.find((h) => h.id === humanId);
      human.assignment = missionId;
    },
    unassign({ humanId }) {
      const human = this.humans.find((h) => h.id === humanId);
      human.assignment = null;
    },
    pick({ content }) {
      const button = events[this.nextEvent].buttons.find(b => b.content === content);
      button.run && button.run(this);
      this.events.shift();
    },
    nextDay() {
      // Sort out current day
      this.messages = [];
      const pendingMissions = this.pendingMissions.sort((m1, m2) => (m1.mission.order || 0) - (m2.mission.order || 0));
      for (const pendingMission of pendingMissions) {
        const mission = pendingMission.mission;
        mission.run(this, pendingMission.participants);
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

      // Add events
      this.events = Object.entries(events).filter((kv) => kv[1].turn === this.getResource('day')).sort((kv1, kv2) => (kv1[1].order || 0) - (kv2[1].order || 0)).map((kv) => kv[0]);
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
    },
  },
  mounted() {
    this.prepDay();
  },
};
