export default {
  props: {
    data: Object,
  },
  template: `
  <li title="{{data.name}}">
    {{ data.qty }}
    <small v-if="data.max"> / {{ data.max }}</small>
    {{ data.icon }}
  </li>
  `,
};
