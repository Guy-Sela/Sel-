document.addEventListener("DOMContentLoaded", function () {
  // Year
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  // ==========================================
  // Newsletter Form Handler
  // ==========================================
  // Posts to a hidden Google Form "formResponse" endpoint so the user never sees Google UI.
  // NOTE: This is intentionally "fire-and-forget" (no reliable success signal from Google Forms).
  const NEWSLETTER_GF = {
    action:
      "https://docs.google.com/forms/u/0/d/e/1FAIpQLScDmwQ6ZhbM_FO2pltqidSyFOUC7C4yknLqtmz-b5GrtAHZ_A/formResponse",
    emailField: "entry.1523136379",
  };

  function ensureNewsletterTransport() {
    const iframeName = "newsletter_hidden_iframe";
    let iframe = document.querySelector(`iframe[name="${iframeName}"]`);
    if (!iframe) {
      iframe = document.createElement("iframe");
      iframe.name = iframeName;
      iframe.tabIndex = -1;
      iframe.setAttribute("aria-hidden", "true");
      iframe.style.position = "absolute";
      iframe.style.width = "1px";
      iframe.style.height = "1px";
      iframe.style.border = "0";
      iframe.style.opacity = "0";
      iframe.style.pointerEvents = "none";
      iframe.style.left = "-9999px";
      iframe.style.top = "-9999px";
      document.body.appendChild(iframe);
    }

    let form = document.getElementById("newsletterGoogleForm");
    if (!form) {
      form = document.createElement("form");
      form.id = "newsletterGoogleForm";
      form.method = "POST";
      form.action = NEWSLETTER_GF.action;
      form.target = iframeName;
      form.style.position = "absolute";
      form.style.left = "-9999px";
      form.style.top = "-9999px";

      const emailInput = document.createElement("input");
      emailInput.type = "email";
      emailInput.name = NEWSLETTER_GF.emailField;
      emailInput.autocomplete = "off";
      form.appendChild(emailInput);

      document.body.appendChild(form);
    }

    const emailFieldEl = form.querySelector(
      `input[name="${CSS?.escape ? CSS.escape(NEWSLETTER_GF.emailField) : NEWSLETTER_GF.emailField}"]`,
    );
    return { iframe, form, emailFieldEl };
  }

  function handleNewsletterSubmit(e) {
    e.preventDefault();

    const emailInput = document.getElementById("newsletterEmail");
    const statusEl = document.getElementById("newsletterStatus");
    const submitBtn = document.querySelector(
      '#newsletterForm button[type="submit"]',
    );
    const email = emailInput?.value?.trim() || "";

    if (!emailInput || !statusEl) return false;
    if (!email) {
      statusEl.textContent = "Please enter an email address.";
      statusEl.className = "contact-form-status error";
      return false;
    }

    // Basic email validity check (browser will also enforce via type="email" + required)
    if (emailInput.validity && !emailInput.validity.valid) {
      statusEl.textContent = "Please enter a valid email.";
      statusEl.className = "contact-form-status error";
      return false;
    }

    statusEl.textContent = "Subscribing...";
    statusEl.className = "contact-form-status";
    if (submitBtn) submitBtn.disabled = true;

    try {
      const { form, emailFieldEl } = ensureNewsletterTransport();
      if (emailFieldEl) emailFieldEl.value = email;
      form.submit();

      // UX: show success quickly, independent of Google response timing.
      window.setTimeout(() => {
        statusEl.textContent = "Thanks! You're on the list.";
        statusEl.className = "contact-form-status success";
        emailInput.value = "";
        if (submitBtn) submitBtn.disabled = false;

        window.setTimeout(() => {
          statusEl.textContent = "";
          statusEl.className = "contact-form-status";
        }, 4000);
      }, 600);
    } catch (err) {
      statusEl.textContent = "Unable to subscribe right now.";
      statusEl.className = "contact-form-status error";
      if (submitBtn) submitBtn.disabled = false;
    }

    return false;
  }

  // Attach form submit handler
  const newsletterForm = document.getElementById("newsletterForm");
  if (newsletterForm) {
    newsletterForm.addEventListener("submit", handleNewsletterSubmit);
  }

  // ==========================================
  // Microdosing Swiper Carousel (lazy-loaded)
  // ==========================================
  (function initMicrodosingSwiper() {
    if (typeof Swiper === "undefined") return;

    const carousel = document.querySelector(".microdosing-carousel");
    if (!carousel) return;

    let swiperInitialized = false;

    function initSwiper() {
      if (swiperInitialized) return;
      swiperInitialized = true;

      new Swiper(".microdosing-carousel", {
        effect: "coverflow",
        grabCursor: true,
        centeredSlides: true,
        slidesPerView: 3,
        initialSlide: 0,
        loop: false,
        coverflowEffect: {
          rotate: 35,
          stretch: 0,
          depth: 350,
          modifier: 1,
          scale: 0.85,
          slideShadows: false,
        },
        breakpoints: {
          0: {
            slidesPerView: 1.15,
            spaceBetween: 12,
            coverflowEffect: {
              rotate: 18,
              stretch: 0,
              depth: 220,
              modifier: 1,
              scale: 0.92,
              slideShadows: false,
            },
          },
          640: {
            slidesPerView: 2,
            spaceBetween: 18,
            coverflowEffect: {
              rotate: 25,
              stretch: 0,
              depth: 260,
              modifier: 1,
              scale: 0.9,
              slideShadows: false,
            },
          },
          1024: {
            slidesPerView: 3,
            coverflowEffect: {
              rotate: 35,
              stretch: 0,
              depth: 350,
              modifier: 1,
              scale: 0.85,
              slideShadows: false,
            },
          },
        },
        pagination: {
          el: ".microdosing-carousel .swiper-pagination",
          clickable: true,
        },
        keyboard: {
          enabled: true,
        },
      });
    }

    // Lazy init: start when carousel is 300px from viewport
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          initSwiper();
          observer.disconnect();
        }
      },
      { rootMargin: "300px" },
    );

    observer.observe(carousel);

    function updateMdDateTime() {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, "0");
      const minutes = String(now.getMinutes()).padStart(2, "0");
      const timeStr = `${hours}:${minutes}`;

      const dateStr = now.toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
      });

      const insightDateStr = now
        .toLocaleDateString("en-US", {
          month: "long",
          day: "numeric",
          year: "numeric",
        })
        .toUpperCase();

      const gongTime = document.getElementById("mdGongTime");
      const gongDate = document.getElementById("mdGongDate");
      const insightDate = document.getElementById("mdInsightDate");

      if (gongTime) gongTime.textContent = timeStr;
      if (gongDate) gongDate.textContent = dateStr;
      if (insightDate) insightDate.textContent = insightDateStr;
    }

    updateMdDateTime();
    setInterval(updateMdDateTime, 60000);
  })();

  // ==========================================
  // About: terminal reveal (play once in view)
  // ==========================================
  (function initAboutTerminal() {
    const terminal = document.getElementById("aboutTerminal");
    const about = document.getElementById("about");
    const typedText = document.getElementById("aboutTypedText");
    const cursor = document.getElementById("aboutCursor");
    const asciiPre = document.getElementById("aboutAsciiPre");
    if (!terminal || !about || !typedText || !cursor || !asciiPre) return;

    const reduce =
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // ASCII Data
    const ASCII_VARIANTS = {
      classic: `-::::::-:.::..-........:...:....   ..               .::.......................::
-:::::-:::::::................  .                    ... ...................:.::
-:::--::-::::-..........                               .   ..........:........::
:-:---:::..:.:.......                                        ..................:
:-:::::...........                                              .........:....::
::::-:::.:......                                                ...............:
-:::::::........                                                    ............
-:::::::.......                                                    .............
:::.::....... ..                                                      .........:
::::.:......  .                                                        .........
:-::.........                                                           .......:
::::........                                                             .......
:::.......                                                                ......
:::......                                                                  .....
:...... .                                                                  .....
........                                                                    ....
.......                                ..:-==:::.                      .. ......
......                             .::--==+*+++===-:.                     .. ...
.....                             :-=-=-=-========--:..                      ...
.....                           .::::.:::-===-==---:::::                      ..
.....                          .:-:......::::::::::::=--:                     ..
.....                          .:::................:::-=:.                    ..
... .                          ..::..................::-:. .                   .
.....                         ....-:.................::::. .                  ..
....                  .       ...:::.................-:...                    ..
....                          .:=+---------:.::-:::::-=...                    ..
...                            -%*--=+*#*=+%#%+-=+=---=*+                      .
..                           .:--=.--==+*===:+=+**++=:-*=  ..                  .
..                           ::=.-::.::::=-..:+-::..:.:=-- ..                ...
....                         .:-:..:::::-:....:----::--:=:                    ..
...                           .:-.    .........:.......-:.                    ..
...              .             .-...............:.....::                     ...
....                            =:....::-=-::=+-::....-.                    ....
....                            --:.:===++----+*+=-:::-.                     ...
.....                           .-:::--::-:-----=--::-:                      ...
......   .                       :----....::::::::-:=-                     . ...
:...... ..                       .=+=::...:--:.::-+++...                     ...
:.........                     .=:.*=.::..:-:..::=#*:.....                 .....
:......... .  .      ..:....:::*%- :+:....::.:..:+*.==:........          .......
:::.........    .:-+*#%%%%%%%%%%@*...-. ..::....-=..#%#*+-:.. .   ..............
::::...... .:-=+#%@@@@@@@@@%%%%%%%-...:..:.:..-=:..=@%%%%%%#*+=-::.. .........:.
-:::...:.:=*%@@@@@@@@@@@@%@@%%%%%@+.........::....:#@%%%%%@@@@@%%%#+=:.......:::
-::::....#%%%%@@%%@@@@@@@@@%%%%%%%#:...     ......*@%%@@%%@@@@@@@@@@@%#+-:...:::
-:-::.:-+@%%%%%@@@@@@@@@@@%%%%%%%@*:....    .....=%%%@@@%%%@@@@@@@@@@@@@@#+-::::
--::-+#@@@%%%%%%%%@@@@@@@%%%%%%%@@#::....  .....-#@%%@@@@%%@@@@@@@@@@@@@@@@%#=-:
-:=*%@@@@@@@%%%@%%%%%@@@%#%%###%@%%=............=%%%%@@@%%#@@@@@@@@@@@@@@@@@@@#-
:=%@@@@@@@@@%%%@@@%%%%%%%%%%%##%%%%#:..........=%@%%%%%%%%%%@%@@@@@@@@@@@@@@%%@%
*%@@@@@@@@@@%%@@@@@@@%%%%%%@%*%%#%%@+...::....-%%%@%%%%%#%%%@@@@@@@@@@@@@%%@@@@@
@@@@@@@@@@@@@%@@@@@@@@@@@@@@%%@@%%%%%:.:---::-%%@@%#%@@@@%%%@@@%%%%%%%%%@%%@@@@@
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@%%%%%%%%+:-==--=*%%%##%@@@@@@%%%%%%%%%%@@@@@%%@@@@@
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@%%@%%%@#-:-==++#%%%%@@@@@@@@@@%@@@@@@@@@@@@@@@@@@@
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@%%%%%%@#-:-=-=+%@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@%#%%%%%=-----##%@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
@@@@@@@@@@@@@@@%%@@@@@@@@@@@@@@@%%@%%@#=-==*@#%@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
@@@@@@@@@@@@@@@%%@@@@@%%@@@@@@@@%%@@%@%+:=*%@#%@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
@@@@@@@@@@@@@@@%%@@@@@@@@@@%@@@%%%@@@@%*++#@%#%@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
@@@@@@@@@@@@@@%%%@@@@@@@@@@@@@@%@%%@@@%*#%%%%%@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
@@@@@@@@@@%@@@@@%%@@@@@@@@@@@@@@@@%%@@@%%%%%%@@@@@@@@@@@@@@@@@@@@@@%@@@@@@@@@@@@
@@@@@@@@@%*%@@@@@%%@@@@@@@@%%%%@@@@%%@@@@%%%@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
@@@@@@@@@%+%@@@@@@@@%%@@@@%%%%@@@@@@%%@@@@%%@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@`,

      dots: `. . . . . . . . .   .   .   .   .   .   .   .   .   .   .   .   .   .   . . .
 .   .   .   .
. . . . . . . . . .       .                               .   . . .   . . . . .

. . . . .   .   .   .   .   .       .       .       .   .   .   .   .   .   .

. . . . . .   .                                                       .   . . .

. . .   .   .   .       .       .       .       .       .       .   .   .   .

. .   .   .                                                               .   .
                                           .
.   .   .   .       .       .   .   . . . . . . . . .       .   .   .   .   .
                                         .   .   .   .
. .   .                         . .   .   . . . . . . . .                     .

.   .   .   .   .       .       . . .   .   .   .   . . .   .   .       .   .
                                ..   .   .   .   .   .
. .                           . . . . . . . . . . . . . . .               .
                               .         .     .       .
.   .   .   .   .   .   .   .   .   . . .   . . . . . . .   .   .   .   .   .

. .                             . . . . . . . . . . . .                       .
                                     .     .   . .
.   .   .   .   .   .   .   .   . . .   . . .   . . .   .   .   .   .   .   .
                                   .             ...
. .   . . .       . . . . . . . . . . . . . . . . . . . . .       .       .   .
               . .................                 ......... .
. . .   . . ....................... .   .   .   . . ............... . . .   . .
         ..........................              .........................
. . . ....................... ..... . .   . . . . ....... ................... .
  ..................................           .................................
............................. . .....   . . . . ... ... ........................
......................................   .   ...................................
..................................... . . . . ..................................
......................................   . .....................................
....................................... . . ....................................
........................................ .......................................
....................................... . ......................................
................................................................................
................................................................................`,

      minimal: `=====+==++=+++=++++++++=++++++++++++++++******+++++++=++++++++++++++++++++++++++
==========++==+++++++++++++++++++*+*+***************++++++++++++++++++++++++++==
========++++++++++++++++*+*****************************++++++++++++++++++++++++=
=======+++++++++++++++****************************************++++++++++++++++++
=======++++++++++++*********************************************++++++++++++++++
===++++++++++++++************************************************+++++++++++++++
+=++++++++++++++*****************************************************+++++++++++
===++++++++++++********************************************************+++++++++
===++++++++++***********************************************************++++++++
=+++++++++++*************************************************************+++++++
+++++++++*****************************************************************++++++
++++++++++**************************++++==---===+++********************+++++++++
++++++++**************************+===-=---:------===++*******************++++++
++++++*************************++===++====---=--========+*******************++++
+++++++************************+===+++++++++++++++++==--=+******************++++
+++++++***********************++++=+++++++++++++++++++===+*+****************++++
++++++****************+*******++++=++++++++++++++++++==+++++**************++++++
++++++*+**************+*******++--====--==============-==+++**************++++++
++++*++**********************++=::==--:::--:-.--::---=-.-++++*************++++++
++++*************************+=-+==++====-=++=--=====+=-==*++***************++++
+++++***********+************++==++++++++++++++===+++++==+**+*************+*++++
+++++++**********+*************+-+++++++++++++++++++++==++**+*************++++++
++++++**************************-=+++===--===-:--==+++=++++++**********+***+++++
++++++++************************+==+=-=========---====++++****************++++++
++++++++++++*********************+--==++++====+++=---=++++***+**********+*++++++
+++++++++++++++++**************+-++:-+=+++===++==-.:=+++++++++*+++**+***++++++++
=++++++++++++*+**+++==---------. -++==++++++++++=:-+::-==+++++++++++++++++++++++
==+++++++++++==-:..              .=+++++++++++===++-    ..::---==+++++++++++++++
-===+++++-:..                     :+++++++++++++++=     .         ..:-==+++++++=
=====++=-                         :=+++++*+++++++=.      .              .:-=++==
====-:.                   .  ..   .=++++++++++++=.       ..                 .:-=
==.                          ..    :=++++++++++=.         .                    .
:                           ..  .   :+++=+++++-         .
                             .       -+=--===:   ...
                               .     .===----..
                                .    .-==-==:.
                                .     .-=--: .
                                       :--.  .
                                       ...  .
          .                                .
         .-                                                                     `,
    };

    let currentStyle = "classic";
    let currentAsciiText = ASCII_VARIANTS.classic;
    let ASCII_ROWS = 1,
      ASCII_COLS = 80;

    function prepareAscii(key) {
      if (!ASCII_VARIANTS[key]) return;
      currentStyle = key;
      const raw = ASCII_VARIANTS[key];
      const lines = raw.split("\n");
      // Simple normalization
      while (lines.length && lines[0].trim() === "") lines.shift();
      while (lines.length && lines[lines.length - 1].trim() === "") lines.pop();

      currentAsciiText = lines.join("\n");
      ASCII_ROWS = lines.length || 1;
      ASCII_COLS = Math.max(1, ...lines.map((l) => l.length));

      // Update UI
      document.querySelectorAll(".ascii-btn").forEach((btn) => {
        btn.classList.toggle("active", btn.dataset.style === key);
      });
    }
    // Use ascii-profile.txt as the canonical "classic" ASCII source.
    // We override the embedded default once the file is loaded.
    const classicAsciiUrl = "ascii-profile.txt";
    const classicReadyPromise = fetch(classicAsciiUrl, { cache: "no-store" })
      .then((res) =>
        res.ok
          ? res.text()
          : Promise.reject(new Error("classic ascii fetch failed")),
      )
      .then((txt) => {
        ASCII_VARIANTS.classic = txt;
      })
      .catch(() => {
        /* keep embedded fallback */
      })
      .finally(() => {
        prepareAscii("classic");
      });

    document.querySelectorAll(".ascii-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const style = btn.dataset.style;
        if (style && ASCII_VARIANTS[style]) {
          prepareAscii(style);
          if (asciiPre.textContent.length > 0) {
            asciiPre.textContent = currentAsciiText;
            fitAsciiToViewport();
          }
        }
      });
    });

    function setCursorVisible(v) {
      cursor.classList.toggle("is-visible", !!v);
    }

    function sleep(ms) {
      return new Promise((r) => window.setTimeout(r, ms));
    }

    function measureChar(preEl) {
      const meas = document.createElement("span");
      meas.textContent = "M";
      meas.style.position = "absolute";
      meas.style.visibility = "hidden";
      meas.style.whiteSpace = "pre";
      meas.style.fontFamily = getComputedStyle(preEl).fontFamily;
      meas.style.fontSize = getComputedStyle(preEl).fontSize;
      meas.style.fontWeight = getComputedStyle(preEl).fontWeight;
      meas.style.letterSpacing = getComputedStyle(preEl).letterSpacing;
      meas.style.lineHeight = getComputedStyle(preEl).lineHeight;
      document.body.appendChild(meas);
      const r = meas.getBoundingClientRect();
      meas.remove();
      return { cw: r.width || 7, ch: r.height || 12 };
    }

    function fitAsciiToViewport() {
      const editor = asciiPre.closest(".term-editor");
      if (!editor) return;

      const editorRect = editor.getBoundingClientRect();
      const vpH = window.innerHeight;
      const availableEditorH = Math.max(
        140,
        Math.floor(vpH - editorRect.top - 18),
      );
      editor.style.height = `${availableEditorH}px`;

      const preStyle = getComputedStyle(asciiPre);
      const padX =
        (parseFloat(preStyle.paddingLeft) || 0) +
        (parseFloat(preStyle.paddingRight) || 0);
      const padY =
        (parseFloat(preStyle.paddingTop) || 0) +
        (parseFloat(preStyle.paddingBottom) || 0);

      const availableW = Math.max(240, editorRect.width - padX);
      const availableH = Math.max(120, availableEditorH - padY);

      asciiPre.style.fontSize = "12px";
      asciiPre.style.lineHeight = "1.08";
      const { cw, ch } = measureChar(asciiPre);

      const targetFontPxW = availableW / (ASCII_COLS * (cw / 12));
      const targetFontPxH = availableH / (ASCII_ROWS * (ch / 12));
      const fontPx = Math.floor(
        Math.max(6, Math.min(targetFontPxW, targetFontPxH, 24)),
      );

      asciiPre.style.fontSize = `${fontPx}px`;
    }

    async function typeInto(el, text, opts = {}) {
      const min = opts.minDelay ?? 12;
      const max = opts.maxDelay ?? 32;
      const pausePunct = opts.pausePunct ?? 120;
      const jitter = () => Math.floor(min + Math.random() * (max - min));

      for (let i = 0; i < text.length; i++) {
        const ch = text[i];
        // Type then move cursor to the end (so it stays to the RIGHT of the prompt/text)
        el.append(ch);
        el.appendChild(cursor);
        if (ch === "." || ch === "!" || ch === "?")
          await sleep(pausePunct + 120);
        else if (ch === "," || ch === ";" || ch === ":")
          await sleep(pausePunct);
        else await sleep(jitter());
      }
      // Ensure cursor is at the end after all text is typed
      el.appendChild(cursor);
    }

    async function blinkCursor(times = 3) {
      for (let i = 0; i < times; i++) {
        setCursorVisible(true);
        await sleep(520);
        setCursorVisible(false);
        await sleep(480);
      }
    }

    async function typeAsciiHesitant() {
      asciiPre.textContent = "";
      const full = currentAsciiText;

      const startLen = 12;
      for (let i = 0; i < Math.min(startLen, full.length); i++) {
        asciiPre.append(full[i]);
        await sleep(Math.random() * 60 + 40);
      }

      await sleep(600);

      let i = startLen;
      let chunk = 20;
      return new Promise((resolve) => {
        function tick() {
          const next = Math.min(full.length, i + chunk);
          asciiPre.textContent = full.slice(0, next);
          i = next;
          chunk = Math.min(300, chunk + 20);
          if (i >= full.length) {
            fitAsciiToViewport();
            resolve();
          } else {
            requestAnimationFrame(tick);
          }
        }
        requestAnimationFrame(tick);
      });
    }

    async function runSequence() {
      typedText.textContent = "❯\u00A0";
      typedText.appendChild(cursor);
      asciiPre.textContent = "";
      setCursorVisible(false);

      await blinkCursor(5);
      await sleep(120);
      setCursorVisible(false);

      // Prefer ascii-profile.txt for the classic portrait; don't block forever if it can't load.
      try {
        await Promise.race([classicReadyPromise, sleep(1200)]);
      } catch (e) {}

      const lineEl = typedText;
      try {
        const wp = window.__worldPop;
        if (wp?.readyPromise) {
          await Promise.race([wp.readyPromise, sleep(1200)]);
        }
      } catch (e) {}

      const humanSpeed = { minDelay: 30, maxDelay: 60, pausePunct: 120 };

      await typeInto(lineEl, "Born 1977, Israel.", humanSpeed);
      await sleep(800);

      await typeInto(lineEl, " On a good day,", humanSpeed);
      await sleep(600);

      await typeInto(lineEl, " one in ", humanSpeed);
      const pop1 = window.__worldPop?.text || "—";
      await typeInto(lineEl, pop1, { minDelay: 40, maxDelay: 80 });
      await typeInto(lineEl, ".", humanSpeed);
      // Population counter starts ticking immediately AFTER the initial number is typed.
      window.__worldPop?.start?.();

      await sleep(800);

      await typeInto(lineEl, " On a bad day,", humanSpeed);
      await sleep(600);

      await typeInto(lineEl, " one of ", humanSpeed);
      const pop2 = window.__worldPop?.text || "—";
      await typeInto(lineEl, pop2, { minDelay: 40, maxDelay: 80 });
      await typeInto(lineEl, ".", humanSpeed);

      await sleep(800);

      await typeInto(lineEl, " Code for consciousness", humanSpeed);
      const tm = document.createElement("span");
      tm.className = "fake-tm";
      tm.textContent = "TM";
      lineEl.appendChild(tm);

      await sleep(1000);
      await typeAsciiHesitant();
      fitAsciiToViewport();
    }

    function showStatic() {
      typedText.innerHTML = "";
      const pop = window.__worldPop?.text || "—";
      const fullText =
        "❯\u00A0Born 1977, Israel. On a good day, one in " +
        pop +
        ". On a bad day, one of " +
        pop +
        ". Code for consciousness";
      typedText.appendChild(document.createTextNode(fullText));
      const tm = document.createElement("span");
      tm.className = "fake-tm";
      tm.textContent = "TM";
      typedText.appendChild(tm);
      typedText.appendChild(cursor);

      asciiPre.textContent = currentAsciiText;
      setCursorVisible(false);
      fitAsciiToViewport();
    }

    let started = false;
    function startOnce() {
      if (started) return;
      started = true;
      if (reduce) showStatic();
      else runSequence().catch(() => showStatic());
    }

    window.addEventListener(
      "resize",
      () => {
        if (!started) return;
        fitAsciiToViewport();
      },
      { passive: true },
    );
    if (window.visualViewport) {
      window.visualViewport.addEventListener("resize", () => {
        if (!started) return;
        fitAsciiToViewport();
      });
    }

    if (!("IntersectionObserver" in window)) {
      startOnce();
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            startOnce();
            io.disconnect();
            break;
          }
        }
      },
      { rootMargin: "100px 0px 0px 0px", threshold: 0.08 },
    );

    io.observe(about);
  })();

  // ==========================================
  // About: World population counter (Census popclock)
  // ==========================================
  (function initWorldPopulationCounter() {
    try {
      const worldState = (window.__worldPop = window.__worldPop || {
        text: "—",
        ready: false,
      });
      if (!worldState.readyPromise) {
        worldState.readyPromise = new Promise((resolve) => {
          worldState._resolveReady = resolve;
        });
      }

      const url = `https://www.census.gov/popclock/data/population.php/world?_=${Date.now()}`;

      function setAll(text) {
        worldState.text = text;
        Array.from(document.getElementsByClassName("worldPopCounter")).forEach(
          (el) => {
            el.textContent = text;
          },
        );
      }

      // Counter is initialized with an initial value, but it should not tick
      // until we explicitly start it right after the first number is typed.
      let pop = NaN;
      let growthRate = NaN;
      let intervalId = null;

      function markReadyOnce() {
        if (worldState.ready) return;
        worldState.ready = true;
        worldState._resolveReady?.();
        worldState._resolveReady = null;
      }

      worldState.start = () => {
        if (intervalId) return;
        if (!Number.isFinite(pop) || !Number.isFinite(growthRate)) return;
        intervalId = window.setInterval(() => {
          pop = Math.round(pop + growthRate);
          setAll(pop.toLocaleString("en-US"));
        }, 1000);
      };

      worldState.stop = () => {
        if (!intervalId) return;
        window.clearInterval(intervalId);
        intervalId = null;
      };

      fetch(url, { cache: "no-store" })
        .then((res) => {
          if (!res.ok) throw new Error(`popclock HTTP ${res.status}`);
          return res.json();
        })
        .then((data) => {
          pop = Number(data?.world?.population);
          growthRate = Number(data?.world?.population_rate);
          if (!Number.isFinite(pop) || !Number.isFinite(growthRate))
            throw new Error("popclock payload shape");

          // Initial number only (no ticking yet)
          setAll(pop.toLocaleString("en-US"));
          markReadyOnce();
        })
        .catch(() => {
          setAll("unavailable");
          markReadyOnce();
        });
    } catch (initError) {}
  })();

  // ==========================================
  // Pixelated Soul: First + Latest diary entries
  // - First entry is hardcoded
  // - Latest entry is fetched from Firestore (public read)
  // Date format matches pxsoul: "dd MMM yyyy" (e.g., "22 Dec 2025")
  // Uses America/Chicago to align with the daily 8am Central publishing cadence.
  // ==========================================
  (function initPxsoulLatestEntry() {
    const latestLabelEl = document.getElementById("pxsoul_latest_label");
    const latestBodyEl = document.getElementById("pxsoul_latest_body");
    if (!latestLabelEl || !latestBodyEl) return;

    const API_KEY = "AIzaSyDIs9vxBTiXwxfsCOFrggLIxPnbRT-wX6E";
    const PROJECT_ID = "pixelated-soul";
    const TZ = "America/Chicago";

    function formatPxsoulDate(date) {
      try {
        // en-GB yields "14 Nov 2025" (no comma), matching pxsoul's "dd MMM yyyy".
        return new Intl.DateTimeFormat("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
          timeZone: TZ,
        }).format(date);
      } catch (e) {
        return date.toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        });
      }
    }

    function getField(fields, key) {
      const v = fields?.[key];
      if (!v || typeof v !== "object") return null;
      if ("stringValue" in v) return v.stringValue;
      if ("integerValue" in v) return Number(v.integerValue);
      if ("timestampValue" in v) return v.timestampValue;
      if ("booleanValue" in v) return Boolean(v.booleanValue);
      return null;
    }

    async function fetchLatest() {
      const url = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents:runQuery?key=${API_KEY}`;
      const body = {
        structuredQuery: {
          from: [{ collectionId: "diary_entries" }],
          orderBy: [
            { field: { fieldPath: "createdAt" }, direction: "DESCENDING" },
          ],
          limit: 1,
        },
      };

      const res = await fetch(url, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error(`Firestore HTTP ${res.status}`);

      const payload = await res.json();
      const doc = Array.isArray(payload) ? payload?.[0]?.document : null;
      const fields = doc?.fields;
      const content = getField(fields, "content");
      const createdAtRaw = getField(fields, "createdAt");
      const dayIndex = getField(fields, "dayIndex");
      if (!content || !createdAtRaw || typeof dayIndex !== "number") {
        throw new Error("Unexpected Firestore payload shape");
      }

      const createdAt = new Date(createdAtRaw);
      if (Number.isNaN(createdAt.getTime()))
        throw new Error("Invalid createdAt timestamp");

      return { content, createdAt, dayIndex };
    }

    (async () => {
      try {
        const latest = await fetchLatest();
        latestLabelEl.textContent = `Latest entry • ${formatPxsoulDate(latest.createdAt)} • Day\u00A0${latest.dayIndex}`;
        latestBodyEl.textContent = latest.content;
        latestBodyEl.parentElement?.setAttribute("aria-busy", "false");
      } catch (e) {
        latestLabelEl.textContent = "Latest entry • unavailable";
        latestBodyEl.textContent = "Unable to load the latest entry right now.";
        latestBodyEl.parentElement?.setAttribute("aria-busy", "false");
      }
    })();
  })();

  // ==========================================
  // Gallery: Conceptual Timing modal + carousel
  // ==========================================
  const clockData = {
    "semi-linear": {
      src: "meditativeclocks/clocks/semi-linear_clock_svg/",
      title: "Semi-linear Clock",
      description:
        'Always the right time, never in the same way. The next "moment" is selected randomly.',
    },
    "ebb-flow": {
      src: "meditativeclocks/clocks/the_ebb_and_flow_of_time/",
      title: "The Ebb and Flow of Time",
      description:
        "Possibly the most minimalistic clock ever made. Time is represented by a single circle, which, at intervals of twelve hours, either expands or contracts. At both extremes (12am, 12pm) it disappears altogether.",
    },
    "past-present-future": {
      src: "meditativeclocks/clocks/present_past_and_future/",
      title: "Present, Past and Future",
      description:
        "Our subjective grasp of time is very different from the rigid, conventional representation. In our minds we often wander between past, present and future, and so does this clock (it takes some time and close attention to see it).",
    },
    hourglass: {
      src: "meditativeclocks/clocks/abstract_hourglass/",
      title: "Abstract Hourglass",
      description: "This one is self-explanatory.",
    },
    universe: {
      src: "meditativeclocks/clocks/universe_clock/",
      title: "Universe Clock",
      description:
        "The small triangle is time passed since the Big Bang. The large, open triangle is time left till the end of time. The scale is logarithmic—the next pixel will appear in 86 billion years.",
    },
    serendipity: {
      src: "meditativeclocks/clocks/serendipity/",
      title: "Serendipity on Demand",
      description:
        "This clock utters a special sound, up to three times every 24 hours, at random intervals, thus connecting moments in life that otherwise wouldn't have been connected.",
    },
  };

  let clockModalCloseTimer = null;
  let clockModalPrevBodyOverflow = "";
  let clockModalPrevBodyPaddingRight = "";
  let clockModalPrevHtmlOverflow = "";

  let clockModalOpenTimer = null;

  function openClock(id) {
    const data = clockData[id];
    if (!data) return;

    const modal = document.getElementById("clockModal");
    const iframe = document.getElementById("modalIframe");
    const title = document.getElementById("modalTitle");
    const description = document.getElementById("modalDescription");
    if (!modal || !iframe || !title || !description) return;

    // If we were mid-close, stop it (prevents delayed src clearing)
    if (clockModalCloseTimer) {
      clearTimeout(clockModalCloseTimer);
      clockModalCloseTimer = null;
    }

    // If we were mid-open (switching clocks), cancel that too
    if (clockModalOpenTimer) {
      clearTimeout(clockModalOpenTimer);
      clockModalOpenTimer = null;
    }

    const isAlreadyOpen = modal.classList.contains("active");

    // Make modal visible (dark) and lock scroll without layout jump
    if (!isAlreadyOpen) {
      clockModalPrevBodyOverflow = document.body.style.overflow;
      clockModalPrevBodyPaddingRight = document.body.style.paddingRight;
      clockModalPrevHtmlOverflow = document.documentElement.style.overflow;

      const scrollbarW =
        window.innerWidth - document.documentElement.clientWidth;
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
      if (scrollbarW > 0) document.body.style.paddingRight = `${scrollbarW}px`;

      modal.classList.add("active");
    }

    // Fade out current iframe first
    iframe.classList.remove("loaded");
    iframe.onload = null;

    function loadNewClock() {
      iframe.onload = () => {
        if (!modal.classList.contains("active")) return;
        iframe.classList.add("loaded");
      };
      iframe.src = data.src;
      title.textContent = data.title;
      description.textContent = data.description;
    }

    // If switching clocks, wait for fade out before loading new one
    if (isAlreadyOpen) {
      clockModalOpenTimer = setTimeout(() => {
        clockModalOpenTimer = null;
        loadNewClock();
      }, 320);
    } else {
      // Fresh open - load immediately
      requestAnimationFrame(loadNewClock);
    }
  }

  function closeClock() {
    const modal = document.getElementById("clockModal");
    const iframe = document.getElementById("modalIframe");
    if (!modal || !iframe) return;

    // Stop any pending load callback from flashing content after close
    iframe.onload = null;
    // Fade iframe out immediately (so about:blank can't flash during modal fade)
    iframe.classList.remove("loaded");

    modal.classList.remove("active");

    // Clear src + restore scroll only after the modal has faded out
    if (clockModalCloseTimer) clearTimeout(clockModalCloseTimer);
    clockModalCloseTimer = window.setTimeout(() => {
      iframe.src = "";
      clockModalCloseTimer = null;
      document.body.style.overflow = clockModalPrevBodyOverflow;
      document.body.style.paddingRight = clockModalPrevBodyPaddingRight;
      document.documentElement.style.overflow = clockModalPrevHtmlOverflow;
    }, 320);
  }

  (function initClockModal() {
    const modal = document.getElementById("clockModal");
    if (!modal) return;

    // Close button
    const closeBtn = document.getElementById("clockModalClose");
    if (closeBtn) {
      closeBtn.addEventListener("click", closeClock);
    }

    // Escape key
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeClock();
    });

    // Click outside
    modal.addEventListener("click", (e) => {
      if (e.target && e.target.id === "clockModal") closeClock();
    });

    // Carousel item clicks (data-clock attribute)
    document.querySelectorAll("[data-clock]").forEach((item) => {
      item.addEventListener("click", () => {
        const clockId = item.getAttribute("data-clock");
        if (clockId) openClock(clockId);
      });
    });
  })();

  (function initCarousel() {
    const track = document.getElementById("carouselTrack");
    if (!track) return;

    const items = track.querySelectorAll(".carousel-item");
    const dots = document.querySelectorAll(".carousel-dot");
    const prevBtn = document.getElementById("carouselPrev");
    const nextBtn = document.getElementById("carouselNext");
    let currentIndex = 0;

    function update() {
      track.style.transform = `translateX(-${currentIndex * 100}%)`;
      dots.forEach((dot, i) =>
        dot.classList.toggle("active", i === currentIndex),
      );
    }

    function goTo(index) {
      if (!items.length) return;
      if (index < 0) index = items.length - 1;
      if (index >= items.length) index = 0;
      currentIndex = index;
      update();
    }

    prevBtn?.addEventListener("click", () => goTo(currentIndex - 1));
    nextBtn?.addEventListener("click", () => goTo(currentIndex + 1));
    dots.forEach((dot) => {
      dot.addEventListener("click", () => goTo(parseInt(dot.dataset.index)));
    });

    // Touch swipe
    let startX = 0;
    track.addEventListener(
      "touchstart",
      (e) => {
        startX = e.touches[0].clientX;
      },
      { passive: true },
    );
    track.addEventListener(
      "touchend",
      (e) => {
        const diff = startX - e.changedTouches[0].clientX;
        if (Math.abs(diff) > 50) goTo(currentIndex + (diff > 0 ? 1 : -1));
      },
      { passive: true },
    );

    // Mouse drag (for desktop when arrows hidden)
    let isDragging = false;
    let dragStartX = 0;
    let didDrag = false;

    track.addEventListener("mousedown", (e) => {
      isDragging = true;
      didDrag = false;
      dragStartX = e.clientX;
      track.style.cursor = "grabbing";
    });

    document.addEventListener("mousemove", (e) => {
      if (isDragging && Math.abs(dragStartX - e.clientX) > 10) {
        didDrag = true;
      }
    });

    document.addEventListener("mouseup", (e) => {
      if (!isDragging) return;
      isDragging = false;
      track.style.cursor = "";
      const diff = dragStartX - e.clientX;
      if (Math.abs(diff) > 50) goTo(currentIndex + (diff > 0 ? 1 : -1));
    });

    // Prevent click from opening clock after drag
    track.addEventListener(
      "click",
      (e) => {
        if (didDrag) {
          e.stopPropagation();
          didDrag = false;
        }
      },
      true,
    );

    update();
  })();

  // ==========================================
  // Works: preload all clock preview iframes when Works nears viewport
  // (avoids iPhone showing "blank/gray" frames mid-scroll)
  // ==========================================
  (function initWorksClockPreload() {
    const works = document.getElementById("works");
    if (!works) return;

    const iframes = Array.from(
      works.querySelectorAll("iframe.clock-preview-iframe"),
    );
    if (!iframes.length) return;

    function loadAll() {
      iframes.forEach((iframe) => {
        const desired = iframe.getAttribute("data-src");
        const current = iframe.getAttribute("src") || "";
        if (!desired) return;
        if (current && current !== "about:blank") return;

        iframe.setAttribute("src", desired);
      });
    }

    if (!("IntersectionObserver" in window)) {
      // Fallback: load as soon as we can.
      loadAll();
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        const e = entries && entries[0];
        if (!e) return;
        if (e.isIntersecting) {
          loadAll();
          io.disconnect();
        }
      },
      { rootMargin: "2000px 0px 2000px 0px", threshold: 0 },
    );

    io.observe(works);
  })();

  // ==========================================
  // STATE
  // ==========================================
  const state = {
    startTime: Date.now(),
    lastActivity: Date.now(),
    lastClickTime: null,
    clicks: 0,
    keysPressed: 0,
    touches: 0,
    lastKey: null,
    pointerX: 0,
    pointerY: 0,
    lastPointerX: 0,
    lastPointerY: 0,
    lastPointerTime: Date.now(),
    pointerVelocity: 0,
    lastScrollY: 0,
    scrollY: 0,
    scrollDepth: 0,
    scrollDir: null,
    viewport: "",
    orientation: "",
    netRequests: 0,
    maxScrollY: 0,
    clipboardEvents: 0,
    selections: 0,
    lastSelection: "",
    domMutations: 0,
    elementsSeen: 0,
    resizeEvents: 0,
    longTasks: 0,
    cumulativeLayoutShift: 0,
    seenElements: new Set(),
  };

  const sessionId =
    crypto.randomUUID?.() || Math.random().toString(36).substr(2, 15);

  // ==========================================
  // HELPER: Get element by ID, handling both mobile (m_) and desktop (d_) prefixes
  // ==========================================
  function getEl(id) {
    return {
      m: document.getElementById("m_" + id),
      d: document.getElementById("d_" + id),
    };
  }

  function setEl(id, value) {
    const els = getEl(id);
    if (els.m) els.m.textContent = value;
    if (els.d) els.d.textContent = value;
  }

  // ==========================================
  // STATIC DATA (set once)
  // ==========================================
  setEl("sessionId", sessionId.substring(0, 8));
  setEl("screen", `${screen.width}×${screen.height}`);
  setEl("pixelRatio", window.devicePixelRatio.toFixed(1) + "x");
  setEl("cpuCores", navigator.hardwareConcurrency || "—");
  setEl(
    "deviceMemory",
    navigator.deviceMemory ? navigator.deviceMemory + "GB" : "—",
  );
  setEl(
    "platform",
    navigator.userAgentData?.platform || navigator.platform || "—",
  );
  setEl("language", navigator.language);
  setEl("timezone", Intl.DateTimeFormat().resolvedOptions().timeZone);
  setEl(
    "themePref",
    window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "DARK"
      : "LIGHT",
  );

  // Additional static data (now for both mobile and desktop)
  setEl("colorDepth", screen.colorDepth + "bit");
  setEl("maxTouch", navigator.maxTouchPoints || 0);
  setEl(
    "reduceMotion",
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
      ? "YES"
      : "NO",
  );
  setEl("historyLen", history.length);
  setEl("referrer", document.referrer || "direct");

  // Storage estimate
  if (navigator.storage?.estimate) {
    navigator.storage.estimate().then((estimate) => {
      const used = estimate.usage
        ? (estimate.usage / 1024 / 1024).toFixed(1) + "MB"
        : "—";
      const quota = estimate.quota
        ? (estimate.quota / 1024 / 1024 / 1024).toFixed(1) + "GB"
        : "—";
      setEl("storageUsed", used);
      setEl("storageQuota", quota);
    });
  }

  // ==========================================
  // TIMING & PAINT METRICS
  // ==========================================
  window.addEventListener("load", () => {
    setTimeout(() => {
      const nav = performance.getEntriesByType("navigation")[0];
      if (nav) {
        setEl("pageLoad", Math.round(nav.loadEventEnd) + "ms");
        setEl("domReady", Math.round(nav.domContentLoadedEventEnd) + "ms");
      }

      const paints = performance.getEntriesByType("paint");
      paints.forEach((entry) => {
        if (entry.name === "first-paint") {
          setEl("firstPaint", Math.round(entry.startTime) + "ms");
        }
        if (entry.name === "first-contentful-paint") {
          setEl("fcp", Math.round(entry.startTime) + "ms");
        }
      });
    }, 0);
  });

  // LCP Observer
  if (window.PerformanceObserver) {
    try {
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        setEl("lcp", Math.round(lastEntry.startTime) + "ms");
      });
      lcpObserver.observe({ type: "largest-contentful-paint", buffered: true });
    } catch (e) {}

    try {
      const clsObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (!entry.hadRecentInput) {
            state.cumulativeLayoutShift += entry.value;
            setEl("cls", state.cumulativeLayoutShift.toFixed(3));
          }
        }
      });
      clsObserver.observe({ type: "layout-shift", buffered: true });
    } catch (e) {}

    try {
      const longTaskObserver = new PerformanceObserver((list) => {
        state.longTasks += list.getEntries().length;
        setEl("longTasks", state.longTasks);
      });
      longTaskObserver.observe({ type: "longtask" });
    } catch (e) {}
  }

  // JS Heap (Chrome only)
  function updateJsHeap() {
    if (performance.memory) {
      const heap = (performance.memory.usedJSHeapSize / 1024 / 1024).toFixed(1);
      setEl("jsHeap", heap + "MB");
    }
  }
  updateJsHeap();

  // ==========================================
  // CONNECTION & ONLINE
  // ==========================================
  function updateConnection() {
    const conn =
      navigator.connection ||
      navigator.mozConnection ||
      navigator.webkitConnection;
    setEl("connection", conn?.effectiveType?.toUpperCase() || "—");
    setEl("online", navigator.onLine ? "YES" : "NO");
    // One latency measure: RTT (ms), when exposed by the Network Information API (Chrome/Edge/Android mainly).
    setEl(
      "rtt",
      typeof conn?.rtt === "number" ? Math.round(conn.rtt) + "ms" : "—",
    );
  }
  updateConnection();
  window.addEventListener("online", updateConnection);
  window.addEventListener("offline", updateConnection);
  if (navigator.connection) {
    navigator.connection.addEventListener("change", updateConnection);
  }

  // ==========================================
  // TIME TO FIRSTS (scroll + interaction)
  // Measured from navigation start via performance.now()
  // ==========================================
  let firstScrollMs = null;
  let firstInteractionMs = null;

  function stampFirstScroll() {
    if (firstScrollMs !== null) return;
    firstScrollMs = Math.round(performance.now());
    setEl("ttfs", firstScrollMs + "ms");
  }

  function stampFirstInteraction() {
    if (firstInteractionMs !== null) return;
    firstInteractionMs = Math.round(performance.now());
    setEl("ttfi", firstInteractionMs + "ms");
  }

  // First interaction: pointer / key / touch (capture so we get it early)
  ["pointerdown", "keydown", "touchstart", "mousedown"].forEach((type) => {
    window.addEventListener(type, stampFirstInteraction, {
      capture: true,
      once: true,
      passive: true,
    });
  });

  // ==========================================
  // NETWORK REQUESTS
  // ==========================================
  if (window.PerformanceObserver) {
    try {
      const resourceObserver = new PerformanceObserver((list) => {
        state.netRequests += list.getEntries().length;
      });
      resourceObserver.observe({ type: "resource", buffered: true });
    } catch (e) {}
    state.netRequests = performance.getEntriesByType("resource").length;
  }

  // ==========================================
  // POINTER
  // ==========================================
  function recordActivity() {
    state.lastActivity = Date.now();
  }

  function handlePointer(e) {
    const x = Math.round(e.clientX ?? e.touches?.[0]?.clientX ?? 0);
    const y = Math.round(e.clientY ?? e.touches?.[0]?.clientY ?? 0);

    const now = Date.now();
    const dt = (now - state.lastPointerTime) / 1000;
    if (dt > 0) {
      const dx = x - state.lastPointerX;
      const dy = y - state.lastPointerY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      state.pointerVelocity = Math.round(dist / dt);
    }

    state.pointerX = x;
    state.pointerY = y;
    state.lastPointerX = x;
    state.lastPointerY = y;
    state.lastPointerTime = now;

    recordActivity();
    scheduleHudRender();

    // Decay velocity after movement stops (no per-frame loop needed).
    if (velocityDecayTimer) window.clearTimeout(velocityDecayTimer);
    velocityDecayTimer = window.setTimeout(() => {
      state.pointerVelocity = 0;
      scheduleHudRender();
    }, 160);
  }
  document.addEventListener("mousemove", handlePointer);
  document.addEventListener("touchmove", handlePointer);

  // ==========================================
  // CLICKS
  // ==========================================
  document.addEventListener("click", () => {
    state.clicks++;
    state.lastClickTime = Date.now();
    recordActivity();
    scheduleHudRender();
  });

  // ==========================================
  // KEYS
  // ==========================================
  document.addEventListener("keydown", (e) => {
    state.keysPressed++;
    state.lastKey = e.key.length === 1 ? e.key : `[${e.key}]`;
    recordActivity();
    scheduleHudRender();
  });

  // ==========================================
  // TOUCH
  // ==========================================
  document.addEventListener("touchstart", () => {
    state.touches++;
    recordActivity();
    scheduleHudRender();
  });

  // ==========================================
  // CLIPBOARD
  // ==========================================
  document.addEventListener("copy", () => {
    state.clipboardEvents++;
    recordActivity();
    scheduleHudRender();
  });
  document.addEventListener("paste", () => {
    state.clipboardEvents++;
    recordActivity();
    scheduleHudRender();
  });
  document.addEventListener("cut", () => {
    state.clipboardEvents++;
    recordActivity();
    scheduleHudRender();
  });

  // ==========================================
  // SELECTION
  // ==========================================
  document.addEventListener("selectionchange", () => {
    const selection = document.getSelection();
    const text = selection?.toString().trim();
    if (text && text !== state.lastSelection) {
      state.selections++;
      state.lastSelection =
        text.substring(0, 30) + (text.length > 30 ? "..." : "");
      recordActivity();
      scheduleHudRender();
    }
  });

  // ==========================================
  // VIEWPORT
  // ==========================================
  function updateViewport() {
    state.viewport = `${window.innerWidth}×${window.innerHeight}`;
    state.orientation =
      window.innerWidth > window.innerHeight ? "LAND" : "PORT";
    scheduleHudRender();
  }
  updateViewport();
  window.addEventListener("resize", () => {
    updateViewport();
    state.resizeEvents++;
  });

  // ==========================================
  // FULLSCREEN
  // ==========================================
  function updateFullscreen() {
    setEl("fullscreen", document.fullscreenElement ? "YES" : "NO");
  }
  document.addEventListener("fullscreenchange", updateFullscreen);

  // ==========================================
  // SCROLL
  // ==========================================
  function updateScroll() {
    stampFirstScroll();
    const y = Math.round(window.scrollY);
    const maxScroll =
      document.documentElement.scrollHeight - window.innerHeight;
    const depth = maxScroll > 0 ? Math.round((y / maxScroll) * 100) : 0;

    if (y > state.lastScrollY) {
      state.scrollDir = "↓";
    } else if (y < state.lastScrollY) {
      state.scrollDir = "↑";
    }
    state.lastScrollY = y;
    state.scrollY = y;
    state.scrollDepth = depth;

    if (y > state.maxScrollY) {
      state.maxScrollY = y;
    }

    recordActivity();
    scheduleHudRender();
  }
  document.addEventListener("scroll", updateScroll, { passive: true });

  // Mark "actively scrolling" for iOS perf (temporarily disables backdrop blur on sticky nav).
  // Like taking weight off the suspension while you’re bouncing over bumps.
  // REMOVED: body.is-scrolling toggle was causing global style invalidation and stutter.
  // Instead we use CSS media queries to disable backdrop-filter on touch devices.
  /*
  var __scrollingClassTimer = 0;
  (function initScrollingClass() {
    document.addEventListener('scroll', () => {
      document.body.classList.add('is-scrolling');
      if (__scrollingClassTimer) window.clearTimeout(__scrollingClassTimer);
      __scrollingClassTimer = window.setTimeout(() => {
        document.body.classList.remove('is-scrolling');
      }, 140);
    }, { passive: true });
  })();
  */

  // ==========================================
  // FOCUS & VISIBILITY
  // ==========================================
  function updateFocus() {
    setEl("tabFocus", document.hasFocus() ? "YES" : "NO");
  }
  function updateVisibility() {
    setEl("visibility", document.visibilityState === "visible" ? "YES" : "NO");
  }
  updateFocus();
  updateVisibility();
  window.addEventListener("focus", updateFocus);
  window.addEventListener("blur", updateFocus);
  document.addEventListener("visibilitychange", updateVisibility);

  // ==========================================
  // PAGE LIFECYCLE
  // ==========================================
  function updatePageState(s) {
    setEl("pageState", s);
  }
  document.addEventListener("freeze", () => updatePageState("FROZEN"));
  document.addEventListener("resume", () => updatePageState("ACTIVE"));
  document.addEventListener("visibilitychange", () => {
    updatePageState(
      document.visibilityState === "hidden" ? "HIDDEN" : "ACTIVE",
    );
  });

  // ==========================================
  // MUTATION OBSERVER
  // ==========================================
  const mutationObserver = new MutationObserver((mutations) => {
    state.domMutations += mutations.length;
  });
  mutationObserver.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: true,
    characterData: true,
  });

  // ==========================================
  // INTERSECTION OBSERVER
  // ==========================================
  const intersectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !state.seenElements.has(entry.target)) {
          state.seenElements.add(entry.target);
          state.elementsSeen++;
        }
      });
    },
    { threshold: 0.5 },
  );

  document.querySelectorAll("section, h1, h2, p, footer").forEach((el) => {
    intersectionObserver.observe(el);
  });

  // ==========================================
  // RESIZE OBSERVER
  // ==========================================
  const desktopHud = document.getElementById("desktopHud");
  const hudResizeObserver = new ResizeObserver(() => {
    state.resizeEvents++;
  });
  if (desktopHud) hudResizeObserver.observe(desktopHud);

  // ==========================================
  // HUD RENDERING
  // - No always-on rAF loop (helps iOS scroll smoothness)
  // - Render is event-driven + a light 1Hz tick for time-based fields
  // - Rendering is gated to when the HUD is actually in view
  // ==========================================
  function formatTime(ms) {
    const s = Math.floor(ms / 1000);
    const hrs = String(Math.floor(s / 3600)).padStart(2, "0");
    const mins = String(Math.floor((s % 3600) / 60)).padStart(2, "0");
    const secs = String(s % 60).padStart(2, "0");
    return `${hrs}:${mins}:${secs}`;
  }

  // NOTE: These may be referenced by earlier event setup (e.g. viewport/scroll init),
  // so avoid TDZ by using `var` (prevents iOS/Safari from hard-crashing on early calls).
  var hudInView = true;
  var renderRaf = 0;
  var velocityDecayTimer = 0;

  function isHudRenderable() {
    return hudInView && document.visibilityState === "visible";
  }

  function renderHudNow() {
    if (!isHudRenderable()) return;

    const now = Date.now();

    setEl("sessionTime", formatTime(now - state.startTime));
    setEl("localTime", new Date().toLocaleTimeString());

    const idle = Math.floor((now - state.lastActivity) / 1000);
    setEl("idleTime", idle + "s");

    setEl("pointerPos", `${state.pointerX}, ${state.pointerY}`);
    setEl("clicks", state.clicks);
    setEl("keysPressed", state.keysPressed);
    setEl("touches", state.touches);
    setEl("netRequests", state.netRequests);
    setEl("domMutations", state.domMutations);
    setEl("scrollY", state.scrollY + "px");
    setEl("scrollDepth", state.scrollDepth + "%");
    setEl("scrollDir", state.scrollDir || "—");
    setEl(
      "viewport",
      state.viewport || `${window.innerWidth}×${window.innerHeight}`,
    );
    setEl(
      "orientation",
      state.orientation ||
        (window.innerWidth > window.innerHeight ? "LAND" : "PORT"),
    );

    // Additional dynamic data (now for both mobile and desktop)
    setEl("pointerVelocity", state.pointerVelocity + " px/s");
    setEl("lastKey", state.lastKey || "—");
    setEl(
      "lastClickTime",
      state.lastClickTime
        ? Math.floor((now - state.lastClickTime) / 1000) + "s ago"
        : "—",
    );
    setEl("clipboardEvents", state.clipboardEvents);
    setEl("selections", state.selections);
    setEl("elementsSeen", state.elementsSeen);
    setEl("resizeEvents", state.resizeEvents);
    setEl("lastSelection", state.lastSelection || "—");

    updateJsHeap();
  }

  function scheduleHudRender() {
    if (!isHudRenderable()) return;
    if (renderRaf) return;
    renderRaf = requestAnimationFrame(() => {
      renderRaf = 0;
      renderHudNow();
    });
  }

  // Gate rendering: HUD only.
  // "HUD" here means the top hero HUD layer (#heroLayer).
  (function initHudVisibilityGate() {
    const heroLayerEl = document.getElementById("heroLayer");
    if (!heroLayerEl || !("IntersectionObserver" in window)) return;

    const io = new IntersectionObserver(
      (entries) => {
        const e = entries && entries[0];
        const visible = !!(e && e.isIntersecting && e.intersectionRatio > 0.12);
        if (visible === hudInView) return;
        hudInView = visible;
        // When it becomes visible again, render immediately so values "catch up".
        if (hudInView) renderHudNow();
      },
      { threshold: [0, 0.12, 0.25, 0.5] },
    );

    io.observe(heroLayerEl);
  })();

  // Light 1Hz tick for time-based fields ("once per second").
  window.setInterval(() => {
    if (!isHudRenderable()) return;
    renderHudNow();
  }, 1000);

  // If the page becomes visible again, refresh instantly.
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") renderHudNow();
  });

  // Initial paint for the HUD readout (now that render helpers exist).
  renderHudNow();

  // ==========================================
  // DESKTOP HUD TOGGLE
  // ==========================================
  const toggle = document.getElementById("hudToggle");
  let hudVisible = true;

  function positionToggle() {
    if (hudVisible && desktopHud) {
      const hudHeight = desktopHud.offsetHeight;
      toggle.style.top = hudHeight + 8 + "px";
    } else {
      toggle.style.top = "0.5rem";
    }
  }
  positionToggle();

  toggle.addEventListener("click", () => {
    hudVisible = !hudVisible;
    desktopHud.classList.toggle("collapsed", !hudVisible);
    toggle.textContent = hudVisible ? "[HIDE]" : "[SHOW]";
    positionToggle();
  });

  window.addEventListener("resize", positionToggle);
  if (desktopHud) new ResizeObserver(positionToggle).observe(desktopHud);

  // ==========================================
  // STICKY NAV: Show after reveal, hide on scroll up
  // ==========================================
  const stickyNav = document.getElementById("stickyNav");
  const worksSection = document.getElementById("works");
  const dissolveContainer = document.getElementById("dissolve-container");
  const revealSection = document.getElementById("reveal");
  const revealText = document.getElementById("revealText");
  let lastScrollTop = 0;
  let navCanShow = false;
  let navCanShowByReveal = false;
  let navCanShowByWorks = false;
  let softEntranceTimer = null;
  const NAV_IDLE_MS = 5000;
  let navIdleTimer = null;

  function updateNavCanShow() {
    const next = !!(navCanShowByReveal || navCanShowByWorks);
    if (next === navCanShow) return;
    navCanShow = next;
    if (navCanShow) scheduleSoftEntrance();
    else stickyNav?.classList.remove("visible");
  }

  function resetNavIdleTimer() {
    if (!stickyNav) return;
    if (!stickyNav.classList.contains("visible")) return;
    if (navIdleTimer) window.clearTimeout(navIdleTimer);
    navIdleTimer = window.setTimeout(() => {
      stickyNav.classList.remove("visible");
    }, NAV_IDLE_MS);
  }

  function clearNavIdleTimer() {
    if (!navIdleTimer) return;
    window.clearTimeout(navIdleTimer);
    navIdleTimer = null;
  }

  function scheduleSoftEntrance() {
    if (!stickyNav) return;
    if (softEntranceTimer) window.clearTimeout(softEntranceTimer);
    // A tiny beat after the reveal clears, like a curtain settling.
    softEntranceTimer = window.setTimeout(() => {
      if (!navCanShow) return;
      stickyNav.classList.add("visible");
      resetNavIdleTimer();
    }, 0);
  }

  // Nav active state (Works selected by default)
  const navLinks = Array.from(
    document.querySelectorAll("#stickyNav [data-nav]"),
  );

  // Lazy-load About terminal iframe so its animation starts only when About becomes active.
  const aboutEmbed = document.querySelector(
    "#aboutTerminal .about-terminal-embed",
  );
  let aboutEmbedLoaded = false;
  let aboutEmbedStartRequested = false;
  let aboutEmbedStarted = false;
  let activeSectionId = "works";
  function ensureAboutEmbedLoaded() {
    if (aboutEmbedLoaded || !aboutEmbed) return;
    const realSrc = aboutEmbed.getAttribute("data-src");
    if (!realSrc) return;
    // Show iframe only after it loads to prevent white flash
    aboutEmbed.addEventListener("load", function onLoad() {
      aboutEmbed.removeEventListener("load", onLoad);
      aboutEmbed.classList.add("loaded");
    });
    aboutEmbed.src = realSrc;
    aboutEmbedLoaded = true;
  }

  // Preload About iframe early (before it's in view) so it's ready when user scrolls there
  (function initAboutPreload() {
    const aboutSection = document.getElementById("about");
    if (!aboutSection || !("IntersectionObserver" in window)) return;

    const preloadObserver = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          ensureAboutEmbedLoaded();
          preloadObserver.disconnect();
        }
      },
      { rootMargin: "1200px 0px 1200px 0px", threshold: 0 },
    );

    preloadObserver.observe(aboutSection);
  })();

  function tryStartAboutEmbedOnce() {
    if (aboutEmbedStarted || !aboutEmbed) return false;
    try {
      const w = aboutEmbed.contentWindow;
      if (w && typeof w.__startCombinedTerminal === "function") {
        w.__startCombinedTerminal();
        aboutEmbedStarted = true;
        return true;
      }
    } catch (e) {}
    try {
      // Message-based start (works once iframe script is listening)
      aboutEmbed.contentWindow?.postMessage(
        { type: "START_TERMINAL_ANSI_COMBINED" },
        "*",
      );
    } catch (e) {}
    return false;
  }

  // Start, but tolerate the iframe not being ready yet by retrying briefly.
  function startAboutEmbedSoon() {
    if (aboutEmbedStarted || !aboutEmbed) return;
    const started = tryStartAboutEmbedOnce();
    if (started) return;

    const maxMs = 2500;
    const stepMs = 100;
    const t0 = Date.now();
    (function retry() {
      if (aboutEmbedStarted) return;
      if (activeSectionId !== "about") return;
      if (Date.now() - t0 > maxMs) return;
      if (tryStartAboutEmbedOnce()) return;
      window.setTimeout(retry, stepMs);
    })();
  }

  // Start once the ❯ (top of iframe) reaches mid-screen, then wait a beat for drama.
  function armAboutEmbedMidScreenStart() {
    if (aboutEmbedStartRequested || aboutEmbedStarted || !aboutEmbed) return;
    aboutEmbedStartRequested = true;

    // If the mid-screen trigger happens before the iframe JS is ready, we'll retry.
    // Still, make sure we can react immediately after load if we're already in About.
    // If we already crossed mid-screen but the iframe wasn't ready, start right after load.
    let crossed = false;
    aboutEmbed.addEventListener("load", () => {
      if (activeSectionId !== "about") return;
      if (aboutEmbedStarted) return;
      if (crossed) startAboutEmbedSoon();
    });

    let raf = 0;
    function tick() {
      raf = 0;
      if (aboutEmbedStarted) return;
      if (activeSectionId !== "about") {
        raf = requestAnimationFrame(tick);
        return;
      }

      const rect = aboutEmbed.getBoundingClientRect();
      const midY = window.innerHeight * 0.5;

      // Trigger when the top edge crosses into/above the midline (prompt is at the top).
      if (!crossed && rect.top <= midY && rect.bottom > 0) {
        crossed = true;
        if (!aboutEmbedStarted && activeSectionId === "about")
          startAboutEmbedSoon();
        return;
      }

      raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);
  }

  function setActiveNav(id) {
    activeSectionId = id;
    navLinks.forEach((a) =>
      a.classList.toggle("active", a.getAttribute("data-nav") === id),
    );
    if (id === "about") {
      ensureAboutEmbedLoaded();
      // Reliability > theatrics: start as soon as About becomes the active section.
      // (Mid-screen gating can be fragile when layout/padding changes.)
      startAboutEmbedSoon();
    }
  }
  setActiveNav("works");

  // ==========================================
  // NAV GATE & ACTIVE SECTION (Optimized via IntersectionObserver)
  // ==========================================
  (function initNavObservers() {
    if (!("IntersectionObserver" in window)) return;

    const gateObserver = new IntersectionObserver(
      (entries) => {
        const e = entries[0];
        const pastReveal = !e.isIntersecting && e.boundingClientRect.top < 0;
        navCanShowByReveal = pastReveal;
        updateNavCanShow();
      },
      { threshold: 0 },
    );
    if (revealSection) gateObserver.observe(revealSection);

    // Works visibility should kick in sooner than the nav gate:
    // reveal Works when its content top (including padding) reaches the top 1/3 of viewport.
    if (worksSection) {
      // Observe the whole Works section so it stays visible while you're anywhere inside Works.
      // (Observing only the first article causes Works to "fade out" once you scroll past it.)
      const worksTriggerEl = worksSection;
      const worksRevealObserver = new IntersectionObserver(
        (entries) => {
          const entry = entries && entries[0];
          if (!entry) return;
          if (entry.isIntersecting) worksSection.classList.add("works-visible");
          else worksSection.classList.remove("works-visible");

          // When Works appears, the navbar should also appear.
          navCanShowByWorks = !!entry.isIntersecting;
          updateNavCanShow();
        },
        {
          // Shrink the root to a thin band around the 1/3 line:
          // top moved down by 33%, bottom moved up by 66% => ~1% band.
          rootMargin: "-33% 0px -66% 0px",
          threshold: 0,
        },
      );
      worksRevealObserver.observe(worksTriggerEl);
    }

    const activeObserver = new IntersectionObserver(
      (entries, observer) => {
        // Find section closest to viewport center among all observed elements
        const viewportCenter = window.innerHeight / 2;
        let closest = null;
        let closestDist = Infinity;

        observer.takeRecords(); // flush pending
        ["works", "about", "contact"].forEach((id) => {
          const el = document.getElementById(id);
          if (!el) return;
          const rect = el.getBoundingClientRect();
          // Section must be at least partially visible
          if (rect.bottom < 0 || rect.top > window.innerHeight) return;
          const sectionCenter = rect.top + rect.height / 2;
          const dist = Math.abs(sectionCenter - viewportCenter);
          if (dist < closestDist) {
            closestDist = dist;
            closest = id;
          }
        });

        if (closest) setActiveNav(closest);
      },
      { rootMargin: "0px 0px -40% 0px", threshold: [0.05, 0.15] },
    );
    ["works", "about", "contact"].forEach((id) => {
      const el = document.getElementById(id);
      if (el) activeObserver.observe(el);
    });
  })();

  function rafThrottle(fn) {
    let raf = 0;
    return function throttled(...args) {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        fn.apply(this, args);
      });
    };
  }

  // Reveal text scroll behavior - hide when scrolled past, show when scrolled back
  const revealTextTop = revealText.getBoundingClientRect().top + window.scrollY;
  const revealTextBottom = revealTextTop + revealText.offsetHeight;
  let lastRevealScrollTop = 0;

  function updateRevealTextVisibility() {
    const scrollTop = window.scrollY;
    const viewportThird = window.innerHeight * 0.33;

    // During the dissolve stage, keep the reveal text visible.
    // The cross-dissolve already controls visibility via opacity, so hiding it here fights the effect.
    if (dissolveContainer) {
      const rect = dissolveContainer.getBoundingClientRect();
      const inDissolve = rect.bottom > 0 && rect.top < window.innerHeight;
      if (inDissolve) {
        revealText.classList.remove("hidden");
        lastRevealScrollTop = scrollTop;
        return;
      }
    }

    // Hide when the text has scrolled past the upper third of viewport
    if (scrollTop > revealTextBottom - viewportThird) {
      if (scrollTop > lastRevealScrollTop) {
        // Scrolling down - hide
        revealText.classList.add("hidden");
      } else {
        // Scrolling up - show
        revealText.classList.remove("hidden");
      }
    } else {
      // Text still in view - always show
      revealText.classList.remove("hidden");
    }

    lastRevealScrollTop = scrollTop;
  }
  const updateRevealTextVisibilityRaf = rafThrottle(updateRevealTextVisibility);
  window.addEventListener("scroll", updateRevealTextVisibilityRaf, {
    passive: true,
  });

  // Scroll handler for show/hide behavior
  // Add hysteresis so fast direction changes don't "flap" the nav on iOS.
  // Also: on iOS, inertial/bounce scroll can briefly reverse direction — don't hide the nav unless
  // the user is actively touching/scrolling upward (otherwise the 5s idle timer handles hiding).
  let navLastY = window.scrollY;
  let navLastDir = 0; // 1 down, -1 up
  let navDirChangeY = navLastY;
  let navShownAtMs = 0;
  let navUserTouching = false;

  window.addEventListener(
    "touchstart",
    () => {
      navUserTouching = true;
    },
    { passive: true },
  );
  window.addEventListener(
    "touchend",
    () => {
      navUserTouching = false;
    },
    { passive: true },
  );
  window.addEventListener(
    "touchcancel",
    () => {
      navUserTouching = false;
    },
    { passive: true },
  );

  function handleStickyNavScroll() {
    const scrollTop = window.scrollY;
    if (!navCanShow) {
      navLastY = scrollTop;
      lastScrollTop = scrollTop;
      return;
    }

    const dy = scrollTop - navLastY;
    if (Math.abs(dy) < 4) return;

    const dir = dy > 0 ? 1 : -1;
    if (dir !== navLastDir) {
      navLastDir = dir;
      navDirChangeY = scrollTop;
    }

    const hysteresisPx = 24;
    if (Math.abs(scrollTop - navDirChangeY) < hysteresisPx) {
      navLastY = scrollTop;
      lastScrollTop = scrollTop;
      return;
    }

    if (dir > 0) {
      if (!stickyNav.classList.contains("visible")) {
        stickyNav.classList.add("visible");
        worksSection?.classList.add("works-visible");
        navShownAtMs = Date.now();
      }
      resetNavIdleTimer();
    } else {
      const recentlyShown = navShownAtMs && Date.now() - navShownAtMs < 450;
      const isCoarsePointer = !!(
        window.matchMedia && window.matchMedia("(pointer: coarse)").matches
      );
      // Touch devices: don't hide during inertia/bounce unless the user is actively swiping.
      // Desktop: allow hide on scroll-up.
      if (recentlyShown || (isCoarsePointer && !navUserTouching)) {
        navLastY = scrollTop;
        lastScrollTop = scrollTop;
        return;
      }
      stickyNav.classList.remove("visible");
      clearNavIdleTimer();
    }

    navLastY = scrollTop;
    lastScrollTop = scrollTop;
  }
  const handleStickyNavScrollRaf = rafThrottle(handleStickyNavScroll);
  window.addEventListener("scroll", handleStickyNavScrollRaf, {
    passive: true,
  });

  // ==========================================
  // CROSS-DISSOLVE: Hero → Reveal (scroll-driven)
  // Pattern: tall container + sticky stage (simple, no deps)
  // ==========================================
  const heroHud = document.getElementById("heroHud");
  const reveal = document.getElementById("reveal");
  const heroLayer = document.getElementById("heroLayer");
  const revealLayer = document.getElementById("revealLayer");

  // ==========================================
  // HERO FIT: scale HUD so it always fits fully in the viewport height
  // (like zooming a camera out until the whole overlay is in frame)
  // ==========================================
  const heroContainer = heroHud?.querySelector(".hud-container");
  let lastHeroScale = 1;

  function fitHeroHud() {
    if (!heroHud || !heroContainer) return;

    const cs = getComputedStyle(heroHud);
    const padY =
      (parseFloat(cs.paddingTop) || 0) + (parseFloat(cs.paddingBottom) || 0);
    const availableH = heroHud.clientHeight - padY;
    if (availableH <= 0) return;

    // Estimate unscaled content height from current rect + last applied scale.
    const rectH = heroContainer.getBoundingClientRect().height || 0;
    const unscaledH = rectH / (lastHeroScale || 1);
    if (unscaledH <= 0) return;

    let scale = availableH / unscaledH;
    scale = Math.min(1, Math.max(0.55, scale));
    if (Math.abs(scale - lastHeroScale) < 0.01) return;
    lastHeroScale = scale;

    // Prefer zoom (affects layout), fallback to transform if unsupported.
    const supportsZoom =
      typeof CSS !== "undefined" &&
      typeof CSS.supports === "function" &&
      CSS.supports("zoom", "1");
    if (supportsZoom) {
      heroContainer.style.zoom = String(scale);
      heroContainer.style.transform = "";
      heroContainer.style.width = "";
    } else {
      heroContainer.style.zoom = "";
      heroContainer.style.transformOrigin = "top center";
      heroContainer.style.transform = `scale(${scale})`;
      heroContainer.style.width = `${100 / scale}%`;
    }
  }

  function scheduleFitHeroHud() {
    requestAnimationFrame(() => requestAnimationFrame(fitHeroHud));
  }

  window.addEventListener("resize", scheduleFitHeroHud);
  // Avoid visualViewport resize: on iOS it can fire DURING scroll as the URL bar animates,
  // which causes mid-scroll re-fitting (layout/transform changes) that feels like a tiny "jump".
  document.fonts?.ready?.then(scheduleFitHeroHud);
  if (window.ResizeObserver && heroContainer)
    new ResizeObserver(scheduleFitHeroHud).observe(heroContainer);
  scheduleFitHeroHud();

  // ==========================================
  // CROSS-DISSOLVE (Option A):
  // - Pure opacity crossfade between two pre-rendered layers (#heroLayer ↔ #revealLayer)
  // - Scroll path is READ scrollY only → WRITE opacity only (no layout reads in scroll)
  // - Metrics are computed on init + resize only
  // - Work is active only while the hero is in/near view (IntersectionObserver gate)
  // ==========================================
  let dissolveViewportH = window.innerHeight;
  let dissolveDistance = window.innerHeight; // fade distance in px (≈ 1 viewport)
  let dissolveStartY = 0;
  let dissolveEndY = 1;
  let dissolveInvRange = 1;
  let dissolveScrollAttached = false;

  function getViewportH() {
    // On iOS the URL bar changes `innerHeight` during scroll; we avoid listening to visualViewport events.
    // We only sample it during init/resize, so it won't create scroll-path work.
    return window.visualViewport?.height || window.innerHeight;
  }

  function clamp01(x) {
    return x < 0 ? 0 : x > 1 ? 1 : x;
  }

  function easeInOut01(t) {
    // Smoothstep-ish: 3t^2 - 2t^3 (cheap, monotonic, no trig)
    return t * t * (3 - 2 * t);
  }

  function setDissolveProgress(t) {
    const progress = clamp01(t);
    heroLayer.style.opacity = String(1 - progress);
    revealLayer.style.opacity = String(progress);

    if (progress >= 1) revealLayer.classList.add("active");
    else revealLayer.classList.remove("active");
  }

  function updateDissolveMetrics() {
    if (!dissolveContainer) return;
    dissolveViewportH = getViewportH();
    // Ensure the fade can finish before the sticky stage ends.
    // Scrollable distance while stage is pinned ≈ containerHeight - viewportHeight.
    const containerH = dissolveContainer.offsetHeight || 0;
    const availableScroll = Math.max(1, containerH - dissolveViewportH);
    // Default: 1 viewport fade, but never exceed what's available.
    dissolveDistance = Math.min(dissolveViewportH, availableScroll);

    // Precompute absolute scroll positions (layout reads happen ONLY here).
    const rect = dissolveContainer.getBoundingClientRect();
    dissolveStartY = rect.top + window.scrollY;
    dissolveEndY = dissolveStartY + dissolveDistance;
    const range = Math.max(1, dissolveEndY - dissolveStartY);
    dissolveInvRange = 1 / range;
  }

  function handleDissolve() {
    // READ-ONLY (scroll): a single scrollY read
    const y = window.scrollY;
    const tLinear = (y - dissolveStartY) * dissolveInvRange;

    // Curve: keep it cheap. If you want linear, replace eased with tLinear.
    const eased = easeInOut01(clamp01(tLinear));

    // WRITE-ONLY (scroll): opacity updates
    setDissolveProgress(eased);
  }

  const handleDissolveRaf = rafThrottle(handleDissolve);

  function attachDissolveScroll() {
    if (dissolveScrollAttached) return;
    dissolveScrollAttached = true;
    window.addEventListener("scroll", handleDissolveRaf, { passive: true });
    heroLayer.style.willChange = "opacity";
    revealLayer.style.willChange = "opacity";
  }

  function detachDissolveScroll() {
    if (!dissolveScrollAttached) return;
    dissolveScrollAttached = false;
    window.removeEventListener("scroll", handleDissolveRaf);
    heroLayer.style.willChange = "";
    revealLayer.style.willChange = "";
  }

  function syncDissolveToScrollImmediate() {
    // No rAF needed here; this is called on init/resize/IO events (not in the scroll hot-path).
    const y = window.scrollY;
    if (y <= dissolveStartY) setDissolveProgress(0);
    else if (y >= dissolveEndY) setDissolveProgress(1);
    else handleDissolve();
  }

  function onDissolveResize() {
    updateDissolveMetrics();
    syncDissolveToScrollImmediate();
  }

  // Init + resize only (avoid visualViewport resize because it can fire DURING scroll on iOS)
  onDissolveResize();
  window.addEventListener("resize", onDissolveResize, { passive: true });

  // Gate with IO so we don't run scroll work once we're past the hero.
  if ("IntersectionObserver" in window && dissolveContainer) {
    const heroObserver = new IntersectionObserver(
      (entries) => {
        const entry = entries && entries[0];
        if (!entry) return;

        if (entry.isIntersecting) {
          // Compute fresh metrics when coming into view (handles orientation changes / font loading shifts).
          updateDissolveMetrics();
          attachDissolveScroll();
          syncDissolveToScrollImmediate();
        } else {
          detachDissolveScroll();
          // If we've scrolled past the hero (container moved above viewport), lock the end-state.
          if (entry.boundingClientRect.top < 0) setDissolveProgress(1);
          else setDissolveProgress(0);
        }
      },
      { rootMargin: "200px 0px 200px 0px", threshold: 0 },
    );

    heroObserver.observe(dissolveContainer);
  } else {
    // Fallback: if IO isn't available, keep it simple.
    attachDissolveScroll();
  }
});
