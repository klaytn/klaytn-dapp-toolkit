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
import Bootcamp from "./bootcamp/bootcamp";
import Frontend from "./bootcamp/frontend";
import Solidity from "./bootcamp/solidity";

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
              </>
            }
          />
          <Route
            path="/course/:id"
            element={
              <>
                <CoursePage courseId={courseId} />
              </>
            }
          />
          <Route
            path="/courses/free"
            element={
              <>
                <FreeCourses handleCourseId={handleSetCourseId} />
              </>
            }
          />
          <Route
            path="/courses/paid"
            element={
              <>
                <PaidCourses
                  handleCourseId={handleSetCourseId}
                  klayBalance={balance}
                />
              </>
            }
          />
          <Route
            path="/courses/advanced"
            element={
              <>
                <AdvanceCourses handleCourseId={handleSetCourseId} />
              </>
            }
          />
          <Route
            path="/bootcamp"
            element={
              <>
                <Bootcamp />
              </>
            }
          />
          <Route
            path="/bootcamp/frontend"
            element={
              <>
                <Frontend />
              </>
            }
          />
          <Route
            path="/bootcamp/solidity"
            element={
              <>
                <Solidity />
              </>
            }
          />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
