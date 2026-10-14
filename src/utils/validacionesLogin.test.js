
import { describe, it, expect } from 'vitest'

import {
    emailEsValido,
    evaluarReglasContraseña,
    contraseñaEsValida,
} from './validacionesLogin.js'

describe('emailEsValido', () => {
    it('acepta un correo válido', () => {
        expect(emailEsValido('alumno@duoc.cl')).toBe(true)
    })

    it('rechaza un correo sin arroba', () => {
        expect(emailEsValido('alumnoduoc.cl')).toBe(false)
    })

    it('rechaza un correo sin dominio', () => {
        expect(emailEsValido('alumno@')).toBe(false)
    })

    it('rechaza espacios dentro del correo', () => {
        expect(emailEsValido('alumno @duoc.cl')).toBe(false)
    })
})

describe('evaluarReglasContraseña', () => {
    it('identifica todas las reglas cumplidas', () => {
        expect(evaluarReglasContraseña('Clanky123!')).toEqual({
            length: true,
            mayuscula: true,
            minuscula: true,
            numero: true,
            especial: true,
        })
    })

    it('detecta una contraseña demasiado corta', () => {
        const resultado = evaluarReglasContraseña('Ab1!')

        expect(resultado.length).toBe(false)
        expect(resultado.mayuscula).toBe(true)
        expect(resultado.minuscula).toBe(true)
        expect(resultado.numero).toBe(true)
        expect(resultado.especial).toBe(true)
    })

    it('detecta la ausencia de mayúsculas', () => {
        expect(
            evaluarReglasContraseña('clanky123!').mayuscula,
        ).toBe(false)
    })

    it('detecta la ausencia de minúsculas', () => {
        expect(
            evaluarReglasContraseña('CLANKY123!').minuscula,
        ).toBe(false)
    })

    it('detecta la ausencia de números', () => {
        expect(
            evaluarReglasContraseña('ClankyTest!').numero,
        ).toBe(false)
    })

    it('detecta la ausencia de caracteres especiales', () => {
        expect(
            evaluarReglasContraseña('Clanky123').especial,
        ).toBe(false)
    })
})

describe('contraseñaEsValida', () => {
    it('acepta una contraseña que cumple todas las reglas', () => {
        expect(contraseñaEsValida('Clanky123!')).toBe(true)
    })

    it('rechaza una contraseña que no cumple todas las reglas', () => {
        expect(contraseñaEsValida('clanky123')).toBe(false)
    })

    it('rechaza una contraseña vacía', () => {
        expect(contraseñaEsValida('')).toBe(false)
    })
})
