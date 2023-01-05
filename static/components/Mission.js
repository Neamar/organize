export default {
  emits: ['assign', 'unassign'],
  props: {
    pendingMission: {
      type: Object,
      required: true,
    },
    humans: {
      type: Object,
      required: true,
    },
  },
  computed: {
    potentialParticipants() {
      return this.humans.filter((h) => !h.assignment);
    },
    className() {
      return this.pendingMission.valid ? 'valid' : 'invalid';
    },
    participantsClassName() {
      return this.pendingMission.validParticipants ? 'valid' : 'invalid';
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
  },
  template: `
  <div>
    <p><span :class="className">Mission</span> : {{ pendingMission.mission.name }} <small v-if="pendingMission.mission.minParticipants" :class="className">{{ pendingMission.mission.minParticipants }} personnes minimum</small></p>
    <ul>
    <li v-for="participant in pendingMission.participants">{{ participant.name }} <button @click="unassign(participant)">Annuler</button></li>
    <li v-if="potentialParticipants.length > 0 && pendingMission.participants.length < (pendingMission.mission.maxParticipants || Infinity)"><select @change="appendParticipant">
      <option selected value="">--</option>
      <option v-for="human in potentialParticipants" :value="human.id">{{ human.name }}</option>
    </select>
    </li>
    </ul>
  </div>
  `,
};
