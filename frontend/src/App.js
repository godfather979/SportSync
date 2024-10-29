import './App.css';
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";

import HomePage from './components/HomePage';
import Bye from './components/Bye';
import Players from './components/Player/Players';
import { SearchTable } from './components/SearchTable';
import Fans from './components/Fan/Fans';


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

  // Check if the current route includes '/table'
  const isTableRoute = location.pathname.includes('/table');

  return (
      <>

      {isTableRoute && <SearchTable />}
      <Routes>
        <Route path="/" element={<HomePage/>} />
        <Route path="/bye" element={<Bye />} />
        <Route path="/table/players" element={<Players />} />
        <Route path="/table/coaches" element={<Players />} />
        <Route path="/table/doctors" element={<Players />} />
        <Route path="/table/events" element={<Players />} />
        <Route path="/table/fans" element={<Fans />} />
        <Route path="/table/institutes" element={<Players />} />
        <Route path="/table/managers" element={<Players />} />
        <Route path="/table/media_broadcasters" element={<Players />} />
        <Route path="/table/referees" element={<Players />} />
        <Route path="/table/sponsors" element={<Players />} />
        <Route path="/table/sports_facilities" element={<Players />} />
        <Route path="/table/sports_federations" element={<Players />} />
        <Route path="/table/teams" element={<Players />} />


        <Route path="/search" element={<SearchTable />} />
      </Routes>
      {/* {!isAdminRoute && <Footer />}       Conditionally render Footer */}
      </>
  );
};

export default App;
