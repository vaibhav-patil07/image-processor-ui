import { createSlice } from '@reduxjs/toolkit'


const initialState = {
  user_id : ''
}
const userSlice = createSlice({
  name : 'user',
  initialState,
  reducers : {
    setUserId : (state, action) => {
      state.user_id = action.payload
      localStorage.setItem('user', JSON.stringify(state))
      return state
    },
  },
})
export const { setUserId } = userSlice.actions
export default userSlice.reducer