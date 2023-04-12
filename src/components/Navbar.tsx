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

    supabase.auth.signOut();
    const handleSignOut = () => {
    }

    return (
        <div className='navbar'>
            <div className='nav_left-ctn'>
                <div id='logo'>Logo</div>
            </div>
            <div className='nav_right-ctn'>
                <button>Home</button>
                {session
                    ? <button onClick={handleSignOut}>Sign Out</button>
                    : <SupabaseLogin redirect='/dashboard' />
                }
                {session &&
                    <button onClick={() => navigate('/dashboard')}>Dashboard</button>
                }
                <button>Get started</button>
            </div >
        </div>
    );
};

export default NavBar;
