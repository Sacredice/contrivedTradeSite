import { useColorMode } from '../context/ColorModeContext'

function Footer() {
  const { checked } = useColorMode();


  return (
    <footer style={{ display: "flex", justifyContent: "space-between", color: checked ? "whitesmoke" : "black", background: checked ? "#272727" : "#2196F3", marginTop: "auto", height: "40px" }}>
      <div style={{ display: "flex", alignItems: "center", marginLeft: "2rem" }}>
        <p>Contrived Trading App &copy; {(new Date()).getFullYear()}</p>
      </div>
      <div style={{ display: "flex", alignItems: "center", marginRight: "2rem" }}>
        <a href="https://github.com/Sacredice/contrivedTradeSite" target='_blank'><img style={{ width: "1.5rem", display: "block" }} src="/github-mark-white.png" alt="" /></a>
      </div>
    </footer>
  )
}

export default Footer
