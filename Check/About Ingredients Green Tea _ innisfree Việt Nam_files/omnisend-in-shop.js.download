(function () {
  const dateVersion = new Date().toISOString().slice(0, 13);

  const script = document.createElement('script');

  script.type = 'text/javascript';
  script.async = true;
  script.src = `https://omnisnippet1.com/platforms/shopify.js?source=appEmbed&v=${dateVersion}`;

  const firstScript = document.getElementsByTagName('script')[0];

  if (firstScript) {
    firstScript.parentNode.insertBefore(script, firstScript);
    return;
  }

  document.head.appendChild(script);
})();
