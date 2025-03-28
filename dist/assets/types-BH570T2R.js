import{c as n,j as r,y as a}from"./index-BGeUDN-j.js";import{a as h,u as m}from"./client-DL1wx6u3.js";import{f as u,z as o}from"./index-CsrqoIsP.js";/**
 * @license lucide-react v0.482.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const d=[["path",{d:"M5 12h14",key:"1ays0h"}],["path",{d:"m12 5 7 7-7 7",key:"xquz4c"}]],N=n("ArrowRight",d);/**
 * @license lucide-react v0.482.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const y=[["path",{d:"M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49",key:"ct8e1f"}],["path",{d:"M14.084 14.158a3 3 0 0 1-4.242-4.242",key:"151rxh"}],["path",{d:"M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143",key:"13bj9a"}],["path",{d:"m2 2 20 20",key:"1ooewy"}]],j=n("EyeOff",y);/**
 * @license lucide-react v0.482.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const l=[["path",{d:"M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0",key:"1nclc0"}],["circle",{cx:"12",cy:"12",r:"3",key:"1v7zrd"}]],b=n("Eye",l);/**
 * @license lucide-react v0.482.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const g=[["rect",{width:"18",height:"11",x:"3",y:"11",rx:"2",ry:"2",key:"1w4ew1"}],["path",{d:"M7 11V7a5 5 0 0 1 10 0v4",key:"fwvmzm"}]],S=n("Lock",g),U=({children:t,title:e,subtitle:s})=>r.jsx("div",{className:"min-h-screen w-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-4",children:r.jsx("div",{className:"w-full max-w-md",children:r.jsxs("div",{className:"bg-white rounded-2xl shadow-xl p-8 space-y-6",children:[r.jsxs("div",{className:"text-center space-y-2",children:[e&&r.jsx("h1",{className:"text-2xl font-bold tracking-tight text-gray-900",children:e}),s&&r.jsx("p",{className:"text-sm text-gray-500",children:s})]}),t]})})});class p{constructor(e){this.http=e}async signUp(e){const s=await this.http.post("signup",e);if(s.status)return a.success(s.message),s.data;throw a.error(s.message),new Error(s.message)}async login(e){const s=await this.http.post("login",e);if(s.status)return a.success(s.message),s.data;throw a.error(s.message),new Error(s.message)}async verifyEmail(e){const s=await this.http.post("email-verify",{emailVerifyToken:e});if(s.status)return a.success(s.message),s.data;throw a.error(s.message),new Error(s.message)}async resendVerifyEmail(e){const s=await this.http.post("resend-verify-email",{userId:e});if(s.status){const i=s.data;return a.success(s.message),i}throw a.error(s.message),new Error(s.message)}async getUserDetailsByInviteHash(e){const s=await this.http.get(`invitation/${e}`);if(s.status)return s.data;throw new Error(s.message)}}const c=new p(h),w="GET_USER_INFO_BY_HASH",f=()=>u({mutationFn:t=>c.signUp(t)}),x=()=>u({mutationFn:t=>c.login(t)}),E=t=>m({queryKey:[w,t],queryFn:()=>c.getUserDetailsByInviteHash(t)}),A={useSignUp:f,useLogin:x,useGetUserByHash:E},M=o.object({username:o.string().email({message:"Invalid email address"}),password:o.string().min(6,{message:"Password must be at least 8 characters long"})});export{U as A,j as E,S as L,A as a,b,N as c,M as s};
