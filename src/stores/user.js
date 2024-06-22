import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  userid:null,
  email:null,
  token:null,
  firstName:null,
  lastName:null,
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser:(state,action)=>{
      const userid=action.payload?.userid;
      const email=action.payload?.email;
      const token=action.payload?.token;
      state.userid=userid;
      state.email=email;
      state.token=token;
    },
    setUsername:(state,action)=>{
      const firstName=action.payload?.firstName;
      const lastName=action.payload?.lastName;
      state.firstName=firstName;
      state.lastName=lastName;
    },
    clearUserinfo:(state)=>{
      state.userid=null;
      state.email=null;
      state.token=null;
      state.firstName=null;
      state.lastName=null;
    }
  }
  ,
})

// Action creators are generated for each case reducer function
export const { setUser,setUsername,clearUserinfo } = userSlice.actions

export default userSlice.reducer