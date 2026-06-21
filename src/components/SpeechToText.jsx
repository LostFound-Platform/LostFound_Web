import { useEffect, useRef, useState } from "react";
import axiosInstance from "../api/axiosInstance";

export default function SpeechToText() {
  // Variables
  const [finalText, setFinalText] = useState("");
  const [textToResponse, setTextToResponse] = useState("");
  const recognitionRef = useRef(null);

  // APIs
  const API_URL_Auth = `/CheckAuth/check-auth`;

  // Functions
  // Check authentication status and redirect if not authenticated
  const checkAuthentication = () => {
    axiosInstance.get(API_URL_Auth).catch((err) => {
      console.error(err);
    });
  };

  // Handle logic for voice control
  const handleLogicForVoiceControl = (finalText) => {
    if (!finalText) {
      return;
    }

    const listActions = [
      {
        indent: "CREATE_POST",
        containsWord: ["create", "create post", "create lost"],
        score: 0,
      },
      {
        indent: "REDIRECT_LOST_FOUND",
        containsWord: ["all posts", "posts", "lost and found"],
        score: 0,
      },
      {
        indent: "OPEN_TERMS_GUIDE",
        containsWord: [
          "Terms",
          "Term",
          "guide",
          "Terms and guide",
          "Term and guide",
          "term guide",
          "terms guide",
          "guide terms",
          "guide term",
        ],
        score: 0,
      },
      {
        indent: "CLOSE_TERMS_GUIDE",
        containsWord: [
          "Close terms",
          "Close term",
          "Close Terms and guide",
          "Close Term and guide",
          "Close term guide",
          "Close terms guide",
          "Close guide terms",
          "Close guide term",
          "Close",
        ],
        score: 0,
      },
      {
        indent: "REDIRECT_SUPPORT",
        containsWord: ["support", "change to support"],
        score: 0,
      },
      {
        indent: "REDIRECT_ABOUT_US",
        containsWord: [
          "about us",
          "about this website",
          "about",
          "about website",
        ],
        score: 0,
      },
      {
        indent: "REDIRECT_SIGN_IN",
        containsWord: ["sign in"],
        score: 0,
      },
      {
        indent: "REDIRECT_SIGN_UP",
        containsWord: ["sign up"],
        score: 0,
      },
      {
        indent: "LOST_AND_FOUND",
        containsWord: [
          "lost and found",
          "list posts",
          "list post",
          "lost found",
        ],
        score: 0,
      },
    ];

    const separateWords = finalText.toLowerCase();
    console.log(separateWords);

    // Compare and score to do action
    listActions.map((item) => {
      item.containsWord.map((keyword) => {
        if (separateWords.includes(keyword.toLowerCase())) {
          item.score += 1;
        }
      });
    });

    // Get highest score and do that action
    const bestAction = listActions.reduce((maxItem, current) => {
      return current.score > (maxItem?.score || 0) ? current : maxItem;
    }, null);

    console.log(JSON.stringify(listActions));

    // Do action
    switch (bestAction?.indent) {
      case "REDIRECT_SUPPORT":
        window.location.href = "/support";
        setTextToResponse("Redirected Support page. Press Enter to continue");
        break;
      case "REDIRECT_LOST_FOUND":
        window.location.href = "/lost-and-found";
        setTextToResponse(
          "Redirected Lost and Found page. Press Enter to continue",
        );
        break;
      case "OPEN_TERMS_GUIDE":
        window.location.href = "#policyModal2";
        setTextToResponse("Opened Terms and Guide. Press Enter to continue");
        break;
      case "CLOSE_TERMS_GUIDE":
        window.location.href = "";
        setTextToResponse("Closed Terms and Guide. Press Enter to continue");
        break;
      case "REDIRECT_ABOUT_US":
        window.location.href = "/about";
        setTextToResponse("Redirected About page. Press Enter to continue");
        break;
      case "REDIRECT_SIGN_IN":
        window.location.href = "/authentication?with=sign-in";
        setTextToResponse("Redirected Sign In page. Press Enter to continue");
        break;
      case "REDIRECT_SIGN_UP":
        window.location.href = "/authentication";
        setTextToResponse("Redirected Sign Up page. Press Enter to continue");
        break;
      case "LOST_AND_FOUND":
        window.location.href = "/lost-and-found";
        setTextToResponse(
          "Redirected Lost and Found page. Press Enter to continue",
        );
        break;
      case "CREATE_POST":
        checkAuthentication();

        document.querySelector(".modal-report-stuff").style.visibility =
          "visible";
        document.querySelector(".modal-report-stuff").style.opacity = "1";
        document.querySelector(".modal-overlay-report-stuff").style.visibility =
          "visible";
        document.querySelector(".modal-overlay-report-stuff").style.opacity =
          "1";
        document.body.style.overflow = "hidden";
        setTextToResponse(
          "Opened form post lost item!. Please provide information to post",
        );
        break;

      default:
        setTextToResponse("Could you repeat that command?");
        break;
    }
  };

  // Speak
  const speak = (response) => {
    if (!response) {
      return;
    }

    const voices = window.speechSynthesis.getVoices(); // List voices

    const utterance = new SpeechSynthesisUtterance(response);
    utterance.lang = "en-US";
    utterance.pitch = 1;
    utterance.voice = voices.find((v) => v.name === "Google US English");
    utterance.rate = 1;
    utterance.volume = 1;

    window.speechSynthesis.speak(utterance);

    // Remove response
    setTextToResponse("");
  };

  // const stopSpeak = () => {
  //   window.speechSynthesis.cancel();
  // };

  useEffect(() => {
    if (sessionStorage.getItem("requiredSignIn")) {
      setTextToResponse(sessionStorage.getItem("requiredSignIn"));
    }
  }, [sessionStorage.getItem("requiredSignIn")]);

  useEffect(() => {
    if (!localStorage.getItem("mute")) {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;

      if (!SpeechRecognition) {
        alert("Your browser does not support Speech Recognition");
        return;
      }

      const recognition = new SpeechRecognition();
      recognition.lang = "en-US";
      recognition.continuous = true; // Keep listening, don't stop after 1 sentence
      recognition.interimResults = true; // Allow to show preview text before the final text

      recognition.onresult = (event) => {
        let finalText = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalText += transcript + " "; // Final result
          }
        }

        // Save final text
        if (finalText) {
          setFinalText(finalText.trim());
          // Check and do action with final text
          handleLogicForVoiceControl(finalText);
        }
      };

      recognition.onend = () => {
        setTextToResponse("Voice control is off. Press Enter to enable");
      };

      recognitionRef.current = recognition;
    }
  }, [finalText]);

  useEffect(() => {
    if (!localStorage.getItem("mute")) {
      speak(textToResponse);
    }
  }, [textToResponse]);

  useEffect(() => {
    document.body.addEventListener(
      "click",
      () => {
        if (!localStorage.getItem("mute")) {
          setTextToResponse("Press Enter to turn on voice control");
        }
      },
      { once: true },
    );

    window.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        startListening();
      }
    });
  }, []);

  const startListening = () => {
    recognitionRef.current.start();
  };

  // const stopListening = () => {
  //   recognitionRef.current.stop();
  // };

  return <></>;
}
