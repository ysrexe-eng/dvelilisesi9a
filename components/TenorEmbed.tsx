import React, { useEffect } from 'react';

function TenorEmbed() {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = "https://tenor.com/embed.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      // In React 18 strict mode, this effect runs twice. The first cleanup
      // removes the script, causing the second one to fail. We can wrap this
      // in a try-catch, but for simplicity, we'll leave it, as it works
      // in production.
      try {
        document.body.removeChild(script);
      } catch (error) {
        // Silently ignore the error.
      }
    };
  }, []);

  return (
    <div
      className="tenor-gif-embed"
      data-postid="17400057"
      data-share-method="host"
      data-aspect-ratio="1"
      data-width="100%"
    >
      <a href="https://tenor.com/view/rabbit-alice-in-wonderland-the-white-rabbit-look-at-this-time-is-ticking-gif-17400057">
        Rabbit Alice In Wonderland GIF
      </a>
      from <a href="https://tenor.com/search/rabbit-gifs">Rabbit GIFs</a>
    </div>
  );
}

export default TenorEmbed;
