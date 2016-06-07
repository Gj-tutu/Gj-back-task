/**
 * Created by tutu on 16-1-4.
 */

/// <reference path="../../../../typings/react/react.d.ts" />
/// <reference path="../../../../libs/ts/material-ui.d.ts" />

import * as React from "react";
import Platform from "../../../../app/tools/Platform";
import AppBar = require('material-ui/lib/app-bar');
import IconButton = require('material-ui/lib/icon-button');
import NavigationMenu = require('material-ui/lib/svg-icons/navigation/menu');
import IconMenu = require('material-ui/lib/menus/icon-menu');
import NavigationMoreVert = require('material-ui/lib/svg-icons/navigation/more-vert');
import MenuItem = require('material-ui/lib/menus/menu-item');


interface HeaderProp {
    mainAction?: any;
    user: any;
}

class Header extends React.Component<HeaderProp, any> {

    constructor(props: any, context: any) {
        super(props, context);
    }

    public render(){
        let leftMenuStyle = {display: "none"};
        if(Platform.getPlatform().isMobile()){
            leftMenuStyle.display = "block";
        }
        return (
            <AppBar
                style={{position:"fixed"}}
                title="脚本处理"
                iconElementLeft={<IconButton style={leftMenuStyle} onTouchTap={this.props.mainAction.leftShow}><NavigationMenu /></IconButton>}
                iconElementRight={
                  <IconMenu
                    iconButtonElement={
                      <IconButton><NavigationMoreVert /></IconButton>
                    }
                    targetOrigin={{horizontal: 'right', vertical: 'top'}}
                    anchorOrigin={{horizontal: 'right', vertical: 'top'}}
                  >
                    <MenuItem primaryText={this.props.user.email} />
                  </IconMenu>
            }
            />
        )
    }
}

export default Header;