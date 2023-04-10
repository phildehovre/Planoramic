import React from "react";
import { Link } from "react-router-dom";
import { Navbar, Nav, NavDropdown, Image } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faUserCircle } from "@fortawesome/free-solid-svg-icons";
import "./Navbar.scss";
import SupabaseLogin from "./SupabaseLogin";

const NavBar = () => {
    return (
        <div className='navbar'>
            <div className='nav_left-ctn'>
                <div id='logo'>Logo</div>
            </div>
            <div className='nav_right-ctn'>
                <button>Home</button>
                <SupabaseLogin redirect='/dashboard' />
                <button>Get started</button>
            </div >
        </div>
    );
};

export default NavBar;
