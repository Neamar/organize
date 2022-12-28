class Human {
  constructor(name, type) {
    this.name = name;
    this.type = type;
  }
}

class Building {
  missions = [];
  displayable = true;
  constructor(name, displayable) {
    this.name = name;
    this.displayable = displayable;
  }
}

class PendingMission {
  participants = [];
  maxParticipants = 1;
  constructor(mission) {
    this.mission = mission;
  }

  run(state) {
    this.mission.run(state);
  }
}

class Resource {
  constructor(name, qty, icon) {
    this.name = name;
    this.qty = qty;
    this.icon = icon;
  }
}

const state = {
  resources: {
    day: new Resource('Jour', 0, '📅'),
    human: new Resource('Humain', 1, '🧑'),
    rawFood: new Resource('Nourriture crue', 10, '🍖'),
    wood: new Resource('Bois', 0, '🪵'),
    metal: new Resource('Métal', 0, '⚙️'),
  },
  missions: {
    basicFoodMission: {
      name: 'Chercher de la nourriture',
      run: (state) => {
        state.resources.rawFood.qty += 3;
      },
    },
  },
  pendingMissions: [],
  humans: [new Human('Marc', 'civil')],
  buildings: [],
};

function newDay(state) {
  state.pendingMissions = state.missions.filter((m) => !m.requirements || m.requirements()).map((m) => new PendingMission(m));
}

newDay(state);
