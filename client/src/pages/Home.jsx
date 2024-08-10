import * as React from 'react';
import { usePrice } from '../context/PriceContext';
import { useColorMode } from "../context/ColorModeContext";
import LoadingSpinner from '../components/LoadingSpinner';
import "./Home.css";


function Home() {
  const { pricesData, isPriceDataError } = usePrice();
  const { checked } = useColorMode();

  const lightMode = checked ? "dark2" : "light1"


  return (
    <div style={{ backgroundColor: "rgba(255, 255, 255, 0)", display: "flex", justifyContent: "center", alignItems: "start", minHeight: "calc(100vh - 68.5px - 48.7px)" }}>
      <div style={{ display: "flex",flexDirection: "column", width: "75%", justifyContent: "center", alignItems: "center", margin: "0", color: checked ? "whitesmoke" : "black" }}>
        <h1 className="homeHeader" style={{ marginBottom: "16px"}}>Welcome to my MERN Stack Project</h1>
        <p className='home'>You need to login to start buying and selling the 6 type of investments. Prices of investments change by a random amount within a certain limit after a randomly determined period of time between 6 and 2.5 minutes. After signing up, every account will receive 250,000 credits, and there is no transaction fee.
        <br />
        <br />
        For security concerns, you can use a fake email address and a simple password (not the one you use for other accounts). There is no email confirmation process, and don't worry; only your password hash is stored in the database.
        Or you can log in to the test account for testing using the <b>username: test</b>, <b>password: pass</b>.  
        </p>
      </div>
    </div>
  )
}

export default Home
