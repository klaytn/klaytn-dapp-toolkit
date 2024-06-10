import { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import "./Courses/Courses.css";
import Navbar from "./Navbar/Navbar";
import Dashboard from "./Dashboard/Dashboard";
import Carousel from "./Carousel/Carousel";
import Courses from "./Courses/Courses";
import CoursePage from "./coursePages/CoursePage";
import FreeCourses from "./Individual_Courses_Pages/FreeCourses";
import PaidCourses from "./Individual_Courses_Pages/PaidCourses";
import AdvanceCourses from "./Individual_Courses_Pages/AdvancedCourses";
import Footer from "./Footer/Footer";
import Transactions from "./transaction";

function App() {
  const [balance, setBalance] = useState(null);
  const [isDisable, setIsDisable] = useState(false);
  // const transactions = Transactions();
  const [courseId, setCourseId] = useState(null);

  const fetchBalance = async (privKey, address) => {
    setIsDisable(true);
    console.log(isDisable);
    try {
      const transaction = await Transactions(privKey, address);
      const balance = await transaction.handleBalance();
      setBalance(balance);
    } catch (error) {
      console.log(error);
      window.alert(error);
      setIsDisable(false);
    } finally {
      console.log(isDisable);
    }
  };

  const handleSetCourseId = (courseId) => {
    setCourseId(courseId);
    console.log(courseId);
  };

  return (
    <Router>
      <div className="App">
        <Navbar klayBalance={balance} />
        <Routes>
          <Route
            path="/"
            element={
              <>
                <Dashboard
                  klayBalance={balance}
                  getBalance={fetchBalance}
                  isDisable={isDisable}
                />
                <Carousel />
                <Courses
                  handleCourseId={handleSetCourseId}
                  klayBalance={balance}
                />
                <Footer />
              </>
            }
          />
          <Route
            path="/course/:id"
            element={
              <>
                <CoursePage courseId={courseId} />
                <Footer />
              </>
            }
          />
          <Route
            path="/free"
            element={
              <>
                <FreeCourses handleCourseId={handleSetCourseId} />
                <Footer />
              </>
            }
          />
          <Route
            path="/paid"
            element={
              <>
                <PaidCourses
                  handleCourseId={handleSetCourseId}
                  klayBalance={balance}
                />
                <Footer />
              </>
            }
          />
          <Route
            path="/advance"
            element={
              <>
                <AdvanceCourses handleCourseId={handleSetCourseId} />
                <Footer />
              </>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
