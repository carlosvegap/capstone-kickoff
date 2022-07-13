import './Adventurer.css';
import FindAdventure from './FindAdventure/FindAdventure';

export default function Adventurer() {
  return (
    <div className="adventure">
      <FindAdventure />
      <div className="profile">
        <h2>information</h2>
      </div>
    </div>
  );
}
