import{j as n}from"./jsx-runtime-DoEZbXM1.js";import{B as c}from"./badge-BhI_kZ9I.js";import{r as h}from"./index-DWtqY3O_.js";import{P as B,a as T,b as D}from"./popover-C4RQM193.js";import"./jsx-runtime-Bw5QeaCk.js";import"./index-BwobEAja.js";import"./utils-CytzSlOG.js";import"./index-DHaFAply.js";import"./index-BghTMhg4.js";import"./index-4JJ3X7d3.js";import"./index-C9Cbq-BE.js";import"./index-h8DnG9fi.js";import"./index-DZJH1aMv.js";import"./index-CWNAz4Fr.js";import"./index-BnuSz0lM.js";import"./Combination-Dlu6W2yo.js";import"./index-k2os2MFt.js";import"./index-BAy4v6XH.js";const p=({value:a,onChange:o,stats:l,tiers:t,renderCount:d,anyLabel:u="любая сложность"})=>{const g=r=>{if(r==="any"){o(["any"]);return}if(a.includes(r)){const i=a.filter(e=>e!==r);o(i.length===0?["any"]:i)}else o([...a.filter(i=>i!=="any"),r])};return n.jsxs("div",{className:"flex flex-wrap gap-1.5 items-center",children:[n.jsxs(c,{variant:a.includes("any")?"default":"outline",onClick:()=>g("any"),className:`cursor-pointer transition-colors text-xs px-2 py-0.5 flex items-center gap-1 ${a.includes("any")?"bg-teal-600 hover:bg-teal-700 text-white border-teal-600":"border-gray-300 text-gray-700 hover:bg-gray-100"}`,role:"radio","aria-checked":a.includes("any"),tabIndex:0,children:[u,d?d(Object.values(l).reduce((r,i)=>r+i,0),a.includes("any")):n.jsx("span",{className:"ml-2 text-gray-400",children:Object.values(l).reduce((r,i)=>r+i,0)})]},"any"),t.map(r=>{const i=l[r.id]||0,e=i===0,s=a.includes(r.id);return n.jsxs(c,{variant:s&&!e?"default":"outline",onClick:()=>!e&&g(r.id),className:`cursor-pointer transition-colors text-xs px-2 py-0.5 ${e?"cursor-not-allowed opacity-50 bg-gray-100 text-gray-400 border-gray-200":s?"bg-teal-600 hover:bg-teal-700 text-white border-teal-600":"border-gray-300 text-gray-700 hover:bg-gray-100"}`,"aria-disabled":e,role:"radio","aria-checked":s&&!e,tabIndex:e?-1:0,children:[r.label,d?d(i,s&&!e):n.jsx("span",{className:"ml-2 text-gray-400",children:i})]},r.id)})]})};try{p.displayName="DifficultyChipsGroup",p.__docgenInfo={description:"",displayName:"DifficultyChipsGroup",props:{value:{defaultValue:null,description:"",name:"value",required:!0,type:{name:"string[]"}},onChange:{defaultValue:null,description:"",name:"onChange",required:!0,type:{name:"(value: string[]) => void"}},stats:{defaultValue:null,description:"",name:"stats",required:!0,type:{name:"{ [key: string]: number; }"}},tiers:{defaultValue:null,description:"",name:"tiers",required:!0,type:{name:"DifficultyTier[]"}},renderCount:{defaultValue:null,description:"",name:"renderCount",required:!1,type:{name:"((count: number, selected: boolean) => ReactNode) | undefined"}},anyLabel:{defaultValue:{value:"любая сложность"},description:"",name:"anyLabel",required:!1,type:{name:"string | undefined"}}}}}catch{}const b=[{id:"easiest",label:"самые лёгкие"},{id:"easy",label:"лёгкие"},{id:"medium",label:"средние"},{id:"hard",label:"сложные"},{id:"hardest",label:"самые сложные"}],V={easiest:4,easy:9,medium:57,hard:44,hardest:0},X={title:"Blocks/DifficultyChipsGroup",component:p},f={render:()=>{const[a,o]=h.useState(["medium"]);return n.jsx(p,{value:a,onChange:o,stats:V,tiers:b,renderCount:(l,t)=>n.jsx("span",{style:{marginLeft:8,color:t?"#fff":"#b0b0b0",fontWeight:400,fontSize:14},children:l}),anyLabel:"любая сложность"})}},m={render:()=>{const[a,o]=h.useState(["any"]);return n.jsx(p,{value:a,onChange:o,stats:V,tiers:b,renderCount:(l,t)=>n.jsxs("span",{style:{marginLeft:4,color:t?"#fff":"#b0b0b0",fontWeight:400,fontSize:14},children:["(",l,")"]}),anyLabel:"любая сложность"})}},y={render:()=>{const[a,o]=h.useState(!1),l=b.map(e=>e.id),[t,d]=h.useState(["any"]),u=e=>{if(e==="any"){d(["any"]);return}let s=t.includes(e)?t.filter(x=>x!==e):[...t.filter(x=>x!=="any"),e];s.length===0&&(s=["any"]),s.length===l.length&&(s=["any"]),d(s)},g=t.length===1&&t[0]==="any"?"любая сложность":t.map(e=>e==="easiest"?"самые лёгкие":e==="easy"?"лёгкие":e==="medium"?"средние":e==="hard"?"сложные":e==="hardest"?"самые сложные":e).join(", "),r=({open:e})=>n.jsx("svg",{width:"16",height:"16",viewBox:"0 0 16 16",fill:"none",xmlns:"http://www.w3.org/2000/svg",style:{marginLeft:6,transition:"transform 0.2s",transform:e?"rotate(180deg)":"rotate(0deg)"},children:n.jsx("path",{d:"M4.5 6L8 9.5L11.5 6",stroke:"#888",strokeWidth:"1.5",strokeLinecap:"round",strokeLinejoin:"round"})}),i=()=>n.jsx("button",{onClick:()=>o(!1),style:{display:"block",width:"100%",marginTop:10,padding:"8px 0",background:"#f3f3f3",border:"none",borderRadius:6,color:"#333",fontSize:14,fontWeight:500,cursor:"pointer"},className:"mobile-only",children:"Закрыть"});return n.jsxs(B,{open:a,onOpenChange:o,children:[n.jsx(T,{asChild:!0,children:n.jsxs(c,{variant:"outline",className:"cursor-pointer py-1 px-3 flex items-center gap-1.5 hover:bg-gray-100 transition-colors difficulty-dropdown-badge",style:{minWidth:0,width:"fit-content",maxWidth:"none",paddingRight:10,paddingLeft:14,display:"flex",alignItems:"center",justifyContent:"space-between",whiteSpace:"nowrap"},children:[n.jsx("span",{className:"text-xs",style:{overflow:"hidden",textOverflow:"ellipsis",fontWeight:400},children:g}),n.jsx(r,{open:a})]})}),n.jsxs(D,{className:"w-auto p-2 difficulty-popover-content",style:{minWidth:220,maxWidth:320,display:"flex",flexWrap:"wrap",gap:8,alignItems:"stretch"},children:[n.jsxs("div",{className:"sb-difficulty-chips-group",style:{width:"100%",display:"flex",flexWrap:"wrap",gap:8},children:[n.jsx(c,{variant:t.length===1&&t[0]==="any"?"default":"outline",className:`cursor-pointer transition-colors text-xs px-2 py-0.5 flex items-center gap-1 ${t.length===1&&t[0]==="any"?"bg-teal-600 hover:bg-teal-700 text-white border-teal-600":"border-gray-300 text-gray-700 hover:bg-gray-100"}`,style:{fontWeight:400},onClick:()=>u("any"),children:"любая сложность"},"any"),b.map(e=>n.jsx(c,{variant:t.includes(e.id)&&t[0]!=="any"?"default":"outline",className:`cursor-pointer transition-colors text-xs px-2 py-0.5 flex items-center gap-1 ${t.includes(e.id)&&t[0]!=="any"?"bg-teal-600 hover:bg-teal-700 text-white border-teal-600":"border-gray-300 text-gray-700 hover:bg-gray-100"}`,style:{fontWeight:400},onClick:()=>u(e.id),children:e.label},e.id))]}),n.jsx("div",{className:"desktop-close-hint",style:{marginTop:10,color:"#888",fontSize:13,textAlign:"center"},children:"ESC или клик вне меню для закрытия"}),n.jsx("div",{className:"mobile-close-btn",style:{display:"none"},children:n.jsx(i,{})}),n.jsx("style",{children:`
            @media (max-width: 600px) {
              .mobile-close-btn { display: block !important; }
              .desktop-close-hint { display: none !important; }
              .difficulty-dropdown-badge {
                width: auto !important;
                max-width: 95vw !important;
                margin: 0 !important;
              }
              .difficulty-popover-content {
                max-width: 95vw !important;
                min-width: 0 !important;
              }
            }
            .sb-difficulty-chips-group .badge,
            .sb-difficulty-chips-group .badge * {
              font-weight: 400 !important;
            }
          `})]})]})}};var v,w,C;f.parameters={...f.parameters,docs:{...(v=f.parameters)==null?void 0:v.docs,source:{originalSource:`{
  render: () => {
    const [value, setValue] = useState<string[]>(["medium"]);
    return <DifficultyChipsGroup value={value} onChange={setValue} stats={mockStats} tiers={difficultyTiers} renderCount={(count, selected) => <span style={{
      marginLeft: 8,
      color: selected ? "#fff" : "#b0b0b0",
      fontWeight: 400,
      fontSize: 14
    }}>\r
            {count}\r
          </span>} anyLabel="любая сложность" />;
  }
}`,...(C=(w=f.parameters)==null?void 0:w.docs)==null?void 0:C.source}}};var k,j,S;m.parameters={...m.parameters,docs:{...(k=m.parameters)==null?void 0:k.docs,source:{originalSource:`{
  render: () => {
    const [value, setValue] = useState<string[]>(["any"]);
    return <DifficultyChipsGroup value={value} onChange={setValue} stats={mockStats} tiers={difficultyTiers} renderCount={(count, selected) => <span style={{
      marginLeft: 4,
      color: selected ? "#fff" : "#b0b0b0",
      fontWeight: 400,
      fontSize: 14
    }}>\r
            ({count})\r
          </span>} anyLabel="любая сложность" />;
  }
}`,...(S=(j=m.parameters)==null?void 0:j.docs)==null?void 0:S.source}}};var N,W,L;y.parameters={...y.parameters,docs:{...(N=y.parameters)==null?void 0:N.docs,source:{originalSource:`{
  render: () => {
    const [open, setOpen] = useState(false);
    const allTierIds = difficultyTiers.map(t => t.id);
    const [value, setValue] = useState<string[]>(["any"]);

    // Логика выбора сложности
    const handleChange = (id: string) => {
      if (id === "any") {
        setValue(["any"]);
        return;
      }
      let newValue = value.includes(id) ? value.filter(v => v !== id) : [...value.filter(v => v !== "any"), id];
      // Если ничего не выбрано — снова any
      if (newValue.length === 0) newValue = ["any"];
      // Если выбраны все — это any
      if (newValue.length === allTierIds.length) newValue = ["any"];
      setValue(newValue);
    };
    const selectedLabel = value.length === 1 && value[0] === "any" ? "любая сложность" : value.map(v => v === "easiest" ? "самые лёгкие" : v === "easy" ? "лёгкие" : v === "medium" ? "средние" : v === "hard" ? "сложные" : v === "hardest" ? "самые сложные" : v).join(", ");
    // SVG шеврона
    const Chevron = ({
      open
    }: {
      open: boolean;
    }) => <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" style={{
      marginLeft: 6,
      transition: "transform 0.2s",
      transform: open ? "rotate(180deg)" : "rotate(0deg)"
    }}>\r
        <path d="M4.5 6L8 9.5L11.5 6" stroke="#888" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />\r
      </svg>;
    // Кнопка закрытия для мобильных устройств
    const MobileCloseButton = () => <button onClick={() => setOpen(false)} style={{
      display: "block",
      width: "100%",
      marginTop: 10,
      padding: "8px 0",
      background: "#f3f3f3",
      border: "none",
      borderRadius: 6,
      color: "#333",
      fontSize: 14,
      fontWeight: 500,
      cursor: "pointer"
    }} className="mobile-only">\r
        Закрыть\r
      </button>;
    return <Popover open={open} onOpenChange={setOpen}>\r
        <PopoverTrigger asChild>\r
          <Badge variant="outline" className="cursor-pointer py-1 px-3 flex items-center gap-1.5 hover:bg-gray-100 transition-colors difficulty-dropdown-badge" style={{
          minWidth: 0,
          width: "fit-content",
          maxWidth: "none",
          paddingRight: 10,
          paddingLeft: 14,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          whiteSpace: "nowrap"
        }}>\r
            <span className="text-xs" style={{
            overflow: "hidden",
            textOverflow: "ellipsis",
            fontWeight: 400
          }}>\r
              {selectedLabel}\r
            </span>\r
            <Chevron open={open} />\r
          </Badge>\r
        </PopoverTrigger>\r
        <PopoverContent className="w-auto p-2 difficulty-popover-content" style={{
        minWidth: 220,
        maxWidth: 320,
        display: "flex",
        flexWrap: "wrap",
        gap: 8,
        alignItems: "stretch"
      }}>\r
          <div className="sb-difficulty-chips-group" style={{
          width: "100%",
          display: "flex",
          flexWrap: "wrap",
          gap: 8
        }}>\r
            {/* Любая сложность */}\r
            <Badge key="any" variant={value.length === 1 && value[0] === "any" ? "default" : "outline"} className={\`cursor-pointer transition-colors text-xs px-2 py-0.5 flex items-center gap-1 \${value.length === 1 && value[0] === "any" ? "bg-teal-600 hover:bg-teal-700 text-white border-teal-600" : "border-gray-300 text-gray-700 hover:bg-gray-100"}\`} style={{
            fontWeight: 400
          }} onClick={() => handleChange("any")}>\r
              любая сложность\r
            </Badge>\r
            {difficultyTiers.map(tier => <Badge key={tier.id} variant={value.includes(tier.id) && value[0] !== "any" ? "default" : "outline"} className={\`cursor-pointer transition-colors text-xs px-2 py-0.5 flex items-center gap-1 \${value.includes(tier.id) && value[0] !== "any" ? "bg-teal-600 hover:bg-teal-700 text-white border-teal-600" : "border-gray-300 text-gray-700 hover:bg-gray-100"}\`} style={{
            fontWeight: 400
          }} onClick={() => handleChange(tier.id)}>\r
                {tier.label}\r
              </Badge>)}\r
          </div>\r
          <div className="desktop-close-hint" style={{
          marginTop: 10,
          color: "#888",
          fontSize: 13,
          textAlign: "center"
        }}>\r
            ESC или клик вне меню для закрытия\r
          </div>\r
          <div className="mobile-close-btn" style={{
          display: "none"
        }}>\r
            <MobileCloseButton />\r
          </div>\r
          <style>{\`
            @media (max-width: 600px) {
              .mobile-close-btn { display: block !important; }
              .desktop-close-hint { display: none !important; }
              .difficulty-dropdown-badge {
                width: auto !important;
                max-width: 95vw !important;
                margin: 0 !important;
              }
              .difficulty-popover-content {
                max-width: 95vw !important;
                min-width: 0 !important;
              }
            }
            .sb-difficulty-chips-group .badge,
            .sb-difficulty-chips-group .badge * {
              font-weight: 400 !important;
            }
          \`}</style>\r
        </PopoverContent>\r
      </Popover>;
  }
}`,...(L=(W=y.parameters)==null?void 0:W.docs)==null?void 0:L.source}}};const Y=["CustomCounter","SiteStyle","DropdownChips"];export{f as CustomCounter,y as DropdownChips,m as SiteStyle,Y as __namedExportsOrder,X as default};
//# sourceMappingURL=DifficultyChipsGroup.stories-RdXuSMV7.js.map
