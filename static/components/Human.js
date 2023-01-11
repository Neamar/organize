export default {
  emits: ['unassign'],
  props: {
    human: {
      type: Object,
      required: true,
    },
    pendingMissions: {
      type: Array,
      required: true,
    },
  },
  computed: {
    pendingMission() {
      return this.pendingMissions.find((pm) => pm.id == this.human.assignment);
    },
    typeEmoji() {
      const types = {
        civilian: '',
        military: '🪖',
        engineer: '📐',
      };

      return types[this.human.type];
    },
  },
  methods: {
    unassign() {
      this.$emit('unassign', { humanId: this.human.id });
    },
  },
  template: `
  <div>
    <p>
      Nom : {{ human.name }}
      <span v-if="human.assignment">
        ({{ pendingMission.mission.name }})
        <button @click="unassign">Annuler</button>
      </span>
      {{ typeEmoji }}
      <span v-if="human.starving">Crève la dalle</span>
    </p>
  </div>
  `,
};
