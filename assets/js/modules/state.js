const state = {
  currentUser: null,
  sessionReady: false,
  progressTimer: null,
};

function getState(key) {
  return state[key];
}

function setState(key, value) {
  state[key] = value;
}

export { getState, setState };
