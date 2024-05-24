import './App.css';
import Navbar from './Navbar';
import Dashboard from './Dashboard';
import Carousel from './Carousel';
import Courses from './Courses/Courses';

function App() {
  return (
    <div className="App">
      <Navbar />
      <Dashboard />
      <Carousel />
      <Courses />
    </div>
  );
}

export default App;
