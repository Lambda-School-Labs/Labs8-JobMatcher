import React from "react";
import DateRangePicker from "@wojtekmaj/react-daterange-picker";
import PropTypes from "prop-types";

import {
	StyledInput,
	FormDiv,
	StyledLabel,
	FormGroup,SaveButton,
	Title
} from "./indexCss";

const Forms = ({ state, onChange,  title, onSubmit }) => {
	//Form will display a set of group form,
	//TODO represent the state of inputs using visual aid.

	let arr = Object.entries(state);
	let inputs = arr.map((item, index) =>
		//check for date input type and using daterangepicker lib
		!item[0].includes("date") ? (
			<FormGroup key={item[1].id || item[0]}>
				<StyledInput
					type={item[1].type || "text"}
					name={item[1].name || item[0]}
					id={item[1].id || item[0]}
					placeholder={item[1].placeholder ||item[1].name ||item[0]}
					value={item[1].value}
					onChange={onChange}
				/>
				<StyledLabel htmlFor={item[1].id || item[0]}>
					{item[1].name || item[0]}
				</StyledLabel>
			</FormGroup>
		) : (
			<DateRangePicker
				key={item[1].id || item[0]}
				onChange={onChange}
				value={item[1].date}
			/>
		)
	);
	return (
		<FormDiv>
			<Title>{title}</Title>
			{inputs}
			<SaveButton onClick={onSubmit}> save </SaveButton>
		</FormDiv>
	);
};

export default Forms;
Forms.propTypes = {
	state: PropTypes.object,
	title: PropTypes.string,
	onSubmit:  PropTypes.func,
	onChange:  PropTypes.func,

};