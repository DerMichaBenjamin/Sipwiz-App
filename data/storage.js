const STORAGE_KEY = 'zipwize_local_state_v1';

export const defaultState = {
  user: null,
  customDrinks: [
    { id: 'custom_radler', name: 'Radler', ml: 300, abv: 2.5 },
    { id: 'custom_sekt', name: 'Sekt', ml: 100, abv: 11 }
  ],
  sessions: [],
  app: {
    hasSeenDisclaimer: false,
    notificationPermissionAsked: false
  }
};

export function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultState;
    const parsed = JSON.parse(raw);
    return {
      ...defaultState,
      ...parsed,
      customDrinks: parsed.customDrinks ?? defaultState.customDrinks,
      sessions: parsed.sessions ?? [],
      app: { ...defaultState.app, ...(parsed.app ?? {}) }
    };
  } catch (error) {
    console.error('ZIPWIZE konnte lokale Daten nicht lesen.', error);
    return defaultState;
  }
}

export function saveState(state) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function resetState() {
  localStorage.removeItem(STORAGE_KEY);
}
