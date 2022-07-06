import "./Home.css"
import Login from "./Login/Login"
import SignUp from  "./SignUp/SignUp"

export default function Home(){
    return (
        <div className="home">
            <Login />
            <SignUp/>
        </div>
    )
}
