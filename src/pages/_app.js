import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import 'react-toastify/dist/ReactToastify.css';
import "@/styles/globals.scss";

import { Provider } from 'react-redux';
import { store } from '@/store/store';
import {ToastContainer} from "react-toastify";
function App({ Component, pageProps }) {
  return (
      <Provider store={store}>
          <div className="wrapper">
              <Component {...pageProps} />
              <ToastContainer
                  position="top-right"
                  autoClose={5000}
                  hideProgressBar={false}
                  newestOnTop={false}
                  closeOnClick
                  rtl={false}
                  pauseOnFocusLoss
                  draggable
                  pauseOnHover
                  theme="light"
                  >
              </ToastContainer>
          </div>
      </Provider>
  );
}
export default App;
