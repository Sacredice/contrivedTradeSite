import { lazy, Suspense } from 'react';
import SignUp from './pages/SignUp';
import SignIn from './pages/SignIn';
import Layout from './layout/Layout';
import Home from './pages/Home';
import PersistantLogin from './components/PersistantLogin';
// import ProtectedRoute from './components/ProtectedRoute';
// import Market from './pages/Market';
// import Profile from './pages/Profile';
// import Details from "./pages/Details";
// import MarketHistory from './pages/MarketHistory';
import { Routes, Route} from "react-router-dom";
import LoadingSpinner from './components/LoadingSpinner';

const ProtectedRoute = lazy(() => import('./components/ProtectedRoute'));
const MarketHistory = lazy(() => import('./pages/MarketHistory'));
const Market = lazy(() => import('./pages/Market'));
const Profile = lazy(() => import('./pages/Profile'));
const Details = lazy(() => import("./pages/Details"));

function App() {

  return (
    <>
      <Routes>
        <Route element={<PersistantLogin />}>
          <Route path='/' element={<Layout />}>
            
            <Route index element={<Home />} />
            <Route path='register' element={<SignUp />} />
            <Route path='login' element={<SignIn />} />


              <Route element={<Suspense fallback={<LoadingSpinner />}><ProtectedRoute /></Suspense>}>
                <Route path="market" element={<Suspense fallback={<LoadingSpinner />}><Market /></Suspense>} />
                <Route path="gold" element={<Suspense fallback={<LoadingSpinner />}><Details tradeGoods={"Gold"} /></Suspense>} />
                <Route path="uranium" element={<Suspense fallback={<LoadingSpinner />}><Details tradeGoods={"Uranium"} /></Suspense>} />
                <Route path="ripcoin" element={<Suspense fallback={<LoadingSpinner />}><Details tradeGoods={"RIPCoin"} /></Suspense>} />
                <Route path="tibcoin" element={<Suspense fallback={<LoadingSpinner />}><Details tradeGoods={"TIBCoin"} /></Suspense>} />
                <Route path="diamond" element={<Suspense fallback={<LoadingSpinner />}><Details tradeGoods={"Diamond"} /></Suspense>} />
                <Route path="plutonium" element={<Suspense fallback={<LoadingSpinner />}><Details tradeGoods={"Plutonium"} /></Suspense>} />

                <Route path=":username" element={<Suspense fallback={<LoadingSpinner />}><Profile /></Suspense>} />
                <Route path=":username/markethistory" element={<Suspense fallback={<LoadingSpinner />}><MarketHistory /></Suspense>} />
              </Route>



          </Route>
        </Route>
      </Routes>
      
    </>
  )
}

export default App
