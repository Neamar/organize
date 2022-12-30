import events from '../constants/events.js';

export default {
  emits: ['pick'],
  props: {
    id: String,
  },
  methods: {
    pick(content) {
      this.$emit('pick', { content });
    },
  },
  computed: {
    event() {
      return events[this.id];
    }
  },
  template: `
  <div class="event">
    <p>{{ event.content }}</p>
    <button v-for="button in event.buttons" @click="pick(button.content)">{{ button.content }}</button>
  </div>
  `,
};
