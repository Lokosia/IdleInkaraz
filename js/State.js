/**
 * Enhanced State module for centralized state management with pubsub pattern.
 * All game state should be stored and accessed through this module.
 */

/**
 * Event system for state changes
 * @type {Object.<string, Array<function>>}
 */
const listeners = {};

/**
 * Register a listener for a specific state property change
 * @param {string} property - The state property to watch
 * @param {function} callback - Function to call when property changes
 * @returns {function} Unsubscribe function
 */
function subscribe(property, callback) {
  if (!listeners[property]) {
    listeners[property] = [];
  }
  listeners[property].push(callback);
  
  // Return unsubscribe function
  return () => {
    listeners[property] = listeners[property].filter(cb => cb !== callback);
  };
}

/**
 * Notify listeners that a state property has changed
 * @param {string} property - The property that changed
 * @param {*} value - The new value
 * @private
 */
function _notify(property, value) {
  if (listeners[property]) {
    listeners[property].forEach(callback => callback(value));
  }
  
  // Also notify "any" listeners
  if (listeners.any) {
    listeners.any.forEach(callback => callback({ property, value }));
  }
}

/**
 * Central State object for tracking all game state.
 * Uses getters and setters to track changes and notify listeners.
 */
const State = {
  // Core game state
  _totalLevel: 0,
  _dropRate: 0,
  _playTime: 0,
  _snackBarTimer: 0,
  _exileData: null,
  _exileMap: null,
  
  // Upgrades state (consolidated from Augments.js)
  _upgradeDropRate: 0,
  _sulphiteDropRate: 350,
  _nikoScarab: 0,
  _incDropRate: 0,
  _incubatorCost: 10,
  _flippingSpeed: 1,
  _flippingSpeedCost: 1,
  
  // UI state flags (consolidated from various components)
  _delveScarabShown: false,
  _iiQUpgradeShown: false,
  _incubatorUpgradeShown: false,
  _flipSpeedUpgradeShown: false,
  
  // Stash tab state (consolidated from StashTabUpgrades.js)
  _currencyStashTab: 0,
  _delveStashTab: 0,
  _quadStashTab: 0,
  _divStashTab: 0,
  _currencyTabShown: false,
  _delveTabShown: false,
  _quadTabShown: false,
  _divTabShown: false,
  
  // --- Getters and setters for all properties ---
  
  // Core state getters/setters
  get totalLevel() { return this._totalLevel; },
  set totalLevel(val) {
    this._totalLevel = val;
    _notify('totalLevel', val);
  },
  
  get dropRate() { return this._dropRate; },
  set dropRate(val) {
    this._dropRate = val;
    _notify('dropRate', val);
  },
  
  get playTime() { return this._playTime; },
  set playTime(val) {
    this._playTime = val;
    _notify('playTime', val);
  },
  
  get snackBarTimer() { return this._snackBarTimer; },
  set snackBarTimer(val) {
    this._snackBarTimer = val;
    _notify('snackBarTimer', val);
  },
  
  get exileData() { return this._exileData; },
  set exileData(val) {
    this._exileData = val;
    _notify('exileData', val);
  },
  
  get exileMap() { return this._exileMap; },
  set exileMap(val) {
    this._exileMap = val;
    _notify('exileMap', val);
  },
  
  // Upgrade state getters/setters
  get upgradeDropRate() { return this._upgradeDropRate; },
  set upgradeDropRate(val) {
    this._upgradeDropRate = val;
    _notify('upgradeDropRate', val);
  },
  
  get sulphiteDropRate() { return this._sulphiteDropRate; },
  set sulphiteDropRate(val) {
    this._sulphiteDropRate = val;
    _notify('sulphiteDropRate', val);
  },
  
  get nikoScarab() { return this._nikoScarab; },
  set nikoScarab(val) {
    this._nikoScarab = val;
    _notify('nikoScarab', val);
  },
  
  get incDropRate() { return this._incDropRate; },
  set incDropRate(val) {
    this._incDropRate = val;
    _notify('incDropRate', val);
  },
  
  get incubatorCost() { return this._incubatorCost; },
  set incubatorCost(val) {
    this._incubatorCost = val;
    _notify('incubatorCost', val);
  },
  
  get flippingSpeed() { return this._flippingSpeed; },
  set flippingSpeed(val) {
    this._flippingSpeed = val;
    _notify('flippingSpeed', val);
  },
  
  get flippingSpeedCost() { return this._flippingSpeedCost; },
  set flippingSpeedCost(val) {
    this._flippingSpeedCost = val;
    _notify('flippingSpeedCost', val);
  },
  
  // UI state flag getters/setters
  get delveScarabShown() { return this._delveScarabShown; },
  set delveScarabShown(val) {
    this._delveScarabShown = val;
    _notify('delveScarabShown', val);
  },
  
  get iiQUpgradeShown() { return this._iiQUpgradeShown; },
  set iiQUpgradeShown(val) {
    this._iiQUpgradeShown = val;
    _notify('iiQUpgradeShown', val);
  },
  
  get incubatorUpgradeShown() { return this._incubatorUpgradeShown; },
  set incubatorUpgradeShown(val) {
    this._incubatorUpgradeShown = val;
    _notify('incubatorUpgradeShown', val);
  },
  
  get flipSpeedUpgradeShown() { return this._flipSpeedUpgradeShown; },
  set flipSpeedUpgradeShown(val) {
    this._flipSpeedUpgradeShown = val;
    _notify('flipSpeedUpgradeShown', val);
  },
  
  // Stash tab state getters/setters
  get currencyStashTab() { return this._currencyStashTab; },
  set currencyStashTab(val) {
    this._currencyStashTab = val;
    _notify('currencyStashTab', val);
  },
  
  get delveStashTab() { return this._delveStashTab; },
  set delveStashTab(val) {
    this._delveStashTab = val;
    _notify('delveStashTab', val);
  },
  
  get quadStashTab() { return this._quadStashTab; },
  set quadStashTab(val) {
    this._quadStashTab = val;
    _notify('quadStashTab', val);
  },
  
  get divStashTab() { return this._divStashTab; },
  set divStashTab(val) {
    this._divStashTab = val;
    _notify('divStashTab', val);
  },
  
  get currencyTabShown() { return this._currencyTabShown; },
  set currencyTabShown(val) {
    this._currencyTabShown = val;
    _notify('currencyTabShown', val);
  },
  
  get delveTabShown() { return this._delveTabShown; },
  set delveTabShown(val) {
    this._delveTabShown = val;
    _notify('delveTabShown', val);
  },
  
  get quadTabShown() { return this._quadTabShown; },
  set quadTabShown(val) {
    this._quadTabShown = val;
    _notify('quadTabShown', val);
  },
  
  get divTabShown() { return this._divTabShown; },
  set divTabShown(val) {
    this._divTabShown = val;
    _notify('divTabShown', val);
  },
};

export { subscribe };
export default State;