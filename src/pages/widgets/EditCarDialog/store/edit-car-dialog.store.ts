import {createSlice, EntityId, isAnyOf, PayloadAction} from "@reduxjs/toolkit";
import {Car} from "../../../CarsList/widgets/CarsList/store/cars-list.store";
import {deleteCar, editCar, setEditCarDialogClose, setEditCarDialogOpenById} from "./edit-car-dialog.thunks";
import {confirmCloseEditCarDialog} from "../../EditCarConfirmationDialog/store/edit-car-confirmation-dialog.thunks";
import {isObjectEmpty} from "../../../../utils/isObjectEmpty";


type EditCarDialogStore = {
    loading: boolean,
    open: boolean,
    entityId: EntityId | null,
    initialState: Omit<Car, 'id'> | null,
    formData: Partial<Omit<Car, 'id'>> | null,
    error: string,
};

const initialState = (): EditCarDialogStore => ({
    loading: false,
    open: false,
    initialState: null,
    formData: null,
    entityId: null,
    error: '',
})

export const editCarDialogSlice = createSlice({
    name: 'edit-car-dialog',
    initialState: initialState(),
    reducers: {
        setFormData(state, action: PayloadAction<Partial<Omit<Car, 'id'>>>) {
            state.formData = isObjectEmpty(action.payload) ? null : action.payload;
        },
        networkErrorCleared(state) {
            state.error = '';
        }
    },
    extraReducers: (builder) => {
        /**
         * Set loading to true for the UI/UX representation of loading state
         */
        builder.addCase(setEditCarDialogOpenById.pending, (state, action) => {
            state.open = true;
            state.loading = true;
            state.entityId = action.meta.arg.id
        })
        /**
         * Set loading to false in case of successful state loading from server/store
         */
        builder.addCase(setEditCarDialogOpenById.fulfilled, (state, action: PayloadAction<Car>) => {
            state.loading = false;
            const {id, ...car} = action.payload;
            state.initialState = car;
        })
        builder.addMatcher(
            isAnyOf(
                editCar.fulfilled,
                deleteCar.fulfilled,
                setEditCarDialogClose.fulfilled,
                confirmCloseEditCarDialog.fulfilled
            ),
            () => {
                return initialState();
            })
        builder.addMatcher(isAnyOf(editCar.pending, deleteCar.pending), (state) => {
            state.loading = true
        })
        /**
         * Process the network or server errors
         * The error message could be used to show the proper snackbar
         */
        builder.addMatcher(
            isAnyOf(editCar.rejected, deleteCar.rejected),
            (state, action) => {
                if (action.meta.condition) {
                    return initialState()
                }
                const payload = action.payload as { message: string }
                state.loading = false
                state.error = payload.message
            })
    }
})

export const {
    setFormData: setEditCarDialogFormData,
    networkErrorCleared: editCarDialogNetworkErrorCleared
} = editCarDialogSlice.actions;

