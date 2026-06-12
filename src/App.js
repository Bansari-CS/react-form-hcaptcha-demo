import { useEffect, useRef, useState } from "react";
import "./App.css";

const HCAPTCHA_SITE_KEY = "6f30aabc-27d0-4c96-a862-68205d1cbaba";

function App() {
  const [status, setStatus] = useState("");
  // const [captchaError, setCaptchaError] = useState("");
  const formRef = useRef(null);

  useEffect(() => {
    const existingScript = document.querySelector(
      'script[src="https://hcaptcha.com/1/api.js"]'
    );

    if (existingScript) {
      return;
    }

    const script = document.createElement("script");
    script.src = "https://hcaptcha.com/1/api.js";
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  // const renderRecaptcha = () => {
    // reCAPTCHA is temporarily disabled while hCaptcha is active.
  // };

  const handleSubmit = (event) => {
    // event.preventDefault();

    // if (!captchaToken) {
    //   setCaptchaError("Please complete the reCAPTCHA before submitting.");
    //   return;
    // }

    setStatus("Sending your message...");
    // setCaptchaError("");

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
            action="https://staging.formbridge.ai/api/forms/6a1d6d555a6e37de3c0b1877"
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

            {/* reCAPTCHA temporarily disabled */}
            {/* {false && (
              <>
                <div id="recaptcha-container" className="recaptcha-wrapper" />
                <input
                  type="hidden"
                  name="g-recaptcha-response"
                  value={captchaToken}
                />
                {captchaError && <div className="form-error">{captchaError}</div>}
              </>
            )} */}

            <button type="submit">Submit</button>
          </form>

          {status && <div className="form-status">{status}</div>}
        </section>
      </main>
    </div>
  );
}

export default App;
