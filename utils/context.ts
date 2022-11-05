import { createContext } from 'react';
import { Socket } from 'socket.io-client';
import { GlobalContextType } from './types';

export const AuthContext = createContext<{ auth: boolean; high: boolean; setAuth: React.Dispatch<React.SetStateAction<boolean>>; setHigh: React.Dispatch<React.SetStateAction<boolean>> }>({ auth: false, high: false, setAuth: () => {}, setHigh: () => {} });

export const SocketContext = createContext<{ socket: Socket | undefined; setSocket: React.Dispatch<React.SetStateAction<Socket | undefined>> }>({ socket: undefined, setSocket: () => {} });

export const GlobalContext = createContext<{ values: GlobalContextType | undefined; setGlobalValues: React.Dispatch<React.SetStateAction<GlobalContextType | undefined>> }>({ values: undefined, setGlobalValues: () => {} });
