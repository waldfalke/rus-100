import{j as t}from"./jsx-runtime-DoEZbXM1.js";import{T as u}from"./task-category-selector-CyPtx4Pg.js";import{r as d}from"./index-DWtqY3O_.js";import{P as k,a as W,b as j}from"./popover-C4RQM193.js";import{B as a}from"./badge-BhI_kZ9I.js";import"./jsx-runtime-Bw5QeaCk.js";import"./chevron-up-BDhz3SY9.js";import"./createLucideIcon-BySMWYsL.js";import"./index-DHaFAply.js";import"./index-BghTMhg4.js";import"./index-4JJ3X7d3.js";import"./index-C9Cbq-BE.js";import"./index-h8DnG9fi.js";import"./index-DZJH1aMv.js";import"./index-CWNAz4Fr.js";import"./index-BnuSz0lM.js";import"./Combination-Dlu6W2yo.js";import"./index-k2os2MFt.js";import"./index-BAy4v6XH.js";import"./utils-CytzSlOG.js";import"./index-BwobEAja.js";const N=["Синтаксис","Орфография","Пунктуация","Лексика","Морфология"],Q={title:"Blocks/TaskCategorySelector",component:u},s={render:()=>{const[n,e]=d.useState([N[0]]);return t.jsx("div",{style:{minWidth:90,maxWidth:220},children:t.jsx(u,{taskNumber:"1",selectedCategories:n,onCategoriesChange:e})})}},l={render:()=>{const n=["Предлоги","Союзы","Частицы","Местоимения","Наречия","Вводные слова"],[e,i]=d.useState([...n]),b=o=>{let r;e.includes(o)?r=e.filter(S=>S!==o):r=[...e,o],r.length===0&&(r=[...n]),r.length===n.length&&(r=[...n]),i(r)},w=e.length===n.length?"Все категории":e.length===1?e[0]:e.length===2?`${e[0]} и ${e[1]}`:`${e.slice(0,-1).join(", ")} и ${e[e.length-1]}`,v=({open:o})=>t.jsx("svg",{width:"16",height:"16",viewBox:"0 0 16 16",fill:"none",xmlns:"http://www.w3.org/2000/svg",style:{marginLeft:6,transition:"transform 0.2s",transform:o?"rotate(180deg)":"rotate(0deg)"},children:t.jsx("path",{d:"M4.5 6L8 9.5L11.5 6",stroke:"#888",strokeWidth:"1.5",strokeLinecap:"round",strokeLinejoin:"round"})}),C=({setOpen:o})=>t.jsx("button",{onClick:()=>o(!1),style:{display:"block",width:"100%",marginTop:10,padding:"8px 0",background:"#f3f3f3",border:"none",borderRadius:6,color:"#333",fontSize:14,fontWeight:500,cursor:"pointer"},className:"mobile-only",children:"Закрыть"}),[c,p]=d.useState(!1);return t.jsx("div",{style:{maxWidth:340},children:t.jsxs(k,{open:c,onOpenChange:p,children:[t.jsx(W,{asChild:!0,children:t.jsxs(a,{variant:"outline",className:"cursor-pointer py-1 px-3 flex items-center gap-1.5 hover:bg-gray-100 transition-colors dropdown-badge",style:{minWidth:0,width:"fit-content",maxWidth:"none",paddingRight:10,paddingLeft:14,display:"flex",alignItems:"center",justifyContent:"space-between",whiteSpace:"nowrap",fontWeight:400},children:[t.jsx("span",{className:"text-xs",style:{overflow:"hidden",textOverflow:"ellipsis",fontWeight:400},children:w}),t.jsx(v,{open:c})]})}),t.jsxs(j,{className:"w-auto p-2",style:{minWidth:220,maxWidth:320,display:"flex",flexWrap:"wrap",gap:8,flexDirection:"column",alignItems:"stretch"},children:[t.jsxs("div",{style:{display:"flex",flexWrap:"wrap",gap:8},children:[t.jsx(a,{variant:e.length===n.length?"default":"outline",className:`cursor-pointer transition-colors text-xs px-2 py-0.5 flex items-center gap-1 ${e.length===n.length?"bg-teal-600 hover:bg-teal-700 text-white border-teal-600":"border-gray-300 text-gray-700 hover:bg-gray-100"}`,style:{fontWeight:400},onClick:()=>i([...n]),children:"Все категории"},"all"),n.map(o=>t.jsx(a,{variant:e.includes(o)&&e.length!==n.length?"default":"outline",className:`cursor-pointer transition-colors text-xs px-2 py-0.5 flex items-center gap-1 ${e.includes(o)&&e.length!==n.length?"bg-teal-600 hover:bg-teal-700 text-white border-teal-600":"border-gray-300 text-gray-700 hover:bg-gray-100"}`,style:{fontWeight:400},onClick:()=>{e.length===n.length?i([o]):b(o)},children:o},o))]}),t.jsx("div",{className:"desktop-close-hint",style:{marginTop:10,color:"#888",fontSize:13,textAlign:"center"},children:"ESC или клик вне меню для закрытия"}),t.jsx("div",{className:"mobile-close-btn",style:{display:"none"},children:t.jsx(C,{setOpen:p})}),t.jsx("style",{children:`
              @media (max-width: 600px) {
                .mobile-close-btn { display: block !important; }
                .desktop-close-hint { display: none !important; }
                .dropdown-badge {
                  width: calc(100vw - 32px) !important;
                  margin: 0 16px !important;
                  max-width: 100vw !important;
                }
              }
              .dropdown-badge, .dropdown-badge * {
                font-weight: 400 !important;
              }
            `})]})]})})}};var g,h,m;s.parameters={...s.parameters,docs:{...(g=s.parameters)==null?void 0:g.docs,source:{originalSource:`{
  render: () => {
    const [selected, setSelected] = useState<string[]>([mockCategories[0]]);
    return <div style={{
      minWidth: 90,
      maxWidth: 220
    }}>\r
        <TaskCategorySelector taskNumber={"1"} selectedCategories={selected} onCategoriesChange={setSelected} />\r
      </div>;
  }
}`,...(m=(h=s.parameters)==null?void 0:h.docs)==null?void 0:m.source}}};var x,f,y;l.parameters={...l.parameters,docs:{...(x=l.parameters)==null?void 0:x.docs,source:{originalSource:`{
  render: () => {
    // Категории для taskNumber 1 (без 'Синтаксис')
    const categories = ["Предлоги", "Союзы", "Частицы", "Местоимения", "Наречия", "Вводные слова"];
    const [selected, setSelected] = useState<string[]>([...categories]);
    // Логика выбора: если выбраны все — это 'Все категории', если снимаем все — снова все
    const handleChange = (cat: string) => {
      let newSelected;
      if (selected.includes(cat)) {
        newSelected = selected.filter(c => c !== cat);
      } else {
        newSelected = [...selected, cat];
      }
      // Если ничего не выбрано — снова все
      if (newSelected.length === 0) newSelected = [...categories];
      // Если выбраны все кроме одного — это тоже 'Все категории'
      if (newSelected.length === categories.length) newSelected = [...categories];
      setSelected(newSelected);
    };
    // Формат отображения выбранных
    const selectedLabel = selected.length === categories.length ? "Все категории" : selected.length === 1 ? selected[0] : selected.length === 2 ? \`\${selected[0]} и \${selected[1]}\` : \`\${selected.slice(0, -1).join(", ")} и \${selected[selected.length - 1]}\`;
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
    }} className="mobile-only">\r
        Закрыть\r
      </button>;
    const [open, setOpen] = useState(false);
    return <div style={{
      maxWidth: 340
    }}>\r
        <Popover open={open} onOpenChange={setOpen}>\r
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
            }}>\r
                {selectedLabel}\r
              </span>\r
              <Chevron open={open} />\r
            </Badge>\r
          </PopoverTrigger>\r
          <PopoverContent className="w-auto p-2" style={{
          minWidth: 220,
          maxWidth: 320,
          display: "flex",
          flexWrap: "wrap",
          gap: 8,
          flexDirection: "column",
          alignItems: "stretch"
        }}>\r
            <div style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 8
          }}>\r
              {/* Все категории */}\r
              <Badge key="all" variant={selected.length === categories.length ? "default" : "outline"} className={\`cursor-pointer transition-colors text-xs px-2 py-0.5 flex items-center gap-1 \${selected.length === categories.length ? "bg-teal-600 hover:bg-teal-700 text-white border-teal-600" : "border-gray-300 text-gray-700 hover:bg-gray-100"}\`} style={{
              fontWeight: 400
            }} onClick={() => setSelected([...categories])}>\r
                Все категории\r
              </Badge>\r
              {categories.map(cat => <Badge key={cat} variant={selected.includes(cat) && selected.length !== categories.length ? "default" : "outline"} className={\`cursor-pointer transition-colors text-xs px-2 py-0.5 flex items-center gap-1 \${selected.includes(cat) && selected.length !== categories.length ? "bg-teal-600 hover:bg-teal-700 text-white border-teal-600" : "border-gray-300 text-gray-700 hover:bg-gray-100"}\`} style={{
              fontWeight: 400
            }} onClick={() => {
              if (selected.length === categories.length) {
                setSelected([cat]);
              } else {
                handleChange(cat);
              }
            }}>\r
                  {cat}\r
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
              <MobileCloseButton setOpen={setOpen} />\r
            </div>\r
            <style>{\`
              @media (max-width: 600px) {
                .mobile-close-btn { display: block !important; }
                .desktop-close-hint { display: none !important; }
                .dropdown-badge {
                  width: calc(100vw - 32px) !important;
                  margin: 0 16px !important;
                  max-width: 100vw !important;
                }
              }
              .dropdown-badge, .dropdown-badge * {
                font-weight: 400 !important;
              }
            \`}</style>\r
          </PopoverContent>\r
        </Popover>\r
      </div>;
  }
}`,...(y=(f=l.parameters)==null?void 0:f.docs)==null?void 0:y.source}}};const U=["Default","DropdownChips"];export{s as Default,l as DropdownChips,U as __namedExportsOrder,Q as default};
//# sourceMappingURL=task-category-selector.stories-76fJ5gFm.js.map
