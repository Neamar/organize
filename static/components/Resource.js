export default {
  props: {
    data: Object,
  },
  template: `
  <li>{{ data.qty }}<small v-if="data.max"> / {{ data.max }}</small> {{ data.icon }}</li>
  `,
};
