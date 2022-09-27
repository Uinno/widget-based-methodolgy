import {createAsyncThunk, EntityId} from "@reduxjs/toolkit";
import {Car} from "../../../../CarsList/widgets/CarsList/store/cars-list.store";

export const fetchCarById = createAsyncThunk(
    'car-details/fetchCar',
    async (arg: {id: EntityId}, thunkAPI) => {
        const {id} = arg;
        const response = await fetch(`http://localhost:3000/cars/${id}`);

        if (!response.ok) {
            return thunkAPI.rejectWithValue(response.statusText)
        }

        return (await response.json()) as Car;
    }
)

