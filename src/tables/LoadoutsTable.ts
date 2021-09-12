import { Loadout } from "../constants/loadouts";
import { Pioneer } from "../loadouts/pioneer";
import { Miner } from "../loadouts/miner";

export default Object.freeze({
  [Loadout.MINER]: new Miner(),
  [Loadout.PIONEER]: new Pioneer(),
});
