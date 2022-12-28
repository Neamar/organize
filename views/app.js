class Human {
  assignment = null;
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
  maxParticipants = 1;
  constructor(state, missionName) {
    this.state = state;
    this.missionName = missionName;
  }

  run(state) {
    missions[this.missionName].run(state);
  }

  participants() {
    return this.state.humans.filter((h) => h.assignment === this);
  }

  canAddParticipants() {
    return this.participants().length < this.maxParticipants;
  }

  potentialParticipants() {
    return this.state.humans.filter((h) => !h.assignment);
  }
}

class Resource {
  constructor(name, qty, icon) {
    this.name = name;
    this.qty = qty;
    this.icon = icon;
  }
}

const missions = {
  basicFoodMission: {
    name: 'Chercher de la nourriture',
    run: (state) => {
      state.resources.rawFood.qty += 3;
    },
  },
  basicWoodMission: {
    name: 'Chercher du bois',
    run: (state) => {
      state.resources.wood.qty += 2;
    },
  },
  basicMetalMission: {
    name: 'Chercher du métal',
    run: (state) => {
      state.resources.metal.qty += 1;
    },
  },
};

const state = {
  resources: {
    day: new Resource('Jour', 0, '📅'),
    human: new Resource('Humain', 1, '🧑'),
    rawFood: new Resource('Nourriture crue', 10, '🍖'),
    wood: new Resource('Bois', 0, '🪵'),
    metal: new Resource('Métal', 0, '⚙️'),
  },
  availableMissions: ['basicFoodMission', 'basicWoodMission', 'basicMetalMission'],
  pendingMissions: [],
  humans: [new Human('Marc', 'civil'), new Human('Jenny', 'civil')],
  buildings: [],
};

function newDay(state) {
  state.pendingMissions = state.availableMissions
    .filter((m) => !missions[m].requirements || missions[m].requirements())
    .map((m) => new PendingMission(state, m));
}

newDay(state);
console.log(state);
