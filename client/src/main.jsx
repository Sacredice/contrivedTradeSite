import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import { UserProvider } from "./context/UserContext.jsx"
import { PriceProvider } from './context/PriceContext.jsx'
import { TradeModalProvider } from './context/TradeModalContext.jsx'
import { ColorModeProvider } from './context/ColorModeContext.jsx'
import { disableReactDevTools } from '@fvilers/disable-react-devtools'
import { QueryClient, QueryClientProvider } from 'react-query'
import { ReactQueryDevtools } from "react-query/devtools"


const queryClient = new QueryClient()

if (process.env.NODE_ENV === 'production') {
  disableReactDevTools();
}

ReactDOM.createRoot(document.getElementById('root')).render(
    <ColorModeProvider>
      <PriceProvider>
        <UserProvider>
          <TradeModalProvider>
            <QueryClientProvider client={queryClient} contextSharing={true}>

                <BrowserRouter>
                    <App />
                    <ReactQueryDevtools />
                </BrowserRouter>

            </QueryClientProvider>
          </TradeModalProvider>
        </UserProvider>
      </PriceProvider>
    </ColorModeProvider>
,
)
