import SignUpContext from "../../../Contexts/SignUpContext"
import {useContext} from "react"
import "./SignUp.css"

export default function SignUp(){
    const signUpObject = useContext(SignUpContext)
    return (
        <div className="signUp">
            <h2>Sign Up</h2>
            <input name="firstName" type="text" placeholder="First Name" value={signUpObject.signUpForm.firstName} onChange={
                (e)=>signUpObject.handleOnSignUpChange(e.target.name, e.target.value)
            }/>
            <input name="lastName" type="text" placeholder="Last Name" value={signUpObject.signUpForm.lastName} onChange={
                (e)=>signUpObject.handleOnSignUpChange(e.target.name, e.target.value)
            }/>
            <input name="username" type="text" placeholder="Username" value={signUpObject.signUpForm.username} onChange={
                (e)=>signUpObject.handleOnSignUpChange(e.target.name, e.target.value)
            }/>
            <input name="password" type="password" placeholder="Password" value={signUpObject.signUpForm.password} onChange={
                (e)=>signUpObject.handleOnSignUpChange(e.target.name, e.target.value)
            }/>
            <input name="email" type="email" placeholder="Your Email" value={signUpObject.signUpForm.email} onChange={
                (e)=>signUpObject.handleOnSignUpChange(e.target.name, e.target.value)
            }/>
            <button>Sign Up</button>
        </div>
    )
}