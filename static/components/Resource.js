export default {
  props: {
    data: Object,
  },
  template: `
  <li>{{ data.qty }} {{ data.icon }}</li>
  `,
};
