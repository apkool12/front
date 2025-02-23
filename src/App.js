import React, { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";

import "./App.css";

import "./font.css";
import "./header.css";
import "./footer.css";
import "./modal.css";

import AuthModal from "./components/AuthModal";
import Header from "./components/Header";
import Footer from "./components/Footer";

import Home from "./pages/home";
import MonthlyStats from "./pages/MonthlyStat";
import Steps from "./pages/Steps";
import StepSelection from "./pages/StepSelection";
import SelectionConfirmModal from "./components/SelectionConfirmModal";
import TodoBtn from "./components/TodoBtn";
import axios from "axios";

const URL =
  "https://port-0-likelion-hackathon-lxmynpl6f586b2fd.sel5.cloudtype.app/";

const App = () => {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false);

  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [email, setEmail] = useState("");
  const [nickname, setNickname] = useState("");
  const [error, setError] = useState("");

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userProfile, setUserProfile] = useState(null);

  const [selec, setSelec] = useState([]);

  const [csrfToken, setCsrfToken] = useState("");

  const openLoginModal = () => setIsLoginModalOpen(true);
  const closeLoginModal = () => {
    setEmail("");
    setPassword("");
    setError("");
    setIsLoginModalOpen(false);
  };

  const openSignupModal = () => {
    setIsSignupModalOpen(true);
    closeLoginModal();
  };

  const closeSignupModal = () => {
    setPassword("");
    setPasswordConfirm("");
    setEmail("");
    setNickname("");
    setError("");
    setIsSignupModalOpen(false);
  };

  const handleLoginSubmit = (userData) => {
    const { badges, level, login_at, nickname, title, user_email } = userData;

    const validate = localStorage.getItem("userid");

    // 상태 업데이트
    if (validate) {
      setIsLoggedIn(true);

      // 로그인 성공 알림
      alert(`${nickname}님 환영합니다`);
      console.log(validate)

      setUserProfile({
        user_email,
        nickname,
        level,
        badges: badges || null,
        title: title || null,
        login_at,
      });

      // 로그인 모달 닫기
      closeLoginModal();
    } else {
      alert("로그인 실패");
    }
  };

  const handleSignupSubmit = () => {
    alert("회원가입이 완료되었습니다!");
    closeSignupModal();
  };

  const handleLogout = () => {
    const userId = localStorage.getItem("userid");

    if (!userId) {
      throw new Error("User ID not found in local storage");
    }

    axios.post(
      `${URL}/logout/`,
      { user_email: email, password: password },
      {
        headers: {
          "X-User-Id": userId,
        },
      }
    );
    localStorage.clear();
    setIsLoggedIn(false);
    setUserProfile(null);
    window.location.href = "/";
    alert("로그아웃 되었습니다.");
  };

  // useEffect(() => {
  //   const initializeCsrfToken = async () => {
  //     const token = await getCsrfToken();
  //     console.log(token);
  //     setCsrfToken(token);
  //   };

  //   initializeCsrfToken();
  // }, []);

  return (
    <div className="app">
      <Header
        openLoginModal={openLoginModal}
        openSignupModal={openSignupModal}
        isLoggedIn={isLoggedIn}
        handleLogout={handleLogout}
      />

      <div className="content">
        <Routes>
          <Route
            path="/"
            element={
              <Home
                openLoginModal={openLoginModal}
                isLoggedIn={isLoggedIn}
                userProfile={userProfile}
              />
            }
          />
          <Route
            path="/steps"
            element={
              <Steps
                selec={selec}
                csrfToken={csrfToken}
                setCsrfToken={setCsrfToken}
              />
            }
          />
          <Route
            path="/monthly-stats"
            element={
              <MonthlyStats csrfToken={csrfToken} setCsrfToken={setCsrfToken} />
            }
          />
          <Route
            path="/step-selection"
            element={
              <StepSelection
                selec={selec}
                setSelec={setSelec}
                csrfToken={csrfToken}
                setCsrfToken={setCsrfToken}
              />
            }
          />
          <Route path="/test" element={<TodoBtn />} />
        </Routes>
      </div>

      <Footer />

      <AuthModal
        isOpen={isLoginModalOpen}
        onClose={closeLoginModal}
        type="login"
        email={email}
        password={password}
        error={error}
        handlePasswordChange={(e) => setPassword(e.target.value)}
        handleEmailChange={(e) => setEmail(e.target.value)}
        handleSubmit={handleLoginSubmit}
        openSignupModal={openSignupModal}
        csrfToken={csrfToken}
        setCsrfToken={setCsrfToken}
      />

      <AuthModal
        isOpen={isSignupModalOpen}
        onClose={closeSignupModal}
        type="signup"
        password={password}
        passwordConfirm={passwordConfirm}
        email={email}
        nickname={nickname}
        error={error}
        handlePasswordChange={(e) => setPassword(e.target.value)}
        handlePasswordConfirmChange={(e) => setPasswordConfirm(e.target.value)}
        handleEmailChange={(e) => setEmail(e.target.value)}
        handleNicknameChange={(e) => setNickname(e.target.value)}
        handleSubmit={handleSignupSubmit}
        csrfToken={csrfToken}
        setCsrfToken={setCsrfToken}
      />
    </div>
  );
};

export default App;
