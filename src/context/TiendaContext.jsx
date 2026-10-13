import { createContext, useContext, useEffect, useReducer } from "react";
import{cargarTienda,guardarTienda} from '../services/storage.js'
import {tiendaReducer} from '../store/tiendaReducer.js'


const TiendaContext= createContext(null)


export function TiendaProvider({children}){
    const [estado,dispatch]= useReducer(tiendaReducer,undefined,cargarTienda)

    useEffect(()=>{
        guardarTienda({productos: estado.productos, carrito:estado.carrito})
    },[estado.productos, estado.carrito])

    return(
        <TiendaContext.Provider value={{estado,dispatch}}>
            {children}
        </TiendaContext.Provider>
    )
}


export function useTienda(){
    const contexto = useContext(TiendaContext)

    if(!contexto){
        throw new Error('useTienda debe usarse dentro de TiendaProvider')

    }

    return contexto
}