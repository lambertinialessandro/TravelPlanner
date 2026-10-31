import ControlsButtons from "./ControlsButtons";
import NavigationTabs from "./NavigationTabs";
import Title from "./Title";

function Header(props) {
  return (
    <header className="bg-slate-800/90 backdrop-blur border-b border-slate-700/60 sticky top-0 z-40 px-4 py-3 flex flex-wrap items-center justify-between gap-3 shadow-md">
      <Title />
      <NavigationTabs />
      <ControlsButtons />
    </header>
  );
}

export default Header;
