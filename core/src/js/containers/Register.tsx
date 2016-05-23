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
import Loading from "./Loading";
import Paper = require('material-ui/lib/paper');
import TextField = require('material-ui/lib/text-field');
import FlatButton = require('material-ui/lib/flat-button');
import Message from "./Message";

interface RegisterProp {
    loading?: any;
    user?: any;
    style?: any;
    mainAction?: any;
    userAction?: any;
}

interface RegisterState {
    email?: string;
    password?: string;
    passwordS?: string;
}

class Register extends React.Component<RegisterProp, RegisterState> {

    constructor(props: any, context: any) {
        super(props, context);
        this.state = {email: "", password: "", passwordS: ""};
    }

    private init(){
        if(this.props.user.email){
            this.props.mainAction.router("/");
        }
    }

    public componentDidMount() {
        this.init();
    }

    public componentWillUnmount() {

    }

    public render () {
        let style = {position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)"};
        let paperStyle = {padding: 30};
        let buttonStyle = {marginTop: 40, textAlign: "center", overflow: "hidden"};
        let titleStyle = {textAlign: "center"};
        return (
            <div>
                <div style={style}>
                    <Paper style={paperStyle} zDepth={2}>
                        <h2 style={titleStyle}>注册</h2>
                        <TextField
                            hintText="name@limei.com"
                            floatingLabelText="email"
                            type="text"
                            onChange={this.__email.bind(this)}
                        />
                        <br/>
                        <TextField
                            hintText="******"
                            floatingLabelText="Password"
                            type="password"
                            onChange={this.__password.bind(this)}
                        />
                        <br/>
                        <TextField
                            hintText="******"
                            floatingLabelText="Password"
                            type="password"
                            onChange={this.__passwordS.bind(this)}
                        />
                        <div style={buttonStyle}>
                            <FlatButton style={{float: "left"}}
                                        label="注册"
                                        secondary={true}
                                        keyboardFocused={true}
                                        onTouchTap={this.__register.bind(this)}/>
                            <FlatButton style={{float: "right"}}
                                        label="登录"
                                        primary={true}
                                        onTouchTap={this.__login.bind(this)}/>
                        </div>
                    </Paper>
                </div>
                <Loading loading={this.props.loading.isLoad}/>
                <Message message={this.props.style.message} mainAction={this.props.mainAction}/>
            </div>
        );
    }
    private __email(event: any){
        this.setState({email: event.target.value})
    }

    private __password(event: any){
        this.setState({password: event.target.value})
    }

    private __passwordS(event: any){
        this.setState({passwordS: event.target.value})
    }

    private __login(){
        this.props.mainAction.router("login");
    }

    private __register(){
        if(!this.state.password){
            this.props.mainAction.message("密码不能为空");
        }else if(this.state.password != this.state.passwordS){
            this.props.mainAction.message("重复密码不一致");
        }else{
            this.props.userAction.register(this.state.email, this.state.password);
        }
    }
}

function mapStateToProps(state: any) {
    return {
        loading: state.Loading,
        user: state.User,
        style: state.Style
    };
}

function mapDispatchToProps(dispatch: any) {
    return {
        mainAction: bindActionCreators(MainAction, dispatch),
        userAction: bindActionCreators(UserAction, dispatch)
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Register)
