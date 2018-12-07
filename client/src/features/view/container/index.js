import React, { Component } from "react";
import { connect } from "react-redux";
import { getRandomUser, postSuperAction } from "../store/action";
import { getMyJobs } from "../../job/store/action";
import { getProfile } from "../../auth/store/action";
import ExplicitBaseCard from "../../../presentation/BaseCard";
import styled from "styled-components";
import { toast } from "react-toastify";

const MatchContainer = styled.div`
  width: 400px;
  max-width: 900px;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  margin: 20px auto;
`;
class ViewContainer extends Component {
  state = {
    is_open: false,
    jobIdSelected: null,
    hasEnoughCreditForRegularAction: false,
    hasEnoughCreditForSuperAction: false,
    hoverText: "",
    outOfCreditAlert: false,
    confirmAction: false
  };
  componentDidMount() {
    // TODO handle the setime out in cleaner way.
    setTimeout(() => {
      this.getRandomUserHandler();
    }, 500);
  }

  showFullCard = e => {
    this.setState({
      is_open: !this.state.is_open
    });
  };
  validateSuperAction = (freeCredit, balance) => {
    if (freeCredit > 0 || balance > 0) {
      if (balance < 10 && freeCredit < 10) {
        this.setState({
          hasEnoughCreditForSuperAction: false,
          hoverText: `you need at least credit to match super`
        });
      } else {
        this.setState({
          hasEnoughCreditForSuperAction: true
        });
      }
    }
  };
  validate = () => {
    const userType = this.props.currentUser.is_seeker;
    let freeCredit;
    let balance = this.props.currentUser.credits;
    if (userType) {
      freeCredit = this.props.currentUser.free_apps;
    } else {
      freeCredit = this.props.currentUser.free_calls;
    }
    if (freeCredit > 0 || balance > 0) {
      this.validateSuperAction(freeCredit, balance);
      this.setState({
        hasEnoughCreditForRegularAction: true,
        hoverText: `you have ${freeCredit || balance} credit left`,
        outOfCreditAlert: false
      });
      if (this.props.currentUser.confirm_spending && freeCredit === 0) {
        this.setState({
          confirmAction: true
        });
      }
    } else {
      this.setState({
        hasEnoughCreditForRegularAction: false,
        hasEnoughCreditForSuperAction: false,
        hoverText: `you have ${freeCredit || balance} credit left, not enough`,
        outOfCreditAlert: "Purchase credit to enable skip super and apply!"
      });
    }
  };

  getRandomUserHandler = () => {
    const userType = this.props.currentUser.is_seeker;
    if (userType) {
      this.props.getRandomUser("job");
    } else {
      this.props.getRandomUser("seeker");
      this.props.getMyJobs();
    }
    this.setState({ jobIdSelected: null });
    this.validate();
    this.props.getProfile();
  };

  postMatchActionHandler = () => {
    const userType = this.props.currentUser.is_seeker;
    let balance = this.props.currentUser.credits;
    let data;
    if (balance < 10) {
      toast.error(
        "Please make sure you have at least 10 or more credit, to match a super"
      );
      return;
    }
    if (userType) {
      data = this.populateSeekerDataInfo("SUPER");
      toast.success("This job was Supered!!");
    } else {
      data = this.populateEmployerDataInfo("SUPER");
      toast.success(`You Supered ${this.props.data.first_name}`);
    }
    this.postCallAction(data);
    this.getRandomUserHandler();
  };

  postInterest = () => {
    const userType = this.props.currentUser.is_seeker;
    let data;
    if (userType) {
      data = this.populateSeekerDataInfo("APPLY");
      toast.success("Your application has been sent!");
    } else {
      data = this.populateEmployerDataInfo("CALL");
      toast.success(`Your call to ${this.props.data.first_name} has been sent`);
    }
    this.postCallAction(data);
    this.getRandomUserHandler();
  };

  postCallAction = data => {
    this.validate();
    this.props.postSuperAction(data);
    this.getRandomUserHandler();
    this.setState({ jobIdSelected: null });
  };

