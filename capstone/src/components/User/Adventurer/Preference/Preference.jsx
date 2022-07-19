import './Preference.css';

export default function Preference() {
  return (
    <div className="filterExperience">
      <div className="filterOptions">
        <h2>Define your adventure path</h2>
        <button type="button" value="add" className="addFilter">Add preferences</button>
      </div>
      <div className="profile">
        <h2>Define your adventurer profile</h2>
      </div>
    </div>
  );
}
