import * as React from 'react';
import { usePrice } from '../context/PriceContext';
import { useColorMode } from "../context/ColorModeContext";
import "./Home.css";


function Home() {
  const { checked } = useColorMode();

  const lightMode = checked ? "dark2" : "light1"


  return (
    <div style={{ backgroundColor: "rgba(255, 255, 255, 0)", display: "flex", justifyContent: "center", alignItems: "start", marginTop: "16px" }}>
      <div style={{ display: "flex", flexDirection: "column", width: "75%", justifyContent: "center", alignItems: "center", marginBottom: "2rem", color: checked ? "whitesmoke" : "black" }}>
        <h1 className="homeHeader" style={{ marginBottom: "16px" }}>Welcome to my MERN Stack Project</h1>
        <p className='home'>You need to login to start buying and selling the 6 type of investments. Prices of investments change by a random amount within a certain limit after a randomly determined period of time between 6 and 2.5 minutes. After signing up, every account will receive 250,000 credits, and there is no transaction fee.
          <br />
          <br />
          For security concerns, you can use a fake email address and a simple password (not the one you use for other accounts). There is no email confirmation process, and don't worry; only your password hash is stored in the database.
          Or you can log in to the test account for testing using the <b>username: test</b>, <b>password: pass</b>.
          <br />
          <br />
          Login could take up to 50 seconds to spin up the server if it is spun down. It's free tier render service.
          <br />
          <br />
          Firebase is used to store current prices and price history for real-time data synchronization, so prices update automatically.
        </p>
      </div>
    </div>
  )
}

export default Home
