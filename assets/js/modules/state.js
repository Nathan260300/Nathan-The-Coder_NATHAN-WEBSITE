const state = {
  currentUser:   null,
  sessionReady:  false,
  progressTimer: null,
  loginProvider: null,
};

function getState(key) {
  return state[key];
}

function setState(key, value) {
  state[key] = value;
  if (key === 'loginProvider') {
    if (value) localStorage.setItem('loginProvider', value);
    else       localStorage.removeItem('loginProvider');
  }
}

function initState() {
  state.loginProvider = localStorage.getItem('loginProvider') || null;
}

export { getState, setState, initState };