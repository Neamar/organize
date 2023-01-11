export default {
  emits: ['assign', 'unassign', 'toggleLock'],
  props: {
    pendingMission: {
      type: Object,
      required: true,
    },
    humans: {
      type: Object,
      required: true,
    },
    canLockAssignments: Boolean,
  },
  computed: {
    potentialParticipants() {
      return this.humans.filter((h) => !h.assignment);
    },
  },
  methods: {
    appendParticipant(e) {
      const selectedId = parseInt(e.srcElement.value);
      this.$emit('assign', { missionId: this.pendingMission.id, humanId: selectedId });
      e.srcElement.value = '';
    },
    unassign(participant) {
      this.$emit('unassign', { humanId: participant.id });
    },
    toggleLock(participant) {
      this.$emit('toggleLock', { humanId: participant.id });
    },
    lockStatusTitle(participant) {
      return participant.assignmentLocked ? 'Ne pas répéter la mission tous les jours' : 'Répéter la mission tous les jours';
    },
  },
  template: `
  <div>
    <p>
      <span :class="{invalid: !pendingMission.valid}">Mission</span> : {{ pendingMission.mission.name }}
      <small v-if="pendingMission.mission.minParticipants" :class="{invalid: !pendingMission.validParticipants}">{{ pendingMission.mission.minParticipants }} personnes minimum</small>
      <small v-for="r in pendingMission.resources" :class="{invalid: !r.valid}">{{ r.qty }} {{ r.resource.icon }}</small></p>
    <ul>
      <li v-for="participant in pendingMission.participants">
        {{ participant.name }}
        <template v-if="canLockAssignments">
        <a @click.prevent="toggleLock(participant)" href="#" :title="lockStatusTitle(participant)">
          <span v-if="participant.assignmentLocked">🔒</span>
          <span v-else="">🔓</span>
        </a>
        </template>
        <button @click="unassign(participant)">Annuler</button></li>
      <li v-if="potentialParticipants.length > 0 && pendingMission.participants.length < (pendingMission.mission.maxParticipants || Infinity)">
        <select @change="appendParticipant">
          <option selected value="">--</option>
          <option v-for="human in potentialParticipants" :value="human.id">{{ human.name }}</option>
        </select>
      </li>
    </ul>
  </div>
  `,
};
