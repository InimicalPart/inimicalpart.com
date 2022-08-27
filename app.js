var path = require("path");
let chalk = require("chalk");
const express = require("express");
const mainWebsite = express();
const app = express();

mainWebsite.use(express.urlencoded({ extended: true }));
mainWebsite.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
mainWebsite.use(express.static(require("path").join(__dirname, "build")));
mainWebsite.use(
  "/img",
  express.static(require("path").join(__dirname, "build/img"))
);
function getActivity(t) {
  let e = require("quick.db").fetch(`presence_${t}`);
  if (!e) return null;
  try {
    e = JSON.parse(e);
  } catch (t) {}
  let a = null;
  "custom" == e.game?.id &&
    ((a = { type: 4, name: e.game.name, state: e.game.state }),
    e.game.emoji && (a.emoji = e.game.emoji)),
    e.activities &&
      e.activities.sort((t, e) =>
        4 == t.type ? -1 : 4 == e.type ? 1 : t.type - e.type
      ),
    (e.game = e.activities[0]);
  let s = (function (t) {
      try {
        t = JSON.parse(t);
      } catch (t) {}
      let e = t.game;
      "custom" === e.id && "Custom Status" === e.name && (e = t.activities[1]);
      if (!e.id.startsWith("spotify:") && "Spotify" !== e.name) return null;
      let a = e.state,
        s = e.details,
        i = e.assets.large_image,
        n = e.timestamps?.start,
        r = e.timestamps?.end,
        l = r - n,
        m = l - (Date.now() - n),
        p = l - m;
      return m <= 0
        ? null
        : {
            song: {
              start: "00:00",
              current:
                c(Math.floor((p / 1e3 / 60) << 0), 2) +
                ":" +
                c(Math.floor((p / 1e3) % 60), 2),
              end:
                c(Math.floor((l / 1e3 / 60) << 0), 2) +
                ":" +
                c(Math.floor((l / 1e3) % 60), 2),
              name: s,
              author: a,
              image: i.replace("spotify:", "https://i.scdn.co/image/"),
              startTimestamp: n,
              endTimestamp: r,
            },
          };
      function c(t, e) {
        let a = t + "";
        for (; a.length < e; ) a = "0" + a;
        return a;
      }
    })(e),
    i = (function (t) {
      if ("custom" === t?.game?.id) return t.activities[1] || null;
      return t.game || null;
    })(e);
  return {
    user: {
      username: e.user.username,
      discriminator: e.user.discriminator,
      image: `https://cdn.discordapp.com/avatars/${e.user.id}/${e.user.avatar}.png`,
      id: t,
    },
    custom_status: a,
    client_status: e.client_status,
    status: e.status,
    activity: {
      activity_data: {
        type: i.type,
        name: i.name,
        state: i.state,
        details: i.details,
        id: i.id,
        timestamps: {
          start: i.timestamps.start || null,
          end: i.timestamps.end || null,
        },
        assets: {
          small_text: i.assets.small_text || null,
          small_image: `https://cdn.discordapp.com/app-assets/${i.application_id}/${i.assets.small_image}.png`,
          large_text: i.assets.large_text || null,
          large_image: `https://cdn.discordapp.com/app-assets/${i.application_id}/${i.assets.large_image}.png`,
        },
        application_id: i.application_id,
      },
      external_data: s,
    },
    lastUpdated: e.lastUpdated,
  };
}
const http = require("http");
let db = require("quick.db");
//require socket.io
const server = http.createServer((req, res) => {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "OPTIONS, POST, GET",
    "Access-Control-Max-Age": 2592000, // 30 days
    /** add other headers as per requirement */
  };

  if (req.method === "GET") {
    //write headers to response
    res.writeHead(200, headers);
  }
});
// const herokuServerServer = http.createServer((req, res) => {
//   const headers = {
//     "Access-Control-Allow-Origin": "*",
//     "Access-Control-Allow-Methods": "OPTIONS, POST, GET",
//     "Access-Control-Max-Age": 2592000, // 30 days
//     /** add other headers as per requirement */
//   };

//   if (req.method === "GET") {
//     //write headers to response
//     res.writeHead(200, headers);
//   }
// });
let allUsers = {};
let inviteUsers = {};
let lastUpdateTime = new Date().getTime();
const { Server } = require("socket.io");

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: false,
  },
}); //, { pingTimeout: 180000, pingInterval: 25000 });

