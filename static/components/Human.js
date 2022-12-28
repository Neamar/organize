export default {
  props: {
    data: Object,
  },
  methods: {
    unassign() {
      this.data.assignment = null;
    },
  },
  template: `
  <div>
    <p>Nom : {{ data.name }} <span v-if="data.assignment">({{ data.assignment.mission.name }}) <button @click="unassign">Annuler</button></span> <span v-if="data.starving">Crève la dalle</span>
    </p>
  </div>
  `,
};
