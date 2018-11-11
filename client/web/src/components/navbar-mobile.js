import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Link} from 'react-router-dom';
import {HashLink} from 'react-router-hash-link';
import * as Scroll from 'react-scroll';
import logo from '../static/logo-white-frame.svg';
import './navbar-mobile.css';
import {ModalContext} from '../app';
import {lockBody, unlockBody} from '../utils';
import {withCookies} from "react-cookie";
import {removeCookies} from "../common";

const scroll = Scroll.animateScroll;

class NavbarMobile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            windowWidth: document.documentElement.clientWidth,
            windowHeight: document.documentElement.clientHeight,
            expand: false
        };
        this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
        this.hideNavbarMobile = this.hideNavbarMobile.bind(this);
    }

    componentDidMount() {
        this.updateWindowDimensions();
        window.addEventListener('resize', this.updateWindowDimensions);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.updateWindowDimensions);
    }

    updateWindowDimensions() {
        this.setState({
            windowWidth: document.documentElement.clientWidth,
            windowHeight: document.documentElement.clientHeight
        });
    }

    hideNavbarMobile() {
        unlockBody();
        this.setState({expand: false});
    }

    render() {
        const home = this.props.home;
        const {cookies} = this.props;
        const id = cookies.get('id');
        const username = cookies.get('username');
        return (
            <ModalContext.Consumer>
                {({showSignupModal, showLoginModal}) => (
                    <div className="navbar-mobile" style={{backgroundColor: home ? '' : '#000000'}}>
                        <div
                            className={`nav-items-mobile ${!this.state.expand && 'nav-items-mobile-collapse'}`}
                            style={{width: this.state.windowWidth, height: this.state.windowHeight}}
                        >
                            <div className="nav-items-wrapper-mobile">
                                <div className="nav-item-mobile">
                                    {home ?
                                        <Link to="#" onClick={(e) => {
                                            e.preventDefault();
                                            this.hideNavbarMobile();
                                            scroll.scrollTo(document.documentElement.clientHeight);
                                        }}>About</Link> :
                                        <HashLink to="/#about" onClick={this.hideNavbarMobile}>About</HashLink>}
                                </div>
                                <div className="nav-item-mobile">
                                    {home ?
                                        <Link to="#" onClick={(e) => {
                                            e.preventDefault();
                                            this.hideNavbarMobile();
                                            scroll.scrollToBottom();
                                        }}>Contact</Link> :
                                        <HashLink to="/#contact" onClick={this.hideNavbarMobile}>Contact</HashLink>}
                                </div>
                                {!id && <div className="nav-item-mobile">
                                    <Link to="#" onClick={(e) => {
                                        e.preventDefault();
                                        this.hideNavbarMobile();
                                        showSignupModal();
                                    }}>Sign up</Link>
                                </div>}
                                {!id && <div className="nav-item-mobile">
                                    <Link to="#" onClick={(e) => {
                                        e.preventDefault();
                                        this.hideNavbarMobile();
                                        showLoginModal();
                                    }}>Log in</Link>
                                </div>}
                                {id && <div className="nav-item-mobile">
                                    <Link
                                        to={`/artizen/${username || id}`}
                                        onClick={this.hideNavbarMobile}>{username || id}
                                    </Link>
                                </div>}
                                {id && <div className="nav-item-mobile">
                                    <Link to="#" onClick={(e) => {
                                        e.preventDefault();
                                        this.hideNavbarMobile();
                                        removeCookies(cookies);
                                        window.location.reload();
                                    }}>Log out</Link>
                                </div>}
                            </div>
                        </div>
                        <div className="nav-logo-mobile">
                            <Link to="/">
                                <img src={logo} className="logo-mobile" alt="logo"/>
                            </Link>
                        </div>
                        <div className={`nav-toggle ${this.state.expand && 'nav-toggle-cancel'}`} onClick={() => {
                            if (this.state.expand) {
                                unlockBody();
                            } else {
                                lockBody();
                            }
                            this.setState({expand: !this.state.expand});
                        }}>
                            <div className="nav-toggle-line" id="nav-toggle-1"/>
                            <div className="nav-toggle-line" id="nav-toggle-2"/>
                            <div className="nav-toggle-line" id="nav-toggle-3"/>
                        </div>
                    </div>
                )}
            </ModalContext.Consumer>
        );
    }
}

NavbarMobile.propTypes = {
    home: PropTypes.bool,
};

export default withCookies(NavbarMobile);
