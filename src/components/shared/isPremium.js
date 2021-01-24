// TODO write tests for this
const isPremium = ({ premium }) =>
  premium && premium.seconds && premium.seconds - Date.now() / 1000 > 0;

export default isPremium;
