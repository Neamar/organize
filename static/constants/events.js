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
 * @property {Boolean} [repeatable=false] Can this event trigger more than once?
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
    content: `Le monde s'est effondré.<br>
    La civilisation a disparu.<br>
    <br>
    Pour les rares humains restants, il va falloir survivre.`,
    buttons: [
      {
        content: 'OK',
      },
    ],
  },
  introduction2: {
    turn: 1,
    content: `Marc et Jenny ont trouvé une clairière à côté d'un village abandonné.<br>
      Ils ont quelques boîtes de conserve avec eux, mais rien qui ne permette de survivre très longtemps.`,
    buttons: [
      {
        content: "C'est parti !",
      },
    ],
  },
  survivor1: {
    turn: 6,
    content: 'Un survivant émacié titube dans la clairière.',
    buttons: [
      {
        content: "L'envoyer mourir plus loin",
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
            assignmentLocked: false,
            starving: true,
          };
          state.humans.push(human);
          state.messages.push('> Un nouvel humain rejoint votre campement, et peut désormais effectuer des missions.');
        },
      },
    ],
  },
  survivor1_2: {
    turn: 6,
    content: "S'il était là, d'autres sont probablement présents aussi. Nous pourrions partir à leur recherche.",
    buttons: [
      {
        content: 'OK',
        run: (state) => {
          state.availableMissions.push('findHuman');
        },
      },
    ],
  },
  militaryGuyStart: {
    runIf: (state) => state.values.madeRadio,
    content:
      "La radio s'allume. Aucune station ne semble émettre. Dans le doute, vous envoyez des SOS en boucle.<br>Après une trentaine de minutes, le voyant lumineux s'éteint.",
    buttons: [
      {
        content: 'Les piles sont mortes.',
        run: (state) => {
          state.values.militaryGuyIncoming = true;
        },
      },
    ],
  },
  militaryGuy: {
    runIf: (state) => state.values.militaryGuyIncoming,
    content:
      "Un homme en treillis apparaît au bout du campement. Il dit être un sergent de l'armée ; il a entendu votre message à la radio. Il analyse votre campement d'un œil critique, puis pose ses affaires. Il semble avoir prévu de rester. La présence d'une arme à sa hanche décourage les questions.",
    buttons: [
      {
        content: "L'accueillir",
        run: (state) => {
          delete state.values.militaryGuyIncoming;

          state.availableMissions.push('makeMilitary');
          state.setResourceRelative('ammo', 10);

          /**
           * @type import('./missions.js').Human
           */
          const human = {
            id: 4,
            name: 'Sergeant',
            type: 'military',
            assignment: null,
            assignmentLocked: false,
            starving: false,
          };
          state.humans.push(human);

          state.messages.push('Un militaire a rejoint votre campement !');
          state.messages.push('> Certaines missions ne peuvent être réalisées que par des personnes ayant certaines compétences.');
          state.messages.push('> Les militaires consomment plus de nourriture que les autres... la loi du plus fort.');
        },
      },
    ],
  },
  assignmentsLock: {
    turn: 8,
    content: "Il serait probablement plus efficace d'assigner certaines personnes à des missions de façon routinière...",
    buttons: [
      {
        content: 'OK',
        run: (state) => {
          state.canLockAssignments = true;
          state.messages.push("> Vous pouvez maintenant conserver la même personne à un poste donné d'un jour à l'autre.");
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
