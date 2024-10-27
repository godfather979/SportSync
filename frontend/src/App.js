import './App.css';
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Hello from './components/Hello';
import Bye from './components/Bye';
import Players from './components/Players';


function App() {



  return (
    <>
    <BrowserRouter>
      <RoutesWeb />
    </BrowserRouter>
    </>
  );
}

const RoutesWeb = () => {
  const location = useLocation(); // Get the current route

  return (
      <>
      {/* {loading && <Loader />} */}
      <Routes>
        <Route path="/" element={<Hello />} />
        <Route path="/bye" element={<Bye />} />
        <Route path="/players" element={<Players />} />
      </Routes>
      {/* {!isAdminRoute && <Footer />}       Conditionally render Footer */}
      </>
  );
};

export default App;