/* prettier-ignore */
// io.on("connection",(e=>{async function t(t){const r=require("firebase-admin"),s=require("./authworria-firebase-adminsdk-fc35t-29a90dc0ca.json");r.apps.length||r.initializeApp({credential:r.credential.cert(s)}),await r.auth().verifyIdToken(t).then((async t=>{for(let s of Object.keys(allUsers))allUsers[s]?.uid==t.uid&&(allUsers[s]?.name!=t.name?(e.broadcast.emit("usrInfoChange",{uid:t.uid,name:t.name}),await r.firestore().collection("users").doc(t.uid).update({name:t.name,username:null}).then((()=>{console.log("User updated")})).catch((e=>{console.log(e)})),allUsers[s].name=t.name):allUsers[s]?.picture!=t.picture&&(e.broadcast.emit("usrInfoChange",{uid:t.uid,picture:t.picture}),await r.firestore().collection("users").doc(t.uid).update({picture:t.picture,username:null}).then((()=>{console.log("User updated")})).catch((e=>{console.log(e)})),allUsers[s].picture=t.picture))})).catch((e=>"err"))}async function r(e,t,r){let s=Object.keys(allUsers).filter((t=>allUsers[t].uid==e));for(let e of s)io.to(e).emit(t,r)}async function s(e,t=!0){const r=require("firebase-admin"),s=require("./authworria-firebase-adminsdk-fc35t-29a90dc0ca.json");let a;return r.apps.length||await r.initializeApp({credential:r.credential.cert(s)}),(await r.firestore().collection("servers").get()).forEach((async s=>{if(s.data()?.serverSettings?.vanityCode===e&&""!==s.data()?.serverSettings?.vanityCode&&s.data()?.serverSettings?.vanityCode)return a=s.data().id;if(s.data()?.invites)for(let i of s.data().invites){if("nvr"==i[e]?.exp)return a=s.data().id;if(i[e]?.exp>Date.now())return a=s.data().id;if(t){let t=await r.firestore().collection("servers").doc(s.data().id).get();t=t.data().invites,t.splice(t.indexOf(e),1),await r.firestore().collection("servers").doc(s.data().id).update({invites:t})}return a="code_exp "+s.data().id}return a=null})),a}async function a(){const e=require("firebase-admin"),t=require("./authworria-firebase-adminsdk-fc35t-29a90dc0ca.json");e.apps.length||await e.initializeApp({credential:e.credential.cert(t)});let r="",s=!1;for(;!s;)r=Math.random().toString(36).substring(2,10)+"-"+Math.random().toString(36).substring(2,6),s=await e.firestore().collection("users").where("friendCode","==",r).get().then((e=>!!e.empty));return r}function i(e,t){return["online","idle","dnd"].includes(e)?t:""}function n(e){for(var t="",r="0123456789",s=r.length,a=0;a<e;a++)t+=r.charAt(Math.floor(Math.random()*s));return t}async function o(t,r=!1){let s=await l(t);if(r)for(let t of s)if(t===e.id){s.splice(t,1);break}return s.length>0}async function l(e){return Object.keys(allUsers).filter((t=>allUsers[t].uid==e))}function d(e){switch(e){case"online":return"/webchat-imgs/status_online.svg";case"dnd":return"/webchat-imgs/status_dnd.svg";case"invisible":case"offline":return"/webchat-imgs/status_offline.svg";case"idle":return"/webchat-imgs/status_idle.svg";default:return"err"}}async function c(e){return e}async function u(e,t){let r=!1;return await firebaseadmin.firestore().collection("servers").doc(t).get().then((t=>{t.data().owner===e&&(r=!0)})).catch((e=>{console.log(e)})),r}async function f(e,t){const r=require("firebase-admin"),s=require("./authworria-firebase-adminsdk-fc35t-29a90dc0ca.json");r.apps.length||await r.initializeApp({credential:r.credential.cert(s)});let a=[];return await r.firestore().collection("servers").doc(t).get().then((t=>{if(!t.exists)return;let r=t.data();if(r.members[e])for(let t of r.members[e].roles){let e=r.roles[t].permissions;for(let t of e)a.includes(t)||a.push(t)}})).catch((e=>{console.log(e)})),a}e.on("lastUpdate",(async()=>{e.emit("lastUpdateRes",{lastUpdateTime:lastUpdateTime})})),e.on("confirmIdent",(async t=>{if(!t?.token)return e.emit("confirmIdentRes",{err:"No token"});const r=require("firebase-admin"),s=require("./authworria-firebase-adminsdk-fc35t-29a90dc0ca.json");r.apps.length||await r.initializeApp({credential:r.credential.cert(s)}),await r.auth().verifyIdToken(t.token).then((async t=>{console.log(chalk.hex("#9b59b6")("[CONFIRMIDENT] ")+chalk.cyan.bold(e.id)+" identifies themselves as "+chalk.white.bold(t.name)),inviteUsers[e.id]=t})),e.emit("confirmIdentRes",{success:!0})})),e.on("goodbye",(async t=>{if(console.log(chalk.bold.yellow("[GOODBYE] ")+chalk.bold.cyan(e.id)),t?.sendBack)return e.emit("goodbye",{result:"goodbye "+e.id,sendBack:t.sendBack});e.emit("goodbye",{result:"goodbye "+e.id})})),e.on("hello",(async t=>{if(console.log(chalk.bold.yellow("[HELLO] ")+chalk.bold.cyan(e.id)),t?.sendBack)return e.emit("hello",{result:"hello "+e.id,sendBack:t.sendBack});e.emit("hello",{result:"hello "+e.id})})),e.on("confirmInvite",(async t=>t?.token?inviteUsers[e.id]?void 0:e.emit("confirmInviteRes",{err:"You don't have the required permissions"}):e.emit("confirmInviteRes",{err:"No token"}))),e.on("getCodeInfo",(async t=>{try{let r=t.code;if(!r)return e.emit("getCodeInfoRes",{err:"No code"});if(!inviteUsers[e.id]&&!allUsers[e.id])return e.emit("getCodeInfoRes",{err:"Not Identified"});console.log(chalk.bold.hex("#9b59b6")("[GETCODEINFO] ")+chalk.cyan.bold(e.id)+" is requesting server info for code: "+chalk.white.bold(r));const a=require("firebase-admin"),i=require("./authworria-firebase-adminsdk-fc35t-29a90dc0ca.json");a.apps.length||await a.initializeApp({credential:a.credential.cert(i)});let n=await s(r);if(!n)return e.emit("getCodeInfoRes",{err:"Invalid code"});if("code_exp"===n.split(" ")[0])return e.emit("getCodeInfoRes",{err:"Code expired"});let o=await a.firestore().collection("servers").doc(n).get();if(o=o.data(),!o)return e.emit("getCodeInfoRes",{err:"Invalid code"});let l={name:o.name,id:o.id,owner:o.owner,serverPicture:o.serverPicture,serverBanner:o.serverBanner,description:o.description,memberCount:o.members.length,maxMembers:o.serverSettings.maxUsers,limitHit:o.members.length>=o.serverSettings.maxUsers};return e.emit("getCodeInfoRes",{serverData:l})}catch(t){return console.log(t),e.emit("getCodeRes",{err:t})}})),e.on("changeStatus",(async s=>{if(!s?.token)return e.emit("changeStatusRes",{err:"No token"});try{await t(s?.token)}catch(t){return e.emit("changeStatusRes",{err:"Invalid Token"})}if(!allUsers[e.id])return e.emit("changeStatusRes",{err:"Not logged in"});let a=e.id,i=s.status;if(!allUsers[a])return e.emit("changeStatusRes",{err:"Not logged in"});let n=s.customStatus||"",o=null,l=s.storeindb||!0;i&&(["online","dnd","idle","invisible"].includes(i)?i==allUsers[a]?.status?e.emit("changeStatusRes",{err:"Status already set to "+i}):(allUsers[a].status=i,l&&db.set(`users.${allUsers[e.id]?.uid}.status`,i),s.imgloc="/webchat-imgs/",o="online"==allUsers[e.id]?.status?path.join(s.imgloc+"/status_online.svg"):"dnd"==allUsers[e.id]?.status?path.join(s.imgloc+"/status_dnd.svg"):"idle"==allUsers[e.id]?.status?path.join(s.imgloc+"/status_idle.svg"):path.join(s.imgloc+"/status_offline.svg")):e.emit("changeStatusRes",{error:"Invalid status"}));const d=require("firebase-admin"),c=require("./authworria-firebase-adminsdk-fc35t-29a90dc0ca.json");d.apps.length||d.initializeApp({credential:d.credential.cert(c)}),n&&(n.length>128&&(n=n.substring(0,128)),allUsers[a].statusText=n,l&&db.set(`users.${allUsers[e.id]?.uid}.statusText`,n)),"offline"!==i&&await d.firestore().collection("users").doc(allUsers[a]?.uid).get().then((async t=>{e.broadcast.emit("usrChangeInfo",{uid:allUsers[e.id]?.uid,username:allUsers[e.id]?.name,friendCode:t.data().friendCode,avatar:allUsers[e.id]?.picture,aboutMe:t.data().aboutMe,banner:t.data().banner,badges:t.data().badges,status:i||allUsers[e.id]?.status,statusText:"invisible"!==i?n||allUsers[e.id]?.statusText:"",statusImg:o})})),r(allUsers[e.id]?.uid,"changeStatusRes",{success:!0,status:i||allUsers[e.id]?.status,statusText:n||allUsers[e.id]?.statusText,statusImg:o}),console.log(chalk.blue("[CHANGESTATUS]"),chalk.bold.cyan(e.id)+" ("+chalk.white.bold(allUsers[e.id]?.name)+")","changed status to "+chalk.bold.white(i||"<no new status>")+" with text: "+chalk.bold.white(n||"<no text>"))})),e.on("getStatus",(async r=>{if(!r?.token)return e.emit("getStatusRes",{err:"No token"});try{await t(r?.token)}catch(t){return e.emit("getStatusRes",{err:"Invalid Token"})}if(!allUsers[e.id])return e.emit("getStatusRes",{err:"Not logged in"});let s=r?.uid||allUsers[e.id]?.uid;if(!s)return e.emit("getStatusRes",{err:"Not logged in"});if(!r?.imgloc)return e.emit("getStatusRes",{err:"No image base location provided"});console.log(chalk.yellow("[GETSTATUS]"),chalk.bold.cyan(e.id)+" ("+chalk.bold.white(allUsers[e.id].name)+") is requesting getStatus for",s==allUsers[e.id]?.uid?"themselves":"uid "+chalk.blue.bold(s));for(let t of Object.keys(allUsers))if(allUsers[t]?.uid==s){let a=null;return a="online"==allUsers[t]?.status?path.join(r.imgloc+"/status_online.svg"):"dnd"==allUsers[t]?.status?path.join(r.imgloc+"/status_dnd.svg"):"idle"==allUsers[t]?.status?path.join(r.imgloc+"/status_idle.svg"):path.join(r.imgloc+"/status_offline.svg"),allUsers[t]!==allUsers[e.id]?e.emit("getStatusRes",{uid:s,status:"invisible"==allUsers[t].status?"offline":allUsers[t].status,statusText:"invisible"==allUsers[t].status||"offline"==allUsers[t].status?"":allUsers[t].statusText,success:!0,statusImg:a}):e.emit("getStatusRes",{uid:s,status:allUsers[e.id].status,statusText:allUsers[e.id].statusText,success:!0,statusImg:a})}return e.emit("getStatusRes",{uid:s,status:"offline",success:!0,statusImg:path.join(r.imgloc+"/status_offline.svg")})})),e.on("settingIdent",(async t=>{if(!t?.token)return e.emit("settingIdentRes",{err:"No token"});const r=require("firebase-admin"),s=require("./authworria-firebase-adminsdk-fc35t-29a90dc0ca.json");r.apps.length||r.initializeApp({credential:r.credential.cert(s)}),await r.auth().verifyIdToken(t?.token).then((async t=>{allUsers[e.id]=t})).catch((t=>(console.log(t),"auth/id-token-expired"==t.errorInfo.code?e.emit("settingIdentRes",{err:"Token expired"}):e.emit("settingIdentRes",{err:"Invalid token"}))))})),e.on("getKnown",(async t=>{if(!t?.token)return e.emit("getKnownRes",{err:"No token"});const r=require("firebase-admin"),s=require("./authworria-firebase-adminsdk-fc35t-29a90dc0ca.json");r.apps.length||await r.initializeApp({credential:r.credential.cert(s)}),await r.auth().verifyIdToken(t?.token).then((async t=>{await r.firestore().collection("users").doc(t.uid).get().then((r=>{let s=r.data().knownUsers;return s?e.emit("getKnownRes",{knownUsers:s,uid:t.uid}):e.emit("getKnownRes",{knownUsers:[],uid:t.uid})})).catch((t=>e.emit("getKnownRes",{err:t})))})).catch((t=>e.emit("getKnownRes",{err:"Invalid token"})))})),e.on("addFriend",(async r=>{if(!r?.token)return e.emit("addFriendRes",{err:"No token"});try{await t(r?.token)}catch(t){return e.emit("addFriendRes",{err:"Invalid Token"})}if(!allUsers[e.id])return e.emit("addFriendRes",{err:"Not logged in"});if(!r?.friendCode)return e.emit("addFriendRes",{err:"No friend code"});const s=require("firebase-admin"),a=require("./authworria-firebase-adminsdk-fc35t-29a90dc0ca.json");s.apps.length||await s.initializeApp({credential:s.credential.cert(a)}),await s.auth().verifyIdToken(r?.token).then((async t=>{await s.firestore().collection("users").where("friendCode","==",r?.friendCode).get().then((async r=>{if(r.empty)return e.emit("addFriendRes",{err:"No user with that friend code"});let a;r.forEach((e=>{a=e.data().uid})),await s.firestore().collection("users").doc(t.uid).update({knownUsers:s.firestore.FieldValue.arrayUnion(a)}).then((()=>e.emit("addFriendRes",{targetUid:a,uid:t.uid}))).catch((t=>e.emit("addFriendRes",{err:t})))})).catch((t=>(console.log(t),e.emit("addFriendRes",{err:"Invalid token"}))))}))})),e.on("removeFriend",(async r=>{if(!r?.token)return e.emit("removeFriendRes",{err:"No token"});try{await t(r?.token)}catch(t){return e.emit("removeFriendRes",{err:"Invalid Token"})}if(!allUsers[e.id])return e.emit("removeFriendRes",{err:"Not logged in"});if(!r?.friendUid)return e.emit("removeFriendRes",{err:"No UID"});const s=require("firebase-admin"),a=require("./authworria-firebase-adminsdk-fc35t-29a90dc0ca.json");s.apps.length||await s.initializeApp({credential:s.credential.cert(a)}),await s.auth().verifyIdToken(r?.token).then((async t=>{await s.firestore().collection("users").doc(t.uid).update({knownUsers:s.firestore.FieldValue.arrayRemove(r?.friendUid)}).then((()=>e.emit("removeFriendRes",{success:!0,uid:t.uid}))).catch((t=>e.emit("removeFriendRes",{err:t})))})).catch((t=>e.emit("removeFriendRes",{err:"Invalid token"})))})),e.on("getInfo",(async r=>{if(!r?.token)return e.emit("getInfoRes",{err:"No token"});try{await t(r?.token)}catch(t){return e.emit("getInfoRes",{err:"Invalid Token"})}if(!allUsers[e.id])return e.emit("getInfoRes",{err:"Not logged in"});if(!r?.uid)return e.emit("getInfoRes",{err:"No uid"});console.log(chalk.green("[GETINFO]"),chalk.bold.cyan(e.id)+" ("+chalk.white.bold(allUsers[e.id].name)+")","requests getInfo on uid",chalk.blue.bold(r?.uid));const s=require("firebase-admin"),a=require("./authworria-firebase-adminsdk-fc35t-29a90dc0ca.json");s.apps.length||await s.initializeApp({credential:s.credential.cert(a)});let n=null,c=null;await o(r?.uid)?(firstConnected=await l(r?.uid),c=allUsers[firstConnected[0]].status||await db.get(`users.${r?.uid}.status`)||"offline",n=allUsers[firstConnected[0]].statusText||await db.get(`users.${r?.uid}.statusText`)||""):(c="offline",n=""),await s.firestore().collection("users").doc(r?.uid).get().then((async t=>e.emit("getInfoRes",{uid:r?.uid,name:t.data()?.name,statusIcon:d(c),status:i(c,n),avatar:t.data().picture||"",aboutMe:t.data().aboutMe||"",friendCode:t.data().friendCode||"fcode-undefined",banner:t.data().banner||"",badges:t.data().badges||[]}))).catch((t=>(console.log("err",t),e.emit("getInfoRes",{err:t}))))})),e.on("getChannels",(async e=>{})),e.on("removeChannel",(async e=>{})),e.on("createChannel",(async e=>{})),console.log(chalk.cyan("[CONNECT]"),"User with socket ID "+chalk.bold.cyan(e.id)+" connected."),e.on("disconnect",(async t=>{if(inviteUsers[e.id])return delete inviteUsers[e.id],console.log(chalk.redBright("[DISCONNECT]"),"Invite user ("+chalk.bold.cyan(e.id)+") disconnected. Reason: "+chalk.bold.red(t.toUpperCase()));if(!allUsers[e.id]&&!inviteUsers[e.id])return console.log(chalk.redBright("[DISCONNECT]"),"Unknown user ("+chalk.bold.cyan(e.id)+") disconnected. Reason: "+chalk.bold.red(t.toUpperCase()));console.log(chalk.redBright("[DISCONNECT]"),"User with ID "+chalk.bold.cyan(e.id)+" ("+chalk.bold.white(allUsers[e.id]?.name||"!!broken!!")+") disconnected. Reason: "+chalk.bold.red(t.toUpperCase()));let r=e.id,s="offline";if(s!==allUsers[r]?.status&&"invisible"!==allUsers[r]?.status&&!await o(allUsers[r]?.uid,!0)){console.log(chalk.red("[DISCONNECT-CHANGESTATUS]"),chalk.bold.cyan(e.id)+" ("+chalk.white.bold(allUsers[e.id]?.name)+")","changed status to "+chalk.bold.white(s));const t=require("firebase-admin"),a=require("./authworria-firebase-adminsdk-fc35t-29a90dc0ca.json");return t.apps.length||await t.initializeApp({credential:t.credential.cert(a)}),await t.firestore().collection("users").doc(allUsers[r]?.uid).get().then((t=>{e.broadcast.emit("usrChangeInfo",{uid:allUsers[e.id]?.uid,username:allUsers[e.id]?.name,friendCode:t.data().friendCode,email:allUsers[e.id]?.email,avatar:allUsers[e.id]?.picture,aboutMe:t.data().aboutMe,banner:t.data().banner,badges:t.data().badges,status:"offline",statusText:"",statusImg:"/webchat-imgs/status_offline.svg"})})),void(e.id in allUsers&&delete allUsers[e.id])}})),e.on("sendMessage",(async r=>{if(!r?.token)return e.emit("sendMessageRes",{err:"No token",elementcode:r.elementcode});try{await t(r?.token)}catch(t){return e.emit("sendMessageRes",{err:"Invalid Token",elementcode:r.elementcode})}if(!allUsers[e.id])return e.emit("sendMessageRes",{err:"Not logged in",elementcode:r.elementcode});if(!r.server)return e.emit("sendMessageRes",{err:"No server",elementcode:r.elementcode});if(!r.channel)return e.emit("sendMessageRes",{err:"No channel",elementcode:r.elementcode});if(!r.message)return e.emit("sendMessageRes",{err:"Message is empty",elementcode:r.elementcode});if(r.message.length>2e3)return e.emit("sendMessageRes",{err:"over 2000 characters",elementcode:r.elementcode});const s=require("firebase-admin"),a=require("./authworria-firebase-adminsdk-fc35t-29a90dc0ca.json");s.apps.length||await s.initializeApp({credential:s.credential.cert(a)});let i=await async function(){const e=require("firebase-admin"),t=require("./authworria-firebase-adminsdk-fc35t-29a90dc0ca.json");e.apps.length||await e.initializeApp({credential:e.credential.cert(t)});let r=null,s=!1;for(;!s;)r=n(16),s=await e.firestore().collection("messages").where("messageID","==",r).get().then((e=>!!e.empty));return r}(),o=allUsers[e.id],l=await s.firestore().collection("servers").doc(r.server).get();if(!l.exists)return e.emit("sendMessageRes",{err:"Server not found",elementcode:r.elementcode});let d=l.data()?.channels,c=!1;for(let e of Object.keys(d))if(e==r.channel){c=!0;break}if(!c)return e.emit("sendMessageRes",{err:"Channel not found",elementcode:r.elementcode});let u=(new Date).getTime();if(!(await s.firestore().collection("messages").doc(r.server).get()).exists){await s.firestore().collection("messages").doc(r.server).set({channels:{}});for(let e in Object.keys(l.data().channels))await s.firestore().collection("messages").doc(r.server).update({channels:{[e]:{messages:[]}}})}await s.firestore().collection("messages").doc(r.server).update({["channels."+r.channel+".messages"]:s.firestore.FieldValue.arrayUnion({message:r.message,author:o?.uid,time:u})}).then((()=>{e.broadcast.emit("receiveMessage",{message:r.message,messageID:i,sender:o?.name,senderUID:o?.uid,senderImg:o?.picture,time:u}),e.emit("sendMessageRes",{success:!0,message:r.message,messageID:i,sender:o?.name,senderUID:o?.uid,senderImg:o?.picture,time:u,elementcode:r.elementcode})})).catch((t=>{console.log(t),e.emit("sendMessageRes",{err:"Error server side.",elementcode:r.elementcode})}))})),e.on("userIdent",(async t=>{if(e.id in allUsers)return e.emit("userIdentRes",{err:"User already exists"});if(!t.token)return e.emit("userIdentRes",{err:"No token"});const r=require("firebase-admin"),s=require("./authworria-firebase-adminsdk-fc35t-29a90dc0ca.json");r.apps.length||await r.initializeApp({credential:r.credential.cert(s)}),await r.auth().verifyIdToken(t.token).then((async t=>{allUsers[e.id]=t,await r.firestore().collection("users").doc(t.uid).get().then((async e=>{if(e.exists){let s=e.data();void 0===e.data().userSettings&&await r.firestore().collection("users").doc(t.uid).update({userSettings:{allowDMsFrom:"everyone"}}),void 0===e.data().servers&&await r.firestore().collection("users").doc(t.uid).update({servers:[]}),s.name!=t.name&&await r.firestore().collection("users").doc(t.uid).update({name:t.name}),s.picture!=t.picture&&await r.firestore().collection("users").doc(t.uid).update({picture:t.picture}),s.username!=t.username&&await r.firestore().collection("users").doc(t.uid).update({username:t.username}),e?.data()?.friendCode||await r.firestore().collection("users").doc(t.uid).update({friendCode:await a()})}else await r.firestore().collection("users").doc(t.uid).set({uid:t.uid,username:null,name:t.name,picture:t.picture,knownUsers:[],friendCode:await a(),aboutMe:null,badges:[],banner:null})})).catch((e=>{console.log(e)}))})).catch((t=>(console.log(t),"auth/id-token-expired"==t.errorInfo.code?e.emit("userIdentRes",{err:"Token expired"}):e.emit("userIdentRes",{err:"Invalid token"}))));let i=await db.get(`users.${allUsers[e.id]?.uid}.status`),n=await db.get(`users.${allUsers[e.id]?.uid}.statusText`);allUsers[e.id].status=i||"online",allUsers[e.id].statusText=n||"";let o=null,l="/webchat-imgs/";o="online"==allUsers[e.id]?.status?path.join(l+"/status_online.svg"):"dnd"==allUsers[e.id]?.status?path.join(l+"/status_dnd.svg"):"idle"==allUsers[e.id]?.status?path.join(l+"/status_idle.svg"):path.join(l+"/status_offline.svg"),"invisible"!==allUsers[e.id]?.status&&"offline"!==allUsers[e.id]?.status&&await r.firestore().collection("users").doc(allUsers[e.id].uid).get().then((async t=>{e.broadcast.emit("usrChangeInfo",{uid:allUsers[e.id]?.uid,username:allUsers[e.id]?.name,friendCode:t.data().friendCode||"fCode-undefined",avatar:allUsers[e.id]?.picture,aboutMe:t.data().aboutMe||"",banner:t.data().banner||"",badges:t.data().badges||[],status:allUsers[e.id]?.status,statusText:allUsers[e.id]?.statusText||db.get(`users.${allUsers[e.id]?.uid}.statusText`)||"",statusImg:o})})),console.log(chalk.rgb(255,165,0)("[USERIDENT]"),chalk.bold.cyan(e.id),'identifies themselves as user "'+chalk.white.bold(allUsers[e.id].name)+'"'),await r.firestore().collection("users").doc(allUsers[e.id].uid).get().then((async t=>e.emit("userIdentRes",{success:!0,user:{uid:allUsers[e.id]?.uid,username:allUsers[e.id]?.name,friendCode:t.data().friendCode,email:allUsers[e.id]?.email,avatar:allUsers[e.id]?.picture,status:allUsers[e.id]?.status,statusText:allUsers[e.id]?.statusText,aboutMe:t.data().aboutMe,banner:t.data().banner,badges:t.data().badges,statusImg:o}}))).catch((e=>{console.log(e)}))})),e.on("getInfoProf",(async r=>{if(!r?.token)return e.emit("getInfoProfRes",{err:"No token"});try{await t(r?.token)}catch(t){return e.emit("getInfoProfRes",{err:"Invalid Token"})}if(!allUsers[e.id])return e.emit("getInfoProfRes",{err:"Not logged in"});const s=require("firebase-admin"),a=require("./authworria-firebase-adminsdk-fc35t-29a90dc0ca.json");s.apps.length||await s.initializeApp({credential:s.credential.cert(a)}),await s.firestore().collection("users").doc(r.uid).get().then((async t=>{if(t.exists){console.log(chalk.rgb(255,165,0)("[GETINFO-PROFILE]"),chalk.bold.cyan(e.id)+" ("+chalk.white.bold(allUsers[e.id].name)+") gets profile info of uid "+chalk.bold.cyan(r.uid));let s=null,a=null;return await o(r?.uid)?(firstConnected=await l(r?.uid),a=allUsers[firstConnected[0]].status||await db.get(`users.${r?.uid}.status`)||"offline",s=allUsers[firstConnected[0]].statusText||await db.get(`users.${r?.uid}.statusText`)||""):(a="offline",s=""),e.emit("getInfoProfRes",{uid:r?.uid,name:t.data()?.name,statusIcon:d(a),status:i(a,s),avatar:t.data().picture||"",aboutMe:t.data().aboutMe||"",friendCode:t.data().friendCode||"fcode-undefined",banner:t.data().banner||"",badges:t.data().badges||[]})}return e.emit("getInfoProfRes",{err:"User not found"})})).catch((t=>(console.log(t),e.emit("getInfoProfRes",{err:"User not found"}))))})),e.on("changeServerImage",(async r=>{if(!r?.token)return e.emit("changeServerImageRes",{err:"No token"});try{await t(r?.token)}catch(t){return e.emit("changeServerImageRes",{err:"Invalid Token"})}if(!allUsers[e.id])return e.emit("changeServerImageRes",{err:"Not logged in"});const s=require("firebase-admin"),a=require("./authworria-firebase-adminsdk-fc35t-29a90dc0ca.json");s.apps.length||await s.initializeApp({credential:s.credential.cert(a)});let i=await s.firestore().collection("servers").doc(r.server).get();if(!i.exists)return e.emit("changeServerImageRes",{err:"Server not found"});if(!(await f(allUsers[e.id].uid,r.server)).includes("MANAGE_SERVER")&&allUsers[e.id].uid!==i.data().owner)return e.emit("changeServerImageRes",{err:"Not allowed"});let n=Buffer.from(r.image),o="/tmp/"+r.server.replace("-","")+"_"+(new Date).getTime()+".png";require("fs").writeFileSync(o,n),require("imgur").uploadFile(o).then((async t=>{console.log(chalk.rgb(255,165,0)("[CHANGE-SERVER-IMAGE]"),chalk.bold.cyan(e.id)+' changes the server image of "'+chalk.white.bold(r.server)+'" to "'+t.link+'"');let a=r.server,i=t.link;await s.firestore().collection("servers").doc(a).update({serverPicture:i,defaultPicture:!1}).catch((e=>{console.log(e)})),e.emit("changeServerImageRes",{success:!0,server:r.server,img:i}),require("fs").unlinkSync(o)}))})),e.on("getMessages",(async r=>{if(!r?.token)return e.emit("getMessagesRes",{err:"No token"});try{await t(r?.token)}catch(t){return e.emit("getMessagesRes",{err:"Invalid Token"})}if(!allUsers[e.id])return e.emit("getMessagesRes",{err:"Not logged in"});if(!r.channel)return e.emit("getMessagesRes",{err:"No channel"});if(!r.server)return e.emit("getMessagesRes",{err:"No server"});const s=require("firebase-admin"),a=require("./authworria-firebase-adminsdk-fc35t-29a90dc0ca.json");s.apps.length||await s.initializeApp({credential:s.credential.cert(a)}),console.log(chalk.rgb(255,165,0)("[GETMESSAGES]"),chalk.bold.cyan(e.id)+" ("+chalk.white.bold(allUsers[e.id].name)+") gets messages of channel '"+chalk.bold.white(r.channel)+"' in server '"+chalk.bold.white(r.server)+"'"),await s.firestore().collection("messages").doc(r.server).get().then((async t=>{if(!t.exists){await s.firestore().collection("messages").doc(r.server).set({channels:{}});let e=await s.firestore().collection("servers").doc(r.server).get();for(let t of Object.keys(e.data().channels))await s.firestore().collection("messages").doc(r.server).update({channels:{[t]:{messages:[]}}});t=await s.firestore().collection("messages").doc(r.server).get()}let a=t.data()?.channels;if(a||(await s.firestore().collection("messages").doc(r.server).update({channels:{}}),a=(t=await s.firestore().collection("messages").doc(r.server).get()).data()?.channels),!a[r.channel]){let i=await s.firestore().collection("servers").doc(r.server).get();if(!i.exists)return console.log("server "+r.server+" doesnt exist in MSGS, but should be"),e.emit("getMessagesRes",{err:"Confusion on server side."});let n=i.data().channels;for(let e of Object.keys(n))e==r.channel&&await s.firestore().collection("messages").doc(r.server).update({channels:{[e]:{messages:[]}}}),a=(t=await s.firestore().collection("messages").doc(r.server).get()).data()?.channels;if(!a[r.channel])return e.emit("getMessagesRes",{err:"Invalid channel"})}let i=a[r.channel]?.messages;return i?(i.sort(((e,t)=>e.time-t.time)),e.emit("getMessagesRes",{messages:i})):(console.log("SERVER ERROR MSGS "+r.server),e.emit("getMessagesRes",{err:"Server Error"}))})).catch((t=>(console.log(t),e.emit("getMessagesRes",{err:t}))))})),e.on("getKnownServers",(async function(r){if(!r?.token)return e.emit("getKnownServersRes",{err:"No token"});try{await t(r?.token)}catch(t){return e.emit("getKnownServersRes",{err:"Invalid Token"})}if(!allUsers[e.id])return e.emit("getKnownServersRes",{err:"Not logged in"});const s=require("firebase-admin"),a=require("./authworria-firebase-adminsdk-fc35t-29a90dc0ca.json");s.apps.length||await s.initializeApp({credential:s.credential.cert(a)});let i=[];return await s.firestore().collection("users").doc(allUsers[e.id].uid).get().then((async t=>{if(!t.exists)return e.emit("getKnownServersRes",{err:"User not found"});i=t.data().servers})).catch((t=>(console.log(t),e.emit("getKnownServersRes",{err:"User not found"})))),e.emit("getKnownServersRes",{servers:i})})),e.on("updateAbtMe",(async function(s){if(!s?.token)return e.emit("updateAbtMeRes",{err:"No token"});try{await t(s?.token)}catch(t){return e.emit("updateAbtMeRes",{err:"Invalid Token"})}if(!allUsers[e.id])return e.emit("updateAbtMeRes",{err:"Not logged in"});if(!s.aboutme&&""!==s.aboutme)return e.emit("updateAbtMeRes",{err:"No new about me"});if(s.aboutme.length>2e3)return e.emit("updateAbtMeRes",{err:"over 2000 characters"});const a=require("firebase-admin"),n=require("./authworria-firebase-adminsdk-fc35t-29a90dc0ca.json");a.apps.length||await a.initializeApp({credential:a.credential.cert(n)}),await a.firestore().collection("users").doc(allUsers[e.id]?.uid).update({aboutMe:s.aboutme}).then((async()=>{await a.firestore().collection("users").doc(allUsers[e.id]?.uid).get().then((async t=>{console.log(chalk.rgb(255,165,0)("[ABOUTME]"),chalk.bold.cyan(e.id)+" ("+chalk.white.bold(allUsers[e.id].name)+") ",'updates their about me to "'+chalk.white.bold(s.aboutme)+'"');let a=null,n=null;return await o(allUsers[e.id].uid)?(firstConnected=await l(allUsers[e.id].uid),n=allUsers[firstConnected[0]].status||await db.get(`users.${allUsers[e.id].uid}.status`)||"offline",a=allUsers[firstConnected[0]].statusText||await db.get(`users.${allUsers[e.id].uid}.statusText`)||""):(n="offline",a=""),e.broadcast.emit("usrChangeInfo",{uid:allUsers[e.id].uid,name:t.data()?.name||"???",statusIcon:d(n),status:i(n,a),avatar:t.data().picture||"",aboutMe:s.aboutme||"",friendCode:t.data().friendCode||"fcode-undefined",banner:t.data().banner||"",badges:t.data().badges||[]}),r(allUsers[e.id].uid,"updateAbtMeRes",{success:!0,uid:allUsers[e.id]?.uid,aboutme:s.aboutme})})).catch((e=>{console.log(e)}))})).catch((t=>(console.log(t),e.emit("updateAbtMeRes",{err:"Error updating about me"}))))})),e.on("createDM",(async r=>{if(!r?.token)return e.emit("createDMRes",{err:"No token"});try{await t(r?.token)}catch(t){return e.emit("createDMRes",{err:"Invalid Token"})}if(!allUsers[e.id])return e.emit("createDMRes",{err:"Not logged in"});if(!r?.uid)return e.emit("createDMRes",{err:"No UID"});await firebaseadmin.firestore().collection("users").doc(allUsers[e.id]?.uid).get().then((t=>{if((t.data().blocked||[]).includes(r.uid))return e.emit("createDMRes",{err:"trg_usr_blocked"})})).catch((e=>{console.log(e)})),await firebaseadmin.firestore().collection("users").doc(r.uid).get().then((t=>(t.data().blocked||[]).includes(allUsers[e.id]?.uid)?e.emit("createDMRes",{err:"usr_blocked"}):"everyone"!==t.data().userSettings.allowDMsFrom&&"friends"!==t.data().userSettings.allowDMsFrom&&t.data().knownUsers.includes(allUsers[e.id].uid)?e.emit("createDMRes",{err:"not_accepting_dms"}):void 0)).catch((e=>{console.log(e)}));let s=await async function(t){let r="AW-"+[allUsers[e.id].uid,t.uid].sort().join("-");return console.log("generated dmID",r),r}(r),a={type:"dm",members:[allUsers[e.id].uid,r.uid]};await firebaseadmin.firestore().collection("users").doc(allUsers[e.id].uid).update({dms:firebase.firestore.FieldValue.arrayUnion(s)}).catch((e=>{console.log(e)})),await firebaseadmin.firestore().collection("servers").doc(s).set(a)})),Array.prototype.sortRoles=function(e){let t=e,r=[];for(let e of t)this.includes(e)&&(r.push(e),this.splice(this.indexOf(e),1));this.splice(0,this.length,...r,...this)},e.on("createServer",(async function(s){if(!s?.token)return e.emit("createServerRes",{err:"No token"});try{await t(s?.token)}catch(t){return e.emit("createServerRes",{err:"Invalid Token"})}if(!allUsers[e.id])return e.emit("createServerRes",{err:"Not logged in"});let a=allUsers[e.id]?.uid||null;if(!a)return e.emit("createServerRes",{err:"No owner uid"});let i=await async function(){const e=require("firebase-admin"),t=require("./authworria-firebase-adminsdk-fc35t-29a90dc0ca.json");e.apps.length||await e.initializeApp({credential:e.credential.cert(t)});let r=!1,s="AW-";for(;!r;){s="AW-";for(let e=0;e<16;e++)s+=Math.floor(10*Math.random());r=await e.firestore().collection("users").where("id","==",s).get().then((e=>!!e.empty))}return s}(),n=s.name||allUsers[e.id].name+"'s server",o=s.desc||"",l=[{uid:a,roles:["everyone"],nickname:null}];const d=require("firebase-admin"),c=require("./authworria-firebase-adminsdk-fc35t-29a90dc0ca.json");d.apps.length||await d.initializeApp({credential:d.credential.cert(c)});let u="https://avatars.dicebear.com/api/initials/"+n+".svg?background=%2336393f&fontSize=40",f=(new Date).getTime(),m={type:"server",id:i,owner:a,name:n,roles:[{everyone:{name:"everyone",permissions:["SEND_MESSAGE","CREATE_INVITE"]}}],channels:{general:{creationTime:f,type:"text",category:"",permissions:{everyone:{permissions:{SEND_MESSAGES:!0,READ_MESSAGE_HISTORY:!0,VIEW_CHANNEL:!0}}}}},description:o,members:l,serverPicture:u||"",serverBanner:"",serverBadge:"",defaultPicture:!0,invites:[],serverSettings:{maxUsers:5e3,vanityCode:""},createdAt:f};await d.firestore().collection("servers").doc(i).set(m).then((async()=>{await d.firestore().collection("users").doc(a).update({servers:d.firestore.FieldValue.arrayUnion(i)}).then((async()=>{await r(a,"createServerRes",{success:!0,server:m})})).catch((e=>{console.log(e)}))})).catch((t=>(console.log(t),e.emit("createServerRes",{err:"Error creating server"}))))})),e.on("createInvite",(async function(r){if(!r?.token)return e.emit("createInviteRes",{err:"No token"});try{await t(r?.token)}catch(t){return e.emit("createInviteRes",{err:"Invalid Token"})}if(!allUsers[e.id])return e.emit("createInviteRes",{err:"Not logged in"});const s=require("firebase-admin"),a=require("./authworria-firebase-adminsdk-fc35t-29a90dc0ca.json");s.apps.length||await s.initializeApp({credential:s.credential.cert(a)});let i=r.serverID;(await f(allUsers[e.id]?.uid,i)).includes("CREATE_INVITE")})),e.on("getBulk",(async function(r){let s=[],a=[];const n=require("firebase-admin"),u=require("./authworria-firebase-adminsdk-fc35t-29a90dc0ca.json");if(n.apps.length||await n.initializeApp({credential:n.credential.cert(u)}),!r?.token)return e.emit("getBulkRes",{err:"No token"});try{await t(r?.token)}catch(t){return e.emit("getBulkRes",{err:"Invalid Token"})}if(!allUsers[e.id])return e.emit("getBulkRes",{err:"Not logged in"});if(!["users","servers","codes"].includes(r.type))return e.emit("getBulkRes",{err:"Invalid type"});if(r.ids.length<1)return e.emit("getBulkRes",{err:"No IDs"});if(console.log(chalk.rgb(255,255,0)("[GETBULK] ")+chalk.cyan.bold(e.id)+" ("+chalk.white.bold(allUsers[e.id]?.name)+") is requesting info for "+chalk.white.bold(r.ids.length+" "+r.type)),"users"===r.type)for(let e=0;e<r.ids.length;e++){let t=null,a=null;await o(r.ids[e])?(firstConnected=await l(r.ids[e]),a=allUsers[firstConnected[0]].status||await db.get(`users.${r.ids[e]}.status`)||"offline",t=allUsers[firstConnected[0]].statusText||await db.get(`users.${r.ids[e]}.statusText`)||""):(a="offline",t=""),await n.firestore().collection("users").doc(r.ids[e]).get().then((n=>{n.exists?s.push({id:e,uid:r?.ids[e],name:n.data()?.name,statusIcon:d(a),status:i(a,t),avatar:n.data().picture||"",aboutMe:n.data().aboutMe||"",friendCode:n.data().friendCode||"fcode-undefined",banner:n.data().banner||"",badges:n.data().badges||[]}):s.push({id:e,uid:r?.ids[e],err:"User does not exist"})}))}else if("servers"===r.type)for(let e=0;e<r.ids.length;e++)await n.firestore().collection("servers").doc(r.ids[e]).get().then((async t=>{t.exists?a.push({id:e,serverID:t.data().id,name:t.data()?.name,description:t.data()?.description,serverPicture:t.data()?.serverPicture||"",serverBanner:t.data()?.serverBanner||"",serverBadge:t.data()?.serverBadge||"",serverSettings:await c(t.data()?.serverSettings)||{},memberCount:t.data()?.members.length||"err"}):a.push({id:e,serverID:r?.ids[e],err:"Server does not exist"})}));else if("codes"===r.type){await function(){const e=require("firebase-admin"),t=require("./authworria-firebase-adminsdk-fc35t-29a90dc0ca.json");e.apps.length||e.initializeApp({credential:e.credential.cert(t)});let r=e.firestore().collection("servers").get(),s=[];return r.forEach((e=>{s.push(e.data())})),s}()}return s.length>0?e.emit("getBulkRes",{type:"users",results:s}):a.length>0?e.emit("getBulkRes",{type:"servers",results:a}):(console.log(s,a),console.log(r),e.emit("getBulkRes",{err:"No results"}))})),e.on("createInvite",(async function(e){})),e.on("removeInvite",(async function(e){})),e.on("joinServer",(async function(t){if(!allUsers[e.id]&&!inviteUsers[e.id])return e.emit("joinServerRes",{err:"Not logged in"});if(!t?.code)return e.emit("joinServerRes",{err:"No code"});const r=require("firebase-admin"),a=require("./authworria-firebase-adminsdk-fc35t-29a90dc0ca.json");r.apps.length||await r.initializeApp({credential:r.credential.cert(a)});let i=t.code,n=allUsers[e.id]?.uid||inviteUsers[e.id]?.uid,o=await s(i);if(!o)return e.emit("joinServerRes",{err:"Invalid code"});if("code_exp"===o.split(" ")[0])return e.emit("joinServerRes",{err:"Code expired"});let l=await r.firestore().collection("servers").doc(o).get().then((e=>e.exists?e.data():null));return l?l.members.includes(n)?e.emit("joinServerRes",{err:"Already in server"}):l.members.length>=l.serverSettings.maxUsers?e.emit("joinServerRes",{err:"Server full"}):(await r.firestore().collection("servers").doc(o).update({members:r.firestore.FieldValue.arrayUnion(n)}),await r.firestore().collection("users").doc(n).update({servers:r.firestore.FieldValue.arrayUnion(o)}),e.emit("joinServerRes",{serverID:o,serverName:l.name,serverDescription:l.description,serverPicture:l.serverPicture,serverOwner:l.owner})):e.emit("joinServerRes",{err:"Server does not exist"})})),e.on("leaveServer",(async function(r){if(!r?.token)return e.emit("leaveServerRes",{err:"No token"});try{await t(r?.token)}catch(t){return e.emit("leaveServerRes",{err:"Invalid Token"})}if(!allUsers[e.id])return e.emit("leaveServerRes",{err:"Not logged in"});if(!r?.serverID)return e.emit("leaveServerRes",{err:"No server id"});const s=require("firebase-admin"),a=require("./authworria-firebase-adminsdk-fc35t-29a90dc0ca.json");s.apps.length||await s.initializeApp({credential:s.credential.cert(a)});let i=r.serverID,n=allUsers[e.id].uid,o=await s.firestore().collection("servers").doc(i).get().then((e=>e.exists?e.data():null));return o?o.members.includes(n)?o.owner===n?e.emit("leaveServerRes",{err:"is_owner"}):(await s.firestore().collection("servers").doc(i).update({members:s.firestore.FieldValue.arrayRemove(n)}),await s.firestore().collection("users").doc(n).update({servers:s.firestore.FieldValue.arrayRemove(i)}),e.emit("leaveServerRes",{serverID:i})):e.emit("leaveServerRes",{err:"Not in server"}):e.emit("leaveServerRes",{err:"Server does not exist"})})),e.on("getServer",(async function(r){if(!r?.token)return e.emit("getServerRes",{err:"No token"});try{await t(r?.token)}catch(t){return e.emit("getServerRes",{err:"Invalid Token"})}if(!allUsers[e.id])return e.emit("getServerRes",{err:"Not logged in"});if(!r?.serverID)return e.emit("getServerRes",{err:"No server id"});const s=require("firebase-admin"),a=require("./authworria-firebase-adminsdk-fc35t-29a90dc0ca.json");s.apps.length||await s.initializeApp({credential:s.credential.cert(a)});let i=r.serverID,n=await s.firestore().collection("servers").doc(i).get().then((e=>e.exists?e.data():null));return n?e.emit("getServerRes",{serverID:i,serverName:n.name,serverDescription:n.description,picture:n.serverPicture,owner:n.owner,members:n.members}):e.emit("getServerRes",{err:"Server does not exist"})})),e.on("deleteServer",(async function(r){if(!r?.token)return e.emit("deleteServerRes",{err:"No token"});try{await t(r?.token)}catch(t){return e.emit("deleteServerRes",{err:"Invalid Token"})}if(!allUsers[e.id])return e.emit("deleteServerRes",{err:"Not logged in"});if(!r?.serverID)return e.emit("deleteServerRes",{err:"No server id"});const s=require("firebase-admin"),a=require("./authworria-firebase-adminsdk-fc35t-29a90dc0ca.json");s.apps.length||await s.initializeApp({credential:s.credential.cert(a)});let i=r.serverID,n=allUsers[e.id].uid,o=await s.firestore().collection("servers").doc(i).get().then((e=>e.exists?e.data().owner!==n?"not_own":e.data():null));return o?"not_own"===o?e.emit("deleteServerRes",{err:"Not owner"}):(((await s.firestore().collection("servers").doc(i).get()).data().members||[]).forEach((async e=>{console.log("Removing server "+i+" for user: "+e),await s.firestore().collection("users").doc(e).update({servers:s.firestore.FieldValue.arrayRemove(i)})})),await s.firestore().collection("servers").doc(i).delete(),e.emit("deleteServerRes",{serverID:i})):e.emit("deleteServerRes",{err:"Server does not exist"})})),e.on("updateServer",(async function(s){if(!s?.token)return e.emit("updateServerRes",{err:"No token"});try{await t(s?.token)}catch(t){return e.emit("updateServerRes",{err:"Invalid Token"})}if(!allUsers[e.id])return e.emit("updateServerRes",{err:"Not logged in"});if(!s.serverID)return e.emit("updateServerRes",{err:"No server id"});const a=require("firebase-admin"),i=require("./authworria-firebase-adminsdk-fc35t-29a90dc0ca.json");if(a.apps.length||await a.initializeApp({credential:a.credential.cert(i)}),"SRV_NAME"===s.change){let t=await a.firestore().collection("servers").doc(s.serverID).get();return doc.exists?(await f(allUsers[e.id].uid,s.serverID)).includes("MANAGE_SERVER")||await u(allUsers[e.id].uid,s.serverID)?(t.data().defaultPicture?await a.firestore().collection("servers").doc(s.serverID).update({name:s.newValue,serverPicture:"https://avatars.dicebear.com/api/initials/"+s.newValue+".svg?background=%2336393f&fontSize=40"}):await a.firestore().collection("servers").doc(s.serverID).update({name:s.newValue}),t.data().defaultPicture?r(allUsers[e.id].uid,"updateServerRes",{serverID:s.serverID,change:s.change,newValue:s.newValue,newImg:"https://avatars.dicebear.com/api/initials/"+s.newValue+".svg?background=%2336393f&fontSize=40"}):r(allUsers[e.id].uid,"updateServerRes",{serverID:s.serverID,change:s.change,newValue:s.newValue})):e.emit("updateServerRes",{err:"Not allowed"}):e.emit("updateServerRes",{err:"Server does not exist"})}})),e.on("getUsrbySkt",(async function(r){if(!data?.token)return e.emit("getUsrbySktRes",{err:"No token"});try{await t(data?.token)}catch(t){return e.emit("getUsrbySktRes",{err:"Invalid Token"})}return allUsers[e.id]?r in allUsers?e.emit("getUsrbySktRes",{success:!0,username:allUsers[r].username,email:allUsers[r].email,emailVerified:allUsers[r].emailVerified}):e.emit("getUsrbySktRes",{err:"Invalid socket id"}):e.emit("getUsrbySktRes",{err:"Not logged in"})}))})),server.listen(6969,(()=>{console.log(chalk.cyan.bold("[*] ")+chalk.white.bold("Socket.IO listening on port 6969"))})).on("error",(e=>{"EADDRINUSE"===e.code&&console.log(chalk.red.bold("[!] ")+chalk.redBright.bold("Port 6969 is already in use"))}));
/* prettier-ignore */
// app.post("/v1/checkEmail",(async(s,e)=>{try{const t=s.body?.email;if(!t)return e.status(400).send({success:!1,code:400,errormsg:"EMAIL missing."});const a=require("firebase-admin"),r=require("./authworria-firebase-adminsdk-fc35t-29a90dc0ca.json");a.apps.length||await a.initializeApp({credential:a.credential.cert(r)}),await a.auth().getUserByEmail(t).then((s=>e.status(200).send({status:200,statusmsg:"OK",data:!1}))).catch((s=>e.status(200).send({status:200,statusmsg:"OK",data:!0})))}catch(s){return console.log(s),e.status(500).send({success:!1,code:500,err:s})}})),app.post("/v1/genTokenFS",(async(s,e)=>{try{let t=s.body?.usr;const a={discord:!0};if(!t)return e.status(200).send({success:!1,code:200,errormsg:"USR missing."});try{JSON.parse(t),t=JSON.parse(t)}catch(s){}const r=require("firebase-admin"),n=require("./authworria-firebase-adminsdk-fc35t-29a90dc0ca.json");r.apps.length||await r.initializeApp({credential:r.credential.cert(n)}),await r.auth().getUser(t.id).then((()=>e.status(200).send({status:200,errormsg:"User exists."}))).catch((async s=>{await r.auth().createUser({uid:t.id,email:t.email,emailVerified:!1,displayName:t.username,photoURL:`https://cdn.discordapp.com/avatars/${t.id}/${t.avatar}.png`,disabled:!1}).then((async s=>{await r.auth().createCustomToken(t.id,a).then((s=>e.status(200).send({status:200,statusmsg:"OK",token:s}))).catch((s=>e.status(200).send({status:200,statusmsg:"Internal Server Error",errormsg:"Error creating custom token.",detailedErr:s})))})).catch((s=>e.status(200).send({status:200,statusmsg:"Internal Server Error",errormsg:"Error creating user.",detailedErr:s})))}))}catch(s){return console.log(s),e.status(500).send({errormsg:s})}})),app.post("/v1/genTokenF",(async(s,e)=>{try{let t=s.body?.usr;const a={discord:!0};if(!t)return e.status(400).send({success:!1,code:400,errormsg:"USR missing."});try{JSON.parse(t),t=JSON.parse(t)}catch(s){}const r=require("firebase-admin"),n=require("./authworria-firebase-adminsdk-fc35t-29a90dc0ca.json");r.apps.length||await r.initializeApp({credential:r.credential.cert(n)}),await r.auth().getUser(t.id).then((async s=>{const n=await r.auth().createCustomToken(t.id,a);return e.send({success:!0,code:200,token:n})})).catch((s=>(console.log(s),e.status(200).send({status:200,errormsg:"User doesnt exist.",detailedErr:s}))))}catch(s){return console.log(s),e.status(400).send({errormsg:s})}}));

