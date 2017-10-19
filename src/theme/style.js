import {MuiThemeProvider} from 'material-ui/styles';
import React, {PureComponent} from 'react';
import {withStyles} from 'material-ui/styles';
import {getInitTheme} from "./default";
import connect from "../redux/utils/connect";

/**
 * 组件样式配置
 *
 *  1. css
 *  2. 主题提供
 *
 *  关于主题来源
 *  初始化： 根据 root 的 theme 配置直接获取 theme
 *  动态切换: redux(store -> theme)
 *
 * @see https://github.com/cssinjs/jss
 * @param styles
 * @param options
 * @returns {Function}
 */
export default function style(styles = {}, options = {}) {

    return function (WrappedComponent) {

        class StyleProxy extends PureComponent {

            static Naked = WrappedComponent;

            render() {

                let {themeObj} = this.props;

                // init theme
                themeObj = themeObj || getInitTheme();

                if(!themeObj) {
                    console.error(`无法找到主题, 请确保\n1. 在所有自定义标签的最外层包裹了 root 标签\n2. 未向 root 指定不存在的主题名\n`, WrappedComponent);

                    return <WrappedComponent {...this.props} />;
                }

                return <MuiThemeProvider theme={themeObj}>
                    <WrappedComponent {...this.props} />
                </MuiThemeProvider>
            }
        }

        options.withTheme = true;

        return connect( (state) => ({
            themeObj: state.theme.payload,
        }) )( withStyles(styles, options)(StyleProxy) );

    }

}
