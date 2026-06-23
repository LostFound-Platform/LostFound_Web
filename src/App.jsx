import Chat from "./components/Chat";
import Footer from "./components/Footer";
import Header from "./components/Header";
import NotificationSystem from "./components/NotificationSystem";
import SpeechToText from "./components/SpeechToText";
import CampusPopup from "./pages/CampusPopup";
import Router from "./routes/Router";

export default function App() {
  return (
    <>
      <SpeechToText />
      <NotificationSystem></NotificationSystem>
      <CampusPopup />
      <Header></Header>
      <div id="wrapper">
        <Router></Router>
      </div>
      <Chat></Chat>
      <Footer></Footer>
    </>
  );
}