mainWebsite.get("/img",(s,e)=>{
    e.redirect("/")
})
//send every item under /img

app.get("/v1/presence/:id", async (req, res) => {
  let userActivity = getActivity(req.params.id);
  res.header("Content-Type", "application/json");
  res.send(JSON.stringify(userActivity));
});
app
  .listen(3000, (e) => {
    console.log(
      chalk.cyan.bold("[*] ") +
        chalk.white.bold("Main APP listening on port 3000")
    );
  })
  .on("error", (e) => {
    if (e.code === "EADDRINUSE") {
      console.log(
        chalk.red.bold("[!] ") +
          chalk.redBright.bold("Port 3000 is already in use")
      );
      process.exit(1);
    }
  });
mainWebsite
  .listen(7798, (e) => {
    console.log(
      chalk.cyan.bold("[*] ") +
        chalk.white.bold("Main Website listening on port 7798")
    );
  })
  .on("error", (e) => {
    if (e.code === "EADDRINUSE") {
      console.log(
        chalk.red.bold("[!] ") +
          chalk.redBright.bold("Port 7798 is already in use")
      );
      process.exit(1);
    }
  });
server
  .listen(7892, (e) => {
    console.log(
      chalk.cyan.bold("[*] ") +
        chalk.white.bold("Socket.IO Server (HEROKU) listening on port 7892")
    );
  })
  .on("error", (e) => {
    if (e.code === "EADDRINUSE") {
      console.log(
        chalk.red.bold("[!] ") +
          chalk.redBright.bold("Port 7892 is already in use")
      );
      process.exit(1);
    }
  });

