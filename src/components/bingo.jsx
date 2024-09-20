"use client";

import React, { useState, useEffect, useRef } from "react";

export default function Bingo() {
  function generateBingoNumbers() {
    let bingoNumbers = [];
    while (bingoNumbers.length < 75) {
      let randomNumber = Math.floor(Math.random() * 75) + 1;
      if (bingoNumbers.indexOf(randomNumber) === -1)
        bingoNumbers.push(randomNumber);
    }
    return bingoNumbers;
  }

  const [bingoNumbers, setBingoNumbers] = useState(generateBingoNumbers());
  const [currentNumber, setCurrentNumber] = useState(null);
  const [timer, setTimer] = useState(null);
  const [isPaused, setIsPaused] = useState(true);
  const [countdown, setCountdown] = useState(4);
  const [selectedNumbers, setSelectedNumbers] = useState([]);
  const selectedNumbersRef = useRef([]);

  const indexRef = useRef(0);
  const setIndex = (newIndex) => {
    indexRef.current = newIndex;
  };

  useEffect(() => {
    if (!isPaused && !timer) {
      setTimer(
        setInterval(() => {
          setCurrentNumber(bingoNumbers[indexRef.current]);
          selectedNumbersRef.current = [
            ...selectedNumbersRef.current,
            bingoNumbers[indexRef.current],
          ];
          setSelectedNumbers(selectedNumbersRef.current);
          setIndex(indexRef.current + 1);
          setCountdown(4);
        }, 4000)
      );
    } else if (isPaused && timer) {
      clearInterval(timer);
      setTimer(null);
    }
  }, [isPaused, timer]);

  useEffect(() => {
    if (!isPaused && countdown > 0) {
      const countdownTimer = setInterval(() => {
        setCountdown((prevCountdown) => prevCountdown - 1);
      }, 1000);
      return () => clearInterval(countdownTimer);
    }
  }, [countdown, isPaused]);

  const togglePause = () => {
    setIsPaused(!isPaused);
  };

  const resetGame = () => {
    if (timer) {
      clearInterval(timer);
      setTimer(null);
    }
    setBingoNumbers(generateBingoNumbers());
    setCurrentNumber(null);
    setIndex(0);
    setIsPaused(true);
    setCountdown(4);
    selectedNumbersRef.current = [];
    setSelectedNumbers([]);
  };

  function getLetter(number) {
    if (number === null) return "";
    if (number <= 15) return "B";
    if (number <= 30) return "I";
    if (number <= 45) return "N";
    if (number <= 60) return "G";
    return "O";
  }

  function getColor(number) {
    if (number === null) return "";
    if (number <= 15) return "red-500";
    if (number <= 30) return "yellow-500";
    if (number <= 45) return "green-500";
    if (number <= 60) return "blue-500";
    return "purple-500";
  }

  function speak(text) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "es-ES"; // Español
    utterance.voice = window.speechSynthesis
      .getVoices()
      .find(
        (voice) => voice.name === "Google Español" && voice.lang === "es-ES"
      ); // Voz femenina
    window.speechSynthesis.speak(utterance);
  }

  useEffect(() => {
    if (currentNumber !== null) {
      speak(`${getLetter(currentNumber)} ${currentNumber}`);
    }
  }, [currentNumber]);

  return (
    <div className="flex flex-col justify-center items-center mt-10">
      <div className="flex flex-col md:flex-row gap-10 items-center justify-center">
        <div className="flex flex-col items-center justify-center">
          {" "}
          <div className="mt-10 mb-5 flex flex-col justify-center items-center text-center">
            <div className="flex justify-center items-center gap-8">
              {" "}
              <div
                className={`h-32 w-32 rounded-full flex text-center justify-center items-center bg-${getColor(
                  currentNumber
                )}`}
              >
                <p className="m-2 text-6xl font-bold ">
                  {" "}
                  {getLetter(currentNumber)}
                  {currentNumber}
                </p>
              </div>
              <div>
                <p>seconds left</p>
                <p className="text-2xl font-semibold"> {countdown} </p>
              </div>
            </div>

            <p className="mt-5">Numbers left: {75 - indexRef.current}</p>
          </div>
          <div className="flex gap-6">
            {" "}
            <button
              className="border rounded-lg px-2 hover:bg-green-700 active:bg-emerald-500"
              onClick={togglePause}
            >
              {isPaused ? "Start" : "Pause"}
            </button>
            <button
              className="border rounded-lg px-2 hover:bg-red-700 active:bg-pink-500"
              onClick={resetGame}
            >
              Reset
            </button>
          </div>
        </div>

        <div className="mt-10">
          <div className="grid grid-cols-5 gap-2 text-center text-2xl font-bold mb-2">
            <div className="bg-red-500 rounded-full h-10 w-10 flex justify-center items-center">
              B
            </div>
            <div className="bg-yellow-500 rounded-full h-10 w-10 flex justify-center items-center">
              I
            </div>
            <div className="bg-green-500 rounded-full h-10 w-10 flex justify-center items-center">
              N
            </div>
            <div className="bg-blue-500 rounded-full h-10 w-10 flex justify-center items-center">
              G
            </div>
            <div className="bg-purple-500 rounded-full h-10 w-10 flex justify-center items-center">
              O
            </div>
          </div>
          {Array.from({ length: 15 }, (_, i) => i + 1).map((row) => (
            <div key={row} className="grid grid-cols-5 gap-2">
              {Array.from({ length: 5 }, (_, i) => i * 15 + row).map(
                (number) => (
                  <div
                    key={number}
                    className={`h-10 w-10 rounded-full flex justify-center items-center my-1 text-black ${
                      selectedNumbers.includes(number)
                        ? `bg-${getColor(number)}`
                        : "bg-gray-500"
                    }`}
                  >
                    <p className="m-2 text-xl font-bold">{number}</p>
                  </div>
                )
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
