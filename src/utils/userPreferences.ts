const PREFERENCES_KEY = 'ibf_certification_preferences';

interface UserPreferences {
  industry?: string;
  certificationLevel?: string;
  darkMode?: boolean;
  lastVisitedStep?: number;
}

export const savePreferences = (preferences: Partial<UserPreferences>) => {
  try {
    const existing = localStorage.getItem(PREFERENCES_KEY);
    const currentPrefs = existing ? JSON.parse(existing) : {};
    const updatedPrefs = { ...currentPrefs, ...preferences };
    localStorage.setItem(PREFERENCES_KEY, JSON.stringify(updatedPrefs));
  } catch (error) {
    console.warn('Failed to save preferences:', error);
  }
};

export const getPreferences = (): UserPreferences => {
  try {
    const prefs = localStorage.getItem(PREFERENCES_KEY);
    return prefs ? JSON.parse(prefs) : {};
  } catch (error) {
    console.warn('Failed to load preferences:', error);
    return {};
  }
};