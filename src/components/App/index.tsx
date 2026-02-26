import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Selector from "@/components/Base/Selector";
import { NYT_DATA } from "@/data/newYorkTimes";

import "./app.scss";
import Cards from "../Cards";

const App = () => {
  return (
    <section className="app">
      <Header />
      <Selector optionsData={NYT_DATA} />
      {/* <Form /> */}
      <Cards />
      <Footer />
    </section>
  );
};

export default App;
