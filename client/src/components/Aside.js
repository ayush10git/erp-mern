import { useState, useEffect } from "react";
import { GrUserManager } from "react-icons/gr";
import { MdDashboard } from "react-icons/md";
import { TbReportSearch } from "react-icons/tb";
import { TiTick } from "react-icons/ti";
import { PiExamBold } from "react-icons/pi";
import { BiHelpCircle } from "react-icons/bi";
import { SlCalender } from "react-icons/sl";
import { HiMenuAlt4 } from "react-icons/hi";

const Aside = () => {
  const [showModal, setShowModal] = useState(false);
  const [phoneActive, setPhoneActive] = useState(window.innerWidth < 930);

  const resizeHandler = () => {
    setPhoneActive(window.innerWidth < 930);
  };

  useEffect(() => {
    window.addEventListener("resize", resizeHandler);

    return () => {
      window.removeEventListener("resize", resizeHandler);
    };
  }, []);

  return (
    <>
      {phoneActive && (
        <button id="hamburger" onClick={() => setShowModal(true)}>
          <HiMenuAlt4 />
        </button>
      )}
      <section
        style={
          phoneActive
            ? {
                width: "20rem",
                height: "100vh",
                position: "fixed",
                top: 0,
                left: showModal ? "0" : "-20rem",
                transition: "all 0.5s",
              }
            : {}
        }
      >
        <aside>
          <div className="title">
            <GrUserManager />
            <h1>ERP</h1>
          </div>
          <div className="menu">
            <div className="menu-items">
              <ul>
                <li>
                  <MdDashboard />
                  Dashboard
                </li>
                <li>
                  <TbReportSearch />
                  Reports
                </li>
                <li className="attendance-menu">
                  <TiTick />
                  Attendance
                </li>
                <li>
                  <PiExamBold />
                  Marklist
                </li>
                <li>
                  <SlCalender />
                  Leaves
                </li>
                <li>
                  <BiHelpCircle />
                  Help
                </li>
              </ul>
            </div>
          </div>
        </aside>
        {phoneActive && (
          <button id="closeSidebar" onClick={() => setShowModal(false)}>
            Close
          </button>
        )}
      </section>
    </>
  );
};

export default Aside;
