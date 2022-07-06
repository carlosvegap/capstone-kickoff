import LoginContext from "../../../Contexts/LoginContext"
import {useContext} from "react";
import "./Login.css"

export default function Login(){
    const loginObject = useContext(LoginContext)
    return (
        <div className="login">
            <h2>Log In</h2>
            <input name="username" type="text" placeholder="username" value={loginObject.loginForm.username} onChange={(e)=>loginObject.handleOnLoginChange(e.target.name, e.target.value)}/>
            <input name="password" type="password" value={loginObject.loginForm.password} onChange={(e)=>loginObject.handleOnLoginFormChange(e.target.name, e.target.value)}/>
            <button>Login</button>
        </div>
    )
}