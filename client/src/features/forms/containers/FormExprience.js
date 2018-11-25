import React, { Component } from "react";
import Form from "../components";
import connect from "react-redux/es/connect/connect";
import {updateProfileImg} from "../store/action";
import {getProfile, updateUser} from "../../auth/store/action";

class ExprienceContainer extends Component {
	state = {
		date: {
			date: [new Date(), new Date()],
			id: "expreince_data"
		},
		title: {
			value: ""
		},
		company: {
			value: ""
		},
		location: {
			value: ""
		},
		headline: {
			value: ""
		},
		description: {
			id: "exprience_description",
			value: ""
		}
	};

	onChange = e => {
		let updateState = { ...this.state };
		if (e.target) {
			updateState[e.target.name].value = e.target.value;
		} else {
			updateState.date.date = e;
		}
		this.setState({ ...updateState });
	};
	onSubmit =(e) =>{
		//adopt to seeker exprience field on backend;
		e.preventDefault();
		let userType = "seeker";
		let userId = this.props.currentUser.id ;
		let data = this.state;
		this.props.updateUser(userType, userId, {
			date: data.date.date,
			title: data.title.value,
			company: data.company.value,
			location: data.location.value,
			headline: data.headline.value,
			description: data.description.value
		});
	}

	render() {
		return (
			<Form
				title="Expreince"
				onSubmit={this.onSubmit}
				onChange={this.onChange}
				state={this.state}
			/>
		);
	}
}
const MapStateToProps = state => ({
	currentUser: state.user.currentUser,
	is_seeker: state.user.is_seeker,
	authenticatoin_succeed: state.authenticatoin_succeed
});
export default connect(
	MapStateToProps,
	{  updateProfileImg, getProfile, updateUser }
)(ExprienceContainer);