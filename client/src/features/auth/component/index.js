import React from "react";
import { Route } from "react-router-dom";
import Signup from "../container/Signup";
import Signin from "../container/Signin";

const Auth = () => {
	return (
		<div>
			<Route path="/auth/login" component={Signup} />

			<Route path="/auth/signin" component={Signin} />
		</div>
	);
};

export default Auth;