/* prettier-ignore */
function nextBirthday(e,t){let n=new Date(e.getMonth()+1+"/"+e.getDate()+"/"+(new Date).getFullYear()+" "+e.getHours()+":"+e.getMinutes()+":"+e.getSeconds());return n<new Date&&(n=n.setFullYear(n.getFullYear()+1)),t&&console.log(new Date(n)),n instanceof Date?n.getTime():n}
/* prettier-ignore */
function makeIMG(e){var t;e?"seconds"==e?(tempTime=""+(nextBirthday(new Date(116362272e4))-new Date)/1e3,temp=tempTime.split("."),temp[1]=String(temp[1]).substring(0,3).padEnd(3,"0"),void 0===temp[1]&&(temp[1]="0"),t=temp.join("."),image=path.join(__dirname,"build/img/blankseconds.png")):"minutes"==e?(tempTime=""+(nextBirthday(new Date(116362272e4))-new Date)/6e4,temp=tempTime.split("."),temp[1]=String(temp[1]).substring(0,4).padEnd(4,"0"),void 0===temp[1]&&(temp[1]="0"),t=temp.join("."),image=path.join(__dirname,"build/img/blankminutes.png")):"hours"==e?(tempTime=""+(nextBirthday(new Date(116362272e4))-new Date)/36e5,temp=tempTime.split("."),temp[1]=String(temp[1]).substring(0,5).padEnd(5,"0"),void 0===temp[1]&&(temp[1]="0"),t=temp.join("."),image=path.join(__dirname,"build/img/blankhours.png")):"days"==e?(tempTime=""+(nextBirthday(new Date(116362272e4))-new Date)/864e5,temp=tempTime.split("."),temp[1]=String(temp[1]).substring(0,6).padEnd(6,"0"),void 0===temp[1]&&(temp[1]="0"),t=temp.join("."),image=path.join(__dirname,"build/img/blankdays.png")):"weeks"==e?(tempTime=""+(nextBirthday(new Date(116362272e4))-new Date)/6048e5,temp=tempTime.split("."),temp[1]=String(temp[1]).substring(0,7).padEnd(7,"0"),void 0===temp[1]&&(temp[1]="0"),t=temp.join("."),image=path.join(__dirname,"build/img/blankweeks.png")):"months"==e?(tempTime=""+(nextBirthday(new Date(116362272e4))-new Date)/2628028800,temp=tempTime.split("."),temp[1]=String(temp[1]).substring(0,8).padEnd(8,"0"),void 0===temp[1]&&(temp[1]="0"),t=temp.join("."),image=path.join(__dirname,"build/img/blankmonths.png")):"milliseconds"==e?(t=""+nextBirthday(new Date(116362272e4))-(new Date).getTime(),image=path.join(__dirname,"build/img/blankmilliseconds.png")):"years"==e&&(t=(new Date-new Date(116362272e4))/31559039999.999992,(t=String(t).split("."))[1]=String(t[1]).padEnd(15,"0"),t=t.join("."),image=path.join(__dirname,"build/img/blank.png")):(e="years",t=(new Date-new Date(116362272e4))/31559039999.999992,(t=String(t).split("."))[1]=String(t[1]).padEnd(15,"0"),t=t.join("."),image=path.join(__dirname,"build/img/blank.png"));const n=require("jimp");n.read(image).then((function(i){n.loadFont(n.FONT_SANS_32_WHITE).then((function(m){i.print(m,0,-5,t),i.getBuffer(n.MIME_PNG,((t,n)=>{i.write(path.join(__dirname,"build/img/"+e+".png"))}))}))})).catch((function(e){console.error(e)}))}
/* prettier-ignore */
setInterval((()=>{
    makeIMG("years"),
    makeIMG("seconds"),
    makeIMG("hours"),
    makeIMG("minutes"),
    makeIMG("months"),
    makeIMG("days"),
    makeIMG("weeks")
}),800);

