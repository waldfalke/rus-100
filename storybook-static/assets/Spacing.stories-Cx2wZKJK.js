import{j as a}from"./jsx-runtime-DoEZbXM1.js";import"./jsx-runtime-Bw5QeaCk.js";const c=[{name:"radius",value:"var(--radius)"}],m=[{name:"xs (4px)",value:4},{name:"sm (8px)",value:8},{name:"md (16px)",value:16},{name:"lg (24px)",value:24},{name:"xl (32px)",value:32}],v={title:"Tokens/Spacing"},n={render:()=>a.jsx("div",{style:{display:"flex",gap:32},children:c.map(e=>a.jsxs("div",{style:{textAlign:"center"},children:[a.jsx("div",{style:{width:48,height:48,background:"#eee",borderRadius:"var(--radius)",border:"1px solid #ccc"}}),a.jsx("div",{className:"text-xs",children:e.name})]},e.name))})},r={render:()=>a.jsx("div",{style:{display:"flex",alignItems:"flex-end",gap:16},children:m.map(e=>a.jsx("div",{style:{width:e.value,height:e.value,background:"#ddd",border:"1px solid #bbb"},title:e.name},e.name))})};var s,d,i;n.parameters={...n.parameters,docs:{...(s=n.parameters)==null?void 0:s.docs,source:{originalSource:`{
  render: () => <div style={{
    display: "flex",
    gap: 32
  }}>\r
      {RADII.map(r => <div key={r.name} style={{
      textAlign: "center"
    }}>\r
          <div style={{
        width: 48,
        height: 48,
        background: "#eee",
        borderRadius: \`var(--radius)\`,
        border: "1px solid #ccc"
      }} />\r
          <div className="text-xs">{r.name}</div>\r
        </div>)}\r
    </div>
}`,...(i=(d=n.parameters)==null?void 0:d.docs)==null?void 0:i.source}}};var t,l,o;r.parameters={...r.parameters,docs:{...(t=r.parameters)==null?void 0:t.docs,source:{originalSource:`{
  render: () => <div style={{
    display: "flex",
    alignItems: "flex-end",
    gap: 16
  }}>\r
      {SPACING.map(s => <div key={s.name} style={{
      width: s.value,
      height: s.value,
      background: "#ddd",
      border: "1px solid #bbb"
    }} title={s.name} />)}\r
    </div>
}`,...(o=(l=r.parameters)==null?void 0:l.docs)==null?void 0:o.source}}};const u=["Radii","SpacingBlocks"];export{n as Radii,r as SpacingBlocks,u as __namedExportsOrder,v as default};
//# sourceMappingURL=Spacing.stories-Cx2wZKJK.js.map
