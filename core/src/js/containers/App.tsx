/**
 * Created by tutu on 16-1-4.
 */

/// <reference path="../../../../typings/react/react.d.ts" />
/// <reference path="../../../../typings/redux/redux.d.ts" />
/// <reference path="../../../../typings/react-redux/react-redux.d.ts" />

import * as React from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import * as MainAction from "../actions/Main";
import * as UserAction from "../actions/User";
import * as PlaybookAction from "../actions/Playbook";
import Loading from "./Loading";
import Header from "./Header";
import Left from "./Left";
import Message from "./Message";
import Content from "./Content";
import Platform from "../../../../app/tools/Platform";

interface AppProp {
    playbook?: any;
    loading?: any;
    user?: any;
    style?: any;
    params?: any;
    mainAction?: any;
    userAction?: any;
    playbookAction?: any;
}

class App extends React.Component<AppProp, any> {

    constructor(props: any, context: any) {
        super(props, context);
    }

    private init(){
        if(!this.props.user.email){
            this.props.mainAction.router("/login");
        }
    }

    private updateDimensions() {
        Platform.getPlatform().init();
        this.setState({update:true});
    }

    public componentDidMount() {
        this.init();
        window.addEventListener("resize", this.updateDimensions.bind(this));
    }

    public componentWillUnmount() {
        window.removeEventListener("resize", this.updateDimensions.bind(this));
    }

    public render() {
        return (
            <div>
                <Header user={this.props.user}
                        mainAction={this.props.mainAction}/>
                <Left show={this.props.style.left}
                      mainAction={this.props.mainAction}
                      playbookAction={this.props.playbookAction}
                      playbook={this.props.playbook}/>
                <Content playbook={this.props.playbook}
                         mainAction={this.props.mainAction}
                         playbookAction={this.props.playbookAction}
                         id={this.props.params.id}
                         type={this.props.params.type}/>
                <Loading loading={this.props.loading.isLoad}/>
                <Message message={this.props.style.message} mainAction={this.props.mainAction}/>
            </div>
        );
    }
}

function mapStateToProps(state: any) {
    return {
        playbook: state.PlayBook,
        loading: state.Loading,
        user: state.User,
        style: state.Style
    };
}

function mapDispatchToProps(dispatch: any) {
    return {
        mainAction: bindActionCreators(MainAction, dispatch),
        userAction: bindActionCreators(UserAction, dispatch),
        playbookAction: bindActionCreators(PlaybookAction, dispatch)
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(App)
