import {describe, test, expect, mock} from "bun:test"
import {render, waitFor} from "@testing-library/react"
import { MemoryRouter } from "react-router-dom"
import axios from "axios"
import { EtelKereses } from "../src/pages/Etel-kereses"
mock.module("axios", () =>({
    default: {
        get : mock()
    }
}))
describe("EtelKereses", () =>{
    test("betölti és megjeleníti a sakkozókat", async () =>{
        axios.get.mockResolvedValueOnce({
            data: [
                {
                    food_id: 2,
                    name: "Vegetable soup",
                    category_id: 1,
                    calories_per_100g: 25,
                    protein_per_100g: 1.50,
                    carbs_per_100g: 3.50,
                    fat_per_100g: 0.50
                }
            ]
        })
        const {getByText} = render( 
            <MemoryRouter>
                <EtelKereses />
            </MemoryRouter>
        )
        await waitFor(() =>{
            expect(getByText(/Vegetable soup/i)).toBeInTheDocument()
        })
    })
})