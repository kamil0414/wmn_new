/* eslint-disable react/jsx-props-no-spreading */
import "../styles/global.scss";
import { AppProps } from "next/app";

function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}

export default App;
