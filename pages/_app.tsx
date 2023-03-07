import { initializeIcons } from "@fluentui/react";
import { AppProps } from "next/app";

const App = ({ Component, pageProps }: AppProps) => {
  initializeIcons();
  return (
    <Component {...pageProps} />
  );
};

export default App;
