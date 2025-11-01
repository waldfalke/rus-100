import{j as t}from"./jsx-runtime-DoEZbXM1.js";import{T as N}from"./TaskCardBlock-CiEdU8zU.js";import{r as s}from"./index-DWtqY3O_.js";import{P as C,a as k,b as S}from"./popover-C4RQM193.js";import{B as r}from"./badge-BhI_kZ9I.js";import"./jsx-runtime-Bw5QeaCk.js";import"./card-CovcHCaV.js";import"./utils-CytzSlOG.js";import"./button-DWZKWoqU.js";import"./index-BghTMhg4.js";import"./index-BwobEAja.js";import"./task-category-selector-CyPtx4Pg.js";import"./chevron-up-BDhz3SY9.js";import"./createLucideIcon-BySMWYsL.js";import"./dice-3-DukkMB4k.js";import"./index-DHaFAply.js";import"./index-4JJ3X7d3.js";import"./index-C9Cbq-BE.js";import"./index-h8DnG9fi.js";import"./index-DZJH1aMv.js";import"./index-CWNAz4Fr.js";import"./index-BnuSz0lM.js";import"./Combination-Dlu6W2yo.js";import"./index-k2os2MFt.js";import"./index-BAy4v6XH.js";const se={title:"Blocks/TaskCardBlockB",component:N},M={id:1,title:"№1. Средства связи предложений в тексте"},g={easiest:2,easy:5,medium:10,hard:6,hardest:1},m=[{id:"easiest",label:"Самые лёгкие"},{id:"easy",label:"Лёгкие"},{id:"medium",label:"Средние"},{id:"hard",label:"Сложные"},{id:"hardest",label:"Самые сложные"}],c={render:()=>{const o=["Орфография","Пунктуация","Лексика","Морфология"],[O,f]=s.useState(0),[a,h]=s.useState(["any"]),[i,d]=s.useState([...o]),$=m.map(e=>e.id),p=e=>{if(e==="any"){h(["any"]);return}let n=a.includes(e)?a.filter(l=>l!==e):[...a.filter(l=>l!=="any"),e];n.length===0&&(n=["any"]),n.length===$.length&&(n=["any"]),h(n)},B=e=>{let n;i.includes(e)?n=i.filter(l=>l!==e):n=[...i,e],n.length===0&&(n=[...o]),n.length===o.length&&(n=[...o]),d(n)},[x,u]=s.useState(!1),L=()=>{if(a.length===1&&a[0]==="any")return"любая сложность";const e=a.map(n=>n==="easiest"?"самые лёгкие":n==="easy"?"лёгкие":n==="medium"?"средние":n==="hard"?"сложные":n==="hardest"?"самые сложные":n.toLowerCase());return e.length===1?e[0]:e.length===2?`${e[0]} и ${e[1]}`:e.length>2?`${e[0]}, ${e[1]} +${e.length-2}`:""},[y,b]=s.useState(!1),T=()=>{if(i.length===o.length)return"все категории";const e=i.map(n=>n.toLowerCase());return e.length===1?e[0]:e.length===2?`${e[0]} и ${e[1]}`:e.length>2?`${e[0]}, ${e[1]} +${e.length-2}`:""},w=({open:e})=>t.jsx("svg",{width:"16",height:"16",viewBox:"0 0 16 16",fill:"none",xmlns:"http://www.w3.org/2000/svg",style:{marginLeft:6,transition:"transform 0.2s",transform:e?"rotate(180deg)":"rotate(0deg)"},children:t.jsx("path",{d:"M4.5 6L8 9.5L11.5 6",stroke:"#888",strokeWidth:"1.5",strokeLinecap:"round",strokeLinejoin:"round"})}),v=({setOpen:e})=>t.jsx("button",{onClick:()=>e(!1),style:{display:"block",width:"100%",marginTop:10,padding:"8px 0",background:"#f3f3f3",border:"none",borderRadius:6,color:"#333",fontSize:14,fontWeight:500,cursor:"pointer"},className:"mobile-only",children:"Закрыть"}),I=t.jsxs(C,{open:x,onOpenChange:u,children:[t.jsx(k,{asChild:!0,children:t.jsxs(r,{variant:"outline",className:"cursor-pointer py-1 px-3 flex items-center gap-1.5 hover:bg-gray-100 transition-colors dropdown-badge",style:{minWidth:0,width:"fit-content",maxWidth:"none",paddingRight:10,paddingLeft:14,display:"flex",alignItems:"center",justifyContent:"space-between",whiteSpace:"nowrap",fontWeight:400},children:[t.jsx("span",{className:"text-xs",style:{overflow:"hidden",textOverflow:"ellipsis",fontWeight:400},children:L()}),t.jsx(w,{open:x})]})}),t.jsxs(S,{className:"w-auto p-2",style:{minWidth:220,maxWidth:320,display:"flex",flexWrap:"wrap",gap:8,alignItems:"stretch"},children:[t.jsxs("div",{style:{display:"flex",flexWrap:"wrap",gap:8},children:[t.jsxs(r,{variant:a.length===1&&a[0]==="any"?"default":"outline",className:`cursor-pointer transition-colors text-xs px-2 py-0.5 flex items-center gap-1 ${a.length===1&&a[0]==="any"?"bg-teal-600 hover:bg-teal-700 text-white border-teal-600":"border-gray-300 text-gray-700 hover:bg-gray-100"}`,style:{fontWeight:400},onClick:()=>p("any"),children:["любая сложность ",t.jsx("span",{className:"text-[14px] font-semibold leading-5",children:Object.values(g).reduce((e,n)=>e+n,0)})]},"any"),m.map(e=>t.jsxs(r,{variant:a.includes(e.id)&&a[0]!=="any"?"default":"outline",className:`cursor-pointer transition-colors text-xs px-2 py-0.5 flex items-center gap-1 ${a.includes(e.id)&&a[0]!=="any"?"bg-teal-600 hover:bg-teal-700 text-white border-teal-600":"border-gray-300 text-gray-700 hover:bg-gray-100"}`,style:{fontWeight:400},onClick:()=>p(e.id),children:[e.label.toLowerCase()," ",t.jsx("span",{className:"text-[14px] font-semibold leading-5",children:g[e.id]})]},e.id))]}),t.jsx("div",{className:"desktop-close-hint text-xs",style:{marginTop:10,color:"#888",textAlign:"center"},children:"ESC или клик вне меню для закрытия"}),t.jsx("div",{className:"mobile-close-btn",style:{display:"none"},children:t.jsx(v,{setOpen:u})}),t.jsx("style",{children:`
            @media (max-width: 600px) {
              .mobile-close-btn { display: block !important; }
              .desktop-close-hint { display: none !important; }
              .dropdown-badge { width: calc(100vw - 32px) !important; margin: 0 16px !important; max-width: 100vw !important; }
            }
            .dropdown-badge, .dropdown-badge * { font-weight: 400 !important; }
          `})]})]}),P=t.jsxs(C,{open:y,onOpenChange:b,children:[t.jsx(k,{asChild:!0,children:t.jsxs(r,{variant:"outline",className:"cursor-pointer py-1 px-3 flex items-center gap-1.5 hover:bg-gray-100 transition-colors dropdown-badge",style:{minWidth:0,width:"fit-content",maxWidth:"none",paddingRight:10,paddingLeft:14,display:"flex",alignItems:"center",justifyContent:"space-between",whiteSpace:"nowrap",fontWeight:400},children:[t.jsx("span",{className:"text-xs",style:{overflow:"hidden",textOverflow:"ellipsis",fontWeight:400},children:T()}),t.jsx(w,{open:y})]})}),t.jsxs(S,{className:"w-auto p-2",style:{minWidth:220,maxWidth:320,display:"flex",flexWrap:"wrap",gap:8,alignItems:"stretch"},children:[t.jsxs("div",{style:{display:"flex",flexWrap:"wrap",gap:8},children:[t.jsx(r,{variant:i.length===o.length?"default":"outline",className:`cursor-pointer transition-colors text-xs px-2 py-0.5 flex items-center gap-1 ${i.length===o.length?"bg-teal-600 hover:bg-teal-700 text-white border-teal-600":"border-gray-300 text-gray-700 hover:bg-gray-100"}`,style:{fontWeight:400},onClick:()=>d([...o]),children:"Все категории"},"all"),o.map(e=>t.jsx(r,{variant:i.includes(e)&&i.length!==o.length?"default":"outline",className:`cursor-pointer transition-colors text-xs px-2 py-0.5 flex items-center gap-1 ${i.includes(e)&&i.length!==o.length?"bg-teal-600 hover:bg-teal-700 text-white border-teal-600":"border-gray-300 text-gray-700 hover:bg-gray-100"}`,style:{fontWeight:400},onClick:()=>{i.length===o.length?d([e]):B(e)},children:e},e))]}),t.jsx("div",{className:"desktop-close-hint text-xs",style:{marginTop:10,color:"#888",textAlign:"center"},children:"ESC или клик вне меню для закрытия"}),t.jsx("div",{className:"mobile-close-btn",style:{display:"none"},children:t.jsx(v,{setOpen:b})}),t.jsx("style",{children:`
            @media (max-width: 600px) {
              .mobile-close-btn { display: block !important; }
              .desktop-close-hint { display: none !important; }
              .dropdown-badge { width: calc(100vw - 32px) !important; margin: 0 16px !important; max-width: 100vw !important; }
            }
            .dropdown-badge, .dropdown-badge * { font-weight: 400 !important; }
          `})]})]});return t.jsxs("div",{style:{width:"100%"},children:[t.jsx(N,{item:{...M,title:"№1. Средства связи предложений в тексте"},category:null,currentCount:O,maxCount:20,onDecrement:()=>f(e=>Math.max(0,e-1)),onIncrement:()=>f(e=>Math.min(20,e+1)),difficulties:a,onDifficultyChange:p,categories:i,onCategoriesChange:d,itemStats:g,difficultyTiers:m,difficultyDropdown:I,categoryDropdown:P}),t.jsx("style",{children:`
          @media (max-width: 600px) {
            .task-card-block-controls {
              flex-direction: column !important;
              align-items: flex-start !important;
              gap: 10px !important;
            }
            .dropdown-badge, .category-dropdown-badge, .difficulty-dropdown-badge {
              width: auto !important;
              max-width: 95vw !important;
              margin: 0 !important;
            }
            .popover-close-btn {
              width: 100% !important;
              padding: 12px 0 !important;
              margin-top: 12px !important;
              border-radius: 8px !important;
              background: #f3f3f3 !important;
              font-size: 16px !important;
              font-weight: 500 !important;
              border: none !important;
              text-align: center !important;
              cursor: pointer !important;
              color: #222 !important;
              box-shadow: none !important;
              display: block !important;
            }
          }
        `})]})}};var j,W,D;c.parameters={...c.parameters,docs:{...(j=c.parameters)==null?void 0:j.docs,source:{originalSource:`{
  render: () => {
    const categories = ["Орфография", "Пунктуация", "Лексика", "Морфология"];
    const [currentCount, setCurrentCount] = useState(0);
    const [difficulties, setDifficulties] = useState<string[]>(["any"]);
    const [catSelected, setCatSelected] = useState<string[]>([...categories]);
    const allTierIds = mockDifficultyTiers.map(t => t.id);

    // Логика выбора сложности
    const handleDiffChange = (id: string) => {
      if (id === "any") {
        setDifficulties(["any"]);
        return;
      }
      let newValue = difficulties.includes(id) ? difficulties.filter(v => v !== id) : [...difficulties.filter(v => v !== "any"), id];
      if (newValue.length === 0) newValue = ["any"];
      if (newValue.length === allTierIds.length) newValue = ["any"];
      setDifficulties(newValue);
    };

    // Логика выбора категорий
    const handleCatChange = (cat: string) => {
      let newSelected;
      if (catSelected.includes(cat)) {
        newSelected = catSelected.filter(c => c !== cat);
      } else {
        newSelected = [...catSelected, cat];
      }
      if (newSelected.length === 0) newSelected = [...categories];
      if (newSelected.length === categories.length) newSelected = [...categories];
      setCatSelected(newSelected);
    };

    // DropdownChips для сложности
    const [diffOpen, setDiffOpen] = useState(false);
    const getDiffLabel = () => {
      if (difficulties.length === 1 && difficulties[0] === "any") return "любая сложность";
      const labels = difficulties.map(v => v === "easiest" ? "самые лёгкие" : v === "easy" ? "лёгкие" : v === "medium" ? "средние" : v === "hard" ? "сложные" : v === "hardest" ? "самые сложные" : v.toLowerCase());
      if (labels.length === 1) return labels[0];
      if (labels.length === 2) return \`\${labels[0]} и \${labels[1]}\`;
      if (labels.length > 2) return \`\${labels[0]}, \${labels[1]} +\${labels.length - 2}\`;
      return "";
    };

    // DropdownChips для категорий
    const [catOpen, setCatOpen] = useState(false);
    const getCatLabel = () => {
      if (catSelected.length === categories.length) return "все категории";
      const labels = catSelected.map(c => c.toLowerCase());
      if (labels.length === 1) return labels[0];
      if (labels.length === 2) return \`\${labels[0]} и \${labels[1]}\`;
      if (labels.length > 2) return \`\${labels[0]}, \${labels[1]} +\${labels.length - 2}\`;
      return "";
    };

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

    // Кнопка закрытия для мобильных
    const MobileCloseButton = ({
      setOpen
    }: {
      setOpen: (v: boolean) => void;
    }) => <button onClick={() => setOpen(false)} style={{
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
    }} className="mobile-only">Закрыть</button>;

    // Dropdown для сложности с счетчиками
    const difficultyDropdown = <Popover open={diffOpen} onOpenChange={setDiffOpen}>\r
        <PopoverTrigger asChild>\r
          <Badge variant="outline" className="cursor-pointer py-1 px-3 flex items-center gap-1.5 hover:bg-gray-100 transition-colors dropdown-badge" style={{
          minWidth: 0,
          width: "fit-content",
          maxWidth: "none",
          paddingRight: 10,
          paddingLeft: 14,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          whiteSpace: "nowrap",
          fontWeight: 400
        }}>\r
            <span className="text-xs" style={{
            overflow: "hidden",
            textOverflow: "ellipsis",
            fontWeight: 400
          }}>{getDiffLabel()}</span>\r
            <Chevron open={diffOpen} />\r
          </Badge>\r
        </PopoverTrigger>\r
        <PopoverContent className="w-auto p-2" style={{
        minWidth: 220,
        maxWidth: 320,
        display: "flex",
        flexWrap: "wrap",
        gap: 8,
        alignItems: "stretch"
      }}>\r
          <div style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 8
        }}>\r
            <Badge key="any" variant={difficulties.length === 1 && difficulties[0] === "any" ? "default" : "outline"} className={\`cursor-pointer transition-colors text-xs px-2 py-0.5 flex items-center gap-1 \${difficulties.length === 1 && difficulties[0] === "any" ? "bg-teal-600 hover:bg-teal-700 text-white border-teal-600" : "border-gray-300 text-gray-700 hover:bg-gray-100"}\`} style={{
            fontWeight: 400
          }} onClick={() => handleDiffChange("any")}>любая сложность <span className="text-[14px] font-semibold leading-5">{Object.values(mockItemStats).reduce((sum, count) => sum + count, 0)}</span></Badge>\r
            {mockDifficultyTiers.map(tier => <Badge key={tier.id} variant={difficulties.includes(tier.id) && difficulties[0] !== "any" ? "default" : "outline"} className={\`cursor-pointer transition-colors text-xs px-2 py-0.5 flex items-center gap-1 \${difficulties.includes(tier.id) && difficulties[0] !== "any" ? "bg-teal-600 hover:bg-teal-700 text-white border-teal-600" : "border-gray-300 text-gray-700 hover:bg-gray-100"}\`} style={{
            fontWeight: 400
          }} onClick={() => handleDiffChange(tier.id)}>{tier.label.toLowerCase()} <span className="text-[14px] font-semibold leading-5">{(mockItemStats as any)[tier.id]}</span></Badge>)}\r
          </div>\r
          <div className="desktop-close-hint text-xs" style={{
          marginTop: 10,
          color: "#888",
          textAlign: "center"
        }}>ESC или клик вне меню для закрытия</div>\r
          <div className="mobile-close-btn" style={{
          display: "none"
        }}><MobileCloseButton setOpen={setDiffOpen} /></div>\r
          <style>{\`
            @media (max-width: 600px) {
              .mobile-close-btn { display: block !important; }
              .desktop-close-hint { display: none !important; }
              .dropdown-badge { width: calc(100vw - 32px) !important; margin: 0 16px !important; max-width: 100vw !important; }
            }
            .dropdown-badge, .dropdown-badge * { font-weight: 400 !important; }
          \`}</style>\r
        </PopoverContent>\r
      </Popover>;

    // Dropdown для категорий
    const categoryDropdown = <Popover open={catOpen} onOpenChange={setCatOpen}>\r
        <PopoverTrigger asChild>\r
          <Badge variant="outline" className="cursor-pointer py-1 px-3 flex items-center gap-1.5 hover:bg-gray-100 transition-colors dropdown-badge" style={{
          minWidth: 0,
          width: "fit-content",
          maxWidth: "none",
          paddingRight: 10,
          paddingLeft: 14,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          whiteSpace: "nowrap",
          fontWeight: 400
        }}>\r
            <span className="text-xs" style={{
            overflow: "hidden",
            textOverflow: "ellipsis",
            fontWeight: 400
          }}>{getCatLabel()}</span>\r
            <Chevron open={catOpen} />\r
          </Badge>\r
        </PopoverTrigger>\r
        <PopoverContent className="w-auto p-2" style={{
        minWidth: 220,
        maxWidth: 320,
        display: "flex",
        flexWrap: "wrap",
        gap: 8,
        alignItems: "stretch"
      }}>\r
          <div style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 8
        }}>\r
            <Badge key="all" variant={catSelected.length === categories.length ? "default" : "outline"} className={\`cursor-pointer transition-colors text-xs px-2 py-0.5 flex items-center gap-1 \${catSelected.length === categories.length ? "bg-teal-600 hover:bg-teal-700 text-white border-teal-600" : "border-gray-300 text-gray-700 hover:bg-gray-100"}\`} style={{
            fontWeight: 400
          }} onClick={() => setCatSelected([...categories])}>Все категории</Badge>\r
            {categories.map(cat => <Badge key={cat} variant={catSelected.includes(cat) && catSelected.length !== categories.length ? "default" : "outline"} className={\`cursor-pointer transition-colors text-xs px-2 py-0.5 flex items-center gap-1 \${catSelected.includes(cat) && catSelected.length !== categories.length ? "bg-teal-600 hover:bg-teal-700 text-white border-teal-600" : "border-gray-300 text-gray-700 hover:bg-gray-100"}\`} style={{
            fontWeight: 400
          }} onClick={() => {
            if (catSelected.length === categories.length) {
              setCatSelected([cat]);
            } else {
              handleCatChange(cat);
            }
          }}>{cat}</Badge>)}\r
          </div>\r
          <div className="desktop-close-hint text-xs" style={{
          marginTop: 10,
          color: "#888",
          textAlign: "center"
        }}>ESC или клик вне меню для закрытия</div>\r
          <div className="mobile-close-btn" style={{
          display: "none"
        }}><MobileCloseButton setOpen={setCatOpen} /></div>\r
          <style>{\`
            @media (max-width: 600px) {
              .mobile-close-btn { display: block !important; }
              .desktop-close-hint { display: none !important; }
              .dropdown-badge { width: calc(100vw - 32px) !important; margin: 0 16px !important; max-width: 100vw !important; }
            }
            .dropdown-badge, .dropdown-badge * { font-weight: 400 !important; }
          \`}</style>\r
        </PopoverContent>\r
      </Popover>;
    return <div style={{
      width: "100%"
    }}>\r
        <TaskCardBlock item={{
        ...mockItem,
        title: "№1. Средства связи предложений в тексте"
      }} category={null} currentCount={currentCount} maxCount={20} onDecrement={() => setCurrentCount(c => Math.max(0, c - 1))} onIncrement={() => setCurrentCount(c => Math.min(20, c + 1))} difficulties={difficulties} onDifficultyChange={handleDiffChange} categories={catSelected} onCategoriesChange={setCatSelected} itemStats={mockItemStats} difficultyTiers={mockDifficultyTiers} difficultyDropdown={difficultyDropdown} categoryDropdown={categoryDropdown} />\r
        <style>{\`
          @media (max-width: 600px) {
            .task-card-block-controls {
              flex-direction: column !important;
              align-items: flex-start !important;
              gap: 10px !important;
            }
            .dropdown-badge, .category-dropdown-badge, .difficulty-dropdown-badge {
              width: auto !important;
              max-width: 95vw !important;
              margin: 0 !important;
            }
            .popover-close-btn {
              width: 100% !important;
              padding: 12px 0 !important;
              margin-top: 12px !important;
              border-radius: 8px !important;
              background: #f3f3f3 !important;
              font-size: 16px !important;
              font-weight: 500 !important;
              border: none !important;
              text-align: center !important;
              cursor: pointer !important;
              color: #222 !important;
              box-shadow: none !important;
              display: block !important;
            }
          }
        \`}</style>\r
      </div>;
  }
}`,...(D=(W=c.parameters)==null?void 0:W.docs)==null?void 0:D.source}}};const de=["FullCard_B"];export{c as FullCard_B,de as __namedExportsOrder,se as default};
//# sourceMappingURL=TaskCardBlockB.stories-DuTfYvPA.js.map
