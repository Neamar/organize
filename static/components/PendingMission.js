export default {
  props: {
    mission: Object,
    humans: Array,
  },
  computed: {
    participants() {
      return this.humans.filter((h) => h.assignment == this);
    },
    potentialParticipants() {
      return this.humans.filter((h) => !h.assignment);
    },
  },
  methods: {
    appendParticipant(e) {
      const selectedId = parseInt(e.srcElement.value);
      const human = this.humans.find((h) => h.id === selectedId);
      human.assignment = this;
      e.srcElement.value = '';
    },
    unassign(participant) {
      participant.assignment = null;
    },
  },
  template: `
  <div>
    <p>Mission : {{ mission.name }}</p>
    <ul>
    <li v-for="participant in participants">{{ participant.name }} <button @click="unassign(participant)">Annuler</button></li>
    <li v-if="potentialParticipants.length > 0"><select @change="appendParticipant">
      <option selected value="">--</option>
      <option v-for="human in potentialParticipants" :value="human.id">{{ human.name }}</option>
    </select>
    </li>
    </ul>
  </div>
  `,
};
