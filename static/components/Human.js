export default {
  emits: ['unassign'],
  props: {
    id: Number,
    name: String,
    assignment: String,
    starving: Boolean,
    pendingMissions: Array,
  },
  computed: {
    pendingMission() {
      return this.pendingMissions.find((pm) => pm.id == this.assignment);
    },
  },
  methods: {
    unassign() {
      this.$emit('unassign', { humanId: this.id });
    },
  },
  template: `
  <div>
    <p>Nom : {{ name }} <span v-if="assignment">({{ pendingMission.mission.name }}) <button @click="unassign">Annuler</button></span> <span v-if="starving">Crève la dalle</span>
    </p>
  </div>
  `,
};
