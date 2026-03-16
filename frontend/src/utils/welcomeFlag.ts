let _hasSeenWelcome = false;

export const hasSeenWelcome = () => _hasSeenWelcome;
export const markWelcomeSeen = () => { _hasSeenWelcome = true; };
