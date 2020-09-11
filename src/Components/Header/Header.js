import React from 'react';
import "./Header.css";
import 'bootstrap/dist/css/bootstrap.min.css';

const Header = () => {
    return (
        <div className="header">
            <div className="logo">
                <h2>This is logo section</h2>
            </div>
            <div className="main-menu">
                <nav>
                    <ul>
                        <li>
                            <a href="/shop">Shop</a>
                        </li>
                        <li>
                            <a href="/review">Order Review</a>
                        </li>
                        <li>
                            <a href="/inventory">Manage Inventory</a>
                        </li>
                    </ul>
                </nav>
            </div>
        </div>
    );
};

export default Header;