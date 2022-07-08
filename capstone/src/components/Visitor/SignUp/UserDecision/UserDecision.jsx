import './UserDecision.css';

export default function UserDecision({ signUpUser, handleOnClickUserButton }) {
  let adventurerButtonClass = 'chosenUser';
  let experienceMakerButtonClass = 'notChosenUser';
  if (signUpUser === 'adventurer') {
    adventurerButtonClass = 'chosenUser';
    experienceMakerButtonClass = 'notChosenUser';
  } else {
    adventurerButtonClass = 'notChosenUser';
    experienceMakerButtonClass = 'chosenUser';
  }
  return (
    <div className="userDecision">
      <h3>I am an ...</h3>
      <button name="adventurer" className={adventurerButtonClass} type="button" onClick={(e) => handleOnClickUserButton(e.target.name)}>Adventurer</button>
      <button name="experienceMaker" className={experienceMakerButtonClass} type="button" onClick={(e) => handleOnClickUserButton(e.target.name)}>Experience Maker</button>
    </div>
  );
}
