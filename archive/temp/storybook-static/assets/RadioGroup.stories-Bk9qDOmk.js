import{j as e}from"./jsx-runtime-DoEZbXM1.js";import{r as i}from"./index-DWtqY3O_.js";import{a as te,c as _}from"./index-DHaFAply.js";import{u as K}from"./index-BghTMhg4.js";import{c as B}from"./index-4JJ3X7d3.js";import{P as C}from"./index-h8DnG9fi.js";import{c as T,R as se,I as ie}from"./index-CyJP_pY-.js";import{u as ne}from"./index-BqMyHzrN.js";import{u as de}from"./index-BnuSz0lM.js";import{u as ce}from"./index-DHw-aQaE.js";import{P as ue}from"./index-BAy4v6XH.js";import{c as U}from"./utils-CytzSlOG.js";import{c as le}from"./createLucideIcon-BySMWYsL.js";import"./jsx-runtime-Bw5QeaCk.js";import"./index-DZJH1aMv.js";import"./index-CWNAz4Fr.js";import"./index-k2os2MFt.js";/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const pe=le("Circle",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}]]);var k="Radio",[me,W]=B(k),[fe,ve]=me(k),z=i.forwardRef((o,s)=>{const{__scopeRadio:r,name:c,checked:a=!1,required:t,disabled:d,value:m="on",onCheck:l,form:f,...y}=o,[p,v]=i.useState(null),u=K(s,b=>v(b)),R=i.useRef(!1),h=p?f||!!p.closest("form"):!0;return e.jsxs(fe,{scope:r,checked:a,disabled:d,children:[e.jsx(C.button,{type:"button",role:"radio","aria-checked":a,"data-state":X(a),"data-disabled":d?"":void 0,disabled:d,value:m,...y,ref:u,onClick:_(o.onClick,b=>{a||l==null||l(),h&&(R.current=b.isPropagationStopped(),R.current||b.stopPropagation())})}),h&&e.jsx(Re,{control:p,bubbles:!R.current,name:c,value:m,checked:a,required:t,disabled:d,form:f,style:{transform:"translateX(-100%)"}})]})});z.displayName=k;var H="RadioIndicator",$=i.forwardRef((o,s)=>{const{__scopeRadio:r,forceMount:c,...a}=o,t=ve(H,r);return e.jsx(ue,{present:c||t.checked,children:e.jsx(C.span,{"data-state":X(t.checked),"data-disabled":t.disabled?"":void 0,...a,ref:s})})});$.displayName=H;var Re=o=>{const{control:s,checked:r,bubbles:c=!0,...a}=o,t=i.useRef(null),d=ce(r),m=de(s);return i.useEffect(()=>{const l=t.current,f=window.HTMLInputElement.prototype,p=Object.getOwnPropertyDescriptor(f,"checked").set;if(d!==r&&p){const v=new Event("click",{bubbles:c});p.call(l,r),l.dispatchEvent(v)}},[d,r,c]),e.jsx("input",{type:"radio","aria-hidden":!0,defaultChecked:r,...a,tabIndex:-1,ref:t,style:{...o.style,...m,position:"absolute",pointerEvents:"none",opacity:0,margin:0}})};function X(o){return o?"checked":"unchecked"}var xe=["ArrowUp","ArrowDown","ArrowLeft","ArrowRight"],N="RadioGroup",[ye,Fe]=B(N,[T,W]),Y=T(),J=W(),[he,be]=ye(N),Q=i.forwardRef((o,s)=>{const{__scopeRadioGroup:r,name:c,defaultValue:a,value:t,required:d=!1,disabled:m=!1,orientation:l,dir:f,loop:y=!0,onValueChange:p,...v}=o,u=Y(r),R=ne(f),[h,b]=te({prop:t,defaultProp:a,onChange:p});return e.jsx(he,{scope:r,name:c,required:d,disabled:m,value:h,onValueChange:b,children:e.jsx(se,{asChild:!0,...u,orientation:l,dir:R,loop:y,children:e.jsx(C.div,{role:"radiogroup","aria-required":d,"aria-orientation":l,"data-disabled":m?"":void 0,dir:R,...v,ref:s})})})});Q.displayName=N;var Z="RadioGroupItem",ee=i.forwardRef((o,s)=>{const{__scopeRadioGroup:r,disabled:c,...a}=o,t=be(Z,r),d=t.disabled||c,m=Y(r),l=J(r),f=i.useRef(null),y=K(s,f),p=t.value===a.value,v=i.useRef(!1);return i.useEffect(()=>{const u=h=>{xe.includes(h.key)&&(v.current=!0)},R=()=>v.current=!1;return document.addEventListener("keydown",u),document.addEventListener("keyup",R),()=>{document.removeEventListener("keydown",u),document.removeEventListener("keyup",R)}},[]),e.jsx(ie,{asChild:!0,...m,focusable:!d,active:p,children:e.jsx(z,{disabled:d,required:t.required,checked:p,...l,...a,name:t.name,ref:y,onCheck:()=>t.onValueChange(a.value),onKeyDown:_(u=>{u.key==="Enter"&&u.preventDefault()}),onFocus:_(a.onFocus,()=>{var u;v.current&&((u=f.current)==null||u.click())})})})});ee.displayName=Z;var Ge="RadioGroupIndicator",re=i.forwardRef((o,s)=>{const{__scopeRadioGroup:r,...c}=o,a=J(r);return e.jsx($,{...a,...c,ref:s})});re.displayName=Ge;var oe=Q,ae=ee,ge=re;const x=i.forwardRef(({className:o,...s},r)=>e.jsx(oe,{className:U("grid gap-2",o),...s,ref:r}));x.displayName=oe.displayName;const n=i.forwardRef(({className:o,...s},r)=>e.jsx(ae,{ref:r,className:U("aspect-square h-4 w-4 rounded-full border border-primary text-primary ring-offset-background focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",o),...s,children:e.jsx(ge,{className:"flex items-center justify-center",children:e.jsx(pe,{className:"h-2.5 w-2.5 fill-current text-current"})})}));n.displayName=ae.displayName;try{x.displayName="RadioGroup",x.__docgenInfo={description:"",displayName:"RadioGroup",props:{asChild:{defaultValue:null,description:"",name:"asChild",required:!1,type:{name:"boolean | undefined"}}}}}catch{}try{n.displayName="RadioGroupItem",n.__docgenInfo={description:"",displayName:"RadioGroupItem",props:{asChild:{defaultValue:null,description:"",name:"asChild",required:!1,type:{name:"boolean | undefined"}}}}}catch{}const Ke={title:"UI/RadioGroup",component:x,tags:["autodocs"]},G={render:()=>e.jsxs(x,{defaultValue:"1",children:[e.jsx(n,{value:"1"})," Option 1",e.jsx(n,{value:"2"})," Option 2",e.jsx(n,{value:"3"})," Option 3"]})},g={render:()=>e.jsxs(x,{defaultValue:"1",disabled:!0,children:[e.jsx(n,{value:"1"})," Option 1",e.jsx(n,{value:"2"})," Option 2",e.jsx(n,{value:"3"})," Option 3"]})},j={render:()=>e.jsxs("div",{children:[e.jsx("label",{style:{display:"block",marginBottom:8},children:"Выберите вариант:"}),e.jsxs(x,{defaultValue:"2",children:[e.jsx(n,{value:"1"})," Вариант 1",e.jsx(n,{value:"2"})," Вариант 2",e.jsx(n,{value:"3"})," Вариант 3"]})]})},I={render:()=>e.jsxs("div",{children:[e.jsxs(x,{defaultValue:"1",children:[e.jsx(n,{value:"1"})," Вариант 1",e.jsx(n,{value:"2"})," Вариант 2"]}),e.jsx("span",{className:"text-xs text-red-500",style:{marginLeft:8},children:"Ошибка: выберите вариант"})]})};var w,E,P;G.parameters={...G.parameters,docs:{...(w=G.parameters)==null?void 0:w.docs,source:{originalSource:`{
  render: () => <RadioGroup defaultValue="1">\r
      <RadioGroupItem value="1" /> Option 1\r
      <RadioGroupItem value="2" /> Option 2\r
      <RadioGroupItem value="3" /> Option 3\r
    </RadioGroup>
}`,...(P=(E=G.parameters)==null?void 0:E.docs)==null?void 0:P.source}}};var S,O,A;g.parameters={...g.parameters,docs:{...(S=g.parameters)==null?void 0:S.docs,source:{originalSource:`{
  render: () => <RadioGroup defaultValue="1" disabled>\r
      <RadioGroupItem value="1" /> Option 1\r
      <RadioGroupItem value="2" /> Option 2\r
      <RadioGroupItem value="3" /> Option 3\r
    </RadioGroup>
}`,...(A=(O=g.parameters)==null?void 0:O.docs)==null?void 0:A.source}}};var D,V,L;j.parameters={...j.parameters,docs:{...(D=j.parameters)==null?void 0:D.docs,source:{originalSource:`{
  render: () => <div>\r
      <label style={{
      display: 'block',
      marginBottom: 8
    }}>Выберите вариант:</label>\r
      <RadioGroup defaultValue="2">\r
        <RadioGroupItem value="1" /> Вариант 1\r
        <RadioGroupItem value="2" /> Вариант 2\r
        <RadioGroupItem value="3" /> Вариант 3\r
      </RadioGroup>\r
    </div>
}`,...(L=(V=j.parameters)==null?void 0:V.docs)==null?void 0:L.source}}};var q,M,F;I.parameters={...I.parameters,docs:{...(q=I.parameters)==null?void 0:q.docs,source:{originalSource:`{
  render: () => <div>\r
      <RadioGroup defaultValue="1">\r
        <RadioGroupItem value="1" /> Вариант 1\r
        <RadioGroupItem value="2" /> Вариант 2\r
      </RadioGroup>\r
      <span className="text-xs text-red-500" style={{
      marginLeft: 8
    }}>Ошибка: выберите вариант</span>\r
    </div>
}`,...(F=(M=I.parameters)==null?void 0:M.docs)==null?void 0:F.source}}};const Be=["Default","Disabled","WithLabel","Error"];export{G as Default,g as Disabled,I as Error,j as WithLabel,Be as __namedExportsOrder,Ke as default};
//# sourceMappingURL=RadioGroup.stories-Bk9qDOmk.js.map
