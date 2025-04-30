import{j as r}from"./jsx-runtime-DoEZbXM1.js";import{C as e,a as i,b as c,c as d,d as b}from"./card-CovcHCaV.js";import{t as C}from"./test-content-jx8OslLq.js";import{B as o}from"./button-DWZKWoqU.js";import"./jsx-runtime-Bw5QeaCk.js";import"./index-DWtqY3O_.js";import"./utils-CytzSlOG.js";import"./index-BghTMhg4.js";import"./index-BwobEAja.js";const F={title:"UI/Card",component:e,tags:["autodocs"]},t={render:()=>r.jsxs(e,{children:[r.jsx(i,{children:r.jsx(c,{children:"Card Title"})}),r.jsx(d,{children:"Card content goes here."}),r.jsx(b,{children:"Card footer"})]})},a={render:()=>r.jsxs(e,{children:[r.jsx(i,{children:r.jsx(c,{children:"Card with Actions"})}),r.jsx(d,{children:"Card content goes here."}),r.jsxs(b,{children:[r.jsx(o,{variant:"outline",style:{marginRight:8},children:"Cancel"}),r.jsx(o,{children:"Save"})]})]})},n={render:()=>r.jsxs(e,{children:[r.jsx(i,{children:r.jsxs(c,{children:[r.jsx("svg",{width:"18",height:"18",fill:"none",stroke:"currentColor",strokeWidth:"2",viewBox:"0 0 24 24",style:{marginRight:6,verticalAlign:"middle"},children:r.jsx("circle",{cx:"12",cy:"12",r:"10"})}),"Card with Icon"]})}),r.jsx(d,{children:"Card content goes here."})]})},s={render:()=>r.jsxs("div",{style:{background:"#f8fafc",padding:24,borderRadius:16},children:[r.jsx("h2",{className:"text-xl font-semibold mb-16",children:C[0].category}),C[0].items.map(l=>r.jsx(e,{style:{marginBottom:12},children:r.jsx(d,{children:r.jsxs("div",{style:{display:"flex",alignItems:"center",justifyContent:"space-between"},children:[r.jsx("span",{children:l.title}),r.jsx(o,{children:"+ Добавить"})]})})},l.id))]})};var m,h,p;t.parameters={...t.parameters,docs:{...(m=t.parameters)==null?void 0:m.docs,source:{originalSource:`{
  render: () => <Card>\r
      <CardHeader>\r
        <CardTitle>Card Title</CardTitle>\r
      </CardHeader>\r
      <CardContent>\r
        Card content goes here.\r
      </CardContent>\r
      <CardFooter>\r
        Card footer\r
      </CardFooter>\r
    </Card>
}`,...(p=(h=t.parameters)==null?void 0:h.docs)==null?void 0:p.source}}};var x,g,u;a.parameters={...a.parameters,docs:{...(x=a.parameters)==null?void 0:x.docs,source:{originalSource:`{
  render: () => <Card>\r
      <CardHeader>\r
        <CardTitle>Card with Actions</CardTitle>\r
      </CardHeader>\r
      <CardContent>\r
        Card content goes here.\r
      </CardContent>\r
      <CardFooter>\r
        <Button variant="outline" style={{
        marginRight: 8
      }}>Cancel</Button>\r
        <Button>Save</Button>\r
      </CardFooter>\r
    </Card>
}`,...(u=(g=a.parameters)==null?void 0:g.docs)==null?void 0:u.source}}};var j,f,y;n.parameters={...n.parameters,docs:{...(j=n.parameters)==null?void 0:j.docs,source:{originalSource:`{
  render: () => <Card>\r
      <CardHeader>\r
        <CardTitle>\r
          <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" style={{
          marginRight: 6,
          verticalAlign: 'middle'
        }}><circle cx="12" cy="12" r="10" /></svg>\r
          Card with Icon\r
        </CardTitle>\r
      </CardHeader>\r
      <CardContent>\r
        Card content goes here.\r
      </CardContent>\r
    </Card>
}`,...(y=(f=n.parameters)==null?void 0:f.docs)==null?void 0:y.source}}};var v,B,k;s.parameters={...s.parameters,docs:{...(v=s.parameters)==null?void 0:v.docs,source:{originalSource:`{
  render: () => <div style={{
    background: '#f8fafc',
    padding: 24,
    borderRadius: 16
  }}>\r
      <h2 className="text-xl font-semibold mb-16">{tasksData[0].category}</h2>\r
      {tasksData[0].items.map(item => <Card key={item.id} style={{
      marginBottom: 12
    }}>\r
          <CardContent>\r
            <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>\r
              <span>{item.title}</span>\r
              <Button>+ Добавить</Button>\r
            </div>\r
          </CardContent>\r
        </Card>)}\r
    </div>
}`,...(k=(B=s.parameters)==null?void 0:B.docs)==null?void 0:k.source}}};const E=["Default","WithActions","WithIcon","CategoryBlock"];export{s as CategoryBlock,t as Default,a as WithActions,n as WithIcon,E as __namedExportsOrder,F as default};
//# sourceMappingURL=Card.stories-DjiMg2uG.js.map
