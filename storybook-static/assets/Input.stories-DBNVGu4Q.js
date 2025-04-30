import{j as e}from"./jsx-runtime-DoEZbXM1.js";import{I as l}from"./input-CZpXrphG.js";import"./jsx-runtime-Bw5QeaCk.js";import"./index-DWtqY3O_.js";import"./utils-CytzSlOG.js";const W={title:"UI/Input",component:l,tags:["autodocs"]},r={args:{value:"",placeholder:"Type here..."}},a={args:{value:"",placeholder:"Disabled input",disabled:!0}},s={args:{value:"Hello, world!"}},o={render:()=>e.jsxs("label",{style:{display:"flex",flexDirection:"column",gap:4},children:[e.jsx("span",{children:"Имя пользователя"}),e.jsx(l,{placeholder:"Введите имя"})]})},t={render:()=>e.jsxs("div",{children:[e.jsx(l,{placeholder:"Ошибка"}),e.jsx("span",{className:"text-xs text-red-500",style:{marginLeft:4},children:"Ошибка: заполните поле"})]})};var n,c,p;r.parameters={...r.parameters,docs:{...(n=r.parameters)==null?void 0:n.docs,source:{originalSource:`{
  args: {
    value: "",
    placeholder: "Type here..."
  }
}`,...(p=(c=r.parameters)==null?void 0:c.docs)==null?void 0:p.source}}};var d,i,u;a.parameters={...a.parameters,docs:{...(d=a.parameters)==null?void 0:d.docs,source:{originalSource:`{
  args: {
    value: "",
    placeholder: "Disabled input",
    disabled: true
  }
}`,...(u=(i=a.parameters)==null?void 0:i.docs)==null?void 0:u.source}}};var m,x,h;s.parameters={...s.parameters,docs:{...(m=s.parameters)==null?void 0:m.docs,source:{originalSource:`{
  args: {
    value: "Hello, world!"
  }
}`,...(h=(x=s.parameters)==null?void 0:x.docs)==null?void 0:h.source}}};var g,b,f;o.parameters={...o.parameters,docs:{...(g=o.parameters)==null?void 0:g.docs,source:{originalSource:`{
  render: () => <label style={{
    display: 'flex',
    flexDirection: 'column',
    gap: 4
  }}>\r
      <span>Имя пользователя</span>\r
      <Input placeholder="Введите имя" />\r
    </label>
}`,...(f=(b=o.parameters)==null?void 0:b.docs)==null?void 0:f.source}}};var v,j,y;t.parameters={...t.parameters,docs:{...(v=t.parameters)==null?void 0:v.docs,source:{originalSource:`{
  render: () => <div>\r
      <Input placeholder="Ошибка" />\r
      <span className="text-xs text-red-500" style={{
      marginLeft: 4
    }}>Ошибка: заполните поле</span>\r
    </div>
}`,...(y=(j=t.parameters)==null?void 0:j.docs)==null?void 0:y.source}}};const w=["Default","Disabled","WithValue","WithLabel","Error"];export{r as Default,a as Disabled,t as Error,o as WithLabel,s as WithValue,w as __namedExportsOrder,W as default};
//# sourceMappingURL=Input.stories-DBNVGu4Q.js.map
