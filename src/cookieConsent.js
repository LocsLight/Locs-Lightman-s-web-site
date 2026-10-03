import * as CookieConsent from "vanilla-cookieconsent";
import "vanilla-cookieconsent/dist/cookieconsent.css";

const GA_MEASUREMENT_ID = "G-XXXXXXXXXX"; // remplace par ton identifiant

const loadGoogleAnalytics = () => {
  if (document.getElementById("ga-script")) return;

  const script = document.createElement("script");
  script.id = "ga-script";
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  document.head.appendChild(script);

  window.dataLayer = window.dataLayer || [];
  function gtag() {
    window.dataLayer.push(arguments);
  }
  window.gtag = gtag;
  gtag("js", new Date());
  gtag("config", GA_MEASUREMENT_ID);
};

export const initCookieConsent = () => {
  CookieConsent.run({
    categories: {
      necessary: { readOnly: true },
      analytics: {},
    },

    language: {
      default: "fr",
      translations: {
        fr: {
          consentModal: {
            title: "Ce site utilise des cookies",
            description:
              "Nous utilisons des cookies pour mesurer l'audience du site. Vous pouvez accepter ou refuser leur utilisation.",
            acceptAllBtn: "Tout accepter",
            acceptNecessaryBtn: "Tout refuser",
            showPreferencesBtn: "Gérer mes préférences",
          },
          preferencesModal: {
            title: "Préférences des cookies",
            acceptAllBtn: "Tout accepter",
            acceptNecessaryBtn: "Tout refuser",
            savePreferencesBtn: "Enregistrer",
            closeIconLabel: "Fermer",
            sections: [
              {
                title: "Cookies nécessaires",
                description: "Indispensables au fonctionnement du site.",
                linkedCategory: "necessary",
              },
              {
                title: "Cookies de mesure d'audience",
                description:
                  "Nous aident à comprendre comment les visiteurs utilisent le site (Google Analytics).",
                linkedCategory: "analytics",
              },
            ],
          },
        },
      },
    },

    onFirstConsent: ({ cookie }) => {
      if (cookie.categories.includes("analytics")) loadGoogleAnalytics();
    },

    onConsent: ({ cookie }) => {
      if (cookie.categories.includes("analytics")) loadGoogleAnalytics();
    },
  });
};
