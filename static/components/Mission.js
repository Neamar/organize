export default {
  emits: ['assign', 'unassign'],
  props: {
    id: String,
    mission: Object,
    valid: Boolean,
    participants: Array,
    humans: Array,
  },
  computed: {
    potentialParticipants() {
      return this.humans.filter((h) => !h.assignment);
    },
    className() {
      return this.valid ? 'valid' : 'invalid';
    },
  },
  methods: {
    appendParticipant(e) {
      const selectedId = parseInt(e.srcElement.value);
      this.$emit('assign', { missionId: this.id, humanId: selectedId });
      e.srcElement.value = '';
    },
    unassign(participant) {
      this.$emit('unassign', { humanId: participant.id });
    },
  },
  template: `
  <div>
    <p><span :class="className">Mission</span> : {{ mission.name }} <small v-if="mission.minParticipants">{{ mission.minParticipants }} personnes minimum</small></p>
    <ul>
    <li v-for="participant in participants">{{ participant.name }} <button @click="unassign(participant)">Annuler</button></li>
    <li v-if="potentialParticipants.length > 0 && participants.length < (mission.maxParticipants || Infinity)"><select @change="appendParticipant">
      <option selected value="">--</option>
      <option v-for="human in potentialParticipants" :value="human.id">{{ human.name }}</option>
    </select>
    </li>
    </ul>
  </div>
  `,
};
