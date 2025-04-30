import{j as t}from"./jsx-runtime-DoEZbXM1.js";import{r as a}from"./index-DWtqY3O_.js";import{u as re}from"./index-BghTMhg4.js";import{c as te}from"./index-4JJ3X7d3.js";import{a as se,c as w}from"./index-DHaFAply.js";import{u as oe}from"./index-DHw-aQaE.js";import{u as ae}from"./index-BnuSz0lM.js";import{P as ne}from"./index-BAy4v6XH.js";import{P as $}from"./index-h8DnG9fi.js";import{c as D}from"./utils-CytzSlOG.js";import{C as ce}from"./check-CVmLzWJK.js";import"./jsx-runtime-Bw5QeaCk.js";import"./index-DZJH1aMv.js";import"./index-CWNAz4Fr.js";import"./createLucideIcon-BySMWYsL.js";var N="Checkbox",[ie,Se]=te(N),[de,le]=ie(N),G=a.forwardRef((e,i)=>{const{__scopeCheckbox:r,name:l,checked:f,defaultChecked:o,required:h,disabled:d,value:x="on",onCheckedChange:j,form:p,...P}=e,[n,k]=a.useState(null),_=re(i,s=>k(s)),R=a.useRef(!1),I=n?p||!!n.closest("form"):!0,[u=!1,S]=se({prop:f,defaultProp:o,onChange:j}),ee=a.useRef(u);return a.useEffect(()=>{const s=n==null?void 0:n.form;if(s){const b=()=>S(ee.current);return s.addEventListener("reset",b),()=>s.removeEventListener("reset",b)}},[n,S]),t.jsxs(de,{scope:r,state:u,disabled:d,children:[t.jsx($.button,{type:"button",role:"checkbox","aria-checked":c(u)?"mixed":u,"aria-required":h,"data-state":Y(u),"data-disabled":d?"":void 0,disabled:d,value:x,...P,ref:_,onKeyDown:w(e.onKeyDown,s=>{s.key==="Enter"&&s.preventDefault()}),onClick:w(e.onClick,s=>{S(b=>c(b)?!0:!b),I&&(R.current=s.isPropagationStopped(),R.current||s.stopPropagation())})}),I&&t.jsx(pe,{control:n,bubbles:!R.current,name:l,value:x,checked:u,required:h,disabled:d,form:p,style:{transform:"translateX(-100%)"},defaultChecked:c(o)?!1:o})]})});G.displayName=N;var J="CheckboxIndicator",Q=a.forwardRef((e,i)=>{const{__scopeCheckbox:r,forceMount:l,...f}=e,o=le(J,r);return t.jsx(ne,{present:l||c(o.state)||o.state===!0,children:t.jsx($.span,{"data-state":Y(o.state),"data-disabled":o.disabled?"":void 0,...f,ref:i,style:{pointerEvents:"none",...e.style}})})});Q.displayName=J;var pe=e=>{const{control:i,checked:r,bubbles:l=!0,defaultChecked:f,...o}=e,h=a.useRef(null),d=oe(r),x=ae(i);a.useEffect(()=>{const p=h.current,P=window.HTMLInputElement.prototype,k=Object.getOwnPropertyDescriptor(P,"checked").set;if(d!==r&&k){const _=new Event("click",{bubbles:l});p.indeterminate=c(r),k.call(p,c(r)?!1:r),p.dispatchEvent(_)}},[d,r,l]);const j=a.useRef(c(r)?!1:r);return t.jsx("input",{type:"checkbox","aria-hidden":!0,defaultChecked:f??j.current,...o,tabIndex:-1,ref:h,style:{...e.style,...x,position:"absolute",pointerEvents:"none",opacity:0,margin:0}})};function c(e){return e==="indeterminate"}function Y(e){return c(e)?"indeterminate":e?"checked":"unchecked"}var Z=G,ue=Q;const m=a.forwardRef(({className:e,...i},r)=>t.jsx(Z,{ref:r,className:D("peer h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground",e),...i,children:t.jsx(ue,{className:D("flex items-center justify-center text-current"),children:t.jsx(ce,{className:"h-4 w-4"})})}));m.displayName=Z.displayName;try{m.displayName="Checkbox",m.__docgenInfo={description:"",displayName:"Checkbox",props:{asChild:{defaultValue:null,description:"",name:"asChild",required:!1,type:{name:"boolean | undefined"}}}}}catch{}const Ne={title:"UI/Checkbox",component:m,tags:["autodocs"]},C={args:{checked:!1}},g={args:{checked:!0}},y={args:{disabled:!0}},v={render:()=>t.jsxs("label",{style:{display:"flex",alignItems:"center",gap:8},children:[t.jsx(m,{}),"Согласен с условиями"]})},E={render:()=>t.jsxs("div",{children:[t.jsx(m,{}),t.jsx("span",{className:"text-xs text-red-500",style:{marginLeft:8},children:"Ошибка: выберите опцию"})]})};var L,O,M;C.parameters={...C.parameters,docs:{...(L=C.parameters)==null?void 0:L.docs,source:{originalSource:`{
  args: {
    checked: false
  }
}`,...(M=(O=C.parameters)==null?void 0:O.docs)==null?void 0:M.source}}};var q,A,B;g.parameters={...g.parameters,docs:{...(q=g.parameters)==null?void 0:q.docs,source:{originalSource:`{
  args: {
    checked: true
  }
}`,...(B=(A=g.parameters)==null?void 0:A.docs)==null?void 0:B.source}}};var H,K,z;y.parameters={...y.parameters,docs:{...(H=y.parameters)==null?void 0:H.docs,source:{originalSource:`{
  args: {
    disabled: true
  }
}`,...(z=(K=y.parameters)==null?void 0:K.docs)==null?void 0:z.source}}};var T,W,X;v.parameters={...v.parameters,docs:{...(T=v.parameters)==null?void 0:T.docs,source:{originalSource:`{
  render: () => <label style={{
    display: 'flex',
    alignItems: 'center',
    gap: 8
  }}>\r
      <Checkbox />\r
      Согласен с условиями\r
    </label>
}`,...(X=(W=v.parameters)==null?void 0:W.docs)==null?void 0:X.source}}};var F,U,V;E.parameters={...E.parameters,docs:{...(F=E.parameters)==null?void 0:F.docs,source:{originalSource:`{
  render: () => <div>\r
      <Checkbox />\r
      <span className="text-xs text-red-500" style={{
      marginLeft: 8
    }}>Ошибка: выберите опцию</span>\r
    </div>
}`,...(V=(U=E.parameters)==null?void 0:U.docs)==null?void 0:V.source}}};const Ie=["Default","Checked","Disabled","WithLabel","Error"];export{g as Checked,C as Default,y as Disabled,E as Error,v as WithLabel,Ie as __namedExportsOrder,Ne as default};
//# sourceMappingURL=Checkbox.stories-CtsNJOLg.js.map
