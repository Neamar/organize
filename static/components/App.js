import Human from './Human.js';
import Resource from './Resource.js';
import Event from './Event.js';
import Mission from './Mission.js';
import missions from '../constants/missions.js';
import events from '../constants/events.js';
const KEYS_TO_SAVE = ['resources', 'humans', 'availableMissions', 'events', 'pastEvents', 'messages', 'canLockAssignments', 'values'];

export default {
  components: {
    Human,
    Resource,
    Mission,
    Event,
  },
  data() {
    return {
      canLockAssignments: false,
      values: {},
      events: [],
      messages: [],
      resources: [
        { id: 'day', name: 'Jour', qty: 1, icon: '📅' },
        { id: 'human', name: 'Humain', qty: 2, icon: '🧑' },
        { id: 'rawFood', name: 'Nourriture', qty: 10, icon: '🍖', max: 10 },
        { id: 'food', name: 'Nourriture cuisinée', qty: 0, icon: '🍲', used: false },
        { id: 'wood', name: 'Bois', qty: 0, icon: '🪵', used: false },
        { id: 'rawMetal', name: 'Bouts de métaux', qty: 0, icon: '🗑️', used: false },
        { id: 'metal', name: 'Métal', qty: 0, icon: '⚙️', used: false },
        { id: 'ammo', name: 'Munitions', qty: 0, icon: '💥', used: false },
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
      pastEvents: [],
      buildings: [],
    };
  },
  computed: {
    availableMissionsSet() {
      return new Set(this.availableMissions);
    },
    pastEventsSet() {
      return new Set(this.pastEvents);
    },
    /**
     * @type import("../constants/missions.js").PendingMission[]
     */
    // @ts-ignore
    pendingMissions() {
      const availableResources = {};
      this.resources.forEach((r) => (availableResources[r.id] = r.qty));

      this.availableMissions.forEach((missionName) => {
        const mission = missions[missionName];
        if (!mission) {
          throw new Error('Unknown mission: ' + missionName);
        }
        if (!mission.costs) {
          return;
        }

        // sum all costs
        Object.entries(mission.costs).forEach(([r, qty]) => {
          const assignees = this.humans.filter((h) => h.assignment === missionName);
          availableResources[r] -= assignees.length * qty;
        });
      });

      return this.availableMissions.map((missionName) => {
        const mission = missions[missionName];
        const participants = this.humans.filter((h) => h.assignment === missionName);

        const invalidParticipants = participants.length > 0 && mission.minParticipants && participants.length < mission.minParticipants;

        const hasMissingResources = participants.length > 0 && Object.keys(mission.costs || {}).some((r) => availableResources[r] < 0);
        const invalid = invalidParticipants || hasMissingResources;

        /** @type import("../constants/missions.js"). PendingMission */
        const pendingMission = {
          id: missionName,
          mission: mission,
          participants: this.humans.filter((h) => h.assignment === missionName),
          resources: Object.keys(mission.costs || {}).map((r) => ({
            resource: this.resource(r),
            qty: mission.costs[r],
            valid: participants.length === 0 || availableResources[r] >= 0,
          })),
          validParticipants: !invalidParticipants,
          valid: !invalid,
        };
        return pendingMission;
      });
    },
    pendingMissionsVisible() {
      return this.pendingMissions.filter((pm) => !pm.mission.hidden);
    },
    visibleResources() {
      return this.resources.filter((r) => r.used !== false);
    },
    canMoveToNextDay() {
      return this.pendingMissions.filter((pm) => !pm.valid).length == 0;
    },
    nextEvent() {
      if (this.events[0]) {
        this.pastEvents.push(this.events[0]);
      }
      return this.events[0];
    },
  },
  methods: {
    assign({ missionId, humanId }) {
      const human = this.humans.find((h) => h.id === humanId);
      human.assignment = missionId;
    },
    unassign({ humanId }) {
      const human = this.humans.find((h) => h.id === humanId);
      human.assignment = null;
      human.assignmentLocked = false;
    },
    toggleLock({ humanId }) {
      const human = this.humans.find((h) => h.id === humanId);
      human.assignmentLocked = !human.assignmentLocked;
    },
    pick({ content }) {
      const button = events[this.nextEvent].buttons.find((b) => b.content === content);
      if (!button) {
        throw new Error('Unknown button');
      }

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
      this.humans.forEach((h) => {
        if (!h.assignmentLocked) {
          h.assignment = null;
        }
      });
      // Auto discover missions
      for (let missionName in missions) {
        const mission = missions[missionName];
        if (mission.autoDiscover && !this.availableMissionsSet.has(missionName) && mission.autoDiscover(this)) {
          this.availableMissions.push(missionName);
          if (mission.onDiscover) {
            this.messages.push(mission.onDiscover);
          }
        }
      }

      // Add events
      this.events = Object.entries(events)
        .filter(
          ([eventName, event]) =>
            (!event.turn || event.turn === this.getResource('day')) &&
            (!event.runIf || event.runIf(this)) &&
            (event.repeatable || !this.pastEventsSet.has(eventName))
        )
        .sort((kv1, kv2) => (kv1[1].order || 0) - (kv2[1].order || 0))
        .map((kv) => kv[0]);
    },
    resource(id) {
      const r = this.resources.find((r) => r.id == id);
      if (r) {
        return r;
      }
      throw new Error('Unknown resource: ' + id);
    },
    getResource(id) {
      return this.resource(id).qty;
    },
    setResourceRelative(id, relativeQty, ignoreMaximum = false) {
      const resource = this.resource(id);
      resource.qty += relativeQty;

      if (resource.qty > 0 && !resource.used) {
        resource.used = true;
      }

      if (resource.qty < 0) {
        resource.qty = 0;
        return false;
      } else if (resource.max && resource.qty > resource.max && !ignoreMaximum) {
        resource.qty = resource.max;
        return false;
      }
      return true;
    },
    removeMission(missionName) {
      this.availableMissions = this.availableMissions.filter((m) => m !== missionName);
      this.humans.forEach((p) => {
        if (p.assignment === missionName) {
          this.unassign({ humanId: p.id });
        }
      });
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
