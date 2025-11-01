import{j as r}from"./jsx-runtime-DoEZbXM1.js";import{r as a}from"./index-DWtqY3O_.js";import{a as Y,c as Z}from"./index-DHaFAply.js";import{u as ee}from"./index-BghTMhg4.js";import{c as re}from"./index-4JJ3X7d3.js";import{u as te}from"./index-DHw-aQaE.js";import{u as se}from"./index-BnuSz0lM.js";import{P as A}from"./index-h8DnG9fi.js";import{c as j}from"./utils-CytzSlOG.js";import"./jsx-runtime-Bw5QeaCk.js";import"./index-DZJH1aMv.js";import"./index-CWNAz4Fr.js";var C="Switch",[ae,ve]=re(C),[oe,ne]=ae(C),U=a.forwardRef((e,s)=>{const{__scopeSwitch:t,name:o,checked:n,defaultChecked:u,required:d,disabled:c,value:l="on",onCheckedChange:v,form:w,...m}=e,[p,G]=a.useState(null),J=ee(s,f=>G(f)),y=a.useRef(!1),_=p?w||!!p.closest("form"):!0,[h=!1,K]=Y({prop:n,defaultProp:u,onChange:v});return r.jsxs(oe,{scope:t,checked:h,disabled:c,children:[r.jsx(A.button,{type:"button",role:"switch","aria-checked":h,"aria-required":d,"data-state":X(h),"data-disabled":c?"":void 0,disabled:c,value:l,...m,ref:J,onClick:Z(e.onClick,f=>{K(Q=>!Q),_&&(y.current=f.isPropagationStopped(),y.current||f.stopPropagation())})}),_&&r.jsx(ce,{control:p,bubbles:!y.current,name:o,value:l,checked:h,required:d,disabled:c,form:w,style:{transform:"translateX(-100%)"}})]})});U.displayName=C;var F="SwitchThumb",V=a.forwardRef((e,s)=>{const{__scopeSwitch:t,...o}=e,n=ne(F,t);return r.jsx(A.span,{"data-state":X(n.checked),"data-disabled":n.disabled?"":void 0,...o,ref:s})});V.displayName=F;var ce=e=>{const{control:s,checked:t,bubbles:o=!0,...n}=e,u=a.useRef(null),d=te(t),c=se(s);return a.useEffect(()=>{const l=u.current,v=window.HTMLInputElement.prototype,m=Object.getOwnPropertyDescriptor(v,"checked").set;if(d!==t&&m){const p=new Event("click",{bubbles:o});m.call(l,t),l.dispatchEvent(p)}},[d,t,o]),r.jsx("input",{type:"checkbox","aria-hidden":!0,defaultChecked:t,...n,tabIndex:-1,ref:u,style:{...e.style,...c,position:"absolute",pointerEvents:"none",opacity:0,margin:0}})};function X(e){return e?"checked":"unchecked"}var $=U,ie=V;const i=a.forwardRef(({className:e,...s},t)=>r.jsx($,{className:j("peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=unchecked]:bg-input",e),...s,ref:t,children:r.jsx(ie,{className:j("pointer-events-none block h-5 w-5 rounded-full bg-background shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0")})}));i.displayName=$.displayName;try{i.displayName="Switch",i.__docgenInfo={description:"",displayName:"Switch",props:{asChild:{defaultValue:null,description:"",name:"asChild",required:!1,type:{name:"boolean | undefined"}}}}}catch{}const we={title:"UI/Switch",component:i,tags:["autodocs"]},b={args:{checked:!1}},g={args:{checked:!0}},x={args:{disabled:!0}},k={render:()=>r.jsxs("label",{style:{display:"flex",alignItems:"center",gap:8},children:[r.jsx(i,{}),"Включить уведомления"]})},S={render:()=>r.jsxs("div",{children:[r.jsx(i,{}),r.jsx("span",{className:"text-xs text-red-500",style:{marginLeft:8},children:"Ошибка: выберите опцию"})]})};var P,E,N;b.parameters={...b.parameters,docs:{...(P=b.parameters)==null?void 0:P.docs,source:{originalSource:`{
  args: {
    checked: false
  }
}`,...(N=(E=b.parameters)==null?void 0:E.docs)==null?void 0:N.source}}};var R,I,T;g.parameters={...g.parameters,docs:{...(R=g.parameters)==null?void 0:R.docs,source:{originalSource:`{
  args: {
    checked: true
  }
}`,...(T=(I=g.parameters)==null?void 0:I.docs)==null?void 0:T.source}}};var D,L,H;x.parameters={...x.parameters,docs:{...(D=x.parameters)==null?void 0:D.docs,source:{originalSource:`{
  args: {
    disabled: true
  }
}`,...(H=(L=x.parameters)==null?void 0:L.docs)==null?void 0:H.source}}};var M,q,B;k.parameters={...k.parameters,docs:{...(M=k.parameters)==null?void 0:M.docs,source:{originalSource:`{
  render: () => <label style={{
    display: 'flex',
    alignItems: 'center',
    gap: 8
  }}>\r
      <Switch />\r
      Включить уведомления\r
    </label>
}`,...(B=(q=k.parameters)==null?void 0:q.docs)==null?void 0:B.source}}};var O,W,z;S.parameters={...S.parameters,docs:{...(O=S.parameters)==null?void 0:O.docs,source:{originalSource:`{
  render: () => <div>\r
      <Switch />\r
      <span className="text-xs text-red-500" style={{
      marginLeft: 8
    }}>Ошибка: выберите опцию</span>\r
    </div>
}`,...(z=(W=S.parameters)==null?void 0:W.docs)==null?void 0:z.source}}};const ye=["Default","Checked","Disabled","WithLabel","Error"];export{g as Checked,b as Default,x as Disabled,S as Error,k as WithLabel,ye as __namedExportsOrder,we as default};
//# sourceMappingURL=Switch.stories-DJvF7-1_.js.map
