import './UserDecision.css';

export default function UserDecision({ signUpUser, handleOnSignUpChange }) {
  return (
    <div className="userDecision">
      <h3>I am an ...</h3>
      {signUpUser === 'adventurer'
        ? (
          <>
            <button name="userType" value="adventurer" className="chosenUser" type="button" onClick={(e) => handleOnSignUpChange(e.target.name, e.target.value)}>Adventurer</button>
            <button name="userType" value="experienceMaker" className="notChosenUser" type="button" onClick={(e) => handleOnSignUpChange(e.target.name, e.target.value)}>Experience Maker</button>
          </>
        )
        : (
          <>
            <button name="userType" value="adventurer" className="notChosenUser" type="button" onClick={(e) => handleOnSignUpChange(e.target.name, e.target.value)}>Adventurer</button>
            <button name="userType" value="experienceMaker" className="chosenUser" type="button" onClick={(e) => handleOnSignUpChange(e.target.name, e.target.value)}>Experience Maker</button>
          </>
        )}
    </div>
  );
}
