let exileData = null;
let exileMap = null;

/**
 * Global State object for tracking game-wide state and references.
 *
 * @type {Object}
 * @property {number} totalLevel - The total level of all exiles.
 * @property {number} dropRate - The global drop rate multiplier.
 * @property {number} playTime - The total play time in seconds.
 * @property {number} snackBarTimer - Timer for controlling snackbar notifications.
 * @property {Array|null} exileData - Array of exile objects (or null if not initialized).
 * @property {Object|null} exileMap - Map of exile names to exile objects (or null if not initialized).
 */
const State = {
  totalLevel: 0,
  dropRate: 0,
  playTime: 0,
  snackBarTimer: 0,
  exileData: null,
  exileMap: null
};

export default State;