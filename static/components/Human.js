export default {
  props: {
    data: Object,
  },
  template: `
  <div>
    <p>Nom : {{ data.name }}</p>
  </div>
  `,
};
