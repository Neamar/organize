export default {
  props: {
    data: Object,
  },
  template: `
  <div>
    <p>Mission : {{ data.mission.name }}</p>
  </div>
  `,
};
