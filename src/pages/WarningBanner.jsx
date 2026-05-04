import React from "react";

const WarningBanner = () => {
  return (
    <div style={styles.container}>
      ⚠️ This is a student project and is not affiliated with Coinbase.
    </div>
  );
};

const styles = {
  container: {
    backgroundColor: "#ffcc00",
    color: "#000",
    textAlign: "center",
    padding: "10px 20px",
    fontWeight: "600",
    fontSize: "13px",
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 9999,
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
  },
};

export default WarningBanner;