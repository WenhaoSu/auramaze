import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Link} from 'react-router-dom';
import {HashLink} from 'react-router-hash-link';
import * as Scroll from 'react-scroll';
import SignupModal from './signup-modal';
import LoginModal from './login-modal';
import {ModalContext} from '../app';
import {AuthContext} from '../app';
import logo from '../static/logo-white-frame.svg';
import './navbar.css';

const scroll = Scroll.animateScroll;

class Navbar extends Component {
    constructor(props) {
        super(props);
    }


    render() {
        const {
            showSignupModal,
            showLoginModal,
            auth,
            ...props
        } = this.props;
        return (
            <div className="navbar" style={{backgroundColor: props.home ? '' : '#000000'}}>
                <div className="nav-items">
                    {auth.id && <div className="nav-item">
                        <Link
                            to={`/artizen/${auth.username || auth.id}`}>{auth.username || auth.id}
                        </Link>
                    </div>}
                    {!auth.id && <div className="nav-item">
                        <Link to="#" onClick={(e) => {
                            e.preventDefault();
                            showLoginModal();
                        }}>Log in</Link>
                    </div>}
                    {!auth.id && <div className="nav-item">
                        <Link to="#" onClick={(e) => {
                            e.preventDefault();
                            showSignupModal();
                        }}>Sign up</Link>
                    </div>}
                    <div className="nav-item">
                        {props.home ?
                            <Link to="#" onClick={(e) => {
                                e.preventDefault();
                                scroll.scrollToBottom();
                            }}>Contact</Link> :
                            <HashLink to="/#contact">Contact</HashLink>}
                    </div>
                    <div className="nav-item">
                        {props.home ?
                            <Link to="#" onClick={(e) => {
                                e.preventDefault();
                                scroll.scrollTo(document.documentElement.clientHeight);
                            }}>About</Link> :
                            <HashLink to="/#about">About</HashLink>}
                    </div>
                </div>
                <div className="nav-logo">
                    <Link to="/">
                        <img src={logo} className="logo-header" alt="logo"/>
                    </Link>
                </div>
                <div className="nav-toggle">
                </div>
            </div>
        );
    }
}

Navbar.propTypes = {
    home: PropTypes.bool,
};

export default React.forwardRef((props, ref) => (<ModalContext.Consumer>
    {({
          showSignupModal,
          showLoginModal,
      }) => <AuthContext.Consumer>
        {({auth}) => <Navbar {...props}
                             showSignupModal={showSignupModal}
                             showLoginModal={showLoginModal}
                             auth={auth}
                             ref={ref}/>}
    </AuthContext.Consumer>}
</ModalContext.Consumer>));
