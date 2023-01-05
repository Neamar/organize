/**
 * A button
 * @typedef {Object} Button
 * @property {String} content Button name
 * @property {Function} [run=() => {}] Function to run when selected
 */

/**
 * An event
 * @typedef {Object} Event
 * @property {Number} [order=0] Priority for this event, the lower the soonest it'll be displayed
 * @property {Number} [turn=null] Turn this event should activate
 * @property {Function} [runIf=() => {}] Run if conditions are met
 * @property {String} content Event description
 * @property {Button[]} buttons list of associate buttons
 */

/**
 * Static list of all events, not reactive
 * @type {Object.<string, Event>}
 */
const events = {
  introduction: {
    turn: 1,
    content: "Le monde s'est effondré. Il va falloir survivre.",
    buttons: [
      {
        content: 'OK',
      },
    ],
  },
  introduction2: {
    turn: 1,
    content:
      "Marc et Jenny ont trouvé une clairière à côté d'un village abandonné.<br>Ils ont un peu de nourriture avec eux, mais rien qui ne permette de survivre très longtemps.",
    buttons: [
      {
        content: "C'est parti",
      },
    ],
  },
  survivor1: {
    turn: 6,
    content: 'Un survivant émacié titube dans la clairière.',
    buttons: [
      {
        content: 'Le renvoyer',
      },
      {
        content: "L'accueillir",
        run: (state) => {
          /**
           * @type import('./missions.js').Human
           */
          const human = {
            id: 3,
            name: 'Nicholas',
            type: 'civilian',
            assignment: null,
            starving: true,
          };
          state.humans.push(human);
        },
      },
    ],
  },
  survivor1_2: {
    turn: 6,
    content: "S'il était là, d'autres sont probablement présents aussi. Une nouvelle mission est disponible.",
    buttons: [
      {
        content: 'OK',
        run: (state) => {
          state.availableMissions.push('findHuman');
        },
      },
    ],
  },
  defeat: {
    order: 1000,
    runIf: (state) => state.humans.length === 0,
    content: "Hélas, il ne reste plus aucun survivant. La partie s'arrête ici.",
    buttons: [],
  },
};

export default events;
