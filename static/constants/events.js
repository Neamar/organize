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
          state.humans.push({
            id: 3,
            name: 'Nicholas',
            type: 'civilian',
            assignment: null,
            starving: true,
          });
        },
      },
    ],
  },
};

export default events;
