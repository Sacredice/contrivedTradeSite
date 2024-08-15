import { useColorMode } from '../context/ColorModeContext'

function Footer() {
    const { checked } = useColorMode();

  return (
    <div style={{ color: checked ? "whitesmoke" : "black", background: checked ? "#272727" : "#2196F3", marginTop: "auto", width: "100%", height: "40px" }}>
      <p>Footer</p>
    </div>
  )
}

export default Footer