/* prettier-ignore */
function getActivity(t){let e=require("quick.db").fetch(`presence_${t}`);if(!e)return null;try{e=JSON.parse(e)}catch(t){}let a=null;"custom"==e?.game?.id&&(a={type:4,name:e?.game?.name,state:e?.game?.state},e?.game?.emoji&&(a.emoji=e?.game?.emoji)),e.activities&&e.activities.sort(((t,e)=>4==t.type?-1:4==e.type?1:t.type-e.type)),e.game=e?.activities[0];let s=function(t){try{t=JSON.parse(t)}catch(t){}let e=t.game;if(!e)return null;if("custom"===e?.id&&"Custom Status"===e?.name&&(e=t.activities[1]),!e?.id?.startsWith("spotify:")&&"Spotify"!==e?.name)return null;let a=e?.state,s=e?.details,i=e?.assets?.large_image,n=e?.timestamps?.start,l=e?.timestamps?.end,r=l-n,m=r-(Date.now()-n),u=r-m;return m<=0?null:{song:{start:"00:00",current:c(Math.floor(u/1e3/60<<0),2)+":"+c(Math.floor(u/1e3%60),2),end:c(Math.floor(r/1e3/60<<0),2)+":"+c(Math.floor(r/1e3%60),2),name:s,author:a,image:i.replace("spotify:","https://i.scdn.co/image/"),startTimestamp:n,endTimestamp:l}};function c(t,e){let a=t+"";for(;a.length<e;)a="0"+a;return a}}(e),i=function(t){return t?.game?"custom"===t?.game?.id?t.activities[1]||null:t.game||null:null}(e),n=function(t){if(!t.activities)return null;let e=t.game,a=t.activities;return"custom"==a[0]?.id&&a.shift(),e&&a.shift(),a}(e),l=null;return i&&(l={activity_data:{type:i?.type,name:i?.name,state:i?.state,details:i?.details,id:i?.id,timestamps:{start:i?.timestamps?.start||null,end:i?.timestamps?.end||null},assets:{small_text:i?.assets?.small_text||null,small_image:`https://cdn.discordapp.com/app-assets/${i?.application_id}/${i?.assets?.small_image}.png`,large_text:i?.assets?.large_text||null,large_image:`https://cdn.discordapp.com/app-assets/${i?.application_id}/${i?.assets?.large_image}.png`},application_id:i?.application_id},external_data:s}),{user:{username:e?.user?.username,discriminator:e?.user?.discriminator,image:`https://cdn.discordapp.com/avatars/${e?.user?.id}/${e?.user?.avatar}.png`,id:t},custom_status:a,client_status:e?.client_status,status:e?.status,activity:l,other_activites:n,lastUpdated:e?.lastUpdated}}

