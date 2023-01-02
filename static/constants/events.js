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
    runIf: (state) => state.humans.length === 0,
    content: "Hélas, il ne reste plus aucun survivant. La partie s'arrête ici.",
    buttons: [],
  },
};

export default events;
