import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Navbar, Nav, NavDropdown, Image } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faUserCircle } from "@fortawesome/free-solid-svg-icons";
import "./Navbar.scss";
import SupabaseLogin from "./SupabaseLogin";
import { useSession } from "@supabase/auth-helpers-react";
import { supabase } from "../App";

const NavBar = () => {

    const session = useSession();
    const navigate = useNavigate();

    const handleSignOut = () => {
        supabase.auth.signOut();
    }

    return (
        <div className='navbar'>
            <div className='nav_left-ctn'>
                <div id='logo'>Logo</div>
            </div>
            <div className='nav_right-ctn'>
                <button className='navbar-btn'>Home</button>
                {session &&
                    <button className='navbar-btn' onClick={() => navigate('/dashboard')}>Dashboard</button>
                }
                {/* <button className='navbar-btn'>Get started</button> */}
                {session
                    ? <button className='navbar-btn sign-in' onClick={handleSignOut}>Sign Out</button>
                    : <SupabaseLogin redirect='/dashboard' />
                }
            </div >
        </div>
    );
};

export default NavBar;
