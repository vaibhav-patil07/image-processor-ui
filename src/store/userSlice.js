import { createSlice } from '@reduxjs/toolkit'


const initialState = {
  user_id : '',
  theme : 'light'
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
    setTheme : (state, action) => {
      state.theme = action.payload
      localStorage.setItem('theme', action.payload)
      return state
    }
  },
})
export const { setUserId, setTheme } = userSlice.actions
export default userSlice.reducer