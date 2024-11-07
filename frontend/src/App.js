import "./App.css";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";

import HomePage from "./components/HomePage";
import Bye from "./components/Bye";
import Players from "./components/Player/Players";
import { SearchTable } from "./components/SearchTable";
import Fans from "./components/Fan/Fans";
import Coaches from "./components/Coaches/Coaches";
import Doctors from "./components/Doctors/Doctors";
import Events from "./components/Events/Events";
import Institute from "./components/Institutes/Institute";
import Managers from "./components/Managers/Managers";
import MediaBroadcasters from "./components/Media_Broadcasters/Media_Broadcasters";
import Referees from "./components/Referees/Referees";
import { SearchRelation } from "./components/SearchRelation";
import { SearchPlayerId } from "./components/PlayerDoctor/SearchPlayerID";
import { SearchDoctorId } from "./components/PlayerDoctor/SearchDoctorId";
import PlayerDoctor from "./components/PlayerDoctor/PlayerDoctors";
import Matches from "./components/Matches/Matches";
import Sponsors from "./components/Sponsors/Sponsors";
import Sports_Facilities from "./components/Sports_Facilities/Sports_Facilities";
import Sports_Federations from "./components/Sports_Federation/Sports_Federations";
import { Logo } from "./Logo";
import CoachPlayer from "./components/CoachPlayer/CoachPlayer";

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
  const isTableRoute = location.pathname.includes("/table");
  const isRelationRoute = location.pathname.includes("/relation");

  return (
    <>
      <Logo />
      {isTableRoute && <SearchTable />}
      {isRelationRoute && <SearchRelation />}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/bye" element={<Bye />} />
        <Route path="/table/players" element={<Players />} />
        <Route path="/table/coaches" element={<Coaches />} />
        <Route path="/table/doctors" element={<Doctors />} />
        <Route path="/table/events" element={<Events />} />
        <Route path="/table/fans" element={<Fans />} />
        <Route path="/table/institutes" element={<Institute />} />
        <Route path="/table/managers" element={<Managers />} />
        <Route
          path="/table/media_broadcasters"
          element={<MediaBroadcasters />}
        />
        <Route path="/table/referees" element={<Referees />} />
        <Route path="/table/sponsors" element={<Sponsors />} />
        <Route
          path="/table/sports_facilities"
          element={<Sports_Facilities />}
        />
        <Route
          path="/table/sports_federations"
          element={<Sports_Federations />}
        />
        <Route path="/table/teams" element={<Players />} />

        <Route path="/relation/playerdoctor" element={<PlayerDoctor />} />
        <Route path="/relation/matches" element={<Matches />} />
        <Route path="/relation/playercoach" element={<CoachPlayer />} />

        <Route path="/test" element={<SearchPlayerId />} />
        <Route path="/test2" element={<SearchDoctorId />} />

        <Route path="/search" element={<SearchTable />} />
      </Routes>
      {/* {!isAdminRoute && <Footer />}       Conditionally render Footer */}
    </>
  );
};

export default App;
