import React from "react";

const Home: React.FC<{ onLogout: () => void }> = ({ onLogout }) => {
    return (
        <div>
            <p>¡Has iniciado sesión!</p>
            <button onClick={onLogout}>Cerrar sesión</button>
        </div>
    );
};

export default Home;