const events = {
  introduction: {
    turn: 1,
    content: "Le monde s'est effondré. Il va falloir survivre.",
    buttons: [
      {
        content: 'OK',
        run(state) {
          state.setResourceRelative('day', 15);
        },
      },
      {
        content: "On s'en FOUT",
      },
    ],
  },
};

export default events;
