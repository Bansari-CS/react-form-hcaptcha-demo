import { useEffect, useRef, useState } from "react";
import "./App.css";

const HCAPTCHA_SITE_KEY = "6f30aabc-27d0-4c96-a862-68205d1cbaba";
const RECAPTCHA_SITE_KEY = "6LdjmgItAAAAABxtIsF_1mdHFwyxL7zPlGob8HN9";

function App() {
  const [status, setStatus] = useState("");
  const [captchaToken, setCaptchaToken] = useState("");
  const [captchaError, setCaptchaError] = useState("");
  const formRef = useRef(null);
  const recaptchaWidgetRef = useRef(null);

  useEffect(() => {
    const createdScripts = [];

    const ensureHcaptcha = () => {
      const existing = document.querySelector(
        'script[src="https://hcaptcha.com/1/api.js"]'
      );

      if (!existing) {
        const script = document.createElement("script");
        script.src = "https://hcaptcha.com/1/api.js";
        script.async = true;
        script.defer = true;
        document.body.appendChild(script);
        createdScripts.push(script);
      }
    };

    const renderRecaptcha = () => {
      if (
        window.grecaptcha &&
        document.getElementById("recaptcha-container") &&
        recaptchaWidgetRef.current === null
      ) {
        recaptchaWidgetRef.current = window.grecaptcha.render(
          "recaptcha-container",
          {
            sitekey: RECAPTCHA_SITE_KEY,
            callback: (token) => {
              setCaptchaToken(token);
              setCaptchaError("");
            },
            "expired-callback": () => {
              setCaptchaToken("");
            },
          }
        );
      }
    };

    const ensureRecaptcha = () => {
      const src =
        "https://www.google.com/recaptcha/api.js?onload=onRecaptchaLoaded&render=explicit";
      const existing = document.querySelector(`script[src="${src}"]`);

      window.onRecaptchaLoaded = renderRecaptcha;

      if (!existing) {
        const script = document.createElement("script");
        script.src = src;
        script.async = true;
        script.defer = true;
        document.body.appendChild(script);
        createdScripts.push(script);
      } else {
        renderRecaptcha();
      }
    };

    ensureHcaptcha();
    ensureRecaptcha();

    return () => {
      createdScripts.forEach((script) => {
        if (script.parentNode) {
          script.parentNode.removeChild(script);
        }
      });
      delete window.onRecaptchaLoaded;
    };
  }, []);

  const handleSubmit = (event) => {
    // event.preventDefault();

    // if (!captchaToken) {
    //   setCaptchaError("Please complete the reCAPTCHA before submitting.");
    //   return;
    // }

    setStatus("Sending your message...");
    setCaptchaError("");

    if (formRef.current) {
      formRef.current.submit();
    }
  };

  return (
    <div className="App">
      <main className="form-page">
        <section className="form-card">
          <div className="form-header">
            <h1>Forminit Honeypot Test</h1>
            <p>
              Test normal submissions and spam submissions using the _gotcha
              honeypot field.
            </p>
          </div>

          <form
            ref={formRef}
            className="form-body"
            action="http://localhost:3001/api/forms/6a16f9c6a80aedb05140fcb4"
            method="POST"
            onSubmit={handleSubmit}
          >
            <label>Full Name</label>
            <input
              type="text"
              name="fi-sender-fullName"
              placeholder="Your Full Name"
              required
            />

            <label>Email</label>
            <input
              type="email"
              name="fi-sender-email"
              placeholder="you@example.com"
              required
            />

            <label>Message</label>
            <textarea
              name="fi-text-message"
              rows="5"
              placeholder="Your message..."
              required
            />

            {/* Honeypot */}
            <input
              type="text"
              name="_gotcha"
              style={{ display: "none" }}
              autoComplete="off"
              tabIndex={-1}
            />

            {/* hCaptcha */}
            <div
              className="h-captcha"
              data-sitekey={HCAPTCHA_SITE_KEY}
            ></div>

            {/* reCAPTCHA */}
            <div id="recaptcha-container" className="recaptcha-wrapper" />
            <input
              type="hidden"
              name="g-recaptcha-response"
              value={captchaToken}
            />
            {captchaError && <div className="form-error">{captchaError}</div>}

            <button type="submit">Submit</button>
          </form>

          {status && <div className="form-status">{status}</div>}
        </section>
      </main>
    </div>
  );
}

export default App;