  populateSeekerDataInfo = action => {
    return {
      job_id: this.props.data.id,
      seeker_action: action,
      employer_action: "",
      seeker_id: this.props.currentUser.id,
      employer_id: this.props.data.employer.id
    };
  };
  populateEmployerDataInfo = action => {
    return {
      job_id: this.state.jobIdSelected,
      seeker_action: "",
      employer_action: action,
      seeker_id: this.props.data.id,
      employer_id: this.props.currentUser.id
    };
  };
  jobSelected = id => {
    this.setState({ jobIdSelected: id });
    this.validate();
  };
  render() {
    let dropDownToggleText;
    if (this.state.jobIdSelected) {
      dropDownToggleText = this.props.jobs.filter(
        job => job.id === this.state.jobIdSelected
      )[0].title;
    }

    let card;
    if (this.props.success && this.props.currentUser.is_seeker) {
      card = (
        <ExplicitBaseCard
          confirmAction={this.state.confirmAction} //seems to need to be passed before button is rendered
          btn1Text={"Skip"}
          btn2Text={"Super"}
          btn3Text={"App"}
          btn1={this.getRandomUserHandler}
          btn2={this.postMatchActionHandler}
          btn3={this.postInterest}
          name={this.props.data.company_name}
          title={this.props.data.title}
          summary={this.props.data.id} // change id to summary
          is_seeker={this.props.data.is_seeker}
          fullCardArrow={this.showFullCard}
          is_open={this.state.is_open}
          is_expandable={true}
          requirements={this.props.data.requirements}
          description={this.props.data.description}
          skills={this.props.data.top_skills}
          extra_skills={this.props.data.extra_skills}
          is_validbtn2={this.state.hasEnoughCreditForSuperAction}
          is_validbtn3={this.state.hasEnoughCreditForRegularAction}
          btn3Hover={this.state.hoverText}
          outOfCreditAlert={this.state.outOfCreditAlert}
          is_valid={this.state.hasEnoughCreditForRegularAction}
        />
      );
    } else if (this.props.success && !this.props.currentUser.is_seeker) {
      card = (
        <ExplicitBaseCard
          confirmAction={this.state.confirmAction} //seems to need to be passed before button is rendered
          btn1Text={"Skip"}
          btn2Text={"Super"}
          btn3Text={"Call"}
          btn1={this.getRandomUserHandler}
          btn2={this.postMatchActionHandler}
          btn3={this.postInterest}
          name={`${this.props.data.first_name} ${this.props.data.last_name}`}
          dropDown={this.props.jobs}
          dropDownToggleText={
            dropDownToggleText || "Select Job to Create a Match"
          }
          jobSelected={this.jobSelected}
          is_valid={this.state.jobIdSelected}
          is_validbtn2={
            this.state.jobIdSelected && this.state.hasEnoughCreditForSuperAction
          }
          is_validbtn3={
            this.state.jobIdSelected &&
            this.state.hasEnoughCreditForRegularAction
          }
          title={this.props.data.desired_title}
          summary={this.props.data.summary}
          is_seeker={this.props.data.is_seeker}
          outOfCreditAlert={this.state.outOfCreditAlert}
          fullCardArrow={this.showFullCard}
          is_open={this.state.is_open}
          is_expandable={true}
          education={this.props.data.education}
          experience={this.props.data.experience || "experience"}
          skills={this.props.data.top_skills}
          extra_skills={this.props.data.extra_skills}
          btn3Hover={this.state.hoverText}
        />
      );
    }

    if (!this.props.success) {
      return <h1>waiting</h1>;
    }
    return <MatchContainer>{card}</MatchContainer>;
  }
}

const MapStateToProps = state => {
  return {
    currentUser: state.user.currentUser,
    data: state.randomUser.data,
    success: state.randomUser.VIEW_SUCCESS,
    jobs: state.jobs.jobs
  };
};

export default connect(
  MapStateToProps,
  { getRandomUser, postSuperAction, getMyJobs, getProfile }
)(ViewContainer);