let herokuWeb = [],
  herokuWorker = [];

io.on("connection", (socket) => {
  socket.emit("HPI", "HPI");
  socket.on("disconnect", () => {
    if (herokuWorker.includes(socket)) {
      console.log(
        chalk.white.bold(socket.id),
        chalk.cyan.bold("(WORKER)"),
        chalk.red.bold(" DISCONNECTED")
      );
      herokuWorker.splice(herokuWorker.indexOf(socket), 1);
      if (herokuWeb.length > 0) {
        for (let i = 0; i < herokuWeb.length; i++) {
          herokuWeb[i].emit("LCNT", {
            socketId: socket.id,
            remaining: herokuWorker.length,
          });
        }
      }
    } else if (herokuWeb.includes(socket)) {
      console.log(
        chalk.white.bold(socket.id),
        chalk.hex("#ffa500").bold("(WEB)"),
        chalk.red.bold("DISCONNECTED")
      );
      herokuWeb.splice(herokuWeb.indexOf(socket), 1);
      if (herokuWorker.length > 0) {
        for (let i = 0; i < herokuWorker.length; i++) {
          herokuWorker[i].emit("LCNT", {
            socketId: socket.id,
            remaining: herokuWeb.length,
          });
        }
      }
    }
  });
  socket.on("HPIResponse", (message) => {
    if (message == "web") {
      console.log(
        chalk.white.bold(socket.id),
        chalk.green.bold("[HPI]"),
        "is a web client"
      );
      herokuWeb.push(socket);
      socket.emit("IACK", "WLCWEB");
    } else if (message == "worker") {
      console.log(
        chalk.white.bold(socket.id),
        chalk.green.bold("[HPI]"),
        "is a worker client"
      );
      herokuWorker.push(socket);
      socket.emit("IACK", "WLCWRKR");
    }
    if (herokuWeb.length >= 1 && herokuWorker.length >= 1) {
      console.log(
        "Both " +
          chalk.hex("#ffa500").bold("[WEB]") +
          " and " +
          chalk.cyan.bold("[WORKER]") +
          " connected"
      );
      for (let i = 0; i < herokuWeb.length; i++) {
        herokuWeb[i].emit("CNT", "CONNECTED");
      }
      for (let i = 0; i < herokuWorker.length; i++) {
        herokuWorker[i].emit("CNT", "CONNECTED");
      }
    }
  });
  socket.on("message", (message) => {
    if (herokuWeb.includes(socket)) {
      console.log(
        chalk.white.bold(socket.id),
        chalk.hex("#ffa500").bold("(WEB)"),
        chalk.blue.bold("[MESSAGE]"),
        message
      );
      for (let i = 0; i < herokuWorker.length; i++) {
        herokuWorker[i].emit("message", message);
      }
    }
    if (herokuWorker.includes(socket)) {
      console.log(
        chalk.white.bold(socket.id),
        chalk.cyan.bold("(WORKER)"),
        chalk.blue.bold("[MESSAGE]"),
        message
      );
      for (let i = 0; i < herokuWeb.length; i++) {
        herokuWeb[i].emit("message", message);
      }
    }
  });
  socket.on("allBotsIdent", (message) => {
    //to each worker
    console.log(
      chalk.white.bold(socket.id),
      chalk.hex("#ffa500").bold("(WEB)"),
      chalk.hex("#39d824").bold("[ABI]"),
      message
    );
    for (let i = 0; i < herokuWorker.length; i++) {
      herokuWorker[i].emit("allBotsIdent", message);
    }
  });
  socket.on("allBotsIdentResponse", (message) => {
    //send to the socket with id message.socketId
    console.log(
      chalk.white.bold(socket.id),
      chalk.cyan.bold("(WORKER)"),
      chalk.hex("#37df79").bold("[ABI-RESPONSE]"),
      message
    );
    for (let i = 0; i < herokuWeb.length; i++) {
      if (herokuWeb[i].id == message.socketId) {
        herokuWeb[i].emit("allBotsIdentResponse", message);
      }
    }
  });
  socket.on("askBotConfig", (message) => {
    //send to the socket with id message.socketId
    console.log(
      chalk.white.bold(socket.id),
      chalk.hex("#ffa500").bold("(WEB)"),
      chalk.hex("#37df79").bold("[ASK-BC]"),
      message
    );
    for (let i = 0; i < herokuWorker.length; i++) {
      if (herokuWorker[i].id == message.socketId) {
        herokuWorker[i].emit("askBotConfig", message);
      }
    }
  });
  socket.on("botConfig", (message) => {
    //send to the socket with id message.socketId
    console.log(
      chalk.white.bold(socket.id),
      chalk.cyan.bold("(WORKER)"),
      chalk.hex("#37df79").bold("[BC]"),
      message
    );
    for (let i = 0; i < herokuWeb.length; i++) {
      if (herokuWeb[i].id == message.socketId) {
        herokuWeb[i].emit("botConfig", message);
      }
    }
  });
  socket.on("getUptime", (message) => {
    //send to the socket with id message.socketId
    console.log(
      chalk.white.bold(socket.id),
      chalk.hex("#ffa500").bold("(WEB)"),
      chalk.hex("#37df79").bold("[GET-UPTIME]"),
      message
    );
    for (let i = 0; i < herokuWorker.length; i++) {
      if (herokuWorker[i].id == message.socketId) {
        herokuWorker[i].emit("getUptime", message);
      }
    }
  });
  socket.on("uptime", (message) => {
    //send to the socket with id message.socketId
    console.log(
      chalk.white.bold(socket.id),
      chalk.cyan.bold("(WORKER)"),
      chalk.hex("#37df79").bold("[UPTIME]"),
      message
    );
    for (let i = 0; i < herokuWeb.length; i++) {
      if (herokuWeb[i].id == message.socketId) {
        herokuWeb[i].emit("uptime", message);
      }
    }
  });
  socket.on("requestAsset", (message) => {
    //send to the socket with id message.socketId
    console.log(
      chalk.white.bold(socket.id),
      chalk.hex("#ffa500").bold("(WEB)"),
      chalk.hex("#37df79").bold("[REQ-ASSET]"),
      message
    );
    for (let i = 0; i < herokuWorker.length; i++) {
      if (herokuWorker[i].id == message.socketId) {
        herokuWorker[i].emit("requestAsset", message);
      }
    }
  });
  socket.on("asset", (message) => {
    //send to the socket with id message.socketId
    console.log(
      chalk.white.bold(socket.id),
      chalk.cyan.bold("(WORKER)"),
      chalk.hex("#37df79").bold("[ASSET]"),
      message
    );
    for (let i = 0; i < herokuWeb.length; i++) {
      if (herokuWeb[i].id == message.socketId) {
        herokuWeb[i].emit("asset", message);
      }
    }
  });
  socket.on("getLatency", (message) => {
    //send to the socket with id message.socketId
    console.log(
      chalk.white.bold(socket.id),
      chalk.hex("#ffa500").bold("(WEB)"),
      chalk.hex("#37df79").bold("[GET-LATENCY]"),
      message
    );
    for (let i = 0; i < herokuWorker.length; i++) {
      if (herokuWorker[i].id == message.socketId) {
        herokuWorker[i].emit("getLatency", message);
      }
    }
  });
  socket.on("latency", (message) => {
    //send to the socket with id message.socketId
    console.log(
      chalk.white.bold(socket.id),
      chalk.cyan.bold("(WORKER)"),
      chalk.hex("#37df79").bold("[LATENCY]"),
      message
    );
    for (let i = 0; i < herokuWeb.length; i++) {
      if (herokuWeb[i].id == message.socketId) {
        herokuWeb[i].emit("latency", message);
      }
    }
  });
  socket.on("webUpdate", (message) => {
    console.log(
      chalk.white.bold(socket.id),
      chalk.hex("#ffa500").bold("(WEB)"),
      chalk.magenta.bold("[WEBUPDATE]"),
      message
    );
    if (herokuWeb.length > 0) {
      for (let i = 0; i < herokuWeb.length; i++) {
        if (herokuWeb[i] !== socket) herokuWeb[i].emit("webUpdate", message);
      }
    }
  });
});
