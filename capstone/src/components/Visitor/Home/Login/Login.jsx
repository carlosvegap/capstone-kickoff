import LoginContext from "../../../Contexts/LoginContext"
import {useContext} from "react";
import "./Login.css"

export default function Login(){
    const loginValue = useContext(LoginContext)
    return (
        <div className="login">
            <input name="username" type="text" placeholder="username" value={loginValue.username} />
            <input name="password" type="password" value={loginValue.password} />
            <button>Login</button>
        </div>
    )
}